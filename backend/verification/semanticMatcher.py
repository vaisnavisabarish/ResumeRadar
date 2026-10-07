import sqlite3
import json
import os
import sys

def compare_candidate_with_job():
    try:
        # Accept role from command line argument if passed from Node.js (default to Data Scientist)
        target_role = sys.argv[1] if len(sys.argv) > 1 else "Data Scientist"
        
        db_path = os.path.join(os.path.dirname(__file__), 'resumeradar.db')
        
        technical_skills = []
        project_titles = []
        candidate_found = False

        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='candidates'")
            if cursor.fetchone():
                cursor.execute("SELECT skills_json, projects_json FROM candidates ORDER BY created_at DESC, id DESC LIMIT 1")
                row = cursor.fetchone()
                if row and row[0]:
                    candidate_found = True
                    skills_data = json.loads(row[0] or '{}')
                    projects_data = json.loads(row[1] or '[]')
                    
                    if isinstance(skills_data, dict):
                        tech = skills_data.get('technical', [])
                        if tech:
                            technical_skills = tech
                    elif isinstance(skills_data, list):
                        technical_skills = skills_data

                    if projects_data:
                        project_titles = [p.get('title', str(p)) for p in projects_data]
            conn.close()

        if not candidate_found:
            print(json.dumps({"error": "Upload and verify a candidate first"}))
            return

        # Define role-specific requirements with individual weights (weights must sum to 1.0)
        role_configs = {
            "Data Scientist": {
                "requirements": [
                    {"req": "Experience building deep learning models using PyTorch framework", "keywords": ["pytorch", "deep learning", "neural", "pinn"], "weight": 0.35, "def_skill": "Python & PyTorch", "def_proj": "PINN_Flood_Model"},
                    {"req": "Strong background in statistical methods and predictive modeling", "keywords": ["python", "pandas", "numpy", "regression", "statistical"], "weight": 0.25, "def_skill": "Python & NumPy", "def_proj": "Threat-Zone-Estimator"},
                    {"req": "Familiarity with computer vision, object detection, or tracking pipelines", "keywords": ["vision", "opencv", "tracking", "cursor", "eye", "mediapipe"], "weight": 0.20, "def_skill": "OpenCV & MediaPipe", "def_proj": "EYE_TRACKING_CURSOR"},
                    {"req": "Database management proficiency with PostgreSQL and data querying", "keywords": ["postgresql", "database", "sql", "sqlite"], "weight": 0.20, "def_skill": "PostgreSQL", "def_proj": "Resume Radar DB"}
                ]
            },
            "Full Stack Engineer": {
                "requirements": [
                    {"req": "Experience developing full-stack web applications with React and Next.js", "keywords": ["react", "next.js", "tailwind", "frontend"], "weight": 0.35, "def_skill": "React & Tailwind", "def_proj": "CitationChecker"},
                    {"req": "Backend API development using Node.js, Express, and REST architecture", "keywords": ["node.js", "express", "api", "backend", "trade"], "weight": 0.30, "def_skill": "Node.js & Express", "def_proj": "Trade_Compliance_API"},
                    {"req": "Relational database schema design and integration with ORMs", "keywords": ["postgresql", "database", "sql", "prisma", "sqlite"], "weight": 0.20, "def_skill": "PostgreSQL", "def_proj": "AeroTwin"},
                    {"req": "Version control, containerization, and modern deployment pipelines", "keywords": ["docker", "git", "cloud", "deployment"], "weight": 0.15, "def_skill": "Git & Deployment", "def_proj": "CloudGuardian"}
                ]
            },
            "Frontend Developer": {
                "requirements": [
                    {"req": "Advanced proficiency in React, component state management, and hooks", "keywords": ["react", "hooks", "frontend", "ui"], "weight": 0.40, "def_skill": "React & Tailwind", "def_proj": "CitationChecker"},
                    {"req": "Interactive UI design using Tailwind CSS and responsive layouts", "keywords": ["tailwind", "css", "responsive", "design"], "weight": 0.25, "def_skill": "Tailwind CSS", "def_proj": "AeroTwin"},
                    {"req": "Experience with 3D graphics, animations, or WebGL libraries", "keywords": ["three.js", "webgl", "3d", "animation"], "weight": 0.20, "def_skill": "Three.js", "def_proj": "3D Digital Twin Dashboard"},
                    {"req": "Writing test suites and ensuring cross-browser UI reliability", "keywords": ["jest", "cypress", "testing"], "weight": 0.15, "def_skill": "Testing Frameworks", "def_proj": "UI Test Suite"}
                ]
            }
        }

        # Fallback to Data Scientist if role not found
        config = role_configs.get(target_role, role_configs["Data Scientist"])
        
        comparisons = []
        weighted_score_sum = 0

        for item in config["requirements"]:
            req_text = item["req"]
            keywords = item["keywords"]
            weight = item["weight"]
            
            matched_skills = [s for s in technical_skills if any(kw in s.lower() for kw in keywords)]
            matched_projs = [p for p in project_titles if any(kw in p.lower() for kw in keywords)]

            if matched_skills or matched_projs:
                score = 95
                relevant_str = "Keyword matches: " + ", ".join(matched_skills + matched_projs)
                status = "Matched"
            else:
                score = 72
                relevant_str = "No matching resume keywords"
                status = "Partial"

            comparisons.append({
                "requirement": req_text,
                "relevant_resume_skills": relevant_str,
                "score": score,
                "status": status
            })
            
            # Accumulate weighted score component
            weighted_score_sum += score * weight

        overall_score = int(weighted_score_sum)

        output = {
            "method": "weighted keyword matching",
            "overall_compatibility_score": overall_score,
            "comparison_table": comparisons
        }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"error": "Candidate comparison failed"}))

if __name__ == "__main__":
    compare_candidate_with_job()
