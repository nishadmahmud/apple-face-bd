"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiBox, FiChevronDown, FiChevronUp } from "react-icons/fi";
import SectionHeader from "../Shared/SectionHeader";
import { getCategoryHref } from "../../lib/categoryLinks";

const MOBILE_INITIAL_COUNT = 8;

function getCategoryImage(cat) {
  return cat?.image || cat?.image_path || cat?.image_url || null;
}

export default function ShopCategories({ categories = [] }) {
  const displayCategories = Array.isArray(categories) ? categories : [];
  const [expanded, setExpanded] = useState(false);

  const hasMoreOnMobile = displayCategories.length > MOBILE_INITIAL_COUNT;

  return (
    <section className="bg-[#3d3d3d] py-8 md:py-10 border-b border-gray-400/30">
      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          dark
          title="Browse"
          highlight="Categories"
          href="/category"
          linkLabel="View all"
        />

        {displayCategories.length > 0 ? (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-2 gap-y-5 md:gap-x-3 md:gap-y-6">
              {displayCategories.map((cat, idx) => {
                const src = getCategoryImage(cat);
                const hiddenOnMobile = !expanded && idx >= MOBILE_INITIAL_COUNT;

                return (
                  <Link
                    key={cat.id || cat.category_id || idx}
                    href={getCategoryHref(cat)}
                    className={`group flex-col items-center gap-2 text-center ${
                      hiddenOnMobile ? "hidden md:flex" : "flex"
                    }`}
                  >
                    <div className="relative w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] md:w-[68px] md:h-[68px] rounded-full bg-white flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-brand-primary transition-all shadow-sm">
                      {src ? (
                        <div className="relative w-[72%] h-[72%]">
                          <Image
                            src={src}
                            alt={cat.name || "Category"}
                            fill
                            unoptimized
                            className="object-contain group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                      ) : (
                        <FiBox className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-gray-300 capitalize line-clamp-2 leading-tight group-hover:text-white transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {hasMoreOnMobile && (
              <div className="mt-6 flex justify-center md:hidden">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/25 bg-white/10 text-sm font-bold text-white hover:bg-white/15 transition-colors"
                  aria-expanded={expanded}
                >
                  {expanded ? (
                    <>
                      Show less
                      <FiChevronUp size={16} aria-hidden />
                    </>
                  ) : (
                    <>
                      See all
                      <FiChevronDown size={16} aria-hidden />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm rounded-xl border border-dashed border-white/20">
            Categories will appear here once loaded.
          </div>
        )}
      </div>
    </section>
  );
}
