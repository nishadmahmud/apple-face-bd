"use client";

import { useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';

/** Prevent awkward wraps after hyphens in specs like "6.9-inch" — text nodes only, not tags/URLs. */
function normalizeDescriptionHtml(html) {
    if (!html || typeof html !== 'string') return '';

    const stripBackgroundFromStyle = (styleValue) =>
        styleValue
            .replace(/\s*background(?:-color)?\s*:\s*[^;]+;?/gi, '')
            .replace(/\s*;\s*;/g, ';')
            .trim()
            .replace(/^;|;$/g, '');

    return html.replace(/(<[^>]+>)|([^<]+)/g, (_match, tag, text) => {
        if (tag) {
            return tag.replace(/\sstyle=(["'])([\s\S]*?)\1/i, (_m, quote, styles) => {
                const cleaned = stripBackgroundFromStyle(styles);
                return cleaned ? ` style=${quote}${cleaned}${quote}` : '';
            });
        }
        if (text) return text.replace(/(\d(?:\.\d+)?)-([a-zA-Z])/g, '$1\u2011$2');
        return _match;
    });
}

export default function ProductTabs({ description, specifications = [], productId }) {
    const specsRef = useRef(null);
    const descRef = useRef(null);
    const { recentlyViewed } = useRecentlyViewed();
    const recentItems = recentlyViewed.filter((item) => Number(item.id) !== Number(productId)).slice(0, 5);
    const formattedDescription = useMemo(
        () => normalizeDescriptionHtml(description),
        [description]
    );

    const scrollToSection = (ref) => {
        if (ref.current) {
            const offset = 100; // Small offset for any fixed header
            const elementPosition = ref.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="mt-12 md:mt-24 w-full">
            {/* Navigation Header */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 mb-12 flex items-center gap-6 md:gap-10">
                <button
                    onClick={() => scrollToSection(specsRef)}
                    className="cursor-pointer py-4 text-[15px] md:text-[17px] font-bold text-gray-900 border-b-2 border-brand-primary transition-all hover:opacity-80"
                >
                    Specifications
                </button>
                <button
                    onClick={() => scrollToSection(descRef)}
                    className="cursor-pointer py-4 text-[15px] md:text-[17px] font-bold text-gray-500 border-b-2 border-transparent hover:text-brand-primary transition-all"
                >
                    Description
                </button>
            </div>

            {/* Combined Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-10 items-start">
                <div className="space-y-20 md:space-y-32">
                    {/* Specifications Section */}
                    <section ref={specsRef} className="scroll-mt-32">
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-brand-primary rounded-full"></span>
                            Product Specifications
                        </h3>
                        <div className="w-full">
                            {Array.isArray(specifications) && specifications.length > 0 ? (
                                <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                                    {specifications.map((spec, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row p-5 md:p-6 hover:bg-gray-50/50 transition-colors">
                                            <div className="sm:w-1/3 text-gray-400 font-bold mb-1 sm:mb-0 uppercase tracking-widest text-[10px] md:text-[11px] antialiased">
                                                {spec.name}
                                            </div>
                                            <div className="sm:w-2/3 text-gray-800 text-[14px] md:text-[16px] font-semibold leading-relaxed">
                                                {spec.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic py-10 text-center bg-gray-50 rounded-2xl">No detailed specifications available.</p>
                            )}
                        </div>
                    </section>

                    {/* Description Section */}
                    <section ref={descRef} className="scroll-mt-32">
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-brand-primary rounded-full"></span>
                            Overview & Details
                        </h3>
                        {formattedDescription ? (
                            <div
                                className="product-description w-full max-w-none"
                                dangerouslySetInnerHTML={{ __html: formattedDescription }}
                            />
                        ) : (
                            <p className="text-gray-400 italic py-10 text-center bg-gray-50 rounded-lg border border-gray-200">
                                No description available for this product.
                            </p>
                        )}
                    </section>
                </div>

                <aside className="hidden lg:block lg:sticky lg:top-28">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <h4 className="text-xl font-black text-gray-900">Recently Viewed</h4>
                            <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-brand-primary hover:underline">View Shop</Link>
                        </div>
                        <div className="p-3 space-y-3">
                            {recentItems.length > 0 ? recentItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/product/${String(item.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${item.id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-primary/30 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                                        <Image src={item.imageUrl || '/no-image.svg'} alt={item.name || 'Product'} fill unoptimized className="object-contain p-1" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400 uppercase font-semibold truncate">{item.brand || 'Brand'}</p>
                                        <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-extrabold text-gray-900">{item.price}</p>
                                            {item.oldPrice && <p className="text-[11px] text-gray-400 line-through">{item.oldPrice}</p>}
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-sm text-gray-400 px-1 py-4 text-center">No recently viewed products yet.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
