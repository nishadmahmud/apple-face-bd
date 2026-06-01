"use client";

import { FiFilter } from "react-icons/fi";

export default function CategoryFilterBar({ activeFilterCount, onOpenFilters }) {
    return (
        <div className="lg:hidden sticky top-[var(--header-offset-md,76px)] z-30 -mx-4 px-4 py-2 bg-card-bg/95 backdrop-blur-sm border-b border-gray-200 mb-4">
            <button
                type="button"
                onClick={onOpenFilters}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 hover:border-brand-primary/40 transition-colors"
            >
                <FiFilter size={16} className="text-brand-primary" />
                Filters
                {activeFilterCount > 0 && (
                    <span className="ml-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
                        {activeFilterCount}
                    </span>
                )}
            </button>
        </div>
    );
}
