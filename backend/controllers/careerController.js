const ResumeAnalysis = require("../models/resumeAnalysis");
const InterviewSession = require("../models/interviewSession");
const { generateJSON } = require("../services/geminiService");

// @desc    Get AI-powered career recommendations
// @route   GET /api/career/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Gather data from ATS analyses and interview results
    const [latestAnalysis, allAnalyses, completedInterviews] =
      await Promise.all([
        ResumeAnalysis.findOne({ user: userId }).sort({ createdAt: -1 }),
        ResumeAnalysis.find({ user: userId })
          .select("skillsFound missingSkills atsScore")
          .sort({ createdAt: -1 })
          .limit(5),
        InterviewSession.find({ user: userId, status: "completed" })
          .select(
            "jobRole interviewType finalReport experienceLevel"
          )
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    // Check if we have enough data
    if (!latestAnalysis && completedInterviews.length === 0) {
      return res.status(200).json({
        message: "Not enough data for recommendations",
        hasData: false,
        recommendations: null,
      });
    }

    // Build comprehensive profile for Gemini
    const allSkills = [
      ...new Set(allAnalyses.flatMap((a) => a.skillsFound)),
    ];
    const allMissingSkills = [
      ...new Set(allAnalyses.flatMap((a) => a.missingSkills)),
    ];
    const avgAtsScore = allAnalyses.length
      ? Math.round(
          allAnalyses.reduce((sum, a) => sum + a.atsScore, 0) /
            allAnalyses.length
        )
      : 0;

    const interviewSummary = completedInterviews
      .map(
        (i) =>
          `Role: ${i.jobRole} (${i.interviewType}, ${i.experienceLevel}) — Overall: ${i.finalReport?.overallScore || "N/A"}/100, Communication: ${i.finalReport?.communicationScore || "N/A"}/100, Technical: ${i.finalReport?.technicalScore || "N/A"}/100, Recommendation: ${i.finalReport?.hiringRecommendation || "N/A"}`
      )
      .join("\n");

    const resumeSnippet = latestAnalysis?.rawResumeText
      ? latestAnalysis.rawResumeText.substring(0, 2000)
      : "No resume text available";

    const systemPrompt = `You are an expert AI career coach. Based on the candidate's resume skills, ATS analyses, and interview performance, generate personalized career recommendations.

You MUST respond with ONLY a valid JSON object:
{
  "recommendedRoles": [
    { "title": "<role title>", "matchPercentage": <number 0-100>, "reason": "<why this role fits>" }
  ],
  "skillGaps": [
    { "skill": "<skill name>", "currentLevel": "<Beginner|Intermediate|Advanced|None>", "requiredLevel": "<Intermediate|Advanced>", "priority": "<High|Medium|Low>" }
  ],
  "learningRoadmap": [
    { "step": <number>, "title": "<milestone title>", "description": "<what to learn/do>", "duration": "<estimated time>", "resources": ["<resource name or URL>"] }
  ],
  "recommendedProjects": [
    { "title": "<project name>", "description": "<what to build>", "skills": ["<skills it develops>"], "difficulty": "<Beginner|Intermediate|Advanced>" }
  ],
  "recommendedCertifications": [
    { "name": "<certification name>", "provider": "<provider>", "estimatedTime": "<time to complete>", "relevance": "<why it matters>" }
  ]
}

Provide 3-5 items for each category. Be specific, practical, and relevant to the candidate's current level.`;

    const userPrompt = `Candidate Profile:

Skills Found: ${allSkills.join(", ") || "None identified"}
Missing Skills: ${allMissingSkills.join(", ") || "None identified"}
Average ATS Score: ${avgAtsScore}/100

Interview Performance:
${interviewSummary || "No interviews completed yet."}

Resume Summary:
${resumeSnippet}`;

    const recommendations = await generateJSON(systemPrompt, userPrompt);

    res.status(200).json({
      message: "Recommendations generated",
      hasData: true,
      recommendations,
      meta: {
        basedOn: {
          atsAnalyses: allAnalyses.length,
          interviews: completedInterviews.length,
          avgAtsScore,
          totalSkills: allSkills.length,
        },
      },
    });
  } catch (error) {
    console.error("Career recommendations error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecommendations,
};
