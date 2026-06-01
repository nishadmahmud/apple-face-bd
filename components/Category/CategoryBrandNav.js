"use client";

import Link from "next/link";

function normalizeSlug(val) {
    return val ? String(val).toLowerCase().trim().replace(/\s+/g, "-") : "";
}

/**
 * One strip only: subcategory links when the API provides sub_category,
 * otherwise brand filter chips (All, Apple, …).
 */
export default function CategoryBrandNav({
    brandsList = [],
    selectedBrands = ["All"],
    onSelectBrand,
    subCategories = [],
    categorySlug,
    activeSubcategory,
}) {
    const hasSubcats = subCategories.length > 0 && categorySlug;
    const hasBrands = !hasSubcats && brandsList.length > 1;

    if (!hasSubcats && !hasBrands) return null;

    const basePath = `/category/${categorySlug}`;

    const chipClass = (active) =>
        `px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap transition-colors border shrink-0 ${
            active
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-gray-700 border-gray-200 hover:border-brand-primary/40"
        }`;

    return (
        <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 w-max max-w-full md:flex-wrap md:w-auto md:justify-end">
                {hasSubcats && (
                    <>
                        <Link
                            href={basePath}
                            scroll={false}
                            className={chipClass(!activeSubcategory)}
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
                                    className={chipClass(isActive)}
                                >
                                    {sub.name}
                                </Link>
                            );
                        })}
                    </>
                )}

                {hasBrands &&
                    brandsList.map((brand) => {
                        const isActive =
                            selectedBrands[0] === brand ||
                            (selectedBrands.length === 0 && brand === "All");
                        return (
                            <button
                                key={brand}
                                type="button"
                                onClick={() => onSelectBrand?.([brand])}
                                className={chipClass(isActive)}
                            >
                                {brand === "All" ? "All" : brand}
                            </button>
                        );
                    })}
            </div>
        </div>
    );
}
