const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  discoverJobs,
} = require("../controllers/jobController");

// All routes are protected
router.use(protect);

// Static routes first (before :id param routes)
router.get("/stats", getJobStats);
router.get("/discover", discoverJobs);

// CRUD routes
router.route("/").get(getJobs).post(createJob);
router.route("/:id").put(updateJob).delete(deleteJob);

module.exports = router;
