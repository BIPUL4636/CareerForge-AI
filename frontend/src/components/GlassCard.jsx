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
        rounded-2xl p-6
        ${gradient ? "gradient-border" : ""}
        glass
        transition-all duration-300
        ${hover ? "hover:bg-white/[0.05] cursor-pointer" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
