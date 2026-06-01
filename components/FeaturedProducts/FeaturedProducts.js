import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../Shared/ProductCard';

export default function FeaturedProducts({ products = [] }) {
    const displayProducts = Array.isArray(products) ? products : [];

    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-6 md:mb-10">
                    <h2 className="text-xl md:text-[28px] font-extrabold tracking-tight">
                        <span className="text-gray-800">Featured </span>
                        <span className="text-brand-primary">Products</span>
                    </h2>
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-primary transition-colors group">
                        <span className="hidden sm:inline">See All</span>
                        <span className="w-8 h-8 rounded-full border-2 border-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <FiArrowRight className="w-4 h-4 text-brand-primary group-hover:text-white" />
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {displayProducts.length > 0 ? displayProducts.map((product, idx) => (
                        <ProductCard key={product.id || idx} product={product} />
                    )) : (
                        <div className="col-span-full text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                            No featured products available right now.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
