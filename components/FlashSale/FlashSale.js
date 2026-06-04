"use client";

import { useState, useEffect } from "react";
import ProductCard from "../Shared/ProductCard";
import SectionIntro from "../Shared/SectionIntro";
import { SITE_GUTTER } from "../Shared/SectionShell";
import { FiZap } from "react-icons/fi";

export default function FlashSale({ products = [] }) {
  const [timeLeft, setTimeLeft] = useState(23 * 86400 + 4 * 3600 + 4 * 60 + 59);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 30 * 86400 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = String(Math.floor(timeLeft / 86400)).padStart(2, "0");
  const hours = String(Math.floor((timeLeft % 86400) / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayProducts = Array.isArray(products) ? products : [];
  const itemsToShow = isMobile ? 2 : 4;
  const step = isMobile ? 2 : 1;
  const totalItems = displayProducts.length;
  const dotsCount = isMobile
    ? Math.ceil(totalItems / 2)
    : Math.max(0, totalItems - itemsToShow + 1);

  useEffect(() => {
    if (isMobile || totalItems <= itemsToShow) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => {
        const nextIndex = prev + step;
        const maxIndex = totalItems - itemsToShow;
        if (nextIndex > maxIndex) return 0;
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [totalItems, itemsToShow, step, isMobile]);

  const mobileGridProducts = displayProducts.slice(0, 6);

  return (
    <section className="py-10 md:py-16">
      <div className={`max-w-site mx-auto w-full ${SITE_GUTTER}`}>
        <div className="bg-[#0a0a0a] text-white rounded-lg border-t-2 border-brand-primary py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <FiZap className="text-brand-primary w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <SectionIntro
              variant="compact"
              title="Limited Time"
              highlight="Flash Sale"
              href="/special-offers"
              linkLabel="See all"
              dark
              className="mb-0"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-brand-primary/40 bg-white/5 px-2 py-1.5 md:px-3 md:py-2 w-fit">
            <TimerBlock value={days} label="D" compact />
            <span className="text-brand-primary font-bold">:</span>
            <TimerBlock value={hours} label="H" compact />
            <span className="text-brand-primary font-bold">:</span>
            <TimerBlock value={minutes} label="M" compact />
            <span className="text-brand-primary font-bold">:</span>
            <TimerBlock value={seconds} label="S" compact />
          </div>
        </div>

        {displayProducts.length > 0 ? (
          <>
            <div className="md:hidden grid grid-cols-2 gap-3">
              {mobileGridProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="hidden md:block overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out items-stretch"
                style={{
                  transform: `translateX(-${startIndex * (100 / itemsToShow)}%)`,
                }}
              >
                {displayProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-1/4 flex-none px-2 flex flex-col items-stretch"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              {dotsCount > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-4">
                  {Array.from({ length: dotsCount }).map((_, pageIndex) => (
                    <button
                      key={pageIndex}
                      type="button"
                      onClick={() => setStartIndex(pageIndex)}
                      className={`h-1.5 transition-all rounded-full ${
                        pageIndex === startIndex
                          ? "bg-brand-primary w-8"
                          : "bg-white/30 hover:bg-white/50 w-5"
                      }`}
                      aria-label={`Go to slide ${pageIndex + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full min-h-[200px] flex items-center justify-center text-gray-400 bg-white/5 rounded-lg border border-dashed border-white/20">
            No flash sale products available right now.
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

function TimerBlock({ value, label, compact }) {
  if (compact) {
    return (
      <div className="flex items-baseline gap-0.5">
        <span className="text-white font-black text-sm md:text-base tabular-nums">{value}</span>
        <span className="text-[9px] text-gray-500 font-semibold">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-gray-900 font-black text-base md:text-lg rounded-md flex items-center justify-center border-2 border-brand-primary">
        {value}
      </div>
      <span className="text-[9px] md:text-[10px] text-gray-500 font-semibold uppercase mt-1">
        {label}
      </span>
    </div>
  );
}
