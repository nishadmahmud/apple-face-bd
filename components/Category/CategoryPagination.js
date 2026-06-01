"use client";

import Link from "next/link";

export default function CategoryPagination({
    totalPages,
    currentPage,
    categorySlug,
    subcatSlug,
    subcatId,
}) {
    if (totalPages <= 1) return null;

    const queryExtras = [
        subcatSlug ? `subcat=${encodeURIComponent(subcatSlug)}` : "",
        subcatId ? `subcat_id=${subcatId}` : "",
    ]
        .filter(Boolean)
        .join("&");

    const buildHref = (pageNum) => {
        const q = queryExtras ? `&${queryExtras}` : "";
        return `/category/${categorySlug}?page=${pageNum}${q}`;
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 md:mt-10">
            {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;

                if (totalPages > 6) {
                    if (pageNum < currentPage - 2 && pageNum !== 1) return null;
                    if (pageNum > currentPage + 2 && pageNum !== totalPages) return null;
                    if (pageNum === currentPage - 2 && pageNum > 2) {
                        return (
                            <span key={`ellipsis-before-${pageNum}`} className="px-2 text-gray-400">
                                …
                            </span>
                        );
                    }
                    if (pageNum === currentPage + 2 && pageNum < totalPages - 1) {
                        return (
                            <span key={`ellipsis-after-${pageNum}`} className="px-2 text-gray-400">
                                …
                            </span>
                        );
                    }
                }

                return (
                    <Link
                        key={pageNum}
                        href={buildHref(pageNum)}
                        scroll
                        className={`min-w-[40px] h-10 px-3 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                            pageNum === currentPage
                                ? "bg-brand-primary text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-brand-primary/40"
                        }`}
                    >
                        {pageNum}
                    </Link>
                );
            })}
        </div>
    );
}
