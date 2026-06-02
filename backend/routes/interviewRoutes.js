const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  startInterview,
  submitAnswer,
  getSession,
  getInterviewHistory,
} = require("../controllers/interviewController");

// All routes are protected
router.use(protect);

// Static routes first
router.get("/history", getInterviewHistory);

// Interview session routes
router.post("/start", startInterview);
router.post("/answer", submitAnswer);
router.get("/:sessionId", getSession);

module.exports = router;
