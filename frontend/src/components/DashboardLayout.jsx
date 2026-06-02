import { Outlet } from "react-router-dom";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
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
} from "lucide-react";

const mobileNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/resume", label: "Resume", icon: FileText },
  { path: "/jobs", label: "Jobs", icon: Briefcase },
  { path: "/profile", label: "Profile", icon: User },
];

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-surface-0">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-white/5">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Menu size={22} className="text-zinc-300" />
            </button>

            {/* Page title - could be dynamic */}
            <div className="hidden lg:block" />

            {/* User section */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">
                  {user?.name || "Welcome"}
                </p>
                <p className="text-xs text-zinc-500">{user?.email || ""}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-brand-500/10">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-surface-100 border-r border-white/5 p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <span className="text-lg font-display font-bold">
                    Career<span className="gradient-text">Forge</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5"
                >
                  <X size={20} className="text-zinc-400" />
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
                            ? "text-white bg-brand-500/10"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      <item.icon
                        size={20}
                        className={isActive ? "text-brand-400" : "text-zinc-500"}
                      />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/5 rounded-xl transition-colors"
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
