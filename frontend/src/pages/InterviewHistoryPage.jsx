import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MessageSquare,
  Code,
  Heart,
  Users,
  Trophy,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const typeIcons = {
  HR: Users,
  Technical: Code,
  Behavioral: Heart,
};

const typeColors = {
  HR: "from-brand-500 to-brand-600",
  Technical: "from-accent-500 to-accent-600",
  Behavioral: "from-emerald-500 to-emerald-600",
};

const getScoreColor = (score) => {
  if (!score && score !== 0) return "text-zinc-500 bg-white/5";
  if (score >= 80) return "text-emerald-400 bg-emerald-500/10";
  if (score >= 60) return "text-brand-400 bg-brand-500/10";
  if (score >= 40) return "text-amber-400 bg-amber-500/10";
  return "text-rose-400 bg-rose-500/10";
};

export default function InterviewHistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/interview/history");
        setSessions(res.data.sessions || []);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
          onClick={() => navigate("/interview")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Interview Setup
        </button>

        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
          <span className="gradient-text">Interview</span> History
        </h1>
        <p className="text-zinc-500">
          Review your past mock interviews and performance.
        </p>
      </motion.div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No interviews yet"
          description="Start your first mock interview to practice and improve your skills."
          actionLabel="Start Interview"
          actionPath="/interview"
        />
      ) : (
        <div className="space-y-3">
          {sessions.map((session, i) => {
            const TypeIcon = typeIcons[session.interviewType] || MessageSquare;
            const isCompleted = session.status === "completed";
            const score = session.finalReport?.overallScore;

            return (
              <motion.div
                key={session._id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i + 1}
              >
                <GlassCard
                  onClick={() =>
                    navigate(
                      isCompleted
                        ? `/interview/report/${session._id}`
                        : `/interview/session/${session._id}`
                    )
                  }
                  className="flex items-center gap-4"
                >
                  {/* Type Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[session.interviewType] || "from-brand-500 to-brand-600"} flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <TypeIcon size={20} className="text-white" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {session.jobRole}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-zinc-500">
                        {session.interviewType} • {session.experienceLevel}
                      </span>
                      <span className="text-xs text-zinc-600 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(session.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Score / Status */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {isCompleted ? (
                      <div
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold ${getScoreColor(score)}`}
                      >
                        {score}/100
                      </div>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium">
                        In Progress
                      </span>
                    )}
                    <ArrowRight size={16} className="text-zinc-600" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
