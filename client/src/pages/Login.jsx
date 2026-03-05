import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets.js';
import toast from 'react-hot-toast';

const Login = () => {

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { axios, setToken } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const url = state === "login" ? "/api/user/login" : "/api/user/register";
    setLoading(true);

    try {
      const { data } = await axios.post(url, { name, email, password });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(`${state === "login" ? "Login" : "Registration"} Successful`);
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleState = () => {
    setState(prev => prev === "login" ? "register" : "login");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="relative w-full max-w-md mx-4 sm:mx-0">

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up relative z-10 text-center rounded-3xl px-6 pt-4 pb-6 sm:px-8 bg-white/95 border border-gray-200/80 shadow-[0_8px_60px_rgba(164,86,247,0.08)] backdrop-blur-xl"
      >
        {/* Logo */}
        <div className="flex justify-center">
            <img
              src={assets.gpt_main_logo}
              alt="SHARP GPT"
              className="w-20 h-20 object-contain"
            />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
          {state === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-gray-400 text-sm mt-1 mb-5">
          {state === "login"
            ? "Sign in to continue your AI journey"
            : "Start your AI-powered experience"}
        </p>

        {/* Name Field (only for register) */}
        {state !== "login" && (
          <div className="animate-slide-down overflow-hidden mb-3">
            <div className="flex items-center w-full bg-gray-50 border border-gray-200 focus-within:border-purple-500 focus-within:shadow-[0_4px_20px_rgba(164,86,247,0.15)] focus-within:-translate-y-px h-12 rounded-2xl overflow-hidden pl-5 gap-3 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="mb-3">
          <div className="flex items-center w-full bg-gray-50 border border-gray-200 focus-within:border-purple-500 focus-within:shadow-[0_4px_20px_rgba(164,86,247,0.15)] focus-within:-translate-y-px h-12 rounded-2xl overflow-hidden pl-5 gap-3 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <div className="flex items-center w-full bg-gray-50 border border-gray-200 focus-within:border-purple-500 focus-within:shadow-[0_4px_20px_rgba(164,86,247,0.15)] focus-within:-translate-y-px h-12 rounded-2xl overflow-hidden pl-5 gap-3 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              placeholder="Password"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Forgot Password */}
        {state === "login" && (
          <div className="text-left mb-4 pl-1">
            <button type="button" className="text-xs text-purple-600 hover:text-purple-800 transition-colors duration-200 font-medium">
              Forgot password?
            </button>
          </div>
        )}

        {state !== "login" && <div className="mb-4" />}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`relative w-full h-12 rounded-2xl text-white font-medium text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${loading ? 'opacity-90 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(164,86,247,0.4)] active:translate-y-0'}`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-login-spin" />
              <span className="text-white/90">
                {state === "login" ? "Signing in..." : "Creating account..."}
              </span>
            </>
          ) : (
            <span>{state === "login" ? "Sign In" : "Create Account"}</span>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        {/* Toggle Login/Register */}
        <p className="text-gray-500 text-sm">
          {state === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={!loading ? toggleState : undefined}
            className={`text-indigo-500 font-medium cursor-pointer hover:underline transition-colors duration-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {state === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>

        {/* Credits Badge */}
        {state !== "login" && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100">
            <img src={assets.diamond_icon} className="w-3.5" alt="" />
            <span className="text-xs text-purple-600 font-medium">20 free credits on signup</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login
