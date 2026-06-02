import { motion } from "framer-motion";

export default function StatsCard({ icon: Icon, label, value, trend, color = "brand" }) {
  const colorMap = {
    brand: "from-brand-500/20 to-brand-600/5 text-brand-400",
    accent: "from-accent-500/20 to-accent-600/5 text-accent-400",
    success: "from-emerald-500/20 to-emerald-600/5 text-emerald-400",
    warning: "from-amber-500/20 to-amber-600/5 text-amber-400",
    info: "from-blue-500/20 to-blue-600/5 text-blue-400",
  };

  const iconBg = {
    brand: "bg-brand-500/10 text-brand-400",
    accent: "bg-accent-500/10 text-accent-400",
    success: "bg-emerald-500/10 text-emerald-400",
    warning: "bg-amber-500/10 text-amber-400",
    info: "bg-blue-500/10 text-blue-400",
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        glass rounded-2xl p-6 relative overflow-hidden
        hover:bg-white/[0.05] transition-all duration-300
      `}
    >
      {/* Gradient glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-30 pointer-events-none`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconBg[color]}`}>
            {Icon && <Icon size={22} />}
          </div>
          {trend && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                trend > 0
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-rose-500/10 text-rose-400"
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>

        <p className="text-3xl font-bold font-display text-white mb-1">{value}</p>
        <p className="text-sm text-zinc-400">{label}</p>
      </div>
    </motion.div>
  );
}
