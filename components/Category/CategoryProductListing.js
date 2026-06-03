"use client";

import { Package } from "lucide-react";
import ProductCard from "../Shared/ProductCard";
import CustomDropdown from "../Shared/CustomDropdown";
import EmptyState from "../Shared/EmptyState";
import LoadingSpinner from "../Shared/LoadingSpinner";
import CategoryPagination from "./CategoryPagination";

const SORT_OPTIONS = [
    { label: "Default", value: "Default" },
    { label: "Price: Low to High", value: "Price: Low to High" },
    { label: "Price: High to Low", value: "Price: High to Low" },
];

export default function CategoryProductListing({
    products,
    totalCount,
    isLoading,
    sortBy,
    onSortChange,
    onClearFilters,
    totalPages,
    currentPage,
    categorySlug,
    subcatSlug,
    subcatId,
}) {
    return (
        <div>
            <div className="flex flex-row items-center justify-between gap-3 mb-4 md:mb-6 pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600 font-medium">
                    {isLoading ? (
                        "Loading…"
                    ) : (
                        <>
                            <span className="font-bold text-gray-900">{totalCount}</span> product
                            {totalCount === 1 ? "" : "s"}
                            {totalPages > 1 && (
                                <span className="text-gray-400 font-normal">
                                    {" "}
                                    · page {currentPage} of {totalPages}
                                </span>
                            )}
                        </>
                    )}
                </p>
                <div className="w-[130px] md:w-[160px] shrink-0">
                    <CustomDropdown
                        options={SORT_OPTIONS}
                        value={sortBy}
                        onChange={onSortChange}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card-bg rounded-lg border border-gray-200 border-dashed">
                    <LoadingSpinner size="md" label="Loading products…" />
                </div>
            ) : products.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-5">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <CategoryPagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        categorySlug={categorySlug}
                        subcatSlug={subcatSlug}
                        subcatId={subcatId}
                    />
                </>
            ) : (
                <EmptyState
                    icon={Package}
                    title="No products found"
                    description="Try adjusting your filters or browse another category."
                    onAction={onClearFilters}
                    actionLabel="Clear filters"
                />
            )}
        </div>
    );
}
