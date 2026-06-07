"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window === "undefined") return [];
        try {
            const storedCart = localStorage.getItem("Apple Face BD_cart");
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Failed to load cart from local storage", error);
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(0);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem("Apple Face BD_cart", JSON.stringify(cartItems));
        } catch (error) {
            console.error("Failed to save cart to local storage", error);
        }
    }, [cartItems]);

    const addToCart = (product, quantity = 1, variants = null, openSidebar = true) => {
        setCartItems((prevItems) => {
            // Create a unique matching key based on id and variants
            const variantKey = variants ? JSON.stringify(variants) : "default";

            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id && item.variantKey === variantKey
            );

            if (existingItemIndex !== -1) {
                // Item exists with same variants, increase quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            }

            // Price calculation (base + selected care plans)
            const selectedBasePrice = Number(variants?.customBasePrice);
            const fallbackBasePrice = Number(product.rawPrice || (product.price ? parseFloat(String(product.price).replace(/[^\d]/g, "")) : 0));
            const basePrice = Number.isFinite(selectedBasePrice) && selectedBasePrice > 0
                ? selectedBasePrice
                : fallbackBasePrice;
            const selectedCarePlans = Array.isArray(variants?.carePlans) ? variants.carePlans : [];
            const careTotalPerUnit = selectedCarePlans.reduce((sum, plan) => sum + Number(plan?.price || 0), 0);
            const finalUnitPrice = basePrice + careTotalPerUnit;

            // New item
            return [
                ...prevItems,
                {
                    ...product,
                    variantKey,
                    variants,
                    quantity,
                    numericBasePrice: basePrice,
                    careTotalPerUnit,
                    numericPrice: finalUnitPrice
                },
            ];
        });

        if (openSidebar) {
            setIsCartOpen(true); // Open sidebar automatically when adding
        }
    };

    const removeFromCart = (id, variantKey = "default") => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => !(item.id === id && item.variantKey === variantKey))
        );
    };

    const updateQuantity = (id, variantKey = "default", newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.variantKey === variantKey
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const toggleCart = () => setIsCartOpen((prev) => !prev);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce(
        (total, item) => total + item.numericPrice * item.quantity,
        0
    );

    const getSubtotal = () => cartTotal;
    const updateDeliveryFee = (fee) => setDeliveryFee(fee);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                toggleCart,
                openCart,
                closeCart,
                cartCount,
                cartTotal,
                getSubtotal,
                deliveryFee,
                updateDeliveryFee,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
