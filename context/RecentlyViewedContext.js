"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const RecentlyViewedContext = createContext();
const STORAGE_KEY = "celltech_recently_viewed";
const MAX_ITEMS = 8;

export function RecentlyViewedProvider({ children }) {
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setRecentlyViewed(parsed.slice(0, MAX_ITEMS));
        } catch (err) {
            console.error("Failed to parse recently viewed products", err);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    const addRecentlyViewed = useCallback((product) => {
        if (!product?.id) return;
        setRecentlyViewed((prev) => {
            const withoutCurrent = prev.filter((item) => Number(item.id) !== Number(product.id));
            return [product, ...withoutCurrent].slice(0, MAX_ITEMS);
        });
    }, []);

    const value = useMemo(() => ({
        recentlyViewed,
        addRecentlyViewed
    }), [recentlyViewed, addRecentlyViewed]);

    return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
}

export function useRecentlyViewed() {
    const context = useContext(RecentlyViewedContext);
    if (!context) throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
    return context;
}

