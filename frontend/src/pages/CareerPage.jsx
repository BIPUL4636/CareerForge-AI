import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import TagChip from "../components/TagChip";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import {
  Compass,
  Target,
  BookOpen,
  FolderCode,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Loader2,
  BarChart3,
  FileText,
  MessageSquare,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const priorityColors = {
  High: "error",
  Medium: "warning",
  Low: "info",
};

const difficultyColors = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "error",
};

const levelColors = {
  None: "error",
  Beginner: "warning",
  Intermediate: "brand",
  Advanced: "success",
};

export default function CareerPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [meta, setMeta] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/career/recommendations");
      setHasData(res.data.hasData);
      setRecommendations(res.data.recommendations);
      setMeta(res.data.meta);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="text-sm text-zinc-300">Analyzing your career data...</p>
          <p className="text-xs text-zinc-600 mt-1">
            This may take a moment as AI processes your profile
          </p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="page-enter max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            <span className="gradient-text">Career</span> Coach
          </h1>
          <p className="text-zinc-500">
            AI-powered career guidance based on your profile.
          </p>
        </motion.div>

        <EmptyState
          icon={Compass}
          title="Not enough data yet"
          description="Upload and analyze a resume, or complete a mock interview to get personalized career recommendations."
        />

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            <GlassCard
              onClick={() => navigate("/resume")}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-brand-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Analyze Resume
                </p>
                <p className="text-xs text-zinc-500">Get your ATS score</p>
              </div>
              <ArrowRight size={16} className="text-zinc-600" />
            </GlassCard>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            <GlassCard
              onClick={() => navigate("/interview")}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={18} className="text-accent-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Mock Interview
                </p>
                <p className="text-xs text-zinc-500">Practice interviewing</p>
              </div>
              <ArrowRight size={16} className="text-zinc-600" />
            </GlassCard>
          </motion.div>
        </div>
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
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
          <span className="gradient-text">Career</span> Coach
        </h1>
        <p className="text-zinc-500">
          Personalized AI recommendations based on your resume and interviews.
        </p>

        {/* Meta stats */}
        {meta && (
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="text-xs text-zinc-500 flex items-center gap-1.5">
              <BarChart3 size={12} className="text-brand-400" />
              Based on {meta.basedOn.atsAnalyses} analyses,{" "}
              {meta.basedOn.interviews} interviews
            </span>
            <span className="text-xs text-zinc-500">
              Avg ATS: {meta.basedOn.avgAtsScore}/100
            </span>
            <span className="text-xs text-zinc-500">
              {meta.basedOn.totalSkills} skills tracked
            </span>
          </div>
        )}
      </motion.div>

      {/* Recommended Roles */}
      {recommendations?.recommendedRoles?.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-brand-400" />
            <h2 className="text-lg font-display font-semibold text-white">
              Recommended Roles
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.recommendedRoles.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <GlassCard hover={true} className="h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">
                      {role.title}
                    </h3>
                    <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-1 rounded-lg">
                      {role.matchPercentage}%
                    </span>
                  </div>
                  {/* Match bar */}
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${role.matchPercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {role.reason}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Skill Gaps */}
      {recommendations?.skillGaps?.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-accent-400" />
            <h2 className="text-lg font-display font-semibold text-white">
              Skill Gap Analysis
            </h2>
          </div>
          <GlassCard hover={false}>
            <div className="space-y-4">
              {recommendations.skillGaps.map((gap, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 rounded-xl bg-white/[0.02]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white mb-1">
                      {gap.skill}
                    </p>
                    <div className="flex items-center gap-2">
                      <TagChip
                        label={gap.currentLevel}
                        variant={levelColors[gap.currentLevel] || "neutral"}
                      />
                      <ArrowRight size={14} className="text-zinc-600" />
                      <TagChip
                        label={gap.requiredLevel}
                        variant="brand"
                      />
                    </div>
                  </div>
                  <TagChip
                    label={gap.priority}
                    variant={priorityColors[gap.priority] || "neutral"}
                  />
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Learning Roadmap */}
      {recommendations?.learningRoadmap?.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-emerald-400" />
            <h2 className="text-lg font-display font-semibold text-white">
              Learning Roadmap
            </h2>
          </div>
          <div className="space-y-0">
            {recommendations.learningRoadmap.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex gap-4"
              >
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-emerald-500/20 flex-shrink-0">
                    {step.step || i + 1}
                  </div>
                  {i < recommendations.learningRoadmap.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-emerald-500/30 to-transparent min-h-[2rem]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6 flex-1">
                  <GlassCard hover={false} className="py-4">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h4 className="text-sm font-semibold text-white">
                        {step.title}
                      </h4>
                      <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-lg">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                      {step.description}
                    </p>
                    {step.resources?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {step.resources.map((r, j) => (
                          <span
                            key={j}
                            className="text-[11px] text-brand-400 bg-brand-500/5 px-2 py-0.5 rounded"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Recommended Projects */}
        {recommendations?.recommendedProjects?.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
          >
            <div className="flex items-center gap-2 mb-4">
              <FolderCode size={18} className="text-amber-400" />
              <h2 className="text-lg font-display font-semibold text-white">
                Recommended Projects
              </h2>
            </div>
            <div className="space-y-3">
              {recommendations.recommendedProjects.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <GlassCard hover={true} className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-white">
                        {project.title}
                      </h4>
                      <TagChip
                        label={project.difficulty}
                        variant={
                          difficultyColors[project.difficulty] || "neutral"
                        }
                      />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills?.map((s, j) => (
                        <TagChip key={j} label={s} variant="neutral" />
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Certifications */}
        {recommendations?.recommendedCertifications?.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={5}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} className="text-brand-400" />
              <h2 className="text-lg font-display font-semibold text-white">
                Certifications
              </h2>
            </div>
            <div className="space-y-3">
              {recommendations.recommendedCertifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <GlassCard hover={true} className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center flex-shrink-0">
                        <Award size={16} className="text-brand-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-0.5">
                          {cert.name}
                        </h4>
                        <p className="text-xs text-zinc-500 mb-1">
                          {cert.provider} • {cert.estimatedTime}
                        </p>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {cert.relevance}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Refresh button */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={6}
        className="text-center"
      >
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-ghost text-sm text-zinc-300 hover:text-white"
        >
          <Sparkles size={16} />
          Regenerate Recommendations
        </button>
      </motion.div>
    </div>
  );
}
