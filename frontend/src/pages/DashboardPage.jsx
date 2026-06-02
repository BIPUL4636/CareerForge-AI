import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import StatsCard from "../components/StatsCard";
import GlassCard from "../components/GlassCard";
import {
  FileText,
  Briefcase,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const recentActivity = [
  {
    icon: FileText,
    text: "Resume uploaded successfully",
    time: "2 hours ago",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
  },
  {
    icon: Briefcase,
    text: "Applied to Frontend Developer at Razorpay",
    time: "5 hours ago",
    color: "text-accent-400",
    bg: "bg-accent-500/10",
  },
  {
    icon: CheckCircle2,
    text: "Interview scheduled with Flipkart",
    time: "1 day ago",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: TrendingUp,
    text: "Resume score improved to 92%",
    time: "2 days ago",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const quickActions = [
  {
    icon: FileText,
    title: "Upload Resume",
    desc: "Add a new resume",
    path: "/resume",
    gradient: "from-brand-500 to-brand-600",
  },
  {
    icon: Briefcase,
    title: "Track Job",
    desc: "Add new application",
    path: "/jobs",
    gradient: "from-accent-500 to-accent-600",
  },
  {
    icon: Target,
    title: "View Profile",
    desc: "Update your info",
    path: "/profile",
    gradient: "from-emerald-500 to-emerald-600",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, applied: 0, interview: 0, offer: 0, rejected: 0, saved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/jobs/stats");
        setStats(res.data);
      } catch (err) {
        // Silently fail — dashboard shows 0s
      }
    };
    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="page-enter max-w-6xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
          {getGreeting()},{" "}
          <span className="gradient-text">{user?.name || "there"}</span> 👋
        </h1>
        <p className="text-zinc-500">
          Here's what's happening with your career journey.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatsCard
          icon={Briefcase}
          label="Applications"
          value={String(stats.total)}
          color="brand"
        />
        <StatsCard
          icon={Clock}
          label="Interviews"
          value={String(stats.interview)}
          color="accent"
        />
        <StatsCard
          icon={FileText}
          label="Saved"
          value={String(stats.saved)}
          color="success"
        />
        <StatsCard
          icon={Target}
          label="Offers"
          value={String(stats.offer)}
          color="warning"
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="lg:col-span-2"
        >
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold text-white">
                Recent Activity
              </h2>
              <span className="text-xs text-zinc-500">Last 7 days</span>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${activity.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <activity.icon size={18} className={activity.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">
                      {activity.text}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <GlassCard hover={false} className="h-full">
            <h2 className="text-lg font-display font-semibold text-white mb-6">
              Quick Actions
            </h2>

            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <Link key={i} to={action.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <action.icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {action.title}
                      </p>
                      <p className="text-xs text-zinc-600">{action.desc}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Pro tip */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-brand-500/5 to-accent-500/5 border border-brand-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-brand-400" />
                <span className="text-xs font-medium text-brand-300">
                  Pro Tip
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Upload your latest resume to get AI-powered suggestions and
                improve your chances of landing interviews.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
