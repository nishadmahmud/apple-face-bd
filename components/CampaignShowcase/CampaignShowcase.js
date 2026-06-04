"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../Shared/ProductCard";
import SectionIntro from "../Shared/SectionIntro";
import SectionShell from "../Shared/SectionShell";

export default function CampaignShowcase({
  splitBanners = [],
  products = [],
  title = "Featured Campaigns",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const titleParts = title?.split(" ") || [];
  const highlight = titleParts.pop() || "Trends";
  const titleMain = titleParts.join(" ") || "Top Digital";

  const itemsPerView = isMobile ? 2 : 4;
  const step = isMobile ? 2 : 1;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  useEffect(() => {
    if (isMobile || products.length <= itemsPerView) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + step;
        if (nextIndex > maxIndex) return 0;
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [products.length, itemsPerView, step, maxIndex, isMobile]);

  if (!products.length && !splitBanners?.length) return null;

  const mobileProducts = products.slice(0, 6);

  return (
    <SectionShell variant="light" border>
      <SectionIntro title={titleMain} highlight={highlight} />

      <div className="flex flex-col md:flex-row gap-5 md:gap-8">
        {splitBanners?.length > 0 && (
          <div className="md:w-[40%] shrink-0 flex flex-col gap-3">
            {splitBanners.map((banner, idx) => (
              <Link
                href={banner.link || banner.button_url || "/"}
                key={banner.id || idx}
                className="relative w-full overflow-hidden rounded-lg bg-gray-50 group block h-[140px] md:h-[200px] border border-gray-200 hover:ring-2 hover:ring-brand-primary/30 transition-all"
              >
                <Image
                  src={banner.image || banner.image_path || banner.image_url || "/no-image.svg"}
                  alt={banner.title || `Campaign ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className={`flex-1 min-w-0 ${splitBanners?.length ? "" : "w-full"}`}>
            <div className="md:hidden grid grid-cols-2 gap-3">
              {mobileProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="hidden md:block overflow-hidden">
              <div
                className="flex items-stretch transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
                }}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="w-1/4 flex-none px-2 h-auto flex flex-col items-stretch"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              {products.length > itemsPerView && (
                <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: Math.ceil((maxIndex + 1) / step) }).map((_, idx) => {
                    const dotIndex = idx * step;
                    return (
                      <button
                        key={dotIndex}
                        type="button"
                        onClick={() => setCurrentIndex(Math.min(dotIndex, maxIndex))}
                        className={`h-2 rounded-full transition-all ${
                          Math.floor(currentIndex / step) === idx
                            ? "w-8 bg-brand-primary"
                            : "w-3 bg-gray-200 hover:bg-gray-300"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
