"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { customerLogin, customerRegister, updateCustomerProfile } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState("login"); // "login" | "register"

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("Apple Face BD BD_token");
            const storedUser = localStorage.getItem("Apple Face BD BD_user");

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to load auth state from localStorage", error);
            localStorage.removeItem("Apple Face BD BD_token");
            localStorage.removeItem("Apple Face BD BD_user");
        } finally {
            setLoading(false);
        }
    }, []);

    // Persist auth state
    const persistAuth = useCallback((newToken, newUser) => {
        try {
            localStorage.setItem("Apple Face BD BD_token", newToken);
            localStorage.setItem("Apple Face BD BD_user", JSON.stringify(newUser));
        } catch (error) {
            console.error("Failed to persist auth state", error);
        }
        setToken(newToken);
        setUser(newUser);
    }, []);

    // Login
    const login = useCallback(async (email, password) => {
        try {
            const response = await customerLogin(email, password);

            // API returns: { message, customer, token } at top level
            const userData = response.customer || response.data?.customer || response.data?.user || response.data;
            const authToken = response.token || response.data?.token;

            if (authToken && userData) {
                persistAuth(authToken, userData);
                setAuthModalOpen(false);
                return { success: true };
            }

            // If we got a message but no token, it's an error
            return {
                success: false,
                message: response.message || response.error || "Login failed. Please check your credentials.",
            };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "Network error. Please try again." };
        }
    }, [persistAuth]);

    // Register
    const register = useCallback(async (userData) => {
        try {
            const response = await customerRegister(userData);

            // API may return token+customer directly, or require auto-login
            const newUser = response.customer || response.data?.customer || response.data?.user || response.data;
            const authToken = response.token || response.data?.token;

            if (authToken && newUser) {
                persistAuth(authToken, newUser);
                setAuthModalOpen(false);
                return { success: true };
            }

            // If registration succeeds but no token returned, auto-login
            if (response.success || response.message?.toLowerCase().includes('success')) {
                const loginResult = await login(userData.email, userData.password);
                return loginResult;
            }

            return {
                success: false,
                message: response.message || response.error || "Registration failed. Please try again.",
            };
        } catch (error) {
            console.error("Register error:", error);
            return { success: false, message: "Network error. Please try again." };
        }
    }, [persistAuth, login]);

    // Logout
    const logout = useCallback(() => {
        localStorage.removeItem("Apple Face BD BD_token");
        localStorage.removeItem("Apple Face BD BD_user");
        setUser(null);
        setToken(null);
    }, []);

    // Update profile
    const updateProfile = useCallback(async (profileData) => {
        if (!token) return { success: false, message: "Not authenticated" };

        try {
            const response = await updateCustomerProfile(token, profileData);

            if (response.success) {
                const updatedUser = { ...user, ...profileData };
                setUser(updatedUser);
                try {
                    localStorage.setItem("Apple Face BD BD_user", JSON.stringify(updatedUser));
                } catch (e) {
                    console.error("Failed to persist updated user", e);
                }
                return { success: true };
            }

            return {
                success: false,
                message: response.message || "Failed to update profile",
            };
        } catch (error) {
            console.error("Profile update error:", error);
            return { success: false, message: "Network error. Please try again." };
        }
    }, [token, user]);

    // Modal controls
    const openAuthModal = useCallback((mode = "login") => {
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setAuthModalOpen(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                authModalOpen,
                authModalMode,
                login,
                register,
                logout,
                updateProfile,
                openAuthModal,
                closeAuthModal,
                setAuthModalMode,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
