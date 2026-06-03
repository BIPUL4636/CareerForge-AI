const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { protect } = require("../middleware/authMiddleware");
const {
  uploadResume,
  getUserResumes,
  analyzeResume,
  getAnalysis,
  getAnalysisHistory,
} = require("../controllers/resumeController");

// ---------- Absolute upload directory ----------
const uploadDir = path.join(__dirname, "..", "uploads");

// Ensure the uploads directory exists at startup (works on Render & locally)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Created uploads directory: ${uploadDir}`);
}

// ---------- Multer configuration ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // absolute path — no more ENOENT
  },

  filename: (req, file, cb) => {
    // Sanitise the original filename to avoid path-traversal issues
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});

// Accept PDF files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// ---------- Multer error-handling middleware ----------
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err.message);
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err) {
    console.error("File upload error:", err.message);
    return res.status(400).json({ message: err.message });
  }
  next();
};

// All routes are protected
router.use(protect);

// Resume upload (multer → error handler → controller)
router.post(
  "/upload",
  upload.single("resume"),
  handleMulterError,
  uploadResume
);

// Resume list
router.get("/list", getUserResumes);

// ATS Analysis
router.post("/analyze", analyzeResume);
router.get("/history", getAnalysisHistory);
router.get("/analysis/:id", getAnalysis);

module.exports = router;