import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, Mail, ShieldCheck, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("admin"); // 'admin' or 'student'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regNo, setRegNo] = useState(""); // For student login
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (activeTab === "admin") {
      if (!email.trim()) {
        setError("Email is required.");
        return;
      }
    } else {
      if (!regNo.trim()) {
        setError("Registration number is required.");
        return;
      }
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const endpoint =
        activeTab === "admin"
          ? "/api/auth/admin/login"
          : "/api/auth/student/login";
      const body =
        activeTab === "admin"
          ? { email: email.trim().toLowerCase(), password }
          : { regNo: regNo.trim(), password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : null;
      const fallbackText = !contentType.includes("application/json")
        ? await response.text()
        : "";

      if (!response.ok || !result?.success) {
        const fallbackMessage = fallbackText
          ? `Authentication failed (HTTP ${response.status}).`
          : `Authentication failed (HTTP ${response.status}).`;
        setError(result?.message || fallbackMessage);
        return;
      }

      const token = result?.data?.token;
      const user = result?.data?.user;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      }

      setSuccessMessage(result?.message || "Authentication successful.");
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(
        "Unable to reach backend API. Ensure backend server is running on port 4000.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-page px-4 py-10 md:py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5 items-stretch">
        <section className="bg-slate-700 text-white rounded-3xl p-7 md:p-10 shadow-card relative overflow-hidden">
          <div className="absolute -top-24 -right-16 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-12 w-56 h-56 rounded-full bg-slate-500/40" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Access
            </div>

            <h1 className="text-4xl md:text-[52px] leading-[0.95] font-extrabold tracking-[-0.03em]">
              Hostel Serenity
              <br />
              Admin Access
            </h1>

            <p className="text-slate-100/90 text-base max-w-md">
              Admin dashboard authentication is enabled here using the backend
              admin login contract.
            </p>
          </div>
        </section>

        <section className="bg-panel border border-panel-border rounded-3xl p-6 md:p-8 shadow-card">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                activeTab === "admin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Admin Login
            </button>
            <button
              onClick={() => setActiveTab("student")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                activeTab === "student"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Student Login
            </button>
          </div>

          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-slate-800">
            {activeTab === "admin" ? "Admin Login" : "Student Login"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {activeTab === "admin"
              ? "Use your admin email and password to continue."
              : "Use your registration number and password to continue."}
          </p>

          <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            {activeTab === "admin" ? (
              <label className="block">
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
                  Email
                </span>
                <div className="mt-2 relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter admin email"
                    className="w-full rounded-xl border border-slate-300 bg-white/80 px-10 py-3.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </label>
            ) : (
              <label className="block">
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
                  Registration Number
                </span>
                <div className="mt-2 relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regNo}
                    onChange={(event) => setRegNo(event.target.value)}
                    placeholder="Enter registration number"
                    className="w-full rounded-xl border border-slate-300 bg-white/80 px-10 py-3.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
                Password
              </span>
              <div className="mt-2 relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-300 bg-white/80 px-10 py-3.5 pr-11 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </label>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {successMessage && (
              <p className="text-sm text-emerald-700 font-medium">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-700 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 font-semibold transition-colors"
            >
              {isSubmitting
                ? "Please wait..."
                : `Login as ${activeTab === "admin" ? "Admin" : "Student"}`}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 py-3.5 font-semibold transition-colors"
            >
              Continue to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-start gap-2">
            <User className="w-3.5 h-3.5 mt-0.5" />
            Active API: POST /api/auth/{activeTab}/login
          </div>
        </section>
      </div>
    </div>
  );
};

export default Auth;
