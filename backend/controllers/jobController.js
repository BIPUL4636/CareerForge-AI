const Job = require("../models/job");
const axios = require("axios");

// @desc    Get all jobs for the logged-in user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const { search, status } = req.query;

    const query = { user: req.user.id };

    // Filter by status
    if (status && status !== "All") {
      query.status = status;
    }

    // Search by company or role
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new tracked job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const { company, role, location, status, link, notes, appliedDate } =
      req.body;

    if (!company || !role) {
      return res
        .status(400)
        .json({ message: "Company and role are required" });
    }

    const job = await Job.create({
      user: req.user.id,
      company,
      role,
      location: location || "Remote",
      status: status || "Applied",
      link: link || "",
      notes: notes || "",
      appliedDate: appliedDate || Date.now(),
    });

    res.status(201).json({ message: "Job added successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a tracked job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure user owns this job
    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Job updated", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a tracked job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure user owns this job
    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job stats for the dashboard
// @route   GET /api/jobs/stats
// @access  Private
const getJobStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [total, applied, interview, offer, rejected, saved] =
      await Promise.all([
        Job.countDocuments({ user: userId }),
        Job.countDocuments({ user: userId, status: "Applied" }),
        Job.countDocuments({ user: userId, status: "Interview" }),
        Job.countDocuments({ user: userId, status: "Offer" }),
        Job.countDocuments({ user: userId, status: "Rejected" }),
        Job.countDocuments({ user: userId, status: "Saved" }),
      ]);

    res.status(200).json({
      total,
      applied,
      interview,
      offer,
      rejected,
      saved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Discover live jobs from Remotive API
// @route   GET /api/jobs/discover
// @access  Private
const discoverJobs = async (req, res) => {
  try {
    const { search, category, limit } = req.query;

    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (limit) params.limit = parseInt(limit) || 20;
    else params.limit = 20;

    const response = await axios.get(
      "https://remotive.com/api/remote-jobs",
      { params, timeout: 10000 }
    );

    const jobs = response.data.jobs || [];

    // Transform to a clean format
    const formatted = jobs.slice(0, params.limit).map((job) => ({
      id: job.id,
      company: job.company_name,
      role: job.title,
      location: job.candidate_required_location || "Worldwide",
      category: job.category,
      jobType: job.job_type,
      salary: job.salary || "Not disclosed",
      link: job.url,
      publishedDate: job.publication_date,
      companyLogo: job.company_logo_url || null,
      tags: job.tags || [],
    }));

    res.status(200).json({ jobs: formatted, total: jobs.length });
  } catch (error) {
    console.error("Remotive API error:", error.message);
    res.status(502).json({
      message: "Failed to fetch jobs from external API",
      error: error.message,
    });
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  discoverJobs,
};
