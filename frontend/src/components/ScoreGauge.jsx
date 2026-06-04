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
    if (s >= 80) return { stroke: "#10b981", text: "text-emerald-600", bg: "from-emerald-50" };
    if (s >= 60) return { stroke: "#6366f1", text: "text-indigo-600", bg: "from-indigo-50" };
    if (s >= 40) return { stroke: "#f59e0b", text: "text-amber-600", bg: "from-amber-50" };
    return { stroke: "#ef4444", text: "text-rose-600", bg: "from-rose-50" };
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
    <div className={`score-gauge-container relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ maxWidth: '100%', height: 'auto' }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
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
            filter: `drop-shadow(0 0 6px ${color.stroke}30)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl sm:text-3xl font-display font-bold ${color.text}`}>
          {animatedScore}
        </span>
        <span className="text-xs text-[#6B7280] mt-0.5">{label}</span>
      </div>
    </div>
  );
}
