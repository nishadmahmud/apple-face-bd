"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FiBox, FiArrowRight } from 'react-icons/fi';

export default function ShopCategories({ categories = [] }) {
    const displayCategories = (Array.isArray(categories) ? categories : []);

    return (
        <section className="bg-white py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 md:mb-10">
                    <h2 className="text-xl md:text-[28px] font-extrabold tracking-tight">
                        <span className="text-gray-800">Shop By </span>
                        <span className="text-brand-primary">Popular Categories</span>
                    </h2>
                    <Link
                        href="/category"
                        className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-primary transition-colors group"
                    >
                        <span className="hidden sm:inline">See All</span>
                        <span className="w-8 h-8 rounded-full border-2 border-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <FiArrowRight className="w-4 h-4 text-brand-primary group-hover:text-white" />
                        </span>
                    </Link>
                </div>

                {/* Category Grid — Image-first cards */}
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
                    {displayCategories.length > 0 ? displayCategories.map((cat, idx) => (
                        <Link
                            href={`/category/${cat.slug || (typeof cat.name === 'string' ? encodeURIComponent(cat.name.toLowerCase().replace(/\s+/g, '-')) : 'all')}`}
                            key={cat.id || idx}
                            className="flex flex-col group"
                        >
                            {/* Image Card — full bleed, no padding */}
                            <div className="aspect-square rounded-2xl bg-[#F5F5F5] border border-gray-200 overflow-hidden relative flex items-center justify-center group-hover:bg-[#EFEFEF] group-hover:border-gray-300 transition-all duration-300">
                                {cat.image || cat.image_path || cat.image_url ? (
                                    <div className="relative w-[80%] h-[80%]">
                                        <Image
                                            src={cat.image || cat.image_path || cat.image_url}
                                            alt={cat.name}
                                            fill
                                            unoptimized
                                            className="object-contain group-hover:scale-[1.02] transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <FiBox className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                                )}
                            </div>
                            {/* Name below */}
                            <span className="text-[10px] sm:text-[11px] md:text-[13px] font-semibold text-gray-700 group-hover:text-brand-primary transition-colors text-center line-clamp-2 leading-tight mt-2 md:mt-3">
                                {cat.name}
                            </span>
                        </Link>
                    )) : (
                        <div className="col-span-4 md:col-span-8 w-full text-center py-8 text-gray-500 text-sm">
                            No category data available right now.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
