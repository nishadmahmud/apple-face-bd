"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

function HeroCarousel({ slides = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const timerRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const didSwipeRef = useRef(false);

  const displaySlides = Array.isArray(slides) ? slides : [];
  const slideCount = displaySlides.length;

  const goToSlide = useCallback(
    (index) => {
      if (slideCount === 0) return;
      const next = ((index % slideCount) + slideCount) % slideCount;
      setCurrentSlide(next);
    },
    [slideCount]
  );

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
    if (slideCount <= 1 || reduceMotion) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, AUTOPLAY_MS);
  }, [slideCount, reduceMotion]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
    <div
      className="w-full relative overflow-hidden rounded-none md:rounded-lg h-[220px] sm:h-[260px] md:h-[420px] lg:h-[440px] bg-gray-900 group touch-pan-y"
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional slides"
      onTouchStart={slideCount > 1 ? handleTouchStart : undefined}
      onTouchMove={slideCount > 1 ? handleTouchMove : undefined}
      onTouchEnd={slideCount > 1 ? handleTouchEnd : undefined}
    >
      {slideCount > 0 ? (
        displaySlides.map((slide, idx) => (
          <div
            key={slide.id ?? idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={currentSlide !== idx}
          >
            <Link
              href={slide.link || "/category"}
              className="w-full h-full block"
              onClick={handleSlideLinkClick}
              draggable={false}
              tabIndex={currentSlide === idx ? 0 : -1}
            >
              <Image
                src={slide.image || "/no-image.svg"}
                alt={slide.title || "Promotional slide"}
                fill
                unoptimized
                className="object-cover object-center pointer-events-none select-none"
                priority={idx === 0}
                draggable={false}
              />
            </Link>
          </div>
        ))
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 bg-gray-100">
          <p className="text-gray-500 font-medium text-sm">No promotions available right now.</p>
        </div>
      )}

      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={() => handleManualNav(goPrev)}
            className="hidden md:flex absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-black/70 text-white border border-white/20 items-center justify-center hover:bg-brand-primary transition-colors"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => handleManualNav(goNext)}
            className="hidden md:flex absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-black/70 text-white border border-white/20 items-center justify-center hover:bg-brand-primary transition-colors"
            aria-label="Next slide"
          >
            <FiChevronRight size={22} />
          </button>

          <div
            className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 md:gap-2"
            role="tablist"
            aria-label="Slide indicators"
          >
            {displaySlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={currentSlide === idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => handleManualNav(() => goToSlide(idx))}
                className={`rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "bg-brand-primary w-6 md:w-8 h-2"
                    : "bg-white/60 hover:bg-white w-2 h-2"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function HeroBannerStrip({ banners = [] }) {
  const displayBanners = Array.isArray(banners) ? banners : [];
  if (displayBanners.length === 0) return null;

  const gridCols =
    displayBanners.length === 1
      ? "grid-cols-1"
      : displayBanners.length === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  return (
    <div
      className={`grid ${gridCols} gap-2 md:gap-4 px-4 md:px-0`}
      role="list"
      aria-label="Featured promotions"
    >
      {displayBanners.map((banner, idx) => (
        <Link
          key={banner.id ?? idx}
          href={banner.link || "/"}
          role="listitem"
          className="relative block overflow-hidden rounded-md bg-gray-100 border border-gray-200/80 h-[88px] sm:h-[100px] md:h-[150px] lg:h-[160px] hover:ring-2 hover:ring-brand-primary/40 transition-all duration-300 group"
        >
          <Image
            src={banner.image || "/no-image.svg"}
            alt={banner.title || `Promotion ${idx + 1}`}
            fill
            unoptimized
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            priority={idx === 0}
          />
        </Link>
      ))}
    </div>
  );
}

export default function HomeHero({ slides = [], banners = [] }) {
  const hasStrip = Array.isArray(banners) && banners.length > 0;

  return (
    <section
      className="w-full bg-card-bg pt-0 md:pt-4 pb-5 md:pb-8 border-b border-gray-200/80"
      aria-label="Home hero"
    >
      <div className="max-w-site mx-auto px-0 md:px-4 lg:px-8">
        <div className={hasStrip ? "space-y-3 md:space-y-4" : ""}>
          <HeroCarousel slides={slides} />
          {hasStrip && <HeroBannerStrip banners={banners} />}
        </div>
      </div>
    </section>
  );
}
