"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { customerLogin, customerRegister, updateCustomerProfile } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("Apple Face BD_token");
            const storedUser = localStorage.getItem("Apple Face BD_user");

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to load auth state from localStorage", error);
            localStorage.removeItem("Apple Face BD_token");
            localStorage.removeItem("Apple Face BD_user");
        } finally {
            setLoading(false);
        }
    }, []);

    // Persist auth state
    const persistAuth = useCallback((newToken, newUser) => {
        try {
            localStorage.setItem("Apple Face BD_token", newToken);
            localStorage.setItem("Apple Face BD_user", JSON.stringify(newUser));
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

            const userData = response.customer || response.data?.customer || response.data?.user || response.data;
            const authToken = response.token || response.data?.token;

            if (authToken && userData) {
                persistAuth(authToken, userData);
                return { success: true };
            }

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

            const newUser = response.customer || response.data?.customer || response.data?.user || response.data;
            const authToken = response.token || response.data?.token;

            if (authToken && newUser) {
                persistAuth(authToken, newUser);
                return { success: true };
            }

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
        localStorage.removeItem("Apple Face BD_token");
        localStorage.removeItem("Apple Face BD_user");
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
                    localStorage.setItem("Apple Face BD_user", JSON.stringify(updatedUser));
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

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                updateProfile,
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
