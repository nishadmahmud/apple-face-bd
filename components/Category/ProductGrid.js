"use client";

import { useState } from 'react';
import { FiGrid, FiList, FiFilter, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../Shared/ProductCard';
import CustomDropdown from '../Shared/CustomDropdown';

export default function ProductGrid({
    products,
    onOpenFilter,
    categoryName = "Products",
    brandsList = ["All"],
    activeBrand = "All",
    onSelectBrand
}) {
    const [sortBy, setSortBy] = useState("Default");

    const sortOptions = [
        { label: "Default", value: "Default" },
        { label: "Price: Low to High", value: "Price: Low to High" },
        { label: "Price: High to Low", value: "Price: High to Low" },
        { label: "Newest Arrivals", value: "Newest Arrivals" },
    ];

    return (
        <div>
            {/* Top Bar: Heading, Showing text, Sort */}
            <div className="flex flex-row items-center justify-between gap-2 mb-4 md:mb-8 border-b border-gray-100 pb-2 md:pb-4 md:border-none">

                <div className="flex flex-col min-w-0 flex-1">
                    <h2 className="text-[13px] sm:text-lg md:text-2xl font-extrabold text-gray-800 capitalize leading-tight truncate">
                        Products of {categoryName}
                    </h2>
                    <span className="hidden md:block text-xs md:text-sm text-gray-500 font-medium">
                        Showing 1 to {products.length} from {products.length} Products
                    </span>
                    <span className="md:hidden text-[9px] text-gray-400 font-medium mt-0.5">
                        {products.length} items found
                    </span>
                </div>

                <div className="flex items-center flex-shrink-0">
                    {/* Sort Dropdown */}
                    <div className="w-[100px] sm:w-[130px] md:w-[160px]">
                        <CustomDropdown
                            options={sortOptions}
                            value={sortBy}
                            onChange={setSortBy}
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

        </div>
    );
}
