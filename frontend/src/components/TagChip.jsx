/**
 * Reusable tag/badge chip component.
 * Used for skills, keywords, strengths/weaknesses.
 */
export default function TagChip({ label, variant = "neutral", className = "" }) {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    error: "bg-rose-50 text-rose-700 border-rose-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    brand: "bg-indigo-50 text-indigo-700 border-indigo-200",
    accent: "bg-purple-50 text-purple-700 border-purple-200",
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
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
