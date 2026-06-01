"use client";

import { Fragment, useState } from "react";
import { FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";

const LIST_PREVIEW_COUNT = 5;

function ShowAllToggle({ expanded, totalCount, onToggle }) {
    if (totalCount <= LIST_PREVIEW_COUNT) return null;
    return (
        <button
            type="button"
            onClick={onToggle}
            className="mt-2 text-xs font-semibold text-brand-primary hover:underline"
        >
            {expanded ? "Show less" : `Show all (${totalCount})`}
        </button>
    );
}

function FilterSection({ title, sectionOpen, onSectionToggle, children }) {
    return (
        <div className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <button
                type="button"
                onClick={onSectionToggle}
                className="flex items-center justify-between w-full text-left font-bold text-gray-900 py-1 text-xs uppercase tracking-wider"
            >
                <span>{title}</span>
                {sectionOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            </button>
            {sectionOpen ? <div className="mt-2">{children}</div> : null}
        </div>
    );
}

function CollapsibleCheckboxList({
    items,
    renderItem,
    getKey,
}) {
    const [listExpanded, setListExpanded] = useState(false);
    const hasMore = items.length > LIST_PREVIEW_COUNT;
    const visibleItems = listExpanded || !hasMore ? items : items.slice(0, LIST_PREVIEW_COUNT);

    return (
        <div>
            <div className="space-y-0.5">
                {visibleItems.map((item, index) => (
                    <Fragment key={getKey(item, index)}>{renderItem(item)}</Fragment>
                ))}
            </div>
            <ShowAllToggle
                expanded={listExpanded}
                totalCount={items.length}
                onToggle={() => setListExpanded((v) => !v)}
            />
        </div>
    );
}

function RegionCheckbox({ value, label, selectedRegion, setSelectedRegion }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer py-0.5 pr-1">
            <input
                type="checkbox"
                checked={selectedRegion.includes(value)}
                onChange={() => {
                    if (selectedRegion.includes(value)) {
                        setSelectedRegion(selectedRegion.filter((item) => item !== value));
                    } else {
                        setSelectedRegion([...selectedRegion, value]);
                    }
                }}
                className="h-3.5 w-3.5 shrink-0 border border-gray-300 rounded text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-sm font-medium text-gray-700 leading-tight">{label}</span>
        </label>
    );
}

function RegionGroupsBody({ groups, selectedRegion, setSelectedRegion }) {
    return (
        <div className="space-y-3">
            {groups.map((group) => (
                <div key={group.id}>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">
                        {group.title}
                    </p>
                    <div className="space-y-0.5">
                        {(group.items || []).map((item, itemIndex) => (
                            <RegionCheckbox
                                key={`${group.id}-${itemIndex}-${item.filterKey || item.value}`}
                                value={item.filterKey || item.value}
                                label={item.label}
                                selectedRegion={selectedRegion}
                                setSelectedRegion={setSelectedRegion}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function RegionFilterContent({ regionFilterGroups, regionList, selectedRegion, setSelectedRegion }) {
    const [listExpanded, setListExpanded] = useState(false);

    if (regionFilterGroups?.enabled && regionFilterGroups.groups?.length > 0) {
        const groups = regionFilterGroups.groups;
        const flatItems = groups.flatMap((g) =>
            (g.items || []).map((item) => ({ group: g, item }))
        );
        const hasMore = flatItems.length > LIST_PREVIEW_COUNT;

        const previewNodes = [];
        let count = 0;
        for (const group of groups) {
            if (count >= LIST_PREVIEW_COUNT) break;
            const itemsToShow = [];
            for (const item of group.items || []) {
                if (count >= LIST_PREVIEW_COUNT) break;
                itemsToShow.push(item);
                count += 1;
            }
            if (itemsToShow.length > 0) {
                previewNodes.push(
                    <div key={group.id}>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">
                            {group.title}
                        </p>
                        <div className="space-y-0.5">
                            {itemsToShow.map((item, itemIndex) => (
                                <RegionCheckbox
                                    key={`${group.id}-preview-${itemIndex}-${item.filterKey || item.value}`}
                                    value={item.filterKey || item.value}
                                    label={item.label}
                                    selectedRegion={selectedRegion}
                                    setSelectedRegion={setSelectedRegion}
                                />
                            ))}
                        </div>
                    </div>
                );
            }
        }

        return (
            <div>
                {listExpanded || !hasMore ? (
                    <RegionGroupsBody
                        groups={groups}
                        selectedRegion={selectedRegion}
                        setSelectedRegion={setSelectedRegion}
                    />
                ) : (
                    <div className="space-y-3">{previewNodes}</div>
                )}
                {hasMore && (
                    <ShowAllToggle
                        expanded={listExpanded}
                        totalCount={flatItems.length}
                        onToggle={() => setListExpanded((v) => !v)}
                    />
                )}
            </div>
        );
    }

    if (!regionList?.length) return null;

    return (
        <CollapsibleCheckboxList
            items={regionList}
            getKey={(r, index) => `${r}-${index}`}
            renderItem={(region) => (
                <RegionCheckbox
                    value={region}
                    label={region}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                />
            )}
        />
    );
}

function ColorFilterContent({ colorList, selectedColor, setSelectedColor, handleCheckboxChange }) {
    const [listExpanded, setListExpanded] = useState(false);
    const hasMore = colorList.length > LIST_PREVIEW_COUNT * 2;
    const visible = listExpanded || !hasMore ? colorList : colorList.slice(0, LIST_PREVIEW_COUNT * 2);

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                    {visible.map((color) => (
                        <button
                            key={color.name}
                            type="button"
                            onClick={() => handleCheckboxChange(color.name, selectedColor, setSelectedColor)}
                            className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 relative flex items-center justify-center shrink-0 ${
                                selectedColor.includes(color.name)
                                    ? "ring-2 ring-brand-primary ring-offset-1 border-brand-primary"
                                    : "border-gray-200"
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        >
                            {(color.hex === "#ffffff" || color.hex?.toLowerCase() === "#fff") && (
                                <span className="absolute inset-0 rounded-full border border-gray-200" />
                            )}
                            {selectedColor.includes(color.name) && (
                                <FiCheck
                                    size={14}
                                    className={
                                        color.hex === "#ffffff" || color.hex?.toLowerCase() === "#fff"
                                            ? "text-gray-800"
                                            : "text-white"
                                    }
                                />
                            )}
                        </button>
                    ))}
            </div>
            {hasMore && (
                <ShowAllToggle
                    expanded={listExpanded}
                    totalCount={colorList.length}
                    onToggle={() => setListExpanded((v) => !v)}
                />
            )}
        </div>
    );
}

export default function CategoryFilterPanel({
    derivedFilters = { brandsList: [], storageList: [], regionList: [], colorList: [] },
    regionFilterGroups = { enabled: false, groups: [] },
    globalMinPrice = 0,
    globalMaxPrice = 1000000,
    selectedBrands = ["All"],
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
    const [sectionOpen, setSectionOpen] = useState({
        price: true,
        storage: true,
        region: true,
        color: true,
        availability: true,
    });

    const toggleSection = (key) => {
        setSectionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCheckboxChange = (value, list, setList) => {
        if (list.includes(value)) {
            setList(list.filter((item) => item !== value));
        } else {
            setList([...list, value]);
        }
    };

    const { brandsList, storageList, regionList, colorList } = derivedFilters;
    const inputClass =
        "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-card-bg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary";

    return (
        <div className="space-y-3">
            {/* Price — always first */}
            <FilterSection
                title="Price"
                sectionOpen={sectionOpen.price}
                onSectionToggle={() => toggleSection("price")}
            >
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                            ৳
                        </span>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder={String(globalMinPrice)}
                            value={selectedPrice.min}
                            onChange={(e) =>
                                setSelectedPrice({
                                    ...selectedPrice,
                                    min: e.target.value.replace(/\D/g, ""),
                                })
                            }
                            className={`${inputClass} pl-7`}
                        />
                    </div>
                    <span className="text-gray-400 text-sm">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                            ৳
                        </span>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder={String(globalMaxPrice)}
                            value={selectedPrice.max}
                            onChange={(e) =>
                                setSelectedPrice({
                                    ...selectedPrice,
                                    max: e.target.value.replace(/\D/g, ""),
                                })
                            }
                            className={`${inputClass} pl-7`}
                        />
                    </div>
                </div>
            </FilterSection>

            {storageList?.length > 0 && (
                <FilterSection
                    title="Storage"
                    sectionOpen={sectionOpen.storage}
                    onSectionToggle={() => toggleSection("storage")}
                >
                    <CollapsibleCheckboxList
                        items={storageList}
                        getKey={(s, index) => `${s}-${index}`}
                        renderItem={(storage) => (
                            <label className="flex items-center gap-2.5 cursor-pointer py-0.5">
                                <input
                                    type="checkbox"
                                    checked={selectedStorage.includes(storage)}
                                    onChange={() =>
                                        handleCheckboxChange(storage, selectedStorage, setSelectedStorage)
                                    }
                                    className="h-3.5 w-3.5 border border-gray-300 rounded text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm font-medium text-gray-700">{storage}</span>
                            </label>
                        )}
                    />
                </FilterSection>
            )}

            {(regionFilterGroups?.enabled && regionFilterGroups.groups?.length > 0) ||
            regionList?.length > 0 ? (
                <FilterSection
                    title="Region"
                    sectionOpen={sectionOpen.region}
                    onSectionToggle={() => toggleSection("region")}
                >
                    <RegionFilterContent
                        regionFilterGroups={regionFilterGroups}
                        regionList={regionList}
                        selectedRegion={selectedRegion}
                        setSelectedRegion={setSelectedRegion}
                    />
                </FilterSection>
            ) : null}

            {colorList?.length > 0 && (
                <FilterSection
                    title="Color"
                    sectionOpen={sectionOpen.color}
                    onSectionToggle={() => toggleSection("color")}
                >
                    <ColorFilterContent
                        colorList={colorList}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                </FilterSection>
            )}

            <FilterSection
                title="Availability"
                sectionOpen={sectionOpen.availability}
                onSectionToggle={() => toggleSection("availability")}
            >
                <div className="space-y-1.5">
                    <label className="flex items-center gap-2.5 cursor-pointer py-0.5">
                        <input
                            type="radio"
                            name="sidebar-availability"
                            checked={selectedAvailability === "All"}
                            onChange={() => setSelectedAvailability("All")}
                            className="h-3.5 w-3.5 border border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">All Items</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer py-0.5">
                        <input
                            type="radio"
                            name="sidebar-availability"
                            checked={selectedAvailability === "In Stock"}
                            onChange={() => setSelectedAvailability("In Stock")}
                            className="h-3.5 w-3.5 border border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                    </label>
                </div>
            </FilterSection>
        </div>
    );
}
