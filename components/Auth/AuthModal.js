"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { X, Eye, EyeOff } from "lucide-react";

const AuthModal = () => {
    const {
        authModalOpen,
        authModalMode,
        closeAuthModal,
        setAuthModalMode,
        login,
        register,
    } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form states
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    // Reset state when modal opens/closes or mode changes
    useEffect(() => {
        if (!authModalOpen) {
            setLoginData({ email: "", password: "" });
            setRegisterData({
                first_name: "",
                last_name: "",
                phone: "",
                email: "",
                password: "",
                confirm_password: "",
            });
            setError("");
            setShowPassword(false);
            setShowConfirmPassword(false);
        }
    }, [authModalOpen]);

    useEffect(() => {
        setError("");
    }, [authModalMode]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (authModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [authModalOpen]);

    // Handlers
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
        if (!result.success) {
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
        if (!result.success) {
            setError(result.message);
        }
    };

    if (!authModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeAuthModal}
            />

            {/* Modal */}
            <div
                className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                style={{ animation: "fadeInUp 0.3s ease-out" }}
            >
                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header / Tabs */}
                <div className="pt-8 px-6 text-center">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                        {authModalMode === "login"
                            ? "Welcome Back"
                            : "Create Account"}
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        {authModalMode === "login"
                            ? "Sign in to access your account"
                            : "Join Apple Face BD BD today"}
                    </p>

                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${authModalMode === "login"
                                ? "text-brand-purple"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setAuthModalMode("login")}
                        >
                            Login
                            {authModalMode === "login" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-t-full" />
                            )}
                        </button>
                        <button
                            className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${authModalMode === "register"
                                ? "text-brand-purple"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setAuthModalMode("register")}
                        >
                            Register
                            {authModalMode === "register" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-t-full" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 pb-8 max-h-[60vh] overflow-y-auto">
                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-start gap-2">
                            <svg
                                className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-sm text-purple-600">{error}</p>
                        </div>
                    )}

                    {/* ═══ LOGIN FORM ═══ */}
                    {authModalMode === "login" ? (
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
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-gray-900"
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
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-gray-900 pr-11"
                                        style={{ fontSize: "16px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                className="w-full py-3.5 bg-brand-purple text-white font-extrabold rounded-xl shadow-lg shadow-brand-purple/30 hover:bg-[#7b3ba8] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : (
                                    "Continue"
                                )}
                            </button>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">
                                    Don&apos;t have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setAuthModalMode("register")}
                                        className="font-bold text-brand-purple hover:underline"
                                    >
                                        Register Now
                                    </button>
                                </p>
                            </div>
                        </form>
                    ) : (
                        /* ═══ REGISTER FORM ═══ */
                        <form onSubmit={handleRegisterSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={registerData.first_name}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="First"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-gray-900"
                                        style={{ fontSize: "16px" }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={registerData.last_name}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="Last"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-gray-900"
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
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-gray-900"
                                    style={{ fontSize: "16px" }}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                                    Phone
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-medium">
                                        +88
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={registerData.phone}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="01XXXXXXXXX"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-gray-900"
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
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-gray-900 pr-11"
                                        style={{ fontSize: "16px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm_password"
                                        value={registerData.confirm_password}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="Re-enter password"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-gray-900 pr-11"
                                        style={{ fontSize: "16px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                className="w-full py-3.5 bg-brand-purple text-white font-extrabold rounded-xl shadow-lg shadow-brand-purple/30 hover:bg-[#7b3ba8] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    "Register"
                                )}
                            </button>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setAuthModalMode("login")}
                                        className="font-bold text-brand-purple hover:underline"
                                    >
                                        Log In
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Animation keyframes */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default AuthModal;
