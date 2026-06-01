"use client";

const DEFAULT_TTL_MS = 15 * 60 * 1000;

const getSeedKey = (productId) => `product_seed_${productId}`;

export function readProductSeed(productId, maxAgeMs = DEFAULT_TTL_MS) {
    if (typeof window === 'undefined' || !productId) return null;
    try {
        const raw = window.sessionStorage.getItem(getSeedKey(productId));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const ts = Number(parsed?.ts || 0);
        if (!ts || Date.now() - ts > maxAgeMs) {
            window.sessionStorage.removeItem(getSeedKey(productId));
            return null;
        }
        if (Number(parsed?.id) !== Number(productId)) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function writeProductSeed(productId, seedPatch) {
    if (typeof window === 'undefined' || !productId || !seedPatch) return;
    try {
        const existing = readProductSeed(productId) || { id: Number(productId) };
        const merged = {
            ...existing,
            ...seedPatch,
            id: Number(productId),
            ts: Date.now()
        };
        window.sessionStorage.setItem(getSeedKey(productId), JSON.stringify(merged));
    } catch {
        // Ignore sessionStorage errors.
    }
}
