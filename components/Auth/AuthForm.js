"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../Shared/LoadingSpinner";
import AppleFaceTextLogo from "../Brand/AppleFaceTextLogo";
import { getLoginUrl, sanitizeRedirect } from "../../lib/authRoutes";

const inputClass =
  "w-full px-4 py-3 bg-card-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-gray-900";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login, register } = useAuth();

  const mode = searchParams.get("mode") === "register" ? "register" : "login";
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    setError("");
  }, [mode]);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectTo);
    }
  }, [authLoading, user, router, redirectTo]);

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(loginData.email, loginData.password);
    setLoading(false);
    if (result.success) {
      router.replace(redirectTo);
    } else {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (registerData.password !== registerData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(registerData.phone)) {
      setError("Please enter a valid 11-digit phone number");
      setLoading(false);
      return;
    }

    const { confirm_password, ...dataToSend } = registerData;
    const result = await register(dataToSend);
    setLoading(false);
    if (result.success) {
      router.replace(redirectTo);
    } else {
      setError(result.message);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" label="Loading…" />
      </div>
    );
  }

  const loginHref = getLoginUrl({ redirect: redirectTo, mode: "login" });
  const registerHref = getLoginUrl({ redirect: redirectTo, mode: "register" });

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="pt-8 px-6 sm:px-8 text-center border-b border-gray-100 pb-6">
          <AppleFaceTextLogo height={28} className="h-7 w-auto mx-auto mb-5" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm text-gray-500">
            {mode === "login"
              ? "Sign in to access orders, wishlist, and more"
              : "Join Apple Face today"}
          </p>

          <div className="flex border-b border-gray-200 mt-6 -mb-px">
            <Link
              href={loginHref}
              className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
                mode === "login"
                  ? "text-brand-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
              {mode === "login" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />
              )}
            </Link>
            <Link
              href={registerHref}
              className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
                mode === "register"
                  ? "text-brand-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
              {mode === "register" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />
              )}
            </Link>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  placeholder="Enter your email"
                  className={inputClass}
                  style={{ fontSize: "16px" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    placeholder="Enter your password"
                    className={`${inputClass} pr-11`}
                    style={{ fontSize: "16px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-primary text-white font-extrabold rounded-lg hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" variant="light" inline />
                    Signing in…
                  </span>
                ) : (
                  "Continue"
                )}
              </button>

              <p className="text-center text-sm text-gray-500 pt-2">
                Don&apos;t have an account?{" "}
                <Link href={registerHref} className="font-bold text-brand-primary hover:underline">
                  Register now
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                    First name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={registerData.first_name}
                    onChange={handleRegisterChange}
                    required
                    placeholder="First"
                    className={inputClass}
                    style={{ fontSize: "16px" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={registerData.last_name}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Last"
                    className={inputClass}
                    style={{ fontSize: "16px" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  placeholder="email@example.com"
                  className={inputClass}
                  style={{ fontSize: "16px" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                  Phone
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-medium">
                    +88
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    required
                    placeholder="01XXXXXXXXX"
                    className={`${inputClass} rounded-l-none`}
                    style={{ fontSize: "16px" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Min. 6 characters"
                    className={`${inputClass} pr-11`}
                    style={{ fontSize: "16px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={registerData.confirm_password}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Re-enter password"
                    className={`${inputClass} pr-11`}
                    style={{ fontSize: "16px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-primary text-white font-extrabold rounded-lg hover:opacity-90 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" variant="light" inline />
                    Creating account…
                  </span>
                ) : (
                  "Register"
                )}
              </button>

              <p className="text-center text-sm text-gray-500 pt-2">
                Already have an account?{" "}
                <Link href={loginHref} className="font-bold text-brand-primary hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
