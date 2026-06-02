import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../components/GlassCard";
import toast from "react-hot-toast";
import API from "../services/api";
import {
  Briefcase,
  Search,
  Plus,
  X,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Loader2,
  Compass,
  ClipboardList,
  Tag,
  Globe,
  DollarSign,
  Bookmark,
  RefreshCw,
  StickyNote,
  ChevronDown,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const statusConfig = {
  Applied: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  Interview: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  Offer: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  Rejected: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
  },
  Saved: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/20",
    dot: "bg-zinc-400",
  },
};

const emptyJob = {
  company: "",
  role: "",
  location: "",
  status: "Applied",
  link: "",
  notes: "",
};

const discoverCategories = [
  "All",
  "Software Development",
  "Design",
  "Marketing",
  "Customer Support",
  "Data",
  "DevOps / Sysadmin",
  "Product",
  "Finance / Legal",
  "Human Resources",
  "QA",
  "Writing",
];

export default function JobsPage() {
  // ─── Tab State ──────────────────────
  const [activeTab, setActiveTab] = useState("tracker");

  // ─── Tracker State ──────────────────
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({ ...emptyJob });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ─── Discover State ─────────────────
  const [discoverJobs, setDiscoverJobs] = useState([]);
  const [discoverSearch, setDiscoverSearch] = useState("");
  const [discoverCategory, setDiscoverCategory] = useState("All");
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [discoverSearched, setDiscoverSearched] = useState(false);
  const [savingJobId, setSavingJobId] = useState(null);

  const statuses = ["All", "Applied", "Interview", "Offer", "Rejected", "Saved"];

  // ─── Fetch Tracked Jobs ─────────────
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filterStatus !== "All") params.status = filterStatus;

      const res = await API.get("/jobs", { params });
      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    if (activeTab === "tracker") {
      fetchJobs();
    }
  }, [fetchJobs, activeTab]);

  // ─── Tracker Handlers ──────────────
  const handleAddJob = async () => {
    if (!newJob.company || !newJob.role) {
      toast.error("Company and role are required");
      return;
    }
    setSaving(true);
    try {
      const res = await API.post("/jobs", {
        ...newJob,
        appliedDate: new Date().toISOString(),
      });
      setJobs((prev) => [res.data.job, ...prev]);
      setNewJob({ ...emptyJob });
      setShowModal(false);
      toast.success("Job added to tracker!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add job");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id) => {
    // Optimistic delete
    const prevJobs = [...jobs];
    setJobs((prev) => prev.filter((j) => j._id !== id));
    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job removed");
    } catch (err) {
      setJobs(prevJobs);
      toast.error("Failed to delete job");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic update
    const prevJobs = [...jobs];
    setJobs((prev) =>
      prev.map((j) => (j._id === id ? { ...j, status: newStatus } : j))
    );
    try {
      await API.put(`/jobs/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      setJobs(prevJobs);
      toast.error("Failed to update status");
    }
  };

  // ─── Discover Handlers ─────────────
  const handleDiscover = async () => {
    setDiscoverLoading(true);
    setDiscoverSearched(true);
    try {
      const params = { limit: 30 };
      if (discoverSearch) params.search = discoverSearch;
      if (discoverCategory !== "All") params.category = discoverCategory;

      const res = await API.get("/jobs/discover", { params });
      setDiscoverJobs(res.data.jobs || []);
    } catch (err) {
      toast.error("Failed to fetch job listings");
    } finally {
      setDiscoverLoading(false);
    }
  };

  // Load discover results on first visit to the tab
  useEffect(() => {
    if (activeTab === "discover" && !discoverSearched) {
      handleDiscover();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleSaveDiscoveredJob = async (job) => {
    setSavingJobId(job.id);
    try {
      const res = await API.post("/jobs", {
        company: job.company,
        role: job.role,
        location: job.location,
        status: "Saved",
        link: job.link,
        appliedDate: new Date().toISOString(),
      });
      setJobs((prev) => [res.data.job, ...prev]);
      toast.success(`Saved "${job.role}" at ${job.company} to your tracker!`);
    } catch (err) {
      toast.error("Failed to save job");
    } finally {
      setSavingJobId(null);
    }
  };

  // ─── Render ────────────────────────
  return (
    <div className="page-enter max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            <span className="gradient-text">Job</span> Center
          </h1>
          <p className="text-zinc-500">
            Track applications & discover new opportunities.
          </p>
        </div>

        {activeTab === "tracker" && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 self-start"
            id="add-job-btn"
          >
            <Plus size={18} />
            Add Job
          </button>
        )}
      </motion.div>

      {/* Tab Switcher */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0.5}
        className="flex gap-1 p-1 rounded-xl bg-surface-200 border border-white/5 w-fit mb-6"
      >
        <button
          onClick={() => setActiveTab("tracker")}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
            ${
              activeTab === "tracker"
                ? "bg-brand-500/15 text-brand-300 shadow-lg shadow-brand-500/5"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/3"
            }
          `}
          id="tab-tracker"
        >
          <ClipboardList size={16} />
          My Tracker
        </button>
        <button
          onClick={() => setActiveTab("discover")}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
            ${
              activeTab === "discover"
                ? "bg-accent-500/15 text-accent-300 shadow-lg shadow-accent-500/5"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/3"
            }
          `}
          id="tab-discover"
        >
          <Compass size={16} />
          Discover Jobs
        </button>
      </motion.div>

      {/* ══════════════ TRACKER TAB ══════════════ */}
      {activeTab === "tracker" && (
        <>
          {/* Search & Filters */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company or role..."
                className="w-full pl-11 pr-4 py-2.5 bg-surface-200 border border-white/5 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none input-glow transition-all"
                id="job-search"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                    px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200
                    ${
                      filterStatus === status
                        ? "bg-brand-500/15 text-brand-300 border border-brand-500/20"
                        : "bg-white/3 text-zinc-500 border border-white/5 hover:bg-white/5 hover:text-zinc-300"
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Job Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2
                  size={32}
                  className="animate-spin text-brand-400 mb-3"
                />
                <p className="text-zinc-500 text-sm">Loading your jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <GlassCard hover={false} className="text-center py-16">
                <Briefcase size={40} className="text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm mb-2">No jobs found</p>
                <p className="text-zinc-600 text-xs">
                  {search
                    ? "Try a different search term"
                    : "Click 'Add Job' to start tracking your applications"}
                </p>
              </GlassCard>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {jobs.map((job, i) => {
                    const config = statusConfig[job.status] || statusConfig.Applied;
                    return (
                      <motion.div
                        key={job._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <GlassCard className="group relative">
                          {/* Status badge */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="relative">
                              <select
                                value={job.status}
                                onChange={(e) =>
                                  handleStatusChange(job._id, e.target.value)
                                }
                                className={`
                                  text-xs font-medium px-2.5 py-1 rounded-lg border cursor-pointer
                                  bg-transparent focus:outline-none appearance-none pr-6
                                  ${config.bg} ${config.text} ${config.border}
                                `}
                              >
                                {statuses
                                  .filter((s) => s !== "All")
                                  .map((s) => (
                                    <option
                                      key={s}
                                      value={s}
                                      className="bg-surface-200 text-white"
                                    >
                                      {s}
                                    </option>
                                  ))}
                              </select>
                              <ChevronDown
                                size={10}
                                className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${config.text}`}
                              />
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteJob(job._id);
                              }}
                              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 text-zinc-600 hover:text-rose-400 transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Company & Role */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-zinc-400">
                                {job.company.charAt(0)}
                              </div>
                              <h3 className="text-sm font-semibold text-white truncate">
                                {job.company}
                              </h3>
                            </div>
                            <p className="text-sm text-zinc-400 truncate">
                              {job.role}
                            </p>
                          </div>

                          {/* Meta */}
                          <div className="space-y-2 text-xs text-zinc-500">
                            {job.location && (
                              <div className="flex items-center gap-2">
                                <MapPin size={12} />
                                <span>{job.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar size={12} />
                              <span>
                                {new Date(
                                  job.appliedDate
                                ).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            {job.notes && (
                              <div className="flex items-start gap-2">
                                <StickyNote size={12} className="mt-0.5 flex-shrink-0" />
                                <span className="truncate">{job.notes}</span>
                              </div>
                            )}
                          </div>

                          {/* Link */}
                          {job.link && (
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                            >
                              <ExternalLink size={12} />
                              View Posting
                            </a>
                          )}
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* ══════════════ DISCOVER TAB ══════════════ */}
      {activeTab === "discover" && (
        <>
          {/* Search & Category */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                value={discoverSearch}
                onChange={(e) => setDiscoverSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDiscover()}
                placeholder="Search jobs... e.g. React, Python, DevOps"
                className="w-full pl-11 pr-4 py-2.5 bg-surface-200 border border-white/5 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none input-glow transition-all"
                id="discover-search"
              />
            </div>

            <div className="relative">
              <select
                value={discoverCategory}
                onChange={(e) => setDiscoverCategory(e.target.value)}
                className="px-4 py-2.5 pr-8 bg-surface-200 border border-white/5 rounded-xl text-white text-sm focus:outline-none input-glow appearance-none cursor-pointer"
                id="discover-category"
              >
                {discoverCategories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-surface-200 text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
              />
            </div>

            <button
              onClick={handleDiscover}
              disabled={discoverLoading}
              className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 self-start disabled:opacity-50"
              id="discover-btn"
            >
              {discoverLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {discoverLoading ? "Searching..." : "Search"}
            </button>
          </motion.div>

          {/* Discover Info Banner */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1.5}
            className="mb-6 p-3 rounded-xl bg-gradient-to-r from-accent-500/5 to-brand-500/5 border border-accent-500/10"
          >
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-accent-400 flex-shrink-0" />
              <p className="text-xs text-zinc-400">
                Live remote job listings powered by{" "}
                <span className="text-accent-300 font-medium">Remotive</span>.
                Click <Bookmark size={10} className="inline text-brand-400" />{" "}
                to save any job directly to your tracker.
              </p>
            </div>
          </motion.div>

          {/* Discover Results */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            {discoverLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2
                  size={32}
                  className="animate-spin text-accent-400 mb-3"
                />
                <p className="text-zinc-500 text-sm">
                  Fetching live job listings...
                </p>
              </div>
            ) : discoverJobs.length === 0 ? (
              <GlassCard hover={false} className="text-center py-16">
                <Compass size={40} className="text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm mb-2">No jobs found</p>
                <p className="text-zinc-600 text-xs">
                  Try different keywords or change the category
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {discoverJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <GlassCard className="group">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Logo / Initial */}
                          <div className="flex-shrink-0">
                            {job.companyLogo ? (
                              <img
                                src={job.companyLogo}
                                alt={job.company}
                                className="w-12 h-12 rounded-xl object-contain bg-white/5 p-1.5"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-brand-500/20 items-center justify-center text-sm font-bold text-zinc-300 ${
                                job.companyLogo ? "hidden" : "flex"
                              }`}
                            >
                              {job.company?.charAt(0) || "?"}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white mb-1 truncate">
                              {job.role}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Building2 size={11} />
                                {job.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                {job.location}
                              </span>
                              {job.salary && job.salary !== "Not disclosed" && (
                                <span className="flex items-center gap-1 text-emerald-400">
                                  <DollarSign size={11} />
                                  {job.salary}
                                </span>
                              )}
                              {job.jobType && (
                                <span className="flex items-center gap-1">
                                  <Briefcase size={11} />
                                  {job.jobType}
                                </span>
                              )}
                            </div>

                            {/* Tags */}
                            {job.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {job.tags.slice(0, 5).map((tag, ti) => (
                                  <span
                                    key={ti}
                                    className="px-2 py-0.5 rounded-md bg-white/3 border border-white/5 text-[10px] text-zinc-500"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleSaveDiscoveredJob(job)}
                              disabled={savingJobId === job.id}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium hover:bg-brand-500/20 transition-all disabled:opacity-50"
                              id={`save-job-${job.id}`}
                            >
                              {savingJobId === job.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Bookmark size={12} />
                              )}
                              Save
                            </button>
                            {job.link && (
                              <a
                                href={job.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-medium hover:bg-accent-500/20 transition-all"
                              >
                                <ExternalLink size={12} />
                                Apply
                              </a>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* ══════════════ ADD JOB MODAL ══════════════ */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-semibold text-white">
                    Add New Job
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-xl hover:bg-white/5 text-zinc-400"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Company *
                    </label>
                    <div className="relative">
                      <Building2
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      />
                      <input
                        type="text"
                        value={newJob.company}
                        onChange={(e) =>
                          setNewJob({ ...newJob, company: e.target.value })
                        }
                        placeholder="e.g. Google"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-200 border border-white/5 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none input-glow"
                        id="modal-company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Role *
                    </label>
                    <div className="relative">
                      <Briefcase
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      />
                      <input
                        type="text"
                        value={newJob.role}
                        onChange={(e) =>
                          setNewJob({ ...newJob, role: e.target.value })
                        }
                        placeholder="e.g. Software Engineer"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-200 border border-white/5 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none input-glow"
                        id="modal-role"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      />
                      <input
                        type="text"
                        value={newJob.location}
                        onChange={(e) =>
                          setNewJob({ ...newJob, location: e.target.value })
                        }
                        placeholder="e.g. Bangalore, IN or Remote"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-200 border border-white/5 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none input-glow"
                        id="modal-location"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={newJob.status}
                        onChange={(e) =>
                          setNewJob({ ...newJob, status: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-surface-200 border border-white/5 rounded-xl text-white text-sm focus:outline-none input-glow appearance-none cursor-pointer"
                        id="modal-status"
                      >
                        {statuses
                          .filter((s) => s !== "All")
                          .map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Job Link
                    </label>
                    <div className="relative">
                      <ExternalLink
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      />
                      <input
                        type="url"
                        value={newJob.link}
                        onChange={(e) =>
                          setNewJob({ ...newJob, link: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-200 border border-white/5 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none input-glow"
                        id="modal-link"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Notes
                    </label>
                    <textarea
                      value={newJob.notes}
                      onChange={(e) =>
                        setNewJob({ ...newJob, notes: e.target.value })
                      }
                      placeholder="Any notes about this job..."
                      rows={2}
                      className="w-full px-4 py-2.5 bg-surface-200 border border-white/5 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none input-glow resize-none"
                      id="modal-notes"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-ghost py-2.5 rounded-xl text-sm font-medium text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddJob}
                    disabled={saving}
                    className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                    id="modal-submit"
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={16} />
                        Add Job
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
