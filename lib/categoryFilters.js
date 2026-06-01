export function countActiveCategoryFilters({
    selectedBrands,
    selectedPrice,
    selectedStorage,
    selectedRegion,
    selectedColor,
    selectedAvailability,
}) {
    let count = 0;
    if (selectedBrands?.length > 0 && selectedBrands[0] !== "All") count += selectedBrands.length;
    if (selectedPrice?.min !== "" || selectedPrice?.max !== "") count += 1;
    count += selectedStorage?.length || 0;
    count += selectedRegion?.length || 0;
    count += selectedColor?.length || 0;
    if (selectedAvailability !== "All") count += 1;
    return count;
}

export function resetCategoryFilters(setters) {
    const {
        setSelectedBrands,
        setSelectedPrice,
        setSelectedStorage,
        setSelectedRegion,
        setSelectedColor,
        setSelectedAvailability,
    } = setters;
    setSelectedBrands?.(["All"]);
    setSelectedPrice?.({ min: "", max: "" });
    setSelectedStorage?.([]);
    setSelectedRegion?.([]);
    setSelectedColor?.([]);
    setSelectedAvailability?.("All");
}
