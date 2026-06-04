import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "./Sidebar";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  User,
  Menu,
  X,
  LogOut,
  Sparkles,
  MessageSquare,
  Compass,
  Sun,
  Moon,
} from "lucide-react";

const mobileNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/resume", label: "Resume", icon: FileText },
  { path: "/jobs", label: "Jobs", icon: Briefcase },
  { path: "/interview", label: "Interview", icon: MessageSquare },
  { path: "/career", label: "Career Coach", icon: Compass },
  { path: "/profile", label: "Profile", icon: User },
];

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logout } = useAuth();

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }
    return () => document.body.classList.remove('nav-open');
  }, [mobileNavOpen]);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu size={22} className="text-[#4A4A4A]" />
            </button>

            {/* Page title - could be dynamic */}
            <div className="hidden lg:block" />

            {/* User section */}
            <div className="flex items-center gap-4">
              {/* Theme toggle button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-[#4A4A4A] hover:text-[#2D2D2D] hover:bg-slate-100 transition-all duration-300 flex items-center justify-center border border-slate-200/50 hover:scale-105 active:scale-95 theme-toggle-btn"
                title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
              >
                {theme === "light" ? (
                  <Moon size={18} className="transition-transform duration-500 hover:rotate-12" />
                ) : (
                  <Sun size={18} className="transition-transform duration-500 hover:rotate-45" />
                )}
              </button>

              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-[#2D2D2D]">
                  {user?.name || "Welcome"}
                </p>
                <p className="text-xs text-[#4A4A4A]">{user?.email || ""}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-indigo-500/15">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[min(18rem,85vw)] bg-white border-r border-slate-200 p-5 sm:p-6 lg:hidden shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <span className="text-lg font-display font-bold text-[#2D2D2D]">
                    Career<span className="gradient-text">Forge</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100"
                >
                  <X size={20} className="text-[#6B7280]" />
                </button>
              </div>

              <nav className="space-y-1">
                {mobileNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileNavOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        text-sm font-medium transition-colors
                        ${
                          isActive
                            ? "text-[#185FA5] bg-indigo-50"
                            : "text-[#4A4A4A] hover:text-[#2D2D2D] hover:bg-slate-50"
                        }
                      `}
                    >
                      <item.icon
                        size={20}
                        className={isActive ? "text-[#185FA5]" : "text-[#6B7280]"}
                      />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
