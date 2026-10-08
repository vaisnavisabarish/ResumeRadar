const {
    extractEmail,
    extractPhone,
    extractUrls,
    classifyUrls,
    extractSkills
} = require("./parser");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const app = express();
const uploadsDirectory = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDirectory, { recursive: true });

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDirectory);
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"));
        }
    }
});

app.get("/", (req, res) => {
    res.json({
        message: "Candidate Intake API is running!"
    });
});

const PORT = 5000;

const sqlite3 = require('sqlite3').verbose();

// Helper to open DB connection
const getDb = () => new sqlite3.Database(path.join(__dirname, 'resumeradar.db'));

app.post("/api/resume/upload", upload.single("resume"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "A PDF file is required in the resume field" });
    }

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const parser = new PDFParse({ data: dataBuffer });
        const pdfData = await parser.getText();
        const text = pdfData.text;

        const urls = extractUrls(text);
        const { parseResume } = require("./resumeParser");
        const result = await parseResume(text); // yields candidate, education, skills, projects, experience, research

        // --- INSERT INTO SQLITE DATABASE ---
        const db = getDb();

        db.serialize(() => {
            // 1. Create tables if they don't exist
            db.run(`CREATE TABLE IF NOT EXISTS candidates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                phone TEXT,
                profile_links TEXT,
                skills TEXT,
                education TEXT,
                projects TEXT,
                experience TEXT,
                research TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // 2. Insert extracted candidate details
            const stmt = db.prepare(`INSERT INTO candidates (name, email, phone, profile_links, skills, education, projects, experience, research) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            
            stmt.run(
                result.candidate?.name || text.split("\n")[0],
                result.candidate?.email || extractEmail(text),
                result.candidate?.phone || extractPhone(text),
                JSON.stringify(result.candidate?.profile_links || classifyUrls(urls)),
                JSON.stringify(result.skills || {}),
                JSON.stringify(result.education || []),
                JSON.stringify(result.projects || []),
                JSON.stringify(result.experience || []),
                JSON.stringify(result.research || [])
            );
            
            stmt.finalize();
        });

        db.close((err) => {
            if (err) console.error("Error closing DB:", err);
        });
        // ------------------------------------

        res.json({
            success: true,
            ...result
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "PDF parsing or database insertion failed"
        });
    }
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    res.status(400).json({ success: false, message: error.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
