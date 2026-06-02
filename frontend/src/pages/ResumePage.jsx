import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  Upload,
  FileText,
  Trash2,
  CloudUpload,
  Loader2,
  File,
  Sparkles,
  History,
  Search,
  ArrowRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export default function ResumePage() {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [showJobRoleFor, setShowJobRoleFor] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Load user's resumes on mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await API.get("/resume/list");
      setResumes(res.data.resumes || []);
    } catch (err) {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleUpload(files[0]);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  const handleUpload = async (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success("Resume uploaded successfully!");

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        fetchResumes(); // Refresh list from server
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAnalyze = async (resumeId) => {
    setAnalyzingId(resumeId);
    try {
      const res = await API.post("/resume/analyze", {
        resumeId,
        jobRole: jobRole || undefined,
      });

      toast.success("Resume analyzed! Redirecting...");
      const analysisId = res.data.analysis._id;
      navigate(`/resume/analysis/${analysisId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzingId(null);
      setShowJobRoleFor(null);
      setJobRole("");
    }
  };

  const handleDelete = async (id) => {
    setResumes((prev) => prev.filter((r) => r._id !== id));
    toast.success("Resume removed");
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="mb-8 flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            <span className="gradient-text">Resume</span> Manager
          </h1>
          <p className="text-zinc-500">
            Upload, manage, and analyze your resumes with AI.
          </p>
        </div>
        <button
          onClick={() => navigate("/resume/history")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-ghost text-sm text-zinc-300 hover:text-white"
        >
          <History size={16} />
          Analysis History
        </button>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="mb-8"
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`
            relative rounded-2xl border-2 border-dashed p-12
            flex flex-col items-center justify-center text-center
            transition-all duration-300 cursor-pointer
            ${
              dragOver
                ? "border-brand-400 bg-brand-500/5"
                : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
            }
            ${uploading ? "pointer-events-none" : ""}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="resume-upload-input"
          />

          {uploading ? (
            <div className="w-full max-w-xs">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <Loader2
                  size={40}
                  className="text-brand-400 animate-spin mb-4"
                />
                <p className="text-sm text-zinc-300 mb-3">Uploading...</p>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  {uploadProgress}% complete
                </p>
              </motion.div>
            </div>
          ) : (
            <>
              <div
                className={`
                w-16 h-16 rounded-2xl mb-4 flex items-center justify-center
                transition-all duration-300
                ${
                  dragOver
                    ? "bg-brand-500/20 scale-110"
                    : "bg-white/5"
                }
              `}
              >
                <CloudUpload
                  size={28}
                  className={`transition-colors ${
                    dragOver ? "text-brand-400" : "text-zinc-500"
                  }`}
                />
              </div>
              <p className="text-sm text-zinc-300 mb-1">
                <span className="text-brand-400 font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-zinc-600">
                PDF, DOC, DOCX — Max 10MB
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Resume List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
      >
        <h2 className="text-lg font-display font-semibold text-white mb-4">
          Your Resumes
        </h2>

        {resumes.length === 0 ? (
          <GlassCard hover={false} className="text-center py-12">
            <FileText size={40} className="text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">
              No resumes uploaded yet. Upload your first resume above.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {resumes.map((resume, i) => (
                <motion.div
                  key={resume._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="py-4" hover={false}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                        <File size={20} className="text-brand-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {resume.fileName}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Uploaded {formatDate(resume.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Analyze Button */}
                        {analyzingId === resume._id ? (
                          <div className="flex items-center gap-2 px-3 py-2">
                            <Loader2
                              size={16}
                              className="text-brand-400 animate-spin"
                            />
                            <span className="text-xs text-brand-400">
                              Analyzing...
                            </span>
                          </div>
                        ) : showJobRoleFor === resume._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={jobRole}
                              onChange={(e) => setJobRole(e.target.value)}
                              placeholder="Target role (optional)"
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-zinc-600 w-40 focus:outline-none input-glow"
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleAnalyze(resume._id);
                              }}
                            />
                            <button
                              onClick={() => handleAnalyze(resume._id)}
                              className="p-2 rounded-lg bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 transition-colors"
                              title="Run Analysis"
                            >
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowJobRoleFor(resume._id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 hover:from-brand-500/20 hover:to-accent-500/20 transition-all text-xs font-medium"
                            title="Analyze with AI"
                          >
                            <Sparkles size={14} />
                            Analyze
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resume._id);
                          }}
                          className="p-2 rounded-lg hover:bg-rose-500/5 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
