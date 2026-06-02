const InterviewSession = require("../models/interviewSession");
const { generateJSON } = require("../services/geminiService");

// @desc    Start a new interview session
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const { jobRole, experienceLevel, interviewType, totalQuestions } = req.body;

    if (!jobRole || !experienceLevel || !interviewType) {
      return res.status(400).json({
        message: "Job role, experience level, and interview type are required",
      });
    }

    // Validate enums
    if (!["Junior", "Mid", "Senior"].includes(experienceLevel)) {
      return res.status(400).json({ message: "Invalid experience level" });
    }
    if (!["HR", "Technical", "Behavioral"].includes(interviewType)) {
      return res.status(400).json({ message: "Invalid interview type" });
    }

    // Generate first question via Gemini
    const systemPrompt = `You are an expert ${interviewType} interviewer at a top tech company.
You are interviewing a ${experienceLevel}-level candidate for the role of "${jobRole}".
This is a ${interviewType} interview.

Generate the first interview question. The question should be appropriate for a ${experienceLevel}-level candidate.

You MUST respond with ONLY a valid JSON object:
{
  "question": "<your interview question>"
}`;

    const result = await generateJSON(systemPrompt, "Generate the first interview question.");

    // Create the session
    const session = await InterviewSession.create({
      user: req.user.id,
      jobRole,
      experienceLevel,
      interviewType,
      totalQuestions: totalQuestions || 5,
      questions: [{ question: result.question }],
    });

    res.status(201).json({
      message: "Interview started",
      session: {
        _id: session._id,
        jobRole: session.jobRole,
        experienceLevel: session.experienceLevel,
        interviewType: session.interviewType,
        status: session.status,
        totalQuestions: session.totalQuestions,
        currentQuestion: 1,
        question: result.question,
      },
    });
  } catch (error) {
    console.error("Start interview error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit an answer and get feedback + next question
// @route   POST /api/interview/answer
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({
        message: "Session ID and answer are required",
      });
    }

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Interview session not found" });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Interview already completed" });
    }

    // Find the current unanswered question
    const currentIdx = session.questions.findIndex((q) => !q.userAnswer);
    if (currentIdx === -1) {
      return res.status(400).json({ message: "All questions already answered" });
    }

    // Build conversation context for Gemini
    const conversationContext = session.questions
      .slice(0, currentIdx)
      .map(
        (q, i) =>
          `Q${i + 1}: ${q.question}\nCandidate Answer: ${q.userAnswer}\nScore: ${q.score}/10`
      )
      .join("\n\n");

    const currentQuestion = session.questions[currentIdx].question;
    const isLastQuestion = currentIdx >= session.totalQuestions - 1;

    // Evaluate the answer
    const evalPrompt = `You are an expert ${session.interviewType} interviewer evaluating a ${session.experienceLevel}-level candidate for "${session.jobRole}".

Previous conversation:
${conversationContext || "This is the first question."}

Current Question (Q${currentIdx + 1}): ${currentQuestion}
Candidate's Answer: ${answer}

Evaluate the answer and ${isLastQuestion ? "DO NOT generate a next question since this is the final question." : "generate the next interview question."}

You MUST respond with ONLY a valid JSON object:
{
  "score": <number 0-10>,
  "strengths": [<array of strength strings in the answer>],
  "weaknesses": [<array of weakness strings in the answer>],
  "improvements": [<array of specific improvement suggestions>],
  "betterAnswer": "<a model answer that would score 10/10>"${isLastQuestion ? "" : ',\n  "nextQuestion": "<the next interview question>"'}
}`;

    const evaluation = await generateJSON(evalPrompt, "Evaluate the candidate's answer.");

    // Update the current question with answer and evaluation
    session.questions[currentIdx].userAnswer = answer;
    session.questions[currentIdx].score = evaluation.score || 0;
    session.questions[currentIdx].strengths = evaluation.strengths || [];
    session.questions[currentIdx].weaknesses = evaluation.weaknesses || [];
    session.questions[currentIdx].improvements = evaluation.improvements || [];
    session.questions[currentIdx].betterAnswer = evaluation.betterAnswer || "";

    // If not the last question, add the next question
    if (!isLastQuestion && evaluation.nextQuestion) {
      session.questions.push({ question: evaluation.nextQuestion });
    }

    // If this was the last question, generate final report
    if (isLastQuestion) {
      session.status = "completed";

      const reportContext = session.questions
        .map(
          (q, i) =>
            `Q${i + 1}: ${q.question}\nAnswer: ${q.userAnswer}\nScore: ${q.score}/10\nStrengths: ${q.strengths.join(", ")}\nWeaknesses: ${q.weaknesses.join(", ")}`
        )
        .join("\n\n");

      const reportPrompt = `You are an expert ${session.interviewType} interviewer. Generate a comprehensive final interview report.

Role: ${session.jobRole}
Level: ${session.experienceLevel}
Type: ${session.interviewType}

Full Interview Transcript:
${reportContext}

You MUST respond with ONLY a valid JSON object:
{
  "overallScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "technicalScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "strengths": [<array of overall strength descriptions>],
  "areasToImprove": [<array of areas where the candidate should improve>],
  "hiringRecommendation": "<Strong Hire | Hire | Maybe | No Hire>"
}

Be realistic and constructive in your assessment.`;

      const report = await generateJSON(reportPrompt, "Generate the final interview report.");

      session.finalReport = {
        overallScore: report.overallScore || 0,
        communicationScore: report.communicationScore || 0,
        technicalScore: report.technicalScore || 0,
        confidenceScore: report.confidenceScore || 0,
        strengths: report.strengths || [],
        areasToImprove: report.areasToImprove || [],
        hiringRecommendation: report.hiringRecommendation || "",
      };
    }

    await session.save();

    const responseData = {
      message: isLastQuestion ? "Interview completed" : "Answer evaluated",
      currentQuestion: currentIdx + 1,
      totalQuestions: session.totalQuestions,
      evaluation: {
        score: evaluation.score,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        improvements: evaluation.improvements,
        betterAnswer: evaluation.betterAnswer,
      },
      isCompleted: isLastQuestion,
    };

    if (!isLastQuestion && evaluation.nextQuestion) {
      responseData.nextQuestion = evaluation.nextQuestion;
    }

    if (isLastQuestion && session.finalReport) {
      responseData.finalReport = session.finalReport;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Submit answer error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single interview session
// @route   GET /api/interview/:sessionId
// @access  Private
const getSession = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: "Interview session not found" });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all interview history for current user
// @route   GET /api/interview/history
// @access  Private
const getInterviewHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id })
      .select(
        "jobRole experienceLevel interviewType status totalQuestions finalReport.overallScore createdAt"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getSession,
  getInterviewHistory,
};
