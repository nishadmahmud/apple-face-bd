"use client";

import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/Shared/ProductCard';
import PageBreadcrumb from '../../components/Shared/PageBreadcrumb';
import EmptyState from '../../components/Shared/EmptyState';

export default function WishlistPage() {
    const { wishlist, wishlistCount, clearWishlist } = useWishlist();

    return (
        <main className="min-h-screen bg-card-bg pb-20 md:pb-10">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
                    <PageBreadcrumb
                        items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]}
                        className="mb-4"
                    />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 flex flex-wrap items-center gap-3">
                                My Wishlist
                                {wishlistCount > 0 && (
                                    <span className="text-sm font-bold bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full border border-brand-primary/20">
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
                                type="button"
                                onClick={clearWishlist}
                                className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:opacity-80 transition-opacity px-4 py-2 rounded-lg border border-brand-primary/30 hover:bg-brand-primary/5"
                            >
                                <FiTrash2 size={16} />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 pt-8 md:pt-10">
                {wishlistCount === 0 ? (
                    <EmptyState
                        icon={FiHeart}
                        title="Your wishlist is empty"
                        description="Looks like you haven't saved any items yet. Start exploring our latest products and save your favorites!"
                        actionHref="/"
                        actionLabel="Start Shopping"
                    />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
                        {wishlist.map((product) => (
                            <div key={product.id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
