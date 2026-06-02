import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isLanding = location.pathname === "/";

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${
            scrolled
              ? "glass-strong shadow-lg shadow-black/20"
              : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow duration-300">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-lg font-display font-bold tracking-tight">
                Career
                <span className="gradient-text">Forge</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {isLanding && !isAuthenticated && (
                <>
                  <NavLink href="#features">Features</NavLink>
                  <NavLink href="#how-it-works">How It Works</NavLink>
                  <NavLink href="#testimonials">Testimonials</NavLink>
                </>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-3 ml-4">
                  <Link
                    to="/dashboard"
                    className="btn-ghost px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>

                  {/* User dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-sm font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl p-2 shadow-xl shadow-black/30"
                        >
                          <div className="px-3 py-2 border-b border-white/5 mb-1">
                            <p className="text-sm font-medium text-white truncate">
                              {user?.name || "User"}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">
                              {user?.email || ""}
                            </p>
                          </div>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <User size={15} />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-colors"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-4">
                  <Link
                    to="/login"
                    className="btn-ghost px-5 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? (
                <X size={22} className="text-zinc-300" />
              ) : (
                <Menu size={22} className="text-zinc-300" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface-100 border-l border-white/5 p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-display font-bold">
                  Career<span className="gradient-text">Forge</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5"
                >
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <MobileLink to="/dashboard" icon={LayoutDashboard}>
                      Dashboard
                    </MobileLink>
                    <MobileLink to="/profile" icon={User}>
                      Profile
                    </MobileLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/5 rounded-xl transition-colors mt-4"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn-ghost px-4 py-3 rounded-xl text-sm font-medium text-zinc-300 text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary px-4 py-3 rounded-xl text-sm font-semibold text-white text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
    >
      {children}
    </a>
  );
}

function MobileLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
    >
      {Icon && <Icon size={18} />}
      {children}
    </Link>
  );
}
