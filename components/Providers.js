"use client";

import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { WishlistProvider } from "../context/WishlistContext";
import { CompareProvider } from "../context/CompareContext";
import { RecentlyViewedProvider } from "../context/RecentlyViewedContext";
import CartSidebar from "./Shared/CartSidebar";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
    return (
        <AuthProvider>
            <RecentlyViewedProvider>
                <CompareProvider>
                    <WishlistProvider>
                        <CartProvider>
                            {children}
                            <CartSidebar />
                            <Toaster
                                position="top-center"
                                toastOptions={{
                                    duration: 3000,
                                    style: {
                                        background: '#1f2937',
                                        color: '#fff',
                                        fontSize: '14px',
                                        borderRadius: '12px',
                                    },
                                }}
                            />
                        </CartProvider>
                    </WishlistProvider>
                </CompareProvider>
            </RecentlyViewedProvider>
        </AuthProvider>
    );
}

