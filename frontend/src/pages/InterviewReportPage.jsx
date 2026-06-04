import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import ScoreGauge from "../components/ScoreGauge";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  ArrowLeft,
  Trophy,
  MessageSquare,
  Code,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const getRecommendationStyle = (rec) => {
  const r = (rec || "").toLowerCase();
  if (r.includes("strong hire"))
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (r.includes("hire") && !r.includes("no"))
    return "bg-brand-500/10 text-brand-400 border-brand-500/20";
  if (r.includes("maybe"))
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-rose-500/10 text-rose-400 border-rose-500/20";
};

function BarChart({ label, value, icon: Icon, color = "brand" }) {
  const colors = {
    brand: "from-brand-500 to-brand-400",
    accent: "from-accent-500 to-accent-400",
    emerald: "from-emerald-500 to-emerald-400",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#4A4A4A] flex items-center gap-2">
          {Icon && <Icon size={14} />}
          {label}
        </span>
        <span className="text-sm font-bold text-[#2D2D2D]">{value}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
        />
      </div>
    </div>
  );
}

export default function InterviewReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState({});

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await API.get(`/interview/${sessionId}`);
        setSession(res.data.session);
      } catch (err) {
        console.error("Failed to load report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || !session.finalReport) {
    return (
      <div className="page-enter max-w-4xl mx-auto">
        <GlassCard hover={false} className="text-center py-16">
          <AlertTriangle size={40} className="text-amber-400 mx-auto mb-4" />
          <p className="text-[#4A4A4A] mb-4">
            Interview report not available yet.
          </p>
          <button
            onClick={() => navigate("/interview")}
            className="px-6 py-2.5 rounded-xl btn-primary text-sm text-white"
          >
            Back to Interviews
          </button>
        </GlassCard>
      </div>
    );
  }

  const report = session.finalReport;

  return (
    <div className="page-enter max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="mb-8"
      >
        <button
          onClick={() => navigate("/interview/history")}
          className="flex items-center gap-2 text-sm text-[#4A4A4A] hover:text-[#2D2D2D] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to History
        </button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
              <span className="gradient-text">Interview</span> Report
            </h1>
            <p className="text-[#6B7280] text-sm">
              {session.interviewType} • {session.jobRole} •{" "}
              {session.experienceLevel} Level
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getRecommendationStyle(report.hiringRecommendation)}`}
          >
            {report.hiringRecommendation}
          </span>
        </div>
      </motion.div>

      {/* Overall Score + Breakdown */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="mb-6"
      >
        <GlassCard hover={false}>
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8">
            <ScoreGauge
              score={report.overallScore}
              size={180}
              label="Overall"
            />
            <div className="flex-1 w-full space-y-4">
              <BarChart
                label="Communication"
                value={report.communicationScore}
                icon={MessageSquare}
                color="brand"
              />
              <BarChart
                label="Technical"
                value={report.technicalScore}
                icon={Code}
                color="accent"
              />
              <BarChart
                label="Confidence"
                value={report.confidenceScore}
                icon={Shield}
                color="emerald"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <h3 className="text-base font-display font-semibold text-[#2D2D2D]">
                Strengths
              </h3>
            </div>
            <div className="space-y-3">
              {report.strengths?.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={14}
                    className="text-emerald-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{s}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertTriangle size={18} className="text-amber-400" />
              </div>
              <h3 className="text-base font-display font-semibold text-[#2D2D2D]">
                Areas to Improve
              </h3>
            </div>
            <div className="space-y-3">
              {report.areasToImprove?.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <AlertTriangle
                    size={14}
                    className="text-amber-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{a}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Question-by-Question Review */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={4}
        className="mb-8"
      >
        <GlassCard hover={false}>
          <h3 className="text-base font-display font-semibold text-[#2D2D2D] mb-4">
            Question-by-Question Review
          </h3>
          <div className="space-y-3">
            {session.questions.map((q, i) => {
              const isExpanded = expandedQ[i];
              const scoreColor =
                q.score >= 8
                  ? "text-emerald-400 bg-emerald-500/10"
                  : q.score >= 6
                    ? "text-brand-400 bg-brand-500/10"
                    : q.score >= 4
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-rose-400 bg-rose-500/10";

              return (
                <div
                  key={i}
                  className="rounded-xl border border-white/5 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedQ((prev) => ({ ...prev, [i]: !prev[i] }))
                    }
                    className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${scoreColor}`}
                      >
                        {q.score}/10
                      </span>
                      <span className="text-sm text-[#4A4A4A] truncate">
                        Q{i + 1}: {q.question}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-[#6B7280] flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-[#6B7280] flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3"
                    >
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">
                          Your Answer:
                        </p>
                        <p className="text-sm text-[#1a1a1a] leading-relaxed bg-white/[0.02] rounded-lg p-3">
                          {q.userAnswer}
                        </p>
                      </div>
                      {q.betterAnswer && (
                        <div>
                          <p className="text-xs text-accent-400 mb-1">
                            Model Answer:
                          </p>
                          <p className="text-sm text-[#1a1a1a] leading-relaxed bg-accent-500/5 rounded-lg p-3 border border-accent-500/10">
                            {q.betterAnswer}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={5}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={() => navigate("/interview")}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl btn-primary text-sm font-semibold text-white"
        >
          <Sparkles size={18} />
          Start New Interview
        </button>
        <button
          onClick={() => navigate("/career")}
          className="px-6 py-4 rounded-2xl btn-ghost text-sm font-medium text-[#4A4A4A] flex items-center gap-2"
        >
          Career Coach
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
