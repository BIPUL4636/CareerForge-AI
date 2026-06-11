import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Navbar from "../components/Navbar";
import {
  Sparkles,
  FileText,
  Briefcase,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
  Globe,
  Code2,
  Link as LinkIcon,
  AtSign,
  Users,
  Award,
  BarChart3,
  Target,
  Play,
} from "lucide-react";

/* ═══════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

/* ═══════════════════════════════════════════
   Data
   ═══════════════════════════════════════════ */

const features = [
  {
    icon: Brain,
    title: "AI-Powered Resume Builder",
    desc: "Craft compelling resumes with AI that understands your industry and highlights your strengths.",
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(59, 130, 246, 0.15)",
  },
  {
    icon: Briefcase,
    title: "Smart Job Tracker",
    desc: "Track every application, interview, and offer in one beautifully organized dashboard.",
    gradient: "from-indigo-500 to-purple-600",
    glow: "rgba(99, 102, 241, 0.15)",
  },
  {
    icon: TrendingUp,
    title: "Career Analytics",
    desc: "Gain insights into your job search with real-time analytics and progress tracking.",
    gradient: "from-purple-500 to-violet-600",
    glow: "rgba(168, 85, 247, 0.15)",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your career data is encrypted and never shared. Your privacy is our priority.",
    gradient: "from-blue-600 to-indigo-700",
    glow: "rgba(37, 99, 235, 0.15)",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "No lag, no waiting. Every interaction feels instant and delightful.",
    gradient: "from-indigo-600 to-purple-700",
    glow: "rgba(79, 70, 229, 0.15)",
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    desc: "Export your resume in PDF, DOCX, or share a live link — your choice.",
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(139, 92, 246, 0.15)",
  },
];

const stats = [
  { icon: Users, value: 3187, suffix: "", label: "Job seekers joined (and growing)" },
  { icon: FileText, value: 14639, suffix: "", label: "Resumes analyzed this month" },
  { icon: TrendingUp, value: 37.4, suffix: "%", label: "Avg. ATS score improvement", isDecimal: true },
  { icon: Briefcase, value: 52481, suffix: "+", label: "Live jobs searched this week" },
  { icon: Brain, value: 7893, suffix: "+", label: "AI mock sessions practiced" },
  { icon: Award, valueText: "1 in 3", suffix: "", label: "Users got an interview call" },
  { icon: Zap, value: 4.2, suffix: " hrs", label: "Saved per application", isDecimal: true },
  { icon: Star, value: 4.8, suffix: " / 5", label: "Rating from 342 user reviews", isDecimal: true },
];

const steps = [
  {
    num: "01",
    title: "Create Your Profile",
    desc: "Sign up in seconds and tell us about your career goals.",
    icon: Target,
  },
  {
    num: "02",
    title: "Upload Your Resume",
    desc: "Drop your existing resume and let AI enhance it instantly.",
    icon: FileText,
  },
  {
    num: "03",
    title: "Track & Apply",
    desc: "Manage applications, track progress, and land your dream job.",
    icon: Play,
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Google",
    text: "CareerForge transformed my job search. The AI resume suggestions were spot-on, and the tracker kept me organized throughout.",
    stars: 5,
    avatar: "PS",
  },
  {
    name: "Rahul Mehta",
    role: "Product Manager at Flipkart",
    text: "The cleanest career tool I've ever used. The dashboard gives me a bird's-eye view of my entire job search journey.",
    stars: 5,
    avatar: "RM",
  },
  {
    name: "Ananya Patel",
    role: "UX Designer at Microsoft",
    text: "From resume building to interview tracking, CareerForge is a game-changer. Highly recommend to every job seeker!",
    stars: 5,
    avatar: "AP",
  },
  {
    name: "David Chen",
    role: "Data Scientist at Amazon",
    text: "The AI-powered insights helped me tailor my resume for each role. Landed 3 interviews in my first week!",
    stars: 5,
    avatar: "DC",
  },
  {
    name: "Sarah Williams",
    role: "Frontend Dev at Spotify",
    text: "Beautiful interface, powerful features. CareerForge made my career transition seamless and stress-free.",
    stars: 5,
    avatar: "SW",
  },
];

/* ═══════════════════════════════════════════
   Floating Particles Component
   ═══════════════════════════════════════════ */

function FloatingParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles = Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ═══════════════════════════════════════════
   Animated Counter Hook
   ═══════════════════════════════════════════ */

function useAnimatedCounter(target, isDecimal = false, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime;
    let animId;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const current = isDecimal
        ? parseFloat((target * easedProgress).toFixed(1))
        : Math.floor(target * easedProgress);

      setCount(current);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [target, isDecimal, duration, shouldStart]);

  return count;
}

/* ═══════════════════════════════════════════
   Stat Card Component
   ═══════════════════════════════════════════ */

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasNumericValue = typeof stat.value === "number";
  const count = useAnimatedCounter(
    hasNumericValue ? stat.value : 0,
    stat.isDecimal,
    2000,
    isInView && hasNumericValue
  );

  const displayValue = hasNumericValue
    ? (stat.isDecimal ? count.toFixed(1) : count.toLocaleString())
    : (stat.valueText || "");

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={scaleIn}
      custom={index}
      className="stat-card-light"
    >
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <stat.icon size={22} className="text-indigo-600" />
      </div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-[#2D2D2D] mb-1">
        {displayValue}
        <span className="gradient-text-light">{stat.suffix || ""}</span>
      </div>
      <div className="text-sm text-[#4A4A4A] font-medium">{stat.label}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Ripple Button Component
   ═══════════════════════════════════════════ */

function RippleButton({ children, className = "", ...props }) {
  const handleClick = useCallback((e) => {
    const btn = e.currentTarget;
    const circle = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    circle.className = "ripple-circle";
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`btn-ripple inline-flex ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Main Landing Page
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob blob-1" style={{ top: "5%", left: "10%" }} />
          <div className="blob blob-2" style={{ top: "60%", right: "5%" }} />
          <div className="blob blob-3" style={{ bottom: "10%", left: "30%" }} />
        </div>

        {/* Floating particles */}
        <FloatingParticles />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-light mb-8 text-sm text-[#185FA5] font-medium"
          >
            <Sparkles size={14} className="text-indigo-500" />
            <span>AI-Powered Career Platform</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6 text-[#2D2D2D]"
          >
            Land Your Dream Job{" "}
            <span className="gradient-text-light">3x Faster</span>
            <br />
            <span className="text-[#6B7280]">with AI Matching</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg sm:text-xl text-[#4A4A4A] max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Join 3,187+ job seekers who saved 4.2 hours per application and boosted their ATS score by 37.4% on average. Build resumes, practice interviews, and track applications.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <RippleButton>
              <Link
                to="/register"
                className="btn-gradient-animated px-8 py-3.5 rounded-2xl text-base font-semibold text-white flex items-center gap-2 group"
              >
                Start Building Free
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </RippleButton>
            <RippleButton>
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-2xl text-base font-medium text-[#1a1a1a] bg-white border border-slate-200 hover:border-[#185FA5]/40 hover:bg-blue-50/50 transition-all duration-300"
              >
                Sign In
              </Link>
            </RippleButton>
          </motion.div>

          {/* Floating Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="mt-20 relative"
          >
            <div className="glass-light-strong rounded-3xl p-1 shadow-2xl shadow-indigo-500/10 max-w-4xl mx-auto border border-slate-200/60">
              <div className="rounded-2xl bg-white p-6 sm:p-8">
                {/* Browser dots */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-4 text-xs text-[#6B7280]">
                    careerforge.ai/dashboard
                  </span>
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                  <div className="rounded-xl p-3 sm:p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50">
                    <div className="text-xl sm:text-2xl font-bold text-indigo-700 mb-1">24</div>
                    <div className="text-xs text-[#4A4A4A]">Applications</div>
                  </div>
                  <div className="rounded-xl p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100/50">
                    <div className="text-xl sm:text-2xl font-bold gradient-text-light mb-1">8</div>
                    <div className="text-xs text-[#4A4A4A]">Interviews</div>
                  </div>
                  <div className="rounded-xl p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100/50 col-span-2 sm:col-span-1">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">3</div>
                    <div className="text-xs text-[#4A4A4A]">Offers</div>
                  </div>
                </div>
                {/* List items */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl p-3 bg-slate-50/80 border border-slate-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <Briefcase size={14} className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div
                          className="h-3 bg-slate-200 rounded-full"
                          style={{ width: `${70 - i * 10}%` }}
                        />
                        <div
                          className="h-2 bg-slate-100 rounded-full mt-1.5"
                          style={{ width: `${50 - i * 8}%` }}
                        />
                      </div>
                      <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${i === 1
                          ? "bg-indigo-100 text-indigo-700"
                          : i === 2
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                        {i === 1 ? "Interview" : i === 2 ? "Applied" : "Offer"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-4 sm:left-8 glass-light-strong rounded-2xl px-4 py-3 shadow-xl shadow-indigo-500/10 hidden sm:flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-sm text-[#1a1a1a] font-medium">Resume Score: 94%</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -right-4 sm:right-8 glass-light-strong rounded-2xl px-4 py-3 shadow-xl shadow-purple-500/10 hidden sm:flex items-center gap-2"
            >
              <TrendingUp size={16} className="text-indigo-600" />
              <span className="text-sm text-[#1a1a1a] font-medium">+42% this week</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ STATISTICS ══════════ */}
      <section className="py-20 relative section-light-gradient">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="py-24 lg:py-32 relative">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob blob-2" style={{ top: "20%", right: "10%", opacity: 0.3 }} />
          <div className="blob blob-3" style={{ bottom: "10%", left: "5%", opacity: 0.25 }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-[#185FA5] font-medium mb-4">
              <Zap size={14} className="text-indigo-500" />
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-[#2D2D2D]">
              Everything You Need to{" "}
              <span className="gradient-text-light">Succeed</span>
            </h2>
            <p className="text-[#4A4A4A] max-w-xl mx-auto text-lg">
              Powerful tools designed to give you an unfair advantage in your job
              search.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="feature-card-light"
                style={{ "--glow-color": feat.glow }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  style={{ boxShadow: `0 8px 24px -4px ${feat.glow}` }}
                >
                  <feat.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold text-[#2D2D2D] mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 section-light-gradient pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-[#185FA5] font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-[#2D2D2D]">
              Three Steps to Your{" "}
              <span className="gradient-text-light">Dream Job</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200 rounded-full" />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center relative"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative z-10">
                  <step.icon size={24} className="text-white" />
                </div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
                  Step {step.num}
                </div>
                <h3 className="text-xl font-display font-semibold text-[#2D2D2D] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section id="testimonials" className="py-24 lg:py-32 relative overflow-hidden">
        {/* Background blob */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob blob-1" style={{ top: "20%", left: "50%", opacity: 0.2 }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-amber-600 font-medium mb-4">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-[#2D2D2D]">
              Loved by{" "}
              <span className="gradient-text-light">Thousands</span>
            </h2>
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="testimonial-card-light"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonials[currentTestimonial].stars }).map(
                      (_, j) => (
                        <Star
                          key={j}
                          size={16}
                          className="text-amber-400 fill-amber-400"
                        />
                      )
                    )}
                  </div>
                  <p className="text-lg text-[#1a1a1a] leading-relaxed mb-8 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#2D2D2D]">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-sm text-[#4A4A4A]">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`carousel-dot ${i === currentTestimonial ? "active" : ""}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="cta-gradient rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden"
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold mb-6 text-white">
                Ready to{" "}
                <span className="text-indigo-200">Forge Your Future?</span>
              </h2>
              <p className="text-lg text-indigo-200/80 mb-10 max-w-xl mx-auto">
                Join thousands of professionals already using CareerForge AI to
                accelerate their career growth.
              </p>
              <RippleButton>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-lg font-semibold bg-white text-indigo-700 hover:bg-indigo-50 transition-colors group shadow-xl shadow-black/10"
                >
                  Get Started — It's Free
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </RippleButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="footer-light py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-lg font-display font-bold text-[#2D2D2D]">
                  Career<span className="gradient-text-light">Forge</span> AI
                </span>
              </div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                Your AI-powered career companion. Build resumes, track jobs, and land your dream role.
              </p>
            </div>

            {/* Links columns */}
            <div>
              <h4 className="text-sm font-semibold text-[#2D2D2D] mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-sm text-[#4A4A4A] hover:text-[#185FA5] transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-sm text-[#4A4A4A] hover:text-[#185FA5] transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="text-sm text-[#4A4A4A] hover:text-[#185FA5] transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#2D2D2D] mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-[#4A4A4A] hover:text-[#185FA5] transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-[#4A4A4A] hover:text-[#185FA5] transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-[#4A4A4A] hover:text-[#185FA5] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#2D2D2D] mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-[#4A4A4A] hover:text-[#185FA5] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-[#4A4A4A] hover:text-[#185FA5] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-[#4A4A4A] hover:text-[#185FA5] transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6B7280]">
              © {new Date().getFullYear()} CareerForge AI. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon-light"
              >
                <Globe size={18} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon-light"
              >
                <AtSign size={18} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon-light"
              >
                <LinkIcon size={18} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon-light"
              >
                <Code2 size={18} />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
