"use client";

import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi";
import CategoryBrandNav from "./CategoryBrandNav";

export default function CategoryHeader({
    bannerImage,
    categoryImage,
    displayCategoryName,
    totalCount,
    isLoading,
    brandsList = [],
    selectedBrands = ["All"],
    onSelectBrand,
    categorySlug,
    subCategories = [],
    activeSubcategory,
}) {
    const hasSubcats = subCategories?.length > 0 && categorySlug;
    const showStrip = hasSubcats || brandsList.length > 1;

    return (
        <div className="mb-4 md:mb-6">
            <div className="w-full relative rounded-lg overflow-hidden border border-gray-200 mb-4 h-28 md:h-36">
                <Image
                    src={bannerImage}
                    alt={`${displayCategoryName} banner`}
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-3 md:gap-4 shrink-0 min-w-0 max-w-[45%] sm:max-w-[38%] md:max-w-[320px]">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg border border-gray-200 overflow-hidden relative bg-white shrink-0">
                        <Image
                            src={categoryImage}
                            alt={displayCategoryName}
                            fill
                            unoptimized
                            className="object-contain p-1.5"
                        />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2 capitalize">
                            <span className="truncate">{displayCategoryName}</span>
                            <FiCheckCircle className="text-brand-primary shrink-0 w-5 h-5" aria-hidden />
                        </h1>
                        <p className="text-xs md:text-sm text-gray-500 font-medium mt-0.5">
                            {isLoading
                                ? "Loading products…"
                                : `${totalCount} product${totalCount === 1 ? "" : "s"}`}
                        </p>
                    </div>
                </div>

                {showStrip && (
                    <CategoryBrandNav
                        brandsList={brandsList}
                        selectedBrands={selectedBrands}
                        onSelectBrand={onSelectBrand}
                        subCategories={subCategories}
                        categorySlug={categorySlug}
                        activeSubcategory={activeSubcategory}
                    />
                )}
            </div>
        </div>
    );
}
