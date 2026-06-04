const Resume = require("../models/resume");
const ResumeAnalysis = require("../models/resumeAnalysis");
const { generateJSON } = require("../services/geminiService");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

// Absolute path to the uploads directory (matches resumeRoutes.js)
const uploadDir = path.join(__dirname, "..", "uploads");

// @desc    Upload a resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    console.log("[uploadResume] req.file =", req.file);
    console.log("[uploadResume] req.body =", req.body);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Use req.file.path which Multer already set to the absolute path
    const absolutePath = req.file.path;
    console.log(`[uploadResume] File saved at: ${absolutePath}`);
    console.log(`[uploadResume] File exists: ${fs.existsSync(absolutePath)}`);

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
    console.error("[uploadResume] Error:", error.message);
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

    // Resolve the file path — handle both old relative paths and new absolute paths
    let filePath = resume.filePath;
    if (!path.isAbsolute(filePath)) {
      // Legacy record stored a relative path like "uploads/123-file.pdf"
      // Resolve it against the project root (one level above controllers/)
      filePath = path.join(uploadDir, path.basename(filePath));
    }
    console.log(`[analyzeResume] Resolved file path: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      console.error(`[analyzeResume] File not found: ${filePath}`);
      return res
        .status(404)
        .json({ message: "Resume file not found on server" });
    }

    let resumeText;
    try {
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);
      resumeText = pdfData.text;
    } catch (readErr) {
      console.error("[analyzeResume] PDF read/parse error:", readErr.message);
      return res.status(500).json({ message: "Failed to read the resume PDF" });
    }

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

// @desc    Delete a resume and its associated file + analyses
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Verify ownership
    if (resume.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 1. Delete the physical file from disk
    let filePath = resume.filePath;
    if (!path.isAbsolute(filePath)) {
      filePath = path.join(uploadDir, path.basename(filePath));
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[deleteResume] Deleted file: ${filePath}`);
    } else {
      console.warn(`[deleteResume] File not found (already deleted?): ${filePath}`);
    }

    // 2. Delete all associated ResumeAnalysis records
    const deletedAnalyses = await ResumeAnalysis.deleteMany({ resume: resume._id });
    console.log(`[deleteResume] Deleted ${deletedAnalyses.deletedCount} associated analyses`);

    // 3. Delete the resume document from MongoDB
    await Resume.findByIdAndDelete(req.params.id);
    console.log(`[deleteResume] Deleted resume record: ${req.params.id}`);

    res.status(200).json({ message: "Resume deleted permanently" });
  } catch (error) {
    console.error("[deleteResume] Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
  getUserResumes,
  analyzeResume,
  getAnalysis,
  getAnalysisHistory,
  deleteResume,
};
