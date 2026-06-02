import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animated circular SVG score gauge.
 * Used by ATS analysis and interview reports.
 */
export default function ScoreGauge({
  score = 0,
  size = 160,
  strokeWidth = 10,
  label = "Score",
  className = "",
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  // Color based on score
  const getColor = (s) => {
    if (s >= 80) return { stroke: "#34d399", text: "text-emerald-400", bg: "from-emerald-500/20" };
    if (s >= 60) return { stroke: "#818cf8", text: "text-brand-400", bg: "from-brand-500/20" };
    if (s >= 40) return { stroke: "#fbbf24", text: "text-amber-400", bg: "from-amber-500/20" };
    return { stroke: "#fb7185", text: "text-rose-400", bg: "from-rose-500/20" };
  };

  const color = getColor(score);

  useEffect(() => {
    // Animate score counting up
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score);
      setAnimatedScore(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${color.stroke}40)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-display font-bold ${color.text}`}>
          {animatedScore}
        </span>
        <span className="text-xs text-zinc-500 mt-0.5">{label}</span>
      </div>
    </div>
  );
}
