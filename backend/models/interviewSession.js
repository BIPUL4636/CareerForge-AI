const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    userAnswer: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    betterAnswer: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const finalReportSchema = new mongoose.Schema(
  {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    communicationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    technicalScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    areasToImprove: {
      type: [String],
      default: [],
    },

    hiringRecommendation: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    experienceLevel: {
      type: String,
      enum: ["Junior", "Mid", "Senior"],
      required: true,
    },

    interviewType: {
      type: String,
      enum: ["HR", "Technical", "Behavioral"],
      required: true,
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },

    questions: [questionSchema],

    finalReport: {
      type: finalReportSchema,
      default: null,
    },

    totalQuestions: {
      type: Number,
      default: 5,
      min: 3,
      max: 10,
    },
  },
  { timestamps: true }
);

// Index for fast user-based queries
interviewSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
