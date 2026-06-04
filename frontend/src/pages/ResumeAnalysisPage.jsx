import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import ScoreGauge from "../components/ScoreGauge";
import TagChip from "../components/TagChip";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Search,
  FileText,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export default function ResumeAnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await API.get(`/resume/analysis/${id}`);
        setAnalysis(res.data.analysis);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter max-w-4xl mx-auto">
        <GlassCard hover={false} className="text-center py-16">
          <AlertTriangle size={40} className="text-rose-500 mx-auto mb-4" />
          <p className="text-[#4A4A4A] mb-4">{error}</p>
          <button
            onClick={() => navigate("/resume")}
            className="px-6 py-2.5 rounded-xl btn-primary text-sm text-white"
          >
            Back to Resumes
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-5xl mx-auto">
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

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 text-[#2D2D2D]">
              <span className="gradient-text">ATS</span> Analysis Results
            </h1>
            <p className="text-[#4A4A4A] text-sm flex items-center gap-2">
              <FileText size={14} />
              {analysis?.resume?.fileName || "Resume"}
              {analysis?.jobRole && (
                <span className="text-[#185FA5]">
                  • Target: {analysis.jobRole}
                </span>
              )}
            </p>
          </div>
          <p className="text-xs text-[#6B7280]">
            Analyzed{" "}
            {new Date(analysis?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </motion.div>

      {/* ATS Score */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="mb-8"
      >
        <GlassCard hover={false} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <ScoreGauge
            score={analysis?.atsScore || 0}
            size={180}
            label="ATS Score"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-display font-bold text-[#2D2D2D] mb-2">
              {analysis?.atsScore >= 80
                ? "Excellent Resume! 🎉"
                : analysis?.atsScore >= 60
                  ? "Good Resume, Room to Improve 👍"
                  : analysis?.atsScore >= 40
                    ? "Needs Work ⚠️"
                    : "Significant Improvements Needed 🔧"}
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              {analysis?.atsScore >= 80
                ? "Your resume is well-optimized for ATS systems. Focus on fine-tuning the details."
                : analysis?.atsScore >= 60
                  ? "Your resume has a solid foundation but could benefit from keyword optimization and structural improvements."
                  : "Your resume may struggle to pass ATS filters. Follow the suggestions below to significantly improve your score."}
            </p>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Skills Found */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <div className="p-2 rounded-lg bg-emerald-50">
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
              <h3 className="text-base font-display font-semibold text-[#2D2D2D]">
                Skills Found
              </h3>
              <span className="text-xs text-[#6B7280] sm:ml-auto">
                {analysis?.skillsFound?.length || 0} skills
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis?.skillsFound?.map((skill, i) => (
                <TagChip key={i} label={skill} variant="success" />
              ))}
              {(!analysis?.skillsFound ||
                analysis.skillsFound.length === 0) && (
                <p className="text-sm text-[#6B7280]">
                  No specific skills detected
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Missing Skills */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <div className="p-2 rounded-lg bg-rose-50">
                <AlertTriangle size={18} className="text-rose-500" />
              </div>
              <h3 className="text-base font-display font-semibold text-[#2D2D2D]">
                Missing Skills
              </h3>
              <span className="text-xs text-[#6B7280] sm:ml-auto">
                {analysis?.missingSkills?.length || 0} gaps
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis?.missingSkills?.map((skill, i) => (
                <TagChip key={i} label={skill} variant="error" />
              ))}
              {(!analysis?.missingSkills ||
                analysis.missingSkills.length === 0) && (
                <p className="text-sm text-[#6B7280]">
                  No significant gaps found
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Strengths */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
        >
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-indigo-50">
                <TrendingUp size={18} className="text-indigo-600" />
              </div>
              <h3 className="text-base font-display font-semibold text-[#2D2D2D]">
                Strengths
              </h3>
            </div>
            <div className="space-y-3">
              {analysis?.strengths?.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{s}</p>
                </motion.div>
              ))}
              {(!analysis?.strengths || analysis.strengths.length === 0) && (
                <p className="text-sm text-[#6B7280]">No strengths identified</p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
        >
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-amber-50">
                <TrendingDown size={18} className="text-amber-600" />
              </div>
              <h3 className="text-base font-display font-semibold text-[#2D2D2D]">
                Weaknesses
              </h3>
            </div>
            <div className="space-y-3">
              {analysis?.weaknesses?.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <AlertTriangle
                    size={16}
                    className="text-amber-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{w}</p>
                </motion.div>
              ))}
              {(!analysis?.weaknesses || analysis.weaknesses.length === 0) && (
                <p className="text-sm text-[#6B7280]">
                  No weaknesses identified
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recommended Keywords */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={6}
        className="mb-6"
      >
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="p-2 rounded-lg bg-purple-50">
              <Search size={18} className="text-purple-600" />
            </div>
            <h3 className="text-base font-display font-semibold text-slate-900">
              Recommended Keywords
            </h3>
            <span className="text-xs text-[#6B7280] sm:ml-auto">
              Add these to boost your ATS score
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis?.recommendedKeywords?.map((kw, i) => (
              <TagChip key={i} label={kw} variant="accent" />
            ))}
            {(!analysis?.recommendedKeywords ||
              analysis.recommendedKeywords.length === 0) && (
              <p className="text-sm text-[#6B7280]">
                No additional keywords recommended
              </p>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Improvement Suggestions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={7}
      >
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-indigo-50">
              <Lightbulb size={18} className="text-indigo-600" />
            </div>
            <h3 className="text-base font-display font-semibold text-slate-900">
              Improvement Suggestions
            </h3>
          </div>
          <div className="space-y-4">
            {analysis?.improvementSuggestions?.map((suggestion, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#185FA5]">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  {suggestion}
                </p>
              </motion.div>
            ))}
            {(!analysis?.improvementSuggestions ||
              analysis.improvementSuggestions.length === 0) && (
              <p className="text-sm text-[#6B7280]">
                No specific suggestions at this time
              </p>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
