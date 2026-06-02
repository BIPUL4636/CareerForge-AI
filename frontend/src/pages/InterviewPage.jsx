import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import TagChip from "../components/TagChip";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  Send,
  Loader2,
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Trophy,
  XCircle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export default function InterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [showBetterAnswer, setShowBetterAnswer] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await API.get(`/interview/${sessionId}`);
        const s = res.data.session;
        setSession(s);
        setTotalQuestions(s.totalQuestions);

        // Rebuild message history from existing questions
        const msgs = [];
        s.questions.forEach((q, i) => {
          msgs.push({ type: "question", text: q.question, num: i + 1 });
          if (q.userAnswer) {
            msgs.push({ type: "answer", text: q.userAnswer });
            msgs.push({
              type: "feedback",
              score: q.score,
              strengths: q.strengths,
              weaknesses: q.weaknesses,
              improvements: q.improvements,
              betterAnswer: q.betterAnswer,
              num: i + 1,
            });
          }
        });

        setMessages(msgs);

        if (s.status === "completed") {
          setIsCompleted(true);
        } else {
          // Find the current unanswered question
          const unansweredIdx = s.questions.findIndex((q) => !q.userAnswer);
          if (unansweredIdx !== -1) {
            setCurrentQuestion(s.questions[unansweredIdx].question);
            setCurrentQuestionNum(unansweredIdx + 1);
          }
        }
      } catch (err) {
        toast.error("Failed to load interview session");
        navigate("/interview");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!answer.trim() || submitting) return;

    const userAnswer = answer.trim();
    setAnswer("");
    setSubmitting(true);

    // Add user answer to messages immediately
    setMessages((prev) => [...prev, { type: "answer", text: userAnswer }]);

    try {
      const res = await API.post("/interview/answer", {
        sessionId,
        answer: userAnswer,
      });

      // Add feedback
      setMessages((prev) => [
        ...prev,
        {
          type: "feedback",
          score: res.data.evaluation.score,
          strengths: res.data.evaluation.strengths,
          weaknesses: res.data.evaluation.weaknesses,
          improvements: res.data.evaluation.improvements,
          betterAnswer: res.data.evaluation.betterAnswer,
          num: res.data.currentQuestion,
        },
      ]);

      if (res.data.isCompleted) {
        setIsCompleted(true);
        toast.success("Interview completed! View your report.");
      } else if (res.data.nextQuestion) {
        // Add next question
        const nextNum = res.data.currentQuestion + 1;
        setCurrentQuestion(res.data.nextQuestion);
        setCurrentQuestionNum(nextNum);
        setMessages((prev) => [
          ...prev,
          { type: "question", text: res.data.nextQuestion, num: nextNum },
        ]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit answer");
      // Remove the optimistically-added answer
      setMessages((prev) => prev.slice(0, -1));
      setAnswer(userAnswer);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBetterAnswer = (num) => {
    setShowBetterAnswer((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center justify-between mb-4 flex-shrink-0"
      >
        <div>
          <h1 className="text-lg font-display font-bold text-white">
            {session?.interviewType} Interview —{" "}
            <span className="gradient-text">{session?.jobRole}</span>
          </h1>
          <p className="text-xs text-zinc-500">
            {session?.experienceLevel} Level
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const answered = messages.filter((m) => m.type === "answer").length;
              return (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i < answered
                      ? "bg-brand-500 shadow-lg shadow-brand-500/30"
                      : i === answered && !isCompleted
                        ? "bg-brand-400 animate-pulse"
                        : "bg-white/10"
                  }`}
                />
              );
            })}
          </div>
          <span className="text-xs text-zinc-500">
            Q{Math.min(currentQuestionNum, totalQuestions)}/{totalQuestions}
          </span>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => {
            if (msg.type === "question") {
              return (
                <motion.div
                  key={`q-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-500 mb-1">
                      Question {msg.num}
                    </p>
                    <div className="glass rounded-2xl rounded-tl-md p-4">
                      <p className="text-sm text-zinc-200 leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            }

            if (msg.type === "answer") {
              return (
                <motion.div
                  key={`a-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-end"
                >
                  <div className="max-w-[80%]">
                    <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl rounded-tr-md p-4">
                      <p className="text-sm text-zinc-200 leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-zinc-300" />
                  </div>
                </motion.div>
              );
            }

            if (msg.type === "feedback") {
              const scoreColor =
                msg.score >= 8
                  ? "text-emerald-400 bg-emerald-500/10"
                  : msg.score >= 6
                    ? "text-brand-400 bg-brand-500/10"
                    : msg.score >= 4
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-rose-400 bg-rose-500/10";

              return (
                <motion.div
                  key={`f-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-12"
                >
                  <div className="glass rounded-2xl p-4 border border-white/5">
                    {/* Score */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold ${scoreColor}`}
                      >
                        {msg.score}/10
                      </div>
                      <span className="text-xs text-zinc-500">
                        Answer Score
                      </span>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      {msg.strengths?.length > 0 && (
                        <div>
                          <p className="text-xs text-emerald-400 mb-1.5 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Strengths
                          </p>
                          <div className="space-y-1">
                            {msg.strengths.map((s, j) => (
                              <p
                                key={j}
                                className="text-xs text-zinc-400 leading-relaxed"
                              >
                                • {s}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {msg.weaknesses?.length > 0 && (
                        <div>
                          <p className="text-xs text-amber-400 mb-1.5 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Areas to Improve
                          </p>
                          <div className="space-y-1">
                            {msg.weaknesses.map((w, j) => (
                              <p
                                key={j}
                                className="text-xs text-zinc-400 leading-relaxed"
                              >
                                • {w}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Improvements */}
                    {msg.improvements?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-brand-400 mb-1.5 flex items-center gap-1">
                          <Lightbulb size={12} />
                          Tips
                        </p>
                        <div className="space-y-1">
                          {msg.improvements.map((imp, j) => (
                            <p
                              key={j}
                              className="text-xs text-zinc-400 leading-relaxed"
                            >
                              • {imp}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Better Answer Toggle */}
                    {msg.betterAnswer && (
                      <div>
                        <button
                          onClick={() => toggleBetterAnswer(msg.num)}
                          className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition-colors"
                        >
                          {showBetterAnswer[msg.num] ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                          {showBetterAnswer[msg.num]
                            ? "Hide"
                            : "Show"}{" "}
                          Model Answer
                        </button>
                        <AnimatePresence>
                          {showBetterAnswer[msg.num] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 p-3 rounded-lg bg-accent-500/5 border border-accent-500/10"
                            >
                              <p className="text-xs text-zinc-300 leading-relaxed">
                                {msg.betterAnswer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            }

            return null;
          })}
        </AnimatePresence>

        {/* Submitting indicator */}
        {submitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 ml-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="glass rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-zinc-500">Evaluating...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area / Completed State */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <button
              onClick={() => navigate(`/interview/report/${sessionId}`)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl btn-primary text-sm font-semibold text-white"
            >
              <Trophy size={18} />
              View Final Report
            </button>
            <button
              onClick={() => navigate("/interview")}
              className="px-6 py-4 rounded-2xl btn-ghost text-sm font-medium text-zinc-300"
            >
              New Interview
            </button>
          </motion.div>
        ) : (
          <div className="glass rounded-2xl p-3 flex gap-3">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Type your answer... (Shift+Enter for new line)"
              rows={3}
              disabled={submitting}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none leading-relaxed"
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || submitting}
              className={`
                self-end p-3 rounded-xl transition-all duration-200
                ${
                  answer.trim() && !submitting
                    ? "bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20"
                    : "bg-white/5 text-zinc-600 cursor-not-allowed"
                }
              `}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
