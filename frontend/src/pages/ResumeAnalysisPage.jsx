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
          <AlertTriangle size={40} className="text-rose-400 mx-auto mb-4" />
          <p className="text-zinc-300 mb-4">{error}</p>
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
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Resumes
        </button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
              <span className="gradient-text">ATS</span> Analysis Results
            </h1>
            <p className="text-zinc-500 text-sm flex items-center gap-2">
              <FileText size={14} />
              {analysis?.resume?.fileName || "Resume"}
              {analysis?.jobRole && (
                <span className="text-brand-400">
                  • Target: {analysis.jobRole}
                </span>
              )}
            </p>
          </div>
          <p className="text-xs text-zinc-600">
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
        <GlassCard hover={false} className="flex flex-col sm:flex-row items-center gap-8">
          <ScoreGauge
            score={analysis?.atsScore || 0}
            size={180}
            label="ATS Score"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-display font-bold text-white mb-2">
              {analysis?.atsScore >= 80
                ? "Excellent Resume! 🎉"
                : analysis?.atsScore >= 60
                  ? "Good Resume, Room to Improve 👍"
                  : analysis?.atsScore >= 40
                    ? "Needs Work ⚠️"
                    : "Significant Improvements Needed 🔧"}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {analysis?.atsScore >= 80
                ? "Your resume is well-optimized for ATS systems. Focus on fine-tuning the details."
                : analysis?.atsScore >= 60
                  ? "Your resume has a solid foundation but could benefit from keyword optimization and structural improvements."
                  : "Your resume may struggle to pass ATS filters. Follow the suggestions below to significantly improve your score."}
            </p>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Skills Found */}
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
              <h3 className="text-base font-display font-semibold text-white">
                Skills Found
              </h3>
              <span className="ml-auto text-xs text-zinc-500">
                {analysis?.skillsFound?.length || 0} skills
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis?.skillsFound?.map((skill, i) => (
                <TagChip key={i} label={skill} variant="success" />
              ))}
              {(!analysis?.skillsFound ||
                analysis.skillsFound.length === 0) && (
                <p className="text-sm text-zinc-500">
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
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <AlertTriangle size={18} className="text-rose-400" />
              </div>
              <h3 className="text-base font-display font-semibold text-white">
                Missing Skills
              </h3>
              <span className="ml-auto text-xs text-zinc-500">
                {analysis?.missingSkills?.length || 0} gaps
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis?.missingSkills?.map((skill, i) => (
                <TagChip key={i} label={skill} variant="error" />
              ))}
              {(!analysis?.missingSkills ||
                analysis.missingSkills.length === 0) && (
                <p className="text-sm text-zinc-500">
                  No significant gaps found
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
        >
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-brand-500/10">
                <TrendingUp size={18} className="text-brand-400" />
              </div>
              <h3 className="text-base font-display font-semibold text-white">
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
                    className="text-emerald-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-zinc-300 leading-relaxed">{s}</p>
                </motion.div>
              ))}
              {(!analysis?.strengths || analysis.strengths.length === 0) && (
                <p className="text-sm text-zinc-500">No strengths identified</p>
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
              <div className="p-2 rounded-lg bg-amber-500/10">
                <TrendingDown size={18} className="text-amber-400" />
              </div>
              <h3 className="text-base font-display font-semibold text-white">
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
                    className="text-amber-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-zinc-300 leading-relaxed">{w}</p>
                </motion.div>
              ))}
              {(!analysis?.weaknesses || analysis.weaknesses.length === 0) && (
                <p className="text-sm text-zinc-500">
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
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-accent-500/10">
              <Search size={18} className="text-accent-400" />
            </div>
            <h3 className="text-base font-display font-semibold text-white">
              Recommended Keywords
            </h3>
            <span className="ml-auto text-xs text-zinc-500">
              Add these to boost your ATS score
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis?.recommendedKeywords?.map((kw, i) => (
              <TagChip key={i} label={kw} variant="accent" />
            ))}
            {(!analysis?.recommendedKeywords ||
              analysis.recommendedKeywords.length === 0) && (
              <p className="text-sm text-zinc-500">
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
            <div className="p-2 rounded-lg bg-brand-500/10">
              <Lightbulb size={18} className="text-brand-400" />
            </div>
            <h3 className="text-base font-display font-semibold text-white">
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
                className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-brand-400">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {suggestion}
                </p>
              </motion.div>
            ))}
            {(!analysis?.improvementSuggestions ||
              analysis.improvementSuggestions.length === 0) && (
              <p className="text-sm text-zinc-500">
                No specific suggestions at this time
              </p>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
