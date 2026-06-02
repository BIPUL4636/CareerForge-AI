import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("cf_token"));
  const [loading, setLoading] = useState(true);

  // Load profile on mount if token exists
  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data.user);
    } catch {
      // Token is invalid
      localStorage.removeItem("cf_token");
      localStorage.removeItem("cf_user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    return res.data;
  };

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const { token: newToken } = res.data;
    localStorage.setItem("cf_token", newToken);
    setToken(newToken);
    // Load profile after login
    await loadProfileAfterAuth(newToken);
    return res.data;
  };

  const loadProfileAfterAuth = async (authToken) => {
    try {
      const res = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(res.data.user);
      localStorage.setItem("cf_user", JSON.stringify(res.data.user));
    } catch {
      // Profile endpoint might return minimal data
      setUser({ email: "User" });
    }
  };

  const logout = () => {
    localStorage.removeItem("cf_token");
    localStorage.removeItem("cf_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = async (updates) => {
    const res = await API.put("/auth/profile", updates);
    const updatedUser = res.data.user;
    setUser(updatedUser);
    localStorage.setItem("cf_user", JSON.stringify(updatedUser));
    return res.data;
  };

  const value = {
    user,
    setUser,
    token,
    loading,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    loadProfile,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
