"use client";

import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiTrash2, FiChevronLeft } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/Shared/ProductCard';

export default function WishlistPage() {
    const { wishlist, wishlistCount, clearWishlist } = useWishlist();

    return (
        <main className="min-h-screen bg-[#F9FAFB] pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Wishlist</span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                My Wishlist
                                {wishlistCount > 0 && (
                                    <span className="text-sm font-bold bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full">
                                        {wishlistCount} {wishlistCount === 1 ? 'Item' : 'Items'}
                                    </span>
                                )}
                            </h1>
                            <p className="text-gray-500 text-sm md:text-base">
                                Your favorite items saved for later.
                            </p>
                        </div>

                        {wishlistCount > 0 && (
                            <button 
                                onClick={clearWishlist}
                                className="inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors px-4 py-2 rounded-xl hover:bg-red-50"
                            >
                                <FiTrash2 size={16} />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
                {wishlistCount === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm text-center px-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <FiHeart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-500 max-w-sm mb-8">
                            Looks like you haven't saved any items yet. Start exploring our latest products and save your favorites!
                        </p>
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <FiShoppingBag size={20} />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {wishlist.map((product) => (
                            <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recently Viewed / Recommendations could go here */}
        </main>
    );
}
