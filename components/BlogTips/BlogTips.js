"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AUTOPLAY_MS = 3500;
const SWIPE_THRESHOLD = 48;

export default function BlogTips({ posts = [] }) {
    const [startIndex, setStartIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const timerRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const didSwipeRef = useRef(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const displayPosts = Array.isArray(posts) ? posts : [];
    const itemsToShow = isMobile ? 1 : 3;
    const step = 1;
    const totalItems = displayPosts.length;
    const maxIndex = Math.max(0, totalItems - itemsToShow);
    const dotsCount = maxIndex + 1;
    const canSwipe = isMobile && totalItems > 1;

    const goNext = useCallback(() => {
        setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + step));
    }, [maxIndex, step]);

    const goPrev = useCallback(() => {
        setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - step));
    }, [maxIndex, step]);

    const startAutoplay = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (totalItems <= itemsToShow) return;

        timerRef.current = setInterval(() => {
            setStartIndex((prev) => {
                const nextIndex = prev + step;
                if (nextIndex > maxIndex) return 0;
                return nextIndex;
            });
        }, AUTOPLAY_MS);
    }, [totalItems, itemsToShow, maxIndex, step]);

    useEffect(() => {
        startAutoplay();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [startAutoplay]);

    useEffect(() => {
        if (startIndex > maxIndex) setStartIndex(0);
    }, [startIndex, maxIndex]);

    const handleManualNav = (navigate) => {
        navigate();
        startAutoplay();
    };

    const handleTouchStart = (e) => {
        if (!canSwipe) return;
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        didSwipeRef.current = false;
    };

    const handleTouchMove = (e) => {
        if (!canSwipe) return;
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            didSwipeRef.current = true;
        }
    };

    const handleTouchEnd = (e) => {
        if (!canSwipe) return;
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= SWIPE_THRESHOLD) {
            didSwipeRef.current = true;
            if (deltaX < 0) handleManualNav(goNext);
            else handleManualNav(goPrev);
        }
    };

    const handlePostLinkClick = (e) => {
        if (didSwipeRef.current) {
            e.preventDefault();
            didSwipeRef.current = false;
        }
    };

    return (
        <section className="bg-white py-10 md:py-20 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="flex items-end justify-between mb-6 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-xl md:text-4xl font-extrabold text-gray-900 mb-1 md:mb-3 tracking-tight">
                            Tech <span className="text-brand-purple">Insights</span>
                        </h2>
                        <p className="text-gray-500 text-xs md:text-lg hidden sm:block">Stay up to date with the latest tech news and tutorials.</p>
                    </div>
                    <Link href="/blogs" className="text-xs md:text-sm font-bold text-gray-500 hover:text-brand-purple uppercase tracking-wider transition-colors inline-block pb-1 border-b-2 border-transparent hover:border-brand-purple whitespace-nowrap">
                        View All
                    </Link>
                </div>

                {displayPosts.length > 0 ? (
                    <div className="w-full">
                        <div
                            className={`overflow-hidden w-full relative pb-2 pt-1 h-full ${canSwipe ? 'touch-pan-y' : ''}`}
                            onTouchStart={canSwipe ? handleTouchStart : undefined}
                            onTouchMove={canSwipe ? handleTouchMove : undefined}
                            onTouchEnd={canSwipe ? handleTouchEnd : undefined}
                        >
                            <div
                                className="flex transition-transform duration-500 ease-in-out h-full items-stretch"
                                style={{ transform: `translateX(-${startIndex * (100 / itemsToShow)}%)` }}
                            >
                                {displayPosts.map((post) => (
                                    <div key={post.id} className={`${isMobile ? 'w-full' : 'w-1/3'} flex-none px-2 md:px-4 flex flex-col items-stretch`}>
                                        <Link
                                            href={`/blogs/${post.slug || post.id}`}
                                            className="w-full h-full group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-purple/20 transition-all duration-300"
                                            onClick={handlePostLinkClick}
                                            draggable={false}
                                        >
                                            <div className="w-full aspect-[16/10] relative overflow-hidden bg-gray-100">
                                                <Image src={post.image || post.imageUrl || '/no-image.svg'} alt={post.title || post.name} fill unoptimized className="object-cover object-center group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none" draggable={false} />
                                                <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 z-10">
                                                    <span className="bg-brand-purple text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
                                                </div>
                                            </div>
                                            <div className="p-4 md:p-6 flex flex-col flex-grow">
                                                <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-2 leading-snug group-hover:text-brand-purple transition-colors line-clamp-2">{post.title || post.name}</h3>
                                                <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4 flex-grow line-clamp-2">{post.excerpt}</p>
                                                <span className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mt-auto">{post.readTime || post.date}</span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {dotsCount > 1 && (
                            <div className="flex justify-center items-center gap-1.5 mt-6 md:mt-8">
                                {Array.from({ length: dotsCount }).map((_, pageIndex) => (
                                    <button
                                        key={pageIndex}
                                        type="button"
                                        onClick={() => handleManualNav(() => setStartIndex(pageIndex))}
                                        className={`h-1.5 transition-all rounded-full ${pageIndex === startIndex ? 'bg-brand-purple w-8' : 'bg-gray-200 hover:bg-gray-300 w-5'}`}
                                        aria-label={`Go to slide ${pageIndex + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full text-center py-10 text-gray-500 text-sm border border-dashed border-gray-200 rounded-xl">
                        No blog posts available right now.
                    </div>
                )}
            </div>
        </section>
    );
}
