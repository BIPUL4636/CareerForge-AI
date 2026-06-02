import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";
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
  Link2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: Brain,
    title: "AI-Powered Resume Builder",
    desc: "Craft compelling resumes with AI that understands your industry and highlights your strengths.",
    color: "brand",
  },
  {
    icon: Briefcase,
    title: "Smart Job Tracker",
    desc: "Track every application, interview, and offer in one beautifully organized dashboard.",
    color: "accent",
  },
  {
    icon: TrendingUp,
    title: "Career Analytics",
    desc: "Gain insights into your job search with real-time analytics and progress tracking.",
    color: "success",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your career data is encrypted and never shared. Your privacy is our priority.",
    color: "info",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "No lag, no waiting. Every interaction feels instant and delightful.",
    color: "warning",
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    desc: "Export your resume in PDF, DOCX, or share a live link — your choice.",
    color: "brand",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Profile",
    desc: "Sign up in seconds and tell us about your career goals.",
  },
  {
    num: "02",
    title: "Upload Your Resume",
    desc: "Drop your existing resume and let AI enhance it instantly.",
  },
  {
    num: "03",
    title: "Track & Apply",
    desc: "Manage applications, track progress, and land your dream job.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Google",
    text: "CareerForge transformed my job search. The AI resume suggestions were spot-on, and the tracker kept me organized throughout.",
    stars: 5,
  },
  {
    name: "Rahul Mehta",
    role: "Product Manager at Flipkart",
    text: "The cleanest career tool I've ever used. The dashboard gives me a bird's-eye view of my entire job search journey.",
    stars: 5,
  },
  {
    name: "Ananya Patel",
    role: "UX Designer at Microsoft",
    text: "From resume building to interview tracking, CareerForge is a game-changer. Highly recommend to every job seeker!",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-0 overflow-hidden">
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient pt-16">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/8 rounded-full blur-3xl animate-glow-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/6 rounded-full blur-3xl animate-glow-pulse"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/4 rounded-full blur-3xl animate-glow-pulse"
            style={{ animationDelay: "0.8s" }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm text-zinc-300"
          >
            <Sparkles size={14} className="text-brand-400" />
            <span>AI-Powered Career Platform</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6"
          >
            Your Career,{" "}
            <span className="gradient-text">Supercharged</span>
            <br />
            <span className="text-zinc-300">with AI</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Build stunning resumes, track every application, and let AI guide
            you to your dream role — all in one premium platform.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="btn-primary px-8 py-3.5 rounded-2xl text-base font-semibold text-white flex items-center gap-2 group"
            >
              Start Building Free
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              to="/login"
              className="btn-ghost px-8 py-3.5 rounded-2xl text-base font-medium text-zinc-300"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Floating cards mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="mt-20 relative"
          >
            <div className="glass-strong rounded-3xl p-1 shadow-2xl shadow-brand-500/5 max-w-4xl mx-auto">
              <div className="rounded-2xl bg-surface-100 p-6 sm:p-8">
                {/* Mock dashboard preview */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-4 text-xs text-zinc-600">
                    careerforge.ai/dashboard
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="glass rounded-xl p-4">
                    <div className="text-2xl font-bold text-white mb-1">24</div>
                    <div className="text-xs text-zinc-500">Applications</div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="text-2xl font-bold gradient-text mb-1">
                      8
                    </div>
                    <div className="text-xs text-zinc-500">Interviews</div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">
                      3
                    </div>
                    <div className="text-xs text-zinc-500">Offers</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 glass rounded-xl p-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center">
                        <Briefcase size={14} className="text-brand-400" />
                      </div>
                      <div className="flex-1">
                        <div
                          className="h-3 bg-white/10 rounded-full"
                          style={{ width: `${70 - i * 10}%` }}
                        />
                        <div
                          className="h-2 bg-white/5 rounded-full mt-1.5"
                          style={{ width: `${50 - i * 8}%` }}
                        />
                      </div>
                      <div className="px-2 py-1 rounded-full text-[10px] bg-brand-500/10 text-brand-400">
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
              className="absolute -top-6 -left-4 sm:left-8 glass-strong rounded-2xl px-4 py-3 shadow-xl hidden sm:flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-sm text-zinc-300">Resume Score: 94%</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -right-4 sm:right-8 glass-strong rounded-2xl px-4 py-3 shadow-xl hidden sm:flex items-center gap-2"
            >
              <TrendingUp size={16} className="text-brand-400" />
              <span className="text-sm text-zinc-300">+42% this week</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-zinc-400 mb-4">
              <Zap size={14} className="text-brand-400" />
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-lg">
              Powerful tools designed to give you an unfair advantage in your job
              search.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => {
              const colorMap = {
                brand: "bg-brand-500/10 text-brand-400",
                accent: "bg-accent-500/10 text-accent-400",
                success: "bg-emerald-500/10 text-emerald-400",
                info: "bg-blue-500/10 text-blue-400",
                warning: "bg-amber-500/10 text-amber-400",
              };

              return (
                <motion.div
                  key={feat.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i}
                >
                  <GlassCard className="h-full">
                    <div
                      className={`w-12 h-12 rounded-xl ${colorMap[feat.color]} flex items-center justify-center mb-4`}
                    >
                      <feat.icon size={22} />
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 hero-gradient opacity-50 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-zinc-400 mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
              Three Steps to Your{" "}
              <span className="gradient-text">Dream Job</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="text-5xl font-display font-black gradient-text mb-4 opacity-40">
                  {step.num}
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section id="testimonials" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-zinc-400 mb-4">
              <Star size={14} className="text-amber-400" />
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
              Loved by{" "}
              <span className="gradient-text">Thousands</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <GlassCard className="h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className="text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed flex-1 mb-6">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-sm font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Ready to{" "}
              <span className="gradient-text">Forge Your Future?</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
              Join thousands of professionals already using CareerForge AI to
              accelerate their career growth.
            </p>
            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-lg font-semibold text-white group"
            >
              Get Started — It's Free
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-sm font-display font-bold">
                Career<span className="gradient-text">Forge</span> AI
              </span>
            </div>

            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} CareerForge AI. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <Globe size={18} />
              </a>
              <a
                href="#"
                className="text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <Code2 size={18} />
              </a>
              <a
                href="#"
                className="text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <Link2 size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
