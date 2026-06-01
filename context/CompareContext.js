"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CompareContext = createContext();
const STORAGE_KEY = "celltech_compare";
const MAX_COMPARE_ITEMS = 3;

export function CompareProvider({ children }) {
    const [compareItems, setCompareItems] = useState([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                setCompareItems(parsed.slice(0, MAX_COMPARE_ITEMS));
            }
        } catch (err) {
            console.error("Failed to parse compare data from localStorage", err);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
    }, [compareItems]);

    const isInCompare = (productId) => compareItems.some((item) => Number(item.id) === Number(productId));

    const removeFromCompare = (productId) => {
        setCompareItems((prev) => prev.filter((item) => Number(item.id) !== Number(productId)));
    };

    const addToCompare = (product) => {
        if (!product?.id) return;

        setCompareItems((prev) => {
            const exists = prev.some((item) => Number(item.id) === Number(product.id));
            if (exists) {
                return prev.map((item) => (Number(item.id) === Number(product.id) ? { ...item, ...product } : item));
            }
            if (prev.length >= MAX_COMPARE_ITEMS) {
                toast.error(`You can compare up to ${MAX_COMPARE_ITEMS} products.`);
                return prev;
            }
            toast.success("Added to compare");
            return [...prev, product];
        });
    };

    const toggleCompare = (product) => {
        if (!product?.id) return;
        if (isInCompare(product.id)) {
            removeFromCompare(product.id);
            toast("Removed from compare");
            return;
        }
        addToCompare(product);
    };

    const clearCompare = () => {
        setCompareItems([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = useMemo(() => ({
        compareItems,
        compareCount: compareItems.length,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        maxCompareItems: MAX_COMPARE_ITEMS
    }), [compareItems]);

    return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
}

