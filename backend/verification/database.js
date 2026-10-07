const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'resumeradar.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database successfully.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        github_url TEXT,
        linkedin_url TEXT,
        skills_json TEXT,
        projects_json TEXT,
        experience_json TEXT,
        certifications_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS verification_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER,
        skill TEXT,
        score INTEGER,
        status TEXT,
        sources INTEGER,
        repos_json TEXT,
        FOREIGN KEY(candidate_id) REFERENCES candidates(id)
    )`);
});

module.exports = db;