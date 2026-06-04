import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = true,
  gradient = false,
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.005 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        rounded-2xl p-4 sm:p-6 bg-white
        border border-slate-200/80
        shadow-sm
        ${gradient ? "gradient-border" : ""}
        transition-all duration-300
        ${hover ? "hover:shadow-md hover:border-slate-300/80 cursor-pointer" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
