import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { LuMoon, LuSun, LuUser, LuLock } from "react-icons/lu";
import { useTheme } from "../Hook/use-theme";
import axios from "@/config/axios";
import API_ENDPOINTS from "@/config/api";
import logo from "../../assets/Logo/Logo.png";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const bannerTexts = [
    "Empowering Team Collaboration",
    "Streamlined Employee Management",
    "Modern Workplace Solutions",
    "Real-Time Productivity Tracking",
    "Smart Data-Driven Insights",
  ];

  const officeImage =
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % bannerTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const from = location.state?.from?.pathname || "/dashboard";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      login(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.status === 401 ? "Invalid credentials" : "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[30%_70%] bg-white dark:bg-dark transition-colors duration-500 font-DMsans overflow-hidden">
      {/* LEFT SIDE - FORM */}
      <div className="flex flex-col justify-between h-screen p-4 md:p-8 bg-white dark:bg-dark z-20 border-r border-slate-100 dark:border-zinc-800">
        <div className="flex justify-between items-center">
          <div className="flex">
            <img src={logo} alt="" className="w-[120px] h-[70px]" />
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all text-slate-600 dark:text-yellow-400 border border-slate-200 dark:border-zinc-700">
            {theme === "light" ? <LuMoon size={20} /> : <LuSun size={20} />}
          </button>
        </div>

        <div className="max-w-md w-full mx-auto py-4">
          <header className="mb-6 text-left">
            <h1 className="text-3xl font-DMsans font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 text-lg">
              Access your workspace and manage your team.
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-600 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300 ml-1">
                Username
              </label>
              <div className="relative group">
                <LuUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-md border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="admin_ems"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300 ml-1">
                Password
              </label>
              <div className="relative group">
                <LuLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-md border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold rounded-md transition-all shadow-xl shadow-orange-500/25 disabled:opacity-50 mt-4 text-lg">
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>

        <div className="text-sm text-center text-slate-400 dark:text-zinc-600">
          &copy; {new Date().getFullYear()} EMS. Standard Enterprise Version.
        </div>
      </div>

      {/* RIGHT SIDE - OFFICE ATMOSPHERE */}
      <div className="hidden md:flex relative items-center justify-center p-8 bg-slate-50 dark:bg-[#0c0c0c]">
        {/* Dekorasi Aksen */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 dark:opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-5xl">
          <div className="relative group overflow-hidden rounded-2xl shadow-2xl transition-transform duration-700 hover:scale-[1.01]">
            {/* Overlay Gradient pada Gambar */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img
              src={officeImage}
              alt="Office Collaboration"
              className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Konten Text di Atas Gambar */}
            <div className="absolute bottom-15 left-0 p-10 z-20 w-full">
              <div className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full mb-4 tracking-widest uppercase">
                System Integrated
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Modernizing Employee <br />
                <span className="text-orange-400">Management Experience</span>
              </h2>
              <div className="h-8 overflow-hidden">
                <p
                  key={textIndex}
                  className="text-xl text-slate-200 font-medium animate-slideUpFade">
                  {bannerTexts[textIndex]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
