const express = require("express");
const router = express.Router();

const multer = require("multer");

const { protect } = require("../middleware/authMiddleware");
const {
  uploadResume,
  getUserResumes,
  analyzeResume,
  getAnalysis,
  getAnalysisHistory,
} = require("../controllers/resumeController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// All routes are protected
router.use(protect);

// Resume upload
router.post(
  "/upload",
  upload.single("resume"),
  uploadResume
);

// Resume list
router.get("/list", getUserResumes);

// ATS Analysis
router.post("/analyze", analyzeResume);
router.get("/history", getAnalysisHistory);
router.get("/analysis/:id", getAnalysis);

module.exports = router;