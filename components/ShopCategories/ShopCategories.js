"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiBox, FiChevronDown, FiChevronUp } from "react-icons/fi";
import SectionHeader from "../Shared/SectionHeader";
import { SITE_GUTTER } from "../Shared/SectionShell";
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
    <section className="py-6 md:py-8 border-b border-gray-200/80 bg-white">
      <div className={`max-w-site mx-auto w-full ${SITE_GUTTER}`}>
        <SectionHeader
          title="Browse"
          highlight="Categories"
          href="/category"
          linkLabel="View all"
        />

        {displayCategories.length > 0 ? (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-2 gap-y-4 md:gap-x-3 md:gap-y-5">
              {displayCategories.map((cat, idx) => {
                const src = getCategoryImage(cat);
                const hiddenOnMobile = !expanded && idx >= MOBILE_INITIAL_COUNT;

                return (
                  <Link
                    key={cat.id || cat.category_id || idx}
                    href={getCategoryHref(cat)}
                    className={`group flex-col items-center gap-2 text-center p-2 md:p-2.5 rounded-xl bg-white shadow-md hover:shadow-lg border border-gray-100 transition-all duration-200 hover:border-brand-primary/20 ${
                      hiddenOnMobile ? "hidden md:flex" : "flex"
                    }`}
                  >
                    <div className="relative w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] md:w-[60px] md:h-[60px] rounded-full bg-card-bg flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-brand-primary/30 transition-all">
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
                        <FiBox className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
                      )}
                    </div>
                    <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-gray-700 capitalize line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm text-sm font-bold text-gray-800 hover:border-brand-primary/40 hover:text-brand-primary transition-colors"
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
          <div className="text-center py-12 text-gray-500 text-sm rounded-xl border border-dashed border-gray-200 bg-card-bg">
            Categories will appear here once loaded.
          </div>
        )}
      </div>
    </section>
  );
}
