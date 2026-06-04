"use client";

import { useState, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../Shared/ProductCard";
import SectionIntro from "../Shared/SectionIntro";
import SectionShell from "../Shared/SectionShell";

export default function NewArrivals({ products = [] }) {
  const [activeBrand, setActiveBrand] = useState("All");
  const sliderRef = useRef(null);

  const sourceProducts = Array.isArray(products) ? products : [];
  const brands = ["All", ...new Set(sourceProducts.map((p) => p.brand).filter(Boolean))];

  const filteredProducts =
    activeBrand === "All"
      ? sourceProducts
      : sourceProducts.filter((p) => p.brand === activeBrand);

  const handleBrandChange = (brand) => {
    setActiveBrand(brand);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <SectionShell variant="muted" border inset>
      <div className="flex items-end justify-between gap-4 mb-4">
        <SectionIntro title="Latest" highlight="Arrivals" variant="compact" className="mb-0" />
      </div>

      {sourceProducts.length > 0 && (
        <div className="flex gap-4 mb-5 overflow-x-auto no-scrollbar border-b border-gray-200">
          {brands.map((brand, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleBrandChange(brand)}
              className={`pb-2.5 text-xs md:text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeBrand === brand
                  ? "text-brand-primary border-brand-primary"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent z-10 hidden md:block" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent z-10 hidden md:block" />

        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-3 md:gap-4 pb-2 snap-x snap-mandatory flex-nowrap no-scrollbar"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, idx) => (
              <div
                key={product.id || idx}
                className="w-[calc(50%-6px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-10 text-gray-500 text-sm">
              No new arrival products available right now.
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex justify-end gap-2 mt-4 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={scrollLeft}
          className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary transition-colors"
          aria-label="Scroll left"
        >
          <FiChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={scrollRight}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-900 text-white hover:bg-brand-primary transition-colors"
          aria-label="Scroll right"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </SectionShell>
  );
}
