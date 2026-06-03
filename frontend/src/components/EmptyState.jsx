import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Reusable empty state component.
 * Shows when no data exists and prompts the user to take action.
 */
export default function EmptyState({
  icon: Icon,
  title = "No data yet",
  description = "",
  actionLabel = "",
  actionPath = "",
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center py-16 px-6 ${className}`}>
        {Icon && (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Icon size={28} className="text-[#6B7280]" />
          </div>
        )}
        <h3 className="text-lg font-display font-semibold text-[#2D2D2D] mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[#4A4A4A] max-w-md mx-auto mb-6">
            {description}
          </p>
        )}
        {actionLabel && actionPath && (
          <Link
            to={actionPath}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl btn-primary text-sm font-medium text-white"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </motion.div>
  );
}
