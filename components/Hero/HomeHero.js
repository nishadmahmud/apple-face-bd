"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { SITE_GUTTER } from "../Shared/SectionShell";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

const MOBILE_CAROUSEL_H =
  "h-[220px] sm:h-[260px]";
const DESKTOP_HERO_H =
  "md:h-[400px] lg:h-[420px]";

function HeroCarousel({
  slides = [],
  className = "",
  showArrows = true,
}) {
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
      className={`w-full relative overflow-hidden rounded-lg bg-gray-900 group touch-pan-y ${className}`}
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
          {showArrows && (
            <>
              <button
                type="button"
                onClick={() => handleManualNav(goPrev)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/70 text-white border border-white/20 items-center justify-center hover:bg-brand-primary transition-colors hidden md:flex"
                aria-label="Previous slide"
              >
                <FiChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => handleManualNav(goNext)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/70 text-white border border-white/20 items-center justify-center hover:bg-brand-primary transition-colors hidden md:flex"
                aria-label="Next slide"
              >
                <FiChevronRight size={22} />
              </button>
            </>
          )}

          <div
            className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 md:gap-2"
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

/** Mobile: 2-column strip under slider */
function HeroBannerStrip({ banners = [] }) {
  const displayBanners = Array.isArray(banners) ? banners : [];
  if (displayBanners.length === 0) return null;

  return (
    <div
      className="grid grid-cols-2 gap-1.5 md:hidden"
      role="list"
      aria-label="Featured promotions"
    >
      {displayBanners.slice(0, 2).map((banner, idx) => (
        <Link
          key={banner.id ?? idx}
          href={banner.link || "/"}
          role="listitem"
          className="relative overflow-hidden rounded-md bg-gray-100 border border-gray-200/80 h-[88px] sm:h-[100px] hover:ring-2 hover:ring-brand-primary/40 transition-all duration-300 group block"
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

/** Desktop: stacked banners beside slider */
function HeroSideBanners({ banners = [] }) {
  const sideBanners = Array.isArray(banners) ? banners.slice(0, 2) : [];
  if (sideBanners.length === 0) return null;

  return (
    <div
      className="hidden md:flex flex-col gap-2 h-full min-h-0"
      role="list"
      aria-label="Featured promotions"
    >
      {sideBanners.map((banner, idx) => (
        <Link
          key={banner.id ?? idx}
          href={banner.link || "/"}
          role="listitem"
          className="relative flex-1 min-h-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200/80 hover:ring-2 hover:ring-brand-primary/40 transition-all duration-300 group block"
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
  const displayBanners = Array.isArray(banners) ? banners : [];
  const hasBanners = displayBanners.length > 0;
  const desktopSplit = hasBanners;

  return (
    <section
      className="border-b border-gray-200/80 pt-3 sm:pt-4 md:pt-4 pb-5 md:pb-8"
      aria-label="Home hero"
    >
      <div className={`max-w-site mx-auto w-full ${SITE_GUTTER}`}>
        {/* Mobile: slider + 2 banners below */}
        <div className={`md:hidden ${hasBanners ? "space-y-2" : ""}`}>
          <HeroCarousel slides={slides} className={MOBILE_CAROUSEL_H} />
          {hasBanners && <HeroBannerStrip banners={displayBanners} />}
        </div>

        {/* Desktop: slider left + 2 stacked banners right */}
        <div
          className={
            desktopSplit
              ? `hidden md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] gap-2 items-stretch ${DESKTOP_HERO_H}`
              : `hidden md:block ${DESKTOP_HERO_H}`
          }
        >
          <HeroCarousel
            slides={slides}
            className="h-full min-h-0 w-full"
            showArrows
          />
          {desktopSplit && <HeroSideBanners banners={displayBanners} />}
        </div>
      </div>
    </section>
  );
}
