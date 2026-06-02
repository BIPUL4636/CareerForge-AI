/**
 * Reusable tag/badge chip component.
 * Used for skills, keywords, strengths/weaknesses.
 */
export default function TagChip({ label, variant = "neutral", className = "" }) {
  const variants = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    brand: "bg-brand-500/10 text-brand-400 border-brand-500/20",
    accent: "bg-accent-500/10 text-accent-400 border-accent-500/20",
    neutral: "bg-white/5 text-zinc-300 border-white/10",
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium
        border transition-all duration-200 hover:scale-105
        ${variants[variant] || variants.neutral}
        ${className}
      `}
    >
      {label}
    </span>
  );
}
