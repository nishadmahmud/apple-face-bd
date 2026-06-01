"use client";

import { FiX } from "react-icons/fi";
import CategoryFilterPanel from "./CategoryFilterPanel";
import { resetCategoryFilters } from "../../lib/categoryFilters";

export default function CategoryFilterSidebar({
    isOpen,
    onClose,
    variant = "drawer",
    derivedFilters,
    regionFilterGroups,
    globalMinPrice,
    globalMaxPrice,
    selectedBrands,
    setSelectedBrands,
    selectedPrice,
    setSelectedPrice,
    selectedStorage,
    setSelectedStorage,
    selectedRegion,
    setSelectedRegion,
    selectedColor,
    setSelectedColor,
    selectedAvailability,
    setSelectedAvailability,
}) {
    const handleReset = () => {
        resetCategoryFilters({
            setSelectedBrands,
            setSelectedPrice,
            setSelectedStorage,
            setSelectedRegion,
            setSelectedColor,
            setSelectedAvailability,
        });
    };

    const panelProps = {
        derivedFilters,
        regionFilterGroups,
        globalMinPrice,
        globalMaxPrice,
        selectedBrands,
        setSelectedBrands,
        selectedPrice,
        setSelectedPrice,
        selectedStorage,
        setSelectedStorage,
        selectedRegion,
        setSelectedRegion,
        selectedColor,
        setSelectedColor,
        selectedAvailability,
        setSelectedAvailability,
    };

    const isDrawer = variant === "drawer";

    return (
        <>
            {isDrawer && (
                <div
                    className={`fixed inset-0 bg-black/50 z-[65] lg:hidden transition-opacity duration-300 ${
                        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={
                    isDrawer
                        ? `fixed inset-y-0 left-0 z-[70] w-[min(100vw,300px)] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
                              isOpen ? "translate-x-0" : "-translate-x-full"
                          }`
                        : "hidden lg:flex lg:flex-col lg:w-full lg:sticky lg:top-[calc(var(--header-offset-md,76px)+1rem)] lg:self-start lg:max-h-[calc(100vh-var(--header-offset-md,76px)-2rem)]"
                }
            >
                <div
                    className={`flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden ${
                        isDrawer ? "h-full" : "shadow-sm"
                    }`}
                >
                    <div className="flex items-center justify-between p-4 bg-[#0a0a0a] shrink-0">
                        <span className="font-bold text-white">Filters</span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-[11px] font-semibold bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                Reset
                            </button>
                            {isDrawer && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-1.5 text-white hover:bg-white/10 rounded-lg"
                                    aria-label="Close filters"
                                >
                                    <FiX size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-4 flex-1 lg:max-h-[calc(100vh-12rem)] overflow-y-auto filter-panel-scroll overscroll-contain">
                        <CategoryFilterPanel {...panelProps} />
                    </div>

                    {isDrawer && (
                        <div className="p-4 border-t border-gray-100 shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-3 bg-brand-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                            >
                                Show Results
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
