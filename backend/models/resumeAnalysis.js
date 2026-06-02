const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    skillsFound: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendedKeywords: {
      type: [String],
      default: [],
    },

    improvementSuggestions: {
      type: [String],
      default: [],
    },

    jobRole: {
      type: String,
      default: "",
      trim: true,
    },

    rawResumeText: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for fast user-based queries
resumeAnalysisSchema.index({ user: 1, createdAt: -1 });
resumeAnalysisSchema.index({ resume: 1 });

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
