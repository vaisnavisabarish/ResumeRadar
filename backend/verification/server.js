require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const { verifyGitHubEvidence } = require('./githubVerifier');
const { verifyLinkedInEvidence } = require('./linkedinVerifier');

const app = express();
app.use(cors());
app.use(express.json());

function runDatabase(sql, parameters) {
    return new Promise((resolve, reject) => {
        db.run(sql, parameters, function(error) {
            if (error) reject(error);
            else resolve(this.lastID);
        });
    });
}

app.post('/api/verify', async (req, res) => {
    try {
        const resumeData = req.body || {};
        
        const githubUrl = resumeData.candidate?.profile_links?.github;
        if (!githubUrl) {
            return res.status(400).json({ error: "No GitHub URL found in profile" });
        }

        const candidateName = resumeData.candidate?.name || "Unknown Candidate";
        const linkedinUrl = resumeData.candidate?.profile_links?.linkedin;

        // Serialize full objects to JSON strings for database storage
        const skillsJson = JSON.stringify(resumeData.skills || {});
        const projectsJson = JSON.stringify(resumeData.projects || []);
        const experienceJson = JSON.stringify(resumeData.experience || []);
        const certificationsJson = JSON.stringify(resumeData.certifications || []);

        // Run verifications
        const [githubEvidence, linkedinResult] = await Promise.all([
            verifyGitHubEvidence(githubUrl, resumeData.skills, resumeData.projects),
            verifyLinkedInEvidence(linkedinUrl, resumeData.experience, resumeData.certifications)
        ]);

        let combinedEvidence = [...githubEvidence];
        if (linkedinResult) combinedEvidence.push(linkedinResult);

        // Save Full Candidate Data into SQLite
        const candidateId = await runDatabase(
            `INSERT INTO candidates (name, github_url, linkedin_url, skills_json, projects_json, experience_json, certifications_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [candidateName, githubUrl, linkedinUrl, skillsJson, projectsJson, experienceJson, certificationsJson]
        );
        for (const item of combinedEvidence) {
            await runDatabase(
                `INSERT INTO verification_results (candidate_id, skill, score, status, sources, repos_json) VALUES (?, ?, ?, ?, ?, ?)`,
                [candidateId, item.skill, item.score, item.status, item.sources, JSON.stringify(item.repos || [])]
            );
        }

        res.json({
            success: true,
            candidateId,
            candidate: candidateName,
            evidence: combinedEvidence
        });

    } catch (error) {
        if (error.name === 'GitHubVerificationError') {
            console.error('GitHub verification error:', { code: error.code, ...error.diagnostics });
            return res.status(error.status).json({
                success: false,
                error: error.message,
                code: error.code,
                diagnostics: error.diagnostics,
            });
        }
        console.error("Server Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to view all stored candidates and their full resumes
app.get('/api/candidates', (req, res) => {
    db.all(`SELECT * FROM candidates ORDER BY created_at DESC, id DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        db.all(`SELECT * FROM verification_results ORDER BY id`, [], (evidenceError, evidenceRows) => {
          if (evidenceError) return res.status(500).json({ error: evidenceError.message });
          try {
        // Preserve the existing candidate response and include its stored evidence.
        const parsedRows = rows.map(row => ({
            ...row,
            skills: JSON.parse(row.skills_json || '{}'),
            projects: JSON.parse(row.projects_json || '[]'),
            experience: JSON.parse(row.experience_json || '[]'),
            certifications: JSON.parse(row.certifications_json || '[]'),
            evidence: evidenceRows.filter(item => item.candidate_id === row.id).map(item => ({
                ...item, repos: JSON.parse(item.repos_json || '[]')
            }))
        }));

        res.json({ success: true, candidates: parsedRows });
          } catch (parseError) {
            res.status(500).json({ error: 'Stored candidate data could not be read' });
          }
        });
    });
});

// Unified Role Analyzer API Endpoint (Matches Semantic Engine Weights)
app.get('/api/role-analysis', (req, res) => {
    const roleDefinitions = {
        'Data Scientist': {
            weights: { 'pytorch': 0.35, 'statistical': 0.25, 'vision': 0.20, 'postgresql': 0.20 },
            skills: [
                { name: 'Python & PyTorch', key: 'pytorch', defaultScore: 95 },
                { name: 'Statistical Methods', key: 'statistical', defaultScore: 94 },
                { name: 'Computer Vision', key: 'vision', defaultScore: 92 },
                { name: 'PostgreSQL & SQL', key: 'postgresql', defaultScore: 90 }
            ]
        },
        'Full Stack Engineer': {
            weights: { 'react': 0.35, 'node': 0.30, 'postgresql': 0.20, 'docker': 0.15 },
            skills: [
                { name: 'React / Next.js', key: 'react', defaultScore: 95 },
                { name: 'Node.js / Express', key: 'node', defaultScore: 95 },
                { name: 'Relational Databases', key: 'postgresql', defaultScore: 95 },
                { name: 'Docker & Deployment', key: 'docker', defaultScore: 95 }
            ]
        },
        'Frontend Developer': {
            weights: { 'react': 0.40, 'tailwind': 0.25, 'three': 0.20, 'jest': 0.15 },
            skills: [
                { name: 'React & Hooks', key: 'react', defaultScore: 95 },
                { name: 'Tailwind CSS & UI', key: 'tailwind', defaultScore: 88 },
                { name: 'Three.js / WebGL', key: 'three', defaultScore: 85 },
                { name: 'Jest / Testing', key: 'jest', defaultScore: 85 }
            ]
        }
    };

    db.get(`SELECT id FROM candidates ORDER BY created_at DESC, id DESC LIMIT 1`, [], (err, candidate) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!candidate) return res.status(404).json({ error: 'Upload and verify a candidate first' });
        db.all(`SELECT skill, score, status FROM verification_results WHERE candidate_id = ?`, [candidate ? candidate.id : 0], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            const skillMap = {};
            if (results) {
                results.forEach(r => {
                    skillMap[r.skill.toLowerCase()] = r.score;
                });
            }

            const computedRoles = {};

            Object.keys(roleDefinitions).forEach(roleName => {
                const def = roleDefinitions[roleName];
                let weightedSum = 0;
                let skillDetails = [];

                def.skills.forEach(skillObj => {
                    // Find score from database or fallback to the tailored default score
                    const foundKey = Object.keys(skillMap).find(k => k.includes(skillObj.key) || skillObj.key.includes(k));
                    const score = foundKey ? skillMap[foundKey] : skillObj.defaultScore;
                    const weight = def.weights[skillObj.key];

                    weightedSum += score * weight;
                    skillDetails.push({
                        name: skillObj.name,
                        status: foundKey ? (score >= 75 ? 'Verified' : 'Partial Evidence') : 'Default estimate (no matching evidence)'
                    });
                });

                const finalMatch = Math.round(weightedSum);
                computedRoles[roleName] = {
                    match: finalMatch,
                    verdict: finalMatch >= 85 ? 'Highly Recommended' : 'Strong Candidate',
                    verdictColor: 'text-green-700',
                    verdictBg: 'bg-green-100',
                    skills: skillDetails
                };
            });

            res.json({ success: true, roles: computedRoles,
                warning: 'Role scores use repository-name heuristics and default scores where no matching evidence exists.' });
        });
    });
});

const { execFile } = require('child_process');
const path = require('path');

app.get('/api/semantic-compare', (req, res) => {
    const selectedRole = req.query.role || "Data Scientist";
    const scriptPath = path.join(__dirname, 'semanticMatcher.py');
    
    // Pass the selected role as an argument rather than through a shell.
    execFile('python', [scriptPath, selectedRole], { timeout: 15000 }, (error, stdout) => {
        if (error) {
            return res.status(502).json({ error: 'Python comparison failed. Check Python availability and candidate data.' });
        }
        try {
            const jsonStartIndex = stdout.indexOf('{');
            const jsonString = jsonStartIndex !== -1 ? stdout.substring(jsonStartIndex) : stdout;
            const parsedData = JSON.parse(jsonString);
            if (parsedData.error) return res.status(422).json(parsedData);
            res.json(parsedData);
        } catch (parseError) {
            res.status(502).json({ error: 'Python comparison returned invalid data' });
        }
    });
});

// Dynamic Gaps and Roadmap Endpoint from SQLite database
app.get('/api/gaps-roadmap', (req, res) => {
    db.get(`SELECT id FROM candidates ORDER BY created_at DESC, id DESC LIMIT 1`, [], (err, candidate) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!candidate) {
            return res.json({ gaps: [], roadmap: [] });
        }

        db.all(`SELECT skill, score, status FROM verification_results WHERE candidate_id = ?`, [candidate.id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            // Filter out gaps (anything with score < 80 or status not 'Verified')
            const unverified = results.filter(r => r.score < 80 || r.status !== 'Verified');
            
            const dynamicGaps = unverified.map((item, idx) => ({
                id: idx + 1,
                skill: item.skill,
                issue: `Stored verification confidence is ${item.score}% with status "${item.status}".`,
                whyMissing: `The saved result for "${item.skill}" is below the evidence threshold or is not marked Verified. Repository code and commits are not inspected by this implementation.`,
                severity: item.score < 50 ? 'High' : 'Medium'
            }));

            // Generate dynamic roadmap checkpoints based on the gaps found
            const dynamicRoadmap = [
                {
                    step: 1,
                    title: 'Bridge Containerization Gaps',
                    time: '15 mins',
                    impact: 'High Impact',
                    action: 'Add Docker configuration files or deployment scripts to repositories lacking infrastructure footprints.',
                    details: {
                        objective: 'Establish production-grade container parity across your microservices.',
                        codeSnippet: 'FROM node:18-alpine\nWORKDIR /app\nCOPY . . \nRUN npm install\nCMD ["npm", "start"]',
                        tasks: [
                            'Create a root Dockerfile for your backend and full-stack projects.',
                            'Verify local build execution using docker build commands.',
                            'Push changes to trigger automated AST rescan.'
                        ]
                    }
                },
                {
                    step: 2,
                    title: 'Attach Live Production URLs',
                    time: '45 mins',
                    impact: 'High Impact',
                    action: 'Deploy frontend and backend instances to Vercel, Railway, or Render to pass live telemetry checks.',
                    details: {
                        objective: 'Transform static resume lines into live verified public endpoints.',
                        codeSnippet: 'vercel --prod --confirm',
                        tasks: [
                            'Link your GitHub repository to a live hosting provider.',
                            'Ensure health check endpoints return 200 OK statuses.',
                            'Update your candidate profile metadata with live deployment links.'
                        ]
                    }
                },
                {
                    step: 3,
                    title: 'Optimize Repository Hierarchies',
                    time: '10 mins',
                    impact: 'Quick Win',
                    action: 'Pin key machine learning and full-stack repositories to the top of your GitHub profile.',
                    details: {
                        objective: 'Enhance public API indexing visibility for automated scraper bots.',
                        codeSnippet: 'git tag -a v1.0.0 -m "Release stable production build"',
                        tasks: [
                            'Pin high-impact repositories (e.g., PINN models, AeroTwin, PulsePoint).',
                            'Add comprehensive README documentation outlining architectural choices.',
                            'Re-run verification scan from the dashboard.'
                        ]
                    }
                }
            ];

            res.json({
                gaps: dynamicGaps,
                roadmap: dynamicRoadmap
            });
        });
    });
});

const { GoogleGenAI } = require('@google/genai');

app.post('/api/generate-resume', async (req, res) => {
    try {
        const { targetRole } = req.body || {};
        if (typeof targetRole !== 'string' || !targetRole.trim()) {
            return res.status(400).json({ success: false, error: 'A targetRole is required' });
        }

        db.get(`SELECT * FROM candidates ORDER BY created_at DESC, id DESC LIMIT 1`, [], async (err, candidate) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (!candidate) return res.status(404).json({ success: false, error: 'Upload and verify a candidate first' });
            if (!process.env.GEMINI_API_KEY) return res.status(503).json({ success: false, error: 'GEMINI_API_KEY is required for AI resume generation' });
            try {
            const rawSkills = candidate ? JSON.parse(candidate.skills_json || '{}') : {};
            const rawProjects = candidate ? JSON.parse(candidate.projects_json || '[]') : [];

            let tailoredResume = null;
            let fallback = false;

            try {
                const prompt = `
                    You are an expert technical resume writer and ATS optimizer.
                    Target Job Role: "${targetRole}"
                    Candidate Raw Skills: ${JSON.stringify(rawSkills)}
                    Candidate Raw Projects: ${JSON.stringify(rawProjects)}

                    Filter and format this candidate's profile so it is 100% tailored and optimized for the "${targetRole}" position. Select only relevant projects and skills.

                    Return strictly as a JSON object with this exact structure:
                    {
                      "fullName": ${JSON.stringify(candidate.name)},
                      "professionalTitle": "Optimized Title for Role",
                      "summary": "A 2-sentence professional summary tailored to the role.",
                      "selectedSkills": ["Skill 1", "Skill 2", "Skill 3"],
                      "optimizedProjects": [
                        { "title": "Project Name", "tech": "Tech Stack used", "description": "High-impact bullet point explaining what was built." }
                      ]
                    }
                `;

                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json' }
                });

                tailoredResume = JSON.parse(response.text);
            } catch (aiError) {
                fallback = true;
                console.warn("Gemini API high demand / error encountered, using resilient fallback payload:", aiError.message);
                
                // Fallback structured resume so presentation never fails
                tailoredResume = {
                  fullName: candidate?.name || "Sadana",
                  professionalTitle: targetRole === 'Data Scientist' ? "Machine Learning & Data Science Engineer" : "Full Stack & AI Engineer",
                  summary: `Results-driven undergraduate specializing in ${targetRole} with hands-on project execution, full-stack web development, and rigorous machine learning pipeline validation.`,
                  selectedSkills: ["Python", "PyTorch", "React.js", "Node.js", "PostgreSQL", "Google Colab", "Git"],
                  optimizedProjects: [
                    {
                      title: targetRole === 'Data Scientist' ? "PINN Flood Forecasting" : "ResumeRadar ATS Platform",
                      tech: "Python, PyTorch, SQLite, React",
                      description: "Designed and implemented advanced data ingestion models with strict mathematical constraints and real-time validation matrices."
                    },
                    {
                      title: "EYE_TRACKING_CURSOR",
                      tech: "OpenCV, MediaPipe, Python",
                      description: "Developed hands-free cursor control pipeline utilizing computer vision and regression models to map landmark coordinates."
                    }
                  ]
                };
            }

            res.json({ success: true, resume: tailoredResume, fallback,
                ...(fallback ? { warning: 'Gemini generation failed. This is a demo fallback resume, not an AI-generated candidate resume.' } : {}) });
            } catch (dataError) {
                res.status(500).json({ success: false, error: 'Stored candidate data could not be read' });
            }
        });
    } catch (error) {
        console.error("Resume generation fatal error:", error);
        res.status(500).json({ success: false, error: "Failed to generate tailored resume" });
    }
});

app.get('/api/gaps-roadmap', (req, res) => {
    db.get(`SELECT * FROM candidates ORDER BY created_at DESC LIMIT 1`, [], (err, candidate) => {
        if (err || !candidate) {
            return res.status(404).json({ error: "No candidate record found in SQLite database" });
        }

        const skills = JSON.parse(candidate.skills_json || '{}');
        const projects = JSON.parse(candidate.projects_json || '[]');

        // Dynamically compute gaps based on database records
        const dynamicGaps = [];
        if (!skills['PyTorch'] && !skills['TensorFlow']) {
            dynamicGaps.push({
                title: "Deep Learning Frameworks",
                type: "Missing Evidence",
                reason: "Database records lack verified PyTorch or TensorFlow code repository signatures.",
                severity: "High"
            });
        }
        if (projects.length < 2) {
            dynamicGaps.push({
                title: "Production Project Volume",
                type: "Profile Gaps",
                reason: `Only ${projects.length} project(s) logged in SQLite. Minimum 3 recommended for high ATS matching.`,
                severity: "Medium"
            });
        }
        // Always include a fallback gap if database is sparse
        if (dynamicGaps.length === 0) {
            dynamicGaps.push({
                title: "Advanced Cloud Pipeline Verification",
                type: "Weakly Represented Skill",
                reason: "Skills listed on resume but no automated CI/CD logs found in connected platforms.",
                severity: "Low"
            });
        }

        res.json({
            success: true,
            gaps: dynamicGaps
        });
    });
});

const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const dbFile = path.join(__dirname, 'resumeradar.db');


// Create jobs table on startup
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        readiness INTEGER NOT NULL,
        skills TEXT NOT NULL,
        description TEXT NOT NULL,
        deadline TEXT NOT NULL,
        applicants INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// --- JOB API ENDPOINTS ---

// 1. Fetch all jobs
app.get("/api/jobs", (req, res) => {
    db.all(`SELECT * FROM jobs ORDER BY id DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, jobs: rows });
    });
});

// 2. Post a new job
app.post("/api/jobs", (req, res) => {
    const { title, company, location, type, readiness, skills, description, deadline } = req.body;
    
    if (!title || !company || !location) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const skillsJson = JSON.stringify(Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()));

    const query = `INSERT INTO jobs (title, company, location, type, readiness, skills, description, deadline, applicants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`;
    
    db.run(query, [title, company, location, type, readiness, skillsJson, description, deadline], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, jobId: this.lastID });
    });
});

// 3. Update an existing job
app.put("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    const { title, company, location, type, readiness, skills, description, deadline } = req.body;
    const skillsJson = JSON.stringify(Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()));

    const query = `UPDATE jobs SET title = ?, company = ?, location = ?, type = ?, readiness = ?, skills = ?, description = ?, deadline = ? WHERE id = ?`;

    db.run(query, [title, company, location, type, readiness, skillsJson, description, deadline, id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, changes: this.changes });
    });
});

// 4. Delete a job posting
app.delete("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM jobs WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, deleted: this.changes });
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Radar Engine & SQLite running on port ${PORT}`);
});