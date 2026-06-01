"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../Shared/ProductCard';
import VideoBanners from '../VideoBanners/VideoBanners';

export default function CampaignShowcase({ splitBanners = [], products = [], videoBanner = null, title = "Featured Campaigns" }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const itemsPerView = isMobile ? 2 : 5; 
    const step = isMobile ? 2 : 1; 
    const maxIndex = Math.max(0, products.length - itemsPerView);

    useEffect(() => {
        if (products.length <= itemsPerView) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + step;
                if (nextIndex > maxIndex) {
                    return 0; // Wrap safely
                }
                return nextIndex;
            });
        }, 4000);

        return () => clearInterval(timer);
    }, [products.length, itemsPerView, step, maxIndex]);

    if (!products.length && !splitBanners?.length) return null;

    return (
        <section className="bg-white py-10 md:py-16 w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                {/* Title */}
                <div className="flex items-center justify-between mb-6 md:mb-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
                        {title}
                        <div className="h-1.5 w-16 sm:w-24 bg-brand-primary mt-2 sm:mt-3 rounded-full"></div>
                    </h2>
                </div>

                {/* Banner Row */}
                {splitBanners && splitBanners.length > 0 && (
                    <div className={`grid grid-cols-1 ${splitBanners.length === 2 ? 'sm:grid-cols-2' : ''} gap-3 md:gap-5 mb-8 md:mb-12`}>
                        {splitBanners.map((banner, idx) => (
                            <Link
                                href={banner.link || banner.button_url || "/"}
                                key={banner.id || idx}
                                className="relative w-full overflow-hidden rounded-xl bg-gray-50 group block h-[150px] sm:h-[200px] md:h-[250px] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-400"
                            >
                                <Image
                                    src={banner.image || banner.image_path || banner.image_url || "/no-image.svg"}
                                    alt={banner.title || `Campaign Banner ${idx + 1}`}
                                    fill
                                    unoptimized
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                />
                            </Link>
                        ))}
                    </div>
                )}

                {/* Product Carousel */}
                {products.length > 0 && (
                    <div className="w-full relative pb-2 pt-1 mb-8 overflow-hidden">
                        <div 
                            className="flex items-stretch transition-transform duration-700 ease-in-out h-full w-full"
                            style={{ 
                                transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`
                            }}
                        >
                            {products.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="w-1/2 md:w-1/5 flex-none px-1.5 md:px-2.5 h-auto flex flex-col items-stretch"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Navigation Dots */}
                        {products.length > itemsPerView && (
                            <div className="flex justify-center mt-6 md:mt-8 gap-2">
                                {Array.from({ length: Math.ceil((maxIndex + 1) / step) }).map((_, idx) => {
                                    const dotIndex = idx * step;
                                    return (
                                        <button
                                            key={dotIndex}
                                            onClick={() => setCurrentIndex(Math.min(dotIndex, maxIndex))}
                                            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                                                Math.floor(currentIndex / step) === idx 
                                                    ? 'w-6 md:w-8 bg-brand-primary' 
                                                    : 'w-2 md:w-3 bg-gray-200 hover:bg-gray-300'
                                            }`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Linked Video Section */}
                {videoBanner && (
                    <div className="mt-8 md:mt-12 w-full mx-auto">
                        <div className="w-full relative rounded-xl md:rounded-3xl overflow-hidden" style={{ aspectRatio: '21/5' }}>
                            <video
                                src={videoBanner.videoUrl || videoBanner.image_path || videoBanner.image}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="object-cover w-full h-full"
                            ></video>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
