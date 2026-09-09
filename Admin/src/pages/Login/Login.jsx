import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UtensilsCrossed, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

const Login = ({ url, setIsLoggedIn }) => {
  const [data, setData] = useState({ email: "shreya@gmail.com", password: "patil" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/user/login`, data);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("adminSession", "true");
        toast.success("Admin login successful!");
        setIsLoggedIn(true);
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      toast.error(err.response?.data?.message || "Login failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FFE5DC] via-[#FFF9F6] to-[#F5EBE6] p-5">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-10 flex flex-col gap-7 animate-page-fade">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FF8A5B] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
            <UtensilsCrossed size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Cravely<span className="text-[#FF6B35]">.</span> Admin
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Sign in with admin credentials to access dashboard
          </p>
        </div>

        <form className="flex flex-col gap-4.5" onSubmit={onSubmitHandler}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={13} className="text-[#FF6B35]" /> Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder="admin@cravely.com"
                value={data.email}
                onChange={onChangeHandler}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={13} className="text-[#FF6B35]" /> Password
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={data.password}
                onChange={onChangeHandler}
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] hover:from-[#E85522] hover:to-[#FF6B35] text-white font-extrabold py-3.5 px-5 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              "Authenticating..."
            ) : (
              <>
                Sign In to Dashboard <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold pt-2 border-t border-slate-100">
          <ShieldCheck size={15} className="text-emerald-500" /> Authorized Admin Access Only
        </div>
      </div>
    </div>
  );
};

export default Login;
