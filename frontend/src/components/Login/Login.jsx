import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Logo from "../../assets/Logo/1x/Logofull.png";
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "../Hook/use-theme";
import axios from "@/config/axios";
import API_ENDPOINTS from "@/config/api";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, setTheme } = useTheme();

  const from = location.state?.from?.pathname || "/dashboard";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      const data = response.data;
      console.log("get data user:", data);

      login(data);
      setSuccess("Login Successfull");
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <section className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      <nav className="p-6 flex items-center justify-between">
        <img src={Logo} alt="Logo" className="h-10 w-auto" />
        <button
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
          onClick={toggleTheme}>
          {theme === "light" ? (
            <LuMoon size={22} />
          ) : (
            <LuSun size={22} className="text-white" />
          )}
        </button>
      </nav>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800">
          <div className="p-8">
            <header className="text-center mb-8">
              <h1 className="font-DMsans text-3xl text-zinc-900 dark:text-white font-bold">
                Sign In
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 mt-2">
                Welcome to{" "}
                <span className="text-orange-500 font-semibold">EMS</span>.
                Please enter your details.
              </p>
            </header>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-orange-500 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98]">
                Log In
              </button>
            </form>

            <footer className="mt-8 text-center text-sm text-slate-500 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-orange-500 font-semibold hover:underline">
                Sign Up
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
