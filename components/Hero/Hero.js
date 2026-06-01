"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

export default function Hero({ slides = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const timerRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const didSwipeRef = useRef(false);

    const displaySlides = Array.isArray(slides) ? slides : [];
    const slideCount = displaySlides.length;

    const goToSlide = useCallback((index) => {
        if (slideCount === 0) return;
        const next = ((index % slideCount) + slideCount) % slideCount;
        setCurrentSlide(next);
    }, [slideCount]);

    const goNext = useCallback(() => {
        if (slideCount === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, [slideCount]);

    const goPrev = useCallback(() => {
        if (slideCount === 0) return;
        setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
    }, [slideCount]);

    const startAutoplay = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (slideCount <= 1) return;

        timerRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideCount);
        }, AUTOPLAY_MS);
    }, [slideCount]);

    useEffect(() => {
        startAutoplay();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [startAutoplay]);

    const handleManualNav = (navigate) => {
        navigate();
        startAutoplay();
    };

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        didSwipeRef.current = false;
    };

    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            didSwipeRef.current = true;
        }
    };

    const handleTouchEnd = (e) => {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= SWIPE_THRESHOLD) {
            didSwipeRef.current = true;
            if (deltaX < 0) handleManualNav(goNext);
            else handleManualNav(goPrev);
        }
    };

    const handleSlideLinkClick = (e) => {
        if (didSwipeRef.current) {
            e.preventDefault();
            didSwipeRef.current = false;
        }
    };

    return (
        <section className="w-full bg-white pt-3 md:pt-4 pb-6 md:pb-8 overflow-hidden border-b border-gray-100">
            <div className="max-w-site mx-auto px-0 md:px-4 lg:px-8">
                <div
                    className="w-full relative overflow-hidden rounded-none md:rounded-lg h-[220px] sm:h-[340px] md:h-[460px] bg-gray-900 group touch-pan-y"
                    onTouchStart={slideCount > 1 ? handleTouchStart : undefined}
                    onTouchMove={slideCount > 1 ? handleTouchMove : undefined}
                    onTouchEnd={slideCount > 1 ? handleTouchEnd : undefined}
                >
                    {slideCount > 0 ? displaySlides.map((slide, idx) => (
                        <div
                            key={slide.id || idx}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <Link
                                href={slide.buttonLink || "/category"}
                                className="w-full h-full block"
                                onClick={handleSlideLinkClick}
                                draggable={false}
                            >
                                <Image
                                    src={slide.image || slide.image_path || "/no-image.svg"}
                                    alt={slide.title || "Slider Image"}
                                    fill
                                    unoptimized
                                    className="object-cover object-center z-0 pointer-events-none select-none"
                                    priority={idx === 0}
                                    draggable={false}
                                />
                            </Link>
                        </div>
                    )) : (
                        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                            <p className="text-gray-500 font-medium">No slider content available right now.</p>
                        </div>
                    )}

                    {slideCount > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => handleManualNav(goPrev)}
                                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 text-white border border-white/20 shadow-md items-center justify-center hover:bg-brand-primary transition-colors"
                                aria-label="Previous slide"
                            >
                                <FiChevronLeft size={22} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleManualNav(goNext)}
                                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 text-white border border-white/20 shadow-md items-center justify-center hover:bg-brand-primary transition-colors"
                                aria-label="Next slide"
                            >
                                <FiChevronRight size={22} />
                            </button>

                            <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
                                {displaySlides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleManualNav(() => goToSlide(idx))}
                                        className={`rounded-full transition-all duration-500 ${currentSlide === idx ? 'bg-brand-primary w-6 md:w-8 h-2 md:h-2.5' : 'bg-white/60 hover:bg-white w-2 md:w-2.5 h-2 md:h-2.5'}`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
