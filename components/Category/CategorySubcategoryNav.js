"use client";

import Link from "next/link";

function normalizeSlug(val) {
    return val ? String(val).toLowerCase().trim().replace(/\s+/g, "-") : "";
}

export default function CategorySubcategoryNav({
    categorySlug,
    subCategories = [],
    activeSubcategory,
}) {
    if (!subCategories?.length) return null;

    const basePath = `/category/${categorySlug}`;

    return (
        <div className="mb-4 md:mb-6 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 w-max min-w-full md:flex-wrap md:w-auto">
                <Link
                    href={basePath}
                    scroll={false}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors border ${
                        !activeSubcategory
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-white text-gray-700 border-gray-200 hover:border-brand-primary/40"
                    }`}
                >
                    All
                </Link>
                {subCategories.map((sub) => {
                    const slug = normalizeSlug(sub.slug || sub.name);
                    const isActive =
                        activeSubcategory &&
                        (String(activeSubcategory.id) === String(sub.id) ||
                            normalizeSlug(activeSubcategory.name) === slug);

                    const href = `${basePath}?subcat=${encodeURIComponent(slug)}&subcat_id=${sub.id}`;

                    return (
                        <Link
                            key={sub.id}
                            href={href}
                            scroll={false}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors border ${
                                isActive
                                    ? "bg-brand-primary text-white border-brand-primary"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-brand-primary/40"
                            }`}
                        >
                            {sub.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
