"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoriesFromServer } from '../../lib/api';
import { FiChevronRight, FiGrid } from 'react-icons/fi';

export default function CategoryIndexPage() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategoriesFromServer();
                if (res?.success && Array.isArray(res.data)) {
                    setCategories(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Header Section */}
                <div className="text-center mb-12 md:mb-20">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Explore <span className="text-brand-purple">Categories</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Discover our wide range of premium tech products organized by category to help you find exactly what you need.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Categories...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id || cat.category_id}
                                href={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="group bg-white rounded-3xl p-6 md:p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col items-center text-center relative overflow-hidden"
                            >
                                {/* Decorative Gradient Background */}
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl group-hover:bg-brand-purple/10 transition-colors duration-500"></div>

                                {/* Category Icon/Image Area */}
                                <div className="w-24 h-24 md:w-32 md:h-32 mb-6 relative z-10 p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform duration-500 ease-out">
                                    <Image
                                        src={cat.image_path || cat.image_url || '/no-image.svg'}
                                        alt={cat.name}
                                        fill
                                        unoptimized
                                        className="object-contain p-2"
                                    />
                                </div>

                                {/* Category Name */}
                                <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-2 group-hover:text-brand-purple transition-colors duration-300">
                                    {cat.name}
                                </h3>

                                {/* Action Label */}
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand-purple transition-all duration-300">
                                    <span>Browse Shop</span>
                                    <FiChevronRight className="transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
