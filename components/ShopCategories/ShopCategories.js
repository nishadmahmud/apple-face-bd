"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FiBox } from 'react-icons/fi';
import SectionHeader from '../Shared/SectionHeader';

function categoryHref(cat) {
  const slug =
    cat.slug ||
    (typeof cat.name === 'string'
      ? encodeURIComponent(cat.name.toLowerCase().replace(/\s+/g, '-'))
      : 'all');
  return `/category/${slug}`;
}

export default function ShopCategories({ categories = [] }) {
  const displayCategories = Array.isArray(categories) ? categories : [];

  return (
    <section className="bg-[#f7f7f7] py-8 md:py-10 border-b border-gray-200">
      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader title="Browse" highlight="Categories" href="/category" linkLabel="View all" />

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2 md:gap-2.5">
          {displayCategories.length > 0 ? (
            displayCategories.map((cat, idx) => (
              <Link
                key={cat.id || idx}
                href={categoryHref(cat)}
                className="group relative flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-brand-primary/50 hover:shadow-sm transition-all duration-200"
              >
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent group-hover:bg-brand-primary transition-colors z-10" />
                <div className="h-[56px] sm:h-[60px] md:h-[64px] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-1.5 md:p-2">
                  {cat.image || cat.image_path || cat.image_url ? (
                    <div className="relative w-full h-full max-h-[44px] md:max-h-[48px]">
                      <Image
                        src={cat.image || cat.image_path || cat.image_url}
                        alt={cat.name}
                        fill
                        unoptimized
                        className="object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <FiBox className="w-6 h-6 md:w-7 md:h-7 text-gray-300" />
                  )}
                </div>
                <div className="px-1.5 py-1.5 md:px-2 md:py-2 border-t border-gray-100 min-h-[36px] md:min-h-[40px] flex items-center justify-center">
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2 leading-tight text-center capitalize">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 text-sm bg-white rounded-xl border border-dashed border-gray-300">
              Categories will appear here once loaded.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
