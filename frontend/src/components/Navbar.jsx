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
              ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/80"
              : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow duration-300">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-lg font-display font-bold tracking-tight text-[#2D2D2D]">
                Career
                <span className="gradient-text">Forge</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {!isAuthenticated && (
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
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[#4A4A4A] hover:text-[#2D2D2D] hover:bg-slate-100 flex items-center gap-2 transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>

                  {/* User dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
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
                          className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 shadow-xl shadow-slate-200/50 border border-slate-200"
                        >
                          <div className="px-3 py-2 border-b border-slate-100 mb-1">
                            <p className="text-sm font-medium text-[#2D2D2D] truncate">
                              {user?.name || "User"}
                            </p>
                            <p className="text-xs text-[#4A4A4A] truncate">
                              {user?.email || ""}
                            </p>
                          </div>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#4A4A4A] hover:text-[#2D2D2D] hover:bg-slate-50 rounded-xl transition-colors"
                          >
                            <User size={15} />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
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
                    className="px-5 py-2 rounded-xl text-sm font-medium text-[#4A4A4A] hover:text-[#2D2D2D] transition-colors"
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
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {mobileOpen ? (
                <X size={22} className="text-[#4A4A4A]" />
              ) : (
                <Menu size={22} className="text-[#4A4A4A]" />
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
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(18rem,85vw)] bg-white border-l border-slate-200 p-5 sm:p-6 md:hidden shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-display font-bold text-[#2D2D2D]">
                  Career<span className="gradient-text">Forge</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100"
                >
                  <X size={20} className="text-[#6B7280]" />
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
                      className="flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-4"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-3 rounded-xl text-sm font-medium text-[#4A4A4A] text-center hover:bg-slate-50 transition-colors"
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
      className="px-4 py-2 text-sm text-[#4A4A4A] hover:text-[#2D2D2D] transition-colors rounded-xl hover:bg-slate-50"
    >
      {children}
    </a>
  );
}

function MobileLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 text-sm text-[#4A4A4A] hover:text-[#2D2D2D] hover:bg-slate-50 rounded-xl transition-colors"
    >
      {Icon && <Icon size={18} />}
      {children}
    </Link>
  );
}
