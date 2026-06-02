const Resume = require("../models/resume");
const ResumeAnalysis = require("../models/resumeAnalysis");
const { generateJSON } = require("../services/geminiService");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

// @desc    Upload a resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    console.log("req.file =", req.file);
    console.log("req.body =", req.body);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.filename,
      filePath: req.file.path,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get all resumes for current user
// @route   GET /api/resume/list
// @access  Private
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze a resume with AI (ATS scoring)
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobRole } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: "Resume ID is required" });
    }

    // Find the resume and verify ownership
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Read the PDF file
    const filePath = path.resolve(resume.filePath);

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "Resume file not found on server" });
    }


    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    console.log("Resume Text Length:", resumeText.length);
    console.log("Resume Preview:");
    console.log(resumeText.substring(0, 500));

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: "Could not extract sufficient text from the resume PDF",
      });
    }

    // Build the Gemini prompt
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and career consultant. 
Analyze the provided resume text and return a detailed ATS analysis.
${jobRole ? `The target job role is: ${jobRole}` : "Analyze for general software/tech industry roles."}

You MUST respond with ONLY a valid JSON object in this EXACT format, no additional text:
{
  "atsScore": <number 0-100>,
  "skillsFound": [<array of skill strings found in the resume>],
  "missingSkills": [<array of important skills missing from the resume>],
  "strengths": [<array of resume strength descriptions>],
  "weaknesses": [<array of resume weakness descriptions>],
  "recommendedKeywords": [<array of keywords to add to improve ATS score>],
  "improvementSuggestions": [<array of specific actionable improvement suggestions>]
}

Be thorough, specific, and actionable in your analysis. Score realistically — most resumes score between 40-80.`;

    const userPrompt = `Analyze this resume:\n\n${resumeText}`;

    // Call Gemini API
    const analysis = await generateJSON(systemPrompt, userPrompt);

    // Save the analysis to MongoDB
    const savedAnalysis = await ResumeAnalysis.create({
      user: req.user.id,
      resume: resumeId,
      atsScore: analysis.atsScore || 0,
      skillsFound: analysis.skillsFound || [],
      missingSkills: analysis.missingSkills || [],
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      recommendedKeywords: analysis.recommendedKeywords || [],
      improvementSuggestions: analysis.improvementSuggestions || [],
      jobRole: jobRole || "",
      rawResumeText: resumeText,
    });

    res.status(200).json({
      message: "Resume analyzed successfully",
      analysis: savedAnalysis,
    });
  } catch (error) {
    console.error("Resume analysis error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single analysis by ID
// @route   GET /api/resume/analysis/:id
// @access  Private
const getAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findById(req.params.id).populate(
      "resume",
      "fileName filePath",
    );

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    if (analysis.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({ analysis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all analysis history for current user
// @route   GET /api/resume/history
// @access  Private
const getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user.id })
      .populate("resume", "fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({ analyses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
  getUserResumes,
  analyzeResume,
  getAnalysis,
  getAnalysisHistory,
};
