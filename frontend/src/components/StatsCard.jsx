import { motion } from "framer-motion";

export default function StatsCard({ icon: Icon, label, value, trend, color = "brand" }) {
  const colorMap = {
    brand: "from-indigo-50 to-blue-50",
    accent: "from-purple-50 to-violet-50",
    success: "from-emerald-50 to-green-50",
    warning: "from-amber-50 to-yellow-50",
    info: "from-blue-50 to-sky-50",
  };

  const iconBg = {
    brand: "bg-indigo-100 text-indigo-600",
    accent: "bg-purple-100 text-purple-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    info: "bg-blue-100 text-blue-600",
  };

  const trendColors = {
    positive: "bg-emerald-50 text-emerald-600 border-emerald-200",
    negative: "bg-rose-50 text-rose-600 border-rose-200",
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        bg-white rounded-2xl p-6 relative overflow-hidden
        border border-slate-200/80 shadow-sm
        hover:shadow-md transition-all duration-300
      `}
    >
      {/* Subtle gradient glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-40 pointer-events-none`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconBg[color]}`}>
            {Icon && <Icon size={22} />}
          </div>
          {trend && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border ${
                trend > 0 ? trendColors.positive : trendColors.negative
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>

        <p className="text-3xl font-bold font-display text-[#2D2D2D] mb-1">{value}</p>
        <p className="text-sm text-[#4A4A4A]">{label}</p>
      </div>
    </motion.div>
  );
}
