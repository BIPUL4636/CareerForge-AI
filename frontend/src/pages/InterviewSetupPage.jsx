import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Code,
  Heart,
  Users,
  Loader2,
  Sparkles,
  ArrowRight,
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

const interviewTypes = [
  {
    type: "HR",
    label: "HR Interview",
    description: "Culture fit, motivation, salary expectations",
    icon: Users,
    gradient: "from-brand-500 to-brand-600",
    bg: "bg-brand-500/10",
    border: "border-brand-500/30",
  },
  {
    type: "Technical",
    label: "Technical Interview",
    description: "Data structures, algorithms, system design",
    icon: Code,
    gradient: "from-accent-500 to-accent-600",
    bg: "bg-accent-500/10",
    border: "border-accent-500/30",
  },
  {
    type: "Behavioral",
    label: "Behavioral Interview",
    description: "STAR method, leadership, conflict resolution",
    icon: Heart,
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
];

const experienceLevels = ["Junior", "Mid", "Senior"];

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [starting, setStarting] = useState(false);

  const canStart = jobRole.trim() && experienceLevel && interviewType;

  const handleStart = async () => {
    if (!canStart) return;

    setStarting(true);
    try {
      const res = await API.post("/interview/start", {
        jobRole: jobRole.trim(),
        experienceLevel,
        interviewType,
      });

      toast.success("Interview started!");
      navigate(`/interview/session/${res.data.session._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start interview");
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="page-enter max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="mb-8 flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            <span className="gradient-text">Mock</span> Interview
          </h1>
          <p className="text-[#4A4A4A]">
            Practice with AI-powered interviews tailored to your role.
          </p>
        </div>
        <button
          onClick={() => navigate("/interview/history")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-ghost text-sm text-[#4A4A4A] hover:text-[#2D2D2D]"
        >
          <History size={16} />
          History
        </button>
      </motion.div>

      {/* Job Role */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="mb-6"
      >
        <GlassCard hover={false}>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-3">
            What role are you interviewing for?
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Frontend Developer, Data Scientist, Product Manager..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-900 placeholder-gray-400 focus:outline-none input-glow transition-all text-sm"
          />
        </GlassCard>
      </motion.div>

      {/* Experience Level */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
        className="mb-6"
      >
        <GlassCard hover={false}>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-3">
            Your experience level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {experienceLevels.map((level) => (
              <button
                key={level}
                onClick={() => setExperienceLevel(level)}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  border
                  ${
                    experienceLevel === level
                      ? "bg-brand-500/15 border-brand-500/40 text-brand-700 shadow-lg shadow-brand-500/10"
                      : "bg-white/[0.02] border-gray-200 text-[#4A4A4A] hover:text-brand-600 hover:border-brand-300 hover:bg-brand-500/5"
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Interview Type */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={3}
        className="mb-8"
      >
        <GlassCard hover={false}>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-3">
            Interview type
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            {interviewTypes.map((item) => {
              const isSelected = interviewType === item.type;
              return (
                <motion.button
                  key={item.type}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInterviewType(item.type)}
                  className={`
                    relative p-5 rounded-xl text-left transition-all duration-200
                    border overflow-hidden
                    ${
                      isSelected
                        ? `${item.bg} ${item.border} shadow-lg`
                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }
                  `}
                >
                  {isSelected && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5`}
                    />
                  )}
                  <div className="relative z-10">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 shadow-lg`}
                    >
                      <item.icon size={18} className="text-white" />
                    </div>
                    <p
                      className={`text-sm font-medium mb-1 ${isSelected ? "text-[#2D2D2D]" : "text-[#4A4A4A]"}`}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs text-[#6B7280]">{item.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={4}
      >
        <button
          onClick={handleStart}
          disabled={!canStart || starting}
          className={`
            w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
            text-base font-semibold transition-all duration-300
            ${
              canStart && !starting
                ? "btn-primary text-white"
                : "bg-white/5 text-zinc-600 cursor-not-allowed"
            }
          `}
        >
          {starting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Starting Interview...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Start Mock Interview
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
