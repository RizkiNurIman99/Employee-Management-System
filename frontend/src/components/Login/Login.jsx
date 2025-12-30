import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "../Hook/use-theme";
import axios from "@/config/axios";
import API_ENDPOINTS from "@/config/api";
import bannerLight from "../../assets/images/bannerlight.png";
import bannerDark from "../../assets/images/bannerdark.png";

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
    "Real-Time Monitoring",
    "RFID Integration",
    "Live Connection Status",
    "Responsive Dashboard",
    "Data Persistence",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % bannerTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const from = location.state?.from?.pathname || "/dashboard";

  const bannerSrc = theme === "dark" ? bannerDark : bannerLight;

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
        err.response?.status === 401
          ? "Username or password is incorrect"
          : "Server error. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[40%_60%] bg-white dark:bg-dark transition-colors">
      <div className="flex flex-col  p-4 md:p-14 bg-accent dark:bg-second_dark">
        <div className="flex justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition"
            disabled={loading}>
            {theme === "light" ? <LuMoon size={20} /> : <LuSun size={20} />}
          </button>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-2 font-DMsans">
            Welcome to EMS
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mb-8 font-DMsans">
            Please sign in to continue.
          </p>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5 font-DMsans">
            <div>
              <label className="block text-sm mb-1 text-slate-600 dark:text-zinc-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border dark:border-border dark:bg-second-dark dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500 outline-none"
                autoFocus
              />
            </div>

            <div className="font-DMsans">
              <label className="block text-sm mb-1 text-slate-600 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border dark:border-border dark:bg-second-dark dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-700 text-light font-semibold rounded-md transition disabled:opacity-60 cursor-pointer">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
        <div className="text-xs text-center text-slate-400 mt-8">
          EMS © {new Date().getFullYear()}
        </div>
      </div>

      {/* RIGHT - IMAGE */}
      <div className="hidden md:relative md:flex h-screen overflow-hidden">
        <img
          src={bannerSrc}
          alt="banner"
          className="absolute inset-0 w-full object-cover p-2"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 ">
          <h1 className="font-Dmsans text-white font-bold text-2xl">
            Welcome to <span className="text-orange-500">EMS</span> (Employee
            Management System)
          </h1>
          <p
            key={textIndex}
            className="text-dark dark:text-white text-xl font-DMsans font-semibold animate-slideUpFade">
            {bannerTexts[textIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
