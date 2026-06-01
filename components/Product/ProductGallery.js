"use client";

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiX, FiZoomIn } from 'react-icons/fi';

export default function ProductGallery({
    images = [],
    selectedIndex = 0,
    onSelectedIndexChange
}) {
    const imageArray = images && images.length > 0 ? images : ['/no-image.svg'];
    const safeIndex = Math.max(0, Math.min(selectedIndex, imageArray.length - 1));
    const mainImage = imageArray[safeIndex];
    const showArrows = imageArray.length > 1;

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

    useEffect(() => {
        setMounted(true);
    }, []);

    const goPrev = useCallback(() => {
        if (!onSelectedIndexChange) return;
        const next = safeIndex === 0 ? imageArray.length - 1 : safeIndex - 1;
        onSelectedIndexChange(next);
    }, [onSelectedIndexChange, safeIndex, imageArray.length]);

    const goNext = useCallback(() => {
        if (!onSelectedIndexChange) return;
        const next = safeIndex === imageArray.length - 1 ? 0 : safeIndex + 1;
        onSelectedIndexChange(next);
    }, [onSelectedIndexChange, safeIndex, imageArray.length]);

    const openLightbox = () => setLightboxOpen(true);
    const closeLightbox = () => setLightboxOpen(false);

    useEffect(() => {
        if (!lightboxOpen) return;

        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [lightboxOpen, goPrev, goNext]);

    const handleMainMouseMove = (e) => {
        if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoom({ active: true, x, y });
    };

    const handleMainMouseLeave = () => {
        setZoom({ active: false, x: 50, y: 50 });
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <button
                    type="button"
                    onClick={openLightbox}
                    onMouseMove={handleMainMouseMove}
                    onMouseLeave={handleMainMouseLeave}
                    className="group w-full aspect-square relative bg-[#f5f5f5] rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-4 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
                    aria-label="View product image fullscreen"
                >
                    {showArrows && (
                        <>
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goPrev();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        goPrev();
                                    }
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-gray-700 border border-gray-200 shadow-sm hover:bg-white hover:text-brand-purple transition-colors flex items-center justify-center"
                                aria-label="Previous image"
                            >
                                <FiChevronLeft size={24} />
                            </span>
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goNext();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        goNext();
                                    }
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-gray-700 border border-gray-200 shadow-sm hover:bg-white hover:text-brand-purple transition-colors flex items-center justify-center"
                                aria-label="Next image"
                            >
                                <FiChevronRight size={24} />
                            </span>
                        </>
                    )}

                    <Image
                        src={mainImage}
                        alt="Product Image"
                        fill
                        unoptimized
                        className={`object-contain pointer-events-none transition-transform duration-200 ease-out ${
                            zoom.active ? 'md:scale-[2]' : ''
                        }`}
                        style={
                            zoom.active
                                ? { transformOrigin: `${zoom.x}% ${zoom.y}%` }
                                : undefined
                        }
                    />

                    <span className="absolute bottom-3 right-3 z-20 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white md:hidden">
                        <FiZoomIn size={14} />
                        Tap to enlarge
                    </span>
                </button>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {imageArray.map((img, idx) => (
                        <button
                            key={`${img}-${idx}`}
                            type="button"
                            onClick={() => onSelectedIndexChange?.(idx)}
                            className={`relative w-20 h-20 shrink-0 rounded-xl border-2 overflow-hidden bg-[#f5f5f5] transition-all ${
                                safeIndex === idx
                                    ? 'border-brand-purple'
                                    : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                unoptimized
                                className="object-contain p-2"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {lightboxOpen &&
                mounted &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[10000] flex flex-col"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Product image viewer"
                    >
                        <button
                            type="button"
                            className="absolute inset-0 bg-black"
                            onClick={closeLightbox}
                            aria-label="Close image viewer"
                        />

                        <div className="relative z-10 flex flex-col h-full min-h-0 pointer-events-none">
                            <div className="flex items-center justify-between px-4 md:px-6 py-4 shrink-0 pointer-events-auto">
                                <p className="text-sm font-semibold text-white">
                                    {safeIndex + 1} / {imageArray.length}
                                </p>
                                <button
                                    type="button"
                                    onClick={closeLightbox}
                                    className="w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors"
                                    aria-label="Close"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="relative flex-1 min-h-0 px-3 md:px-8 pb-4 pointer-events-auto">
                                {showArrows && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={goPrev}
                                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors"
                                            aria-label="Previous image"
                                        >
                                            <FiChevronLeft size={28} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goNext}
                                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors"
                                            aria-label="Next image"
                                        >
                                            <FiChevronRight size={28} />
                                        </button>
                                    </>
                                )}

                                <div className="relative w-full h-full max-w-5xl mx-auto">
                                    <Image
                                        src={mainImage}
                                        alt="Product image fullscreen"
                                        fill
                                        unoptimized
                                        priority
                                        className="object-contain"
                                        sizes="100vw"
                                    />
                                </div>
                            </div>

                            {imageArray.length > 1 && (
                                <div className="flex gap-2 px-4 pb-8 overflow-x-auto scrollbar-hide shrink-0 justify-center pointer-events-auto">
                                    {imageArray.map((img, idx) => (
                                        <button
                                            key={`lb-${img}-${idx}`}
                                            type="button"
                                            onClick={() => onSelectedIndexChange?.(idx)}
                                            className={`relative w-16 h-16 shrink-0 rounded-lg border-2 overflow-hidden bg-white/5 ${
                                                safeIndex === idx ? 'border-brand-purple' : 'border-white/25'
                                            }`}
                                        >
                                            <Image
                                                src={img}
                                                alt=""
                                                fill
                                                unoptimized
                                                className="object-contain p-1"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
