import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit3,
  Save,
  X,
  Sparkles,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(formData);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    : "May 2026";

  return (
    <div className="page-enter max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
          Your <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-[#4A4A4A]">
          Manage your account information and settings.
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="mb-6"
      >
        <GlassCard hover={false} className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-3xl font-display font-bold shadow-xl shadow-brand-500/15">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg">
                  <Sparkles size={12} className="text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                {editing ? (
                  <div className="space-y-3 max-w-sm">
                    <div>
                      <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-surface-200 border border-white/5 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none input-glow"
                        id="profile-name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-surface-200 border border-white/5 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none input-glow"
                        id="profile-email"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary px-4 py-2 rounded-xl text-xs font-medium text-white flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Save size={14} />
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="btn-ghost px-4 py-2 rounded-xl text-xs font-medium text-[#6B7280]"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <h2 className="text-xl font-display font-bold text-[#2D2D2D]">
                        {user?.name || "User"}
                      </h2>
                      <button
                        onClick={() => setEditing(true)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-[#6B7280] hover:text-[#4A4A4A] transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-[#4A4A4A] mt-1">
                      {user?.email || "user@example.com"}
                    </p>
                    <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                      <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <Calendar size={12} />
                        Joined {joinDate}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <Shield size={12} />
                        Verified
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
        className="mb-6"
      >
        <h2 className="text-lg font-display font-semibold text-[#2D2D2D] mb-4">
          Account Settings
        </h2>

        <div className="space-y-3">
          <GlassCard className="flex items-center gap-3 sm:gap-4 py-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <User size={18} className="text-brand-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D2D2D]">
                Personal Information
              </p>
              <p className="text-xs text-[#6B7280]">
                Update your name and personal details
              </p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Edit
            </button>
          </GlassCard>

          <GlassCard className="flex items-center gap-3 sm:gap-4 py-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <KeyRound size={18} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D2D2D]">Change Password</p>
              <p className="text-xs text-[#6B7280]">
                Update your password for security
              </p>
            </div>
            <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              Update
            </button>
          </GlassCard>

          <GlassCard className="flex items-center gap-3 sm:gap-4 py-4">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <Mail size={18} className="text-accent-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D2D2D]">
                Email Notifications
              </p>
              <p className="text-xs text-[#6B7280]">
                Manage your email preferences
              </p>
            </div>
            <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              Manage
            </button>
          </GlassCard>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={3}
      >
        <h2 className="text-lg font-display font-semibold text-[#2D2D2D] mb-4">
          Session
        </h2>

        <GlassCard hover={false} className="border-rose-500/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <LogOut size={18} className="text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#2D2D2D]">Sign Out</p>
                <p className="text-xs text-[#6B7280]">
                  Log out of your CareerForge account
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
              id="profile-logout"
            >
              Sign Out
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
