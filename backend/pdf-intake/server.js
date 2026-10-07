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
const result = await parseResume(pdfData.text);


res.json({
    success:true,
    ...result
});

    } catch(error) {

        console.log(error);

        res.status(500).json({
            success:false,
            message:"PDF parsing failed"
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
