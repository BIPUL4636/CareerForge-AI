import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import {
  ArrowLeft,
  FileText,
  ArrowRight,
  Calendar,
  Target,
  History,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const getScoreColor = (score) => {
  if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 60) return "text-indigo-600 bg-indigo-50 border-indigo-200";
  if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-rose-600 bg-rose-50 border-rose-200";
};

export default function ResumeHistoryPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/resume/history");
        setAnalyses(res.data.analyses || []);
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
          onClick={() => navigate("/resume")}
          className="flex items-center gap-2 text-sm text-[#4A4A4A] hover:text-[#2D2D2D] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Resumes
        </button>

        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 text-[#2D2D2D]">
          <span className="gradient-text">Analysis</span> History
        </h1>
        <p className="text-[#4A4A4A]">
          All your past resume ATS analyses in one place.
        </p>
      </motion.div>

      {/* History List */}
      {analyses.length === 0 ? (
        <EmptyState
          icon={History}
          title="No analyses yet"
          description="Upload a resume and run an ATS analysis to see your history here."
          actionLabel="Go to Resumes"
          actionPath="/resume"
        />
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis, i) => (
            <motion.div
              key={analysis._id}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 1}
            >
              <GlassCard
                onClick={() => navigate(`/resume/analysis/${analysis._id}`)}
                className="flex items-center gap-4"
              >
                {/* Score Badge */}
                <div
                  className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border flex-shrink-0 ${getScoreColor(analysis.atsScore)}`}
                >
                  <span className="text-lg font-bold font-display">
                    {analysis.atsScore}
                  </span>
                  <span className="text-[10px] opacity-70">ATS</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2D2D2D] truncate flex items-center gap-2">
                    <FileText size={14} className="text-[#6B7280] flex-shrink-0" />
                    {analysis.resume?.fileName || "Resume"}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[#6B7280] flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(analysis.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                    {analysis.jobRole && (
                      <span className="text-xs text-[#185FA5] flex items-center gap-1">
                        <Target size={12} />
                        {analysis.jobRole}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={16}
                  className="text-[#6B7280] group-hover:text-[#4A4A4A] flex-shrink-0"
                />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
