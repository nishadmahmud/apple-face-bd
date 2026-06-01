"use client";

import { useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../Shared/ProductCard';

export default function NewArrivals({ products = [] }) {
    const [activeBrand, setActiveBrand] = useState('All');
    const sliderRef = useRef(null);

    const sourceProducts = Array.isArray(products) ? products : [];
    const brands = ['All', ...new Set(sourceProducts.map((p) => p.brand).filter(Boolean))];

    const filteredProducts = activeBrand === 'All'
        ? sourceProducts
        : sourceProducts.filter((p) => p.brand === activeBrand);

    const handleBrandChange = (brand) => {
        setActiveBrand(brand);
        if (sliderRef.current) {
            sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h2 className="text-xl md:text-[28px] font-extrabold tracking-tight">
                        <span className="text-gray-800">Latest </span>
                        <span className="text-brand-primary">Products</span>
                    </h2>

                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={scrollLeft}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors border-2 border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary"
                        >
                            <FiChevronLeft size={18} />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-brand-primary text-white hover:bg-green-600"
                        >
                            <FiChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {sourceProducts.length > 0 && (
                    <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                        {brands.map((brand, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleBrandChange(brand)}
                                className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${activeBrand === brand ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                )}

                <div className="overflow-hidden relative">
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto gap-3 md:gap-4 pb-4 snap-x snap-mandatory flex-nowrap no-scrollbar"
                    >
                        {filteredProducts.length > 0 ? filteredProducts.map((product, idx) => (
                            <div key={product.id || idx} className="w-[calc(50%-6px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] shrink-0 snap-start">
                                <ProductCard product={product} />
                            </div>
                        )) : (
                            <div className="w-full text-center py-10 text-gray-500 text-sm">No new arrival products available right now.</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
