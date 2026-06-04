import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Compass,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/resume", label: "Resume", icon: FileText },
  { path: "/jobs", label: "Jobs", icon: Briefcase },
  { path: "/interview", label: "Interview", icon: MessageSquare },
  { path: "/career", label: "Career Coach", icon: Compass },
  { path: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
        hidden lg:flex flex-col h-screen sticky top-0
        bg-white border-r border-slate-200
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-18 border-b border-slate-200">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-display font-bold tracking-tight text-[#2D2D2D]"
          >
            Career<span className="gradient-text">Forge</span>
          </motion.span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200
                group relative overflow-hidden
                ${
                  isActive
                    ? "text-[#185FA5] bg-indigo-50"
                    : "text-[#4A4A4A] hover:text-[#2D2D2D] hover:bg-slate-50"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <item.icon
                size={20}
                className={`flex-shrink-0 ${
                  isActive
                    ? "text-[#185FA5]"
                    : "text-[#6B7280] group-hover:text-[#4A4A4A]"
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-4 border-t border-slate-200">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-[#6B7280] hover:text-[#4A4A4A] hover:bg-slate-50 rounded-xl transition-colors"
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
