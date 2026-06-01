"use client";

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck, FiX, FiFilter } from 'react-icons/fi';

function PopoverMenu({ id, isOpen, onToggle, label, isActive, alignRight = false, children }) {
    const popoverRef = useRef(null);
    const buttonRef = useRef(null);
    const [mobileMenuPos, setMobileMenuPos] = useState(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onToggle(null);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onToggle]);

    useEffect(() => {
        if (!isOpen || !buttonRef.current) {
            setMobileMenuPos(null);
            return;
        }

        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        if (!isMobile) {
            setMobileMenuPos(null);
            return;
        }

        const updatePosition = () => {
            const rect = buttonRef.current.getBoundingClientRect();
            setMobileMenuPos({
                top: rect.bottom + 8,
                left: alignRight ? undefined : Math.max(12, rect.left),
                right: alignRight ? Math.max(12, window.innerWidth - rect.right) : undefined
            });
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen, alignRight]);

    return (
        <div className="relative shrink-0" ref={popoverRef}>
            <button
                ref={buttonRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={(e) => { e.preventDefault(); onToggle(isOpen ? null : id); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer select-none shadow-sm hover:shadow-md active:scale-[0.98] ${
                    isActive 
                        ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/25' 
                        : isOpen 
                            ? 'bg-gray-50 text-gray-900 border-gray-300 ring-2 ring-gray-200/80'
                            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
            >
                {label}
                <FiChevronDown
                    size={16}
                    className={`shrink-0 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-[80] md:hidden bg-transparent"
                        aria-label="Close filter menu"
                        onClick={() => onToggle(null)}
                    />
                    <div
                        className={`bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-4 min-w-[240px] max-w-[min(100vw-24px,320px)] z-[90] ${
                            mobileMenuPos ? 'fixed' : `absolute top-full mt-2 ${alignRight ? 'right-0' : 'left-0'}`
                        }`}
                        style={
                            mobileMenuPos
                                ? {
                                      top: mobileMenuPos.top,
                                      left: mobileMenuPos.left,
                                      right: mobileMenuPos.right
                                  }
                                : undefined
                        }
                    >
                        {children}
                    </div>
                </>
            )}
        </div>
    );
}

function RegionCheckbox({ value, label, selectedRegion, setSelectedRegion, onToggle }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group p-1 hover:bg-gray-50 rounded pl-2">
            <input
                type="checkbox"
                checked={selectedRegion.includes(value)}
                onChange={() => {
                    if (selectedRegion.includes(value)) {
                        setSelectedRegion(selectedRegion.filter((item) => item !== value));
                    } else {
                        setSelectedRegion([...selectedRegion, value]);
                    }
                    onToggle?.();
                }}
                className="h-4 w-4 border border-gray-300 rounded text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
    );
}

export default function CategoryTopFilters({
    derivedFilters = { brandsList: [], storageList: [], regionList: [], colorList: [] },
    regionFilterGroups = { enabled: false, groups: [] },
    globalMinPrice = 0,
    globalMaxPrice = 1000000,
    selectedBrands = ['All'],
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
    setSelectedAvailability
}) {
    const [openPopover, setOpenPopover] = useState(null);

    const handleCheckboxChange = (value, list, setList) => {
        if (list.includes(value)) {
            setList(list.filter(item => item !== value));
        } else {
            setList([...list, value]);
        }
    };

    const handleReset = () => {
        setSelectedBrands(['All']);
        setSelectedPrice({ min: '', max: '' });
        setSelectedStorage([]);
        setSelectedRegion([]);
        setSelectedColor([]);
        setSelectedAvailability('All');
        setOpenPopover(null);
    };

    const countActiveFilters = () => {
        let count = 0;
        if (selectedBrands.length > 0 && selectedBrands[0] !== 'All') count += selectedBrands.length;
        if (selectedPrice.min !== '' || selectedPrice.max !== '') count += 1;
        count += selectedStorage.length;
        count += selectedRegion.length;
        count += selectedColor.length;
        if (selectedAvailability !== 'All') count += 1;
        return count;
    };

    const { brandsList, storageList, regionList, colorList } = derivedFilters;

    return (
        <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-end gap-2 w-max min-w-full md:w-auto md:min-w-0 lg:-mt-1 relative z-30">
            
            {/* Reset Button (only shown if filters are active) */}
            {countActiveFilters() > 0 && (
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 hover:text-gray-900 transition-all flex-shrink-0 cursor-pointer select-none shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                    <FiX size={14} />
                    Reset
                </button>
            )}

            {/* Brands (if available and not just "All") */}
            {brandsList.length > 1 && (
                <PopoverMenu 
                    id="brand"
                    label={`Brand${selectedBrands[0] !== 'All' ? ` (${selectedBrands[0]})` : ''}`} 
                    isActive={selectedBrands[0] !== 'All'}
                    isOpen={openPopover === 'brand'} 
                    onToggle={setOpenPopover}
                >
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {brandsList.map(brand => (
                            <label key={brand} className="flex items-center gap-3 cursor-pointer group p-1">
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={selectedBrands[0] === brand || (selectedBrands.length === 0 && brand === 'All')}
                                    onChange={() => {
                                        setSelectedBrands([brand]);
                                        setOpenPopover(null);
                                    }}
                                    className="h-4 w-4 border border-gray-300 rounded-full text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-brand-primary">
                                    {brand === 'All' ? 'All Products' : brand}
                                </span>
                            </label>
                        ))}
                    </div>
                </PopoverMenu>
            )}

            {/* Storage */}
            {storageList && storageList.length > 0 && (
                <PopoverMenu 
                    id="storage"
                    label={`Storage${selectedStorage.length > 0 ? ` (${selectedStorage.length})` : ''}`} 
                    isActive={selectedStorage.length > 0}
                    isOpen={openPopover === 'storage'} 
                    onToggle={setOpenPopover}
                >
                    <div className="space-y-2 max-h-60 overflow-y-auto min-w-[200px]">
                        {storageList.map(storage => (
                            <label key={storage} className="flex items-center gap-3 cursor-pointer group p-1 hover:bg-gray-50 rounded">
                                <input
                                    type="checkbox"
                                    checked={selectedStorage.includes(storage)}
                                    onChange={() => handleCheckboxChange(storage, selectedStorage, setSelectedStorage)}
                                    className="h-4 w-4 border border-gray-300 rounded text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm font-medium text-gray-700">{storage}</span>
                            </label>
                        ))}
                    </div>
                </PopoverMenu>
            )}

            {/* Region — grouped for Phones / Used Phones */}
            {regionFilterGroups?.enabled && regionFilterGroups.groups?.length > 0 ? (
                <PopoverMenu
                    id="region"
                    label={`Region${selectedRegion.length > 0 ? ` (${selectedRegion.length})` : ''}`}
                    isActive={selectedRegion.length > 0}
                    isOpen={openPopover === 'region'}
                    onToggle={setOpenPopover}
                    alignRight={true}
                >
                    <div className="space-y-3 max-h-[320px] overflow-y-auto min-w-[220px] pr-1">
                        {regionFilterGroups.groups.map((group) => (
                            <div key={group.id}>
                                <p className="text-[11px] font-extrabold uppercase tracking-wide text-gray-500 px-1 mb-1.5">
                                    {group.title}
                                </p>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => (
                                        <RegionCheckbox
                                            key={item.filterKey || `${group.id}-${item.value}`}
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
                </PopoverMenu>
            ) : regionList && regionList.length > 0 ? (
                <PopoverMenu
                    id="region"
                    label={`Region${selectedRegion.length > 0 ? ` (${selectedRegion.length})` : ''}`}
                    isActive={selectedRegion.length > 0}
                    isOpen={openPopover === 'region'}
                    onToggle={setOpenPopover}
                    alignRight={true}
                >
                    <div className="space-y-2 max-h-60 overflow-y-auto min-w-[200px]">
                        {regionList.map((region) => (
                            <RegionCheckbox
                                key={region}
                                value={region}
                                label={region}
                                selectedRegion={selectedRegion}
                                setSelectedRegion={setSelectedRegion}
                            />
                        ))}
                    </div>
                </PopoverMenu>
            ) : null}

            {/* Colors */}
            {colorList && colorList.length > 0 && (
                <PopoverMenu 
                    id="color"
                    label={`Color${selectedColor.length > 0 ? ` (${selectedColor.length})` : ''}`} 
                    isActive={selectedColor.length > 0}
                    isOpen={openPopover === 'color'} 
                    onToggle={setOpenPopover}
                    alignRight={true}
                >
                    <div className="flex flex-wrap gap-2 w-[220px]">
                        {colorList.map(color => (
                            <button
                                key={color.name}
                                onClick={() => handleCheckboxChange(color.name, selectedColor, setSelectedColor)}
                                className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 relative flex items-center justify-center ${
                                    selectedColor.includes(color.name)
                                    ? 'ring-2 ring-brand-primary ring-offset-2 border-brand-primary scale-110'
                                    : 'border-gray-200'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            >
                                {color.hex === '#ffffff' || color.hex.toLowerCase() === '#fff' ? (
                                    <span className="absolute inset-0 rounded-full border border-gray-200"></span>
                                ) : null}
                                {selectedColor.includes(color.name) && (
                                    <FiCheck 
                                        size={14} 
                                        className={color.hex === '#ffffff' || color.hex.toLowerCase() === '#fff' ? 'text-gray-800' : 'text-white'} 
                                        style={{ mixBlendMode: 'difference' }} 
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </PopoverMenu>
            )}

            {/* Price — directly before Availability */}
            <PopoverMenu 
                id="price"
                label={`Price${selectedPrice.min || selectedPrice.max ? ' (Custom)' : ''}`} 
                isActive={selectedPrice.min !== '' || selectedPrice.max !== ''}
                isOpen={openPopover === 'price'} 
                onToggle={setOpenPopover}
                alignRight={true}
            >
                <div className="w-[280px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">৳</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder={globalMinPrice.toString()}
                                value={selectedPrice.min}
                                onChange={(e) => setSelectedPrice({ ...selectedPrice, min: e.target.value.replace(/\D/g, '') })}
                                className="w-full pl-6 pr-2 py-2 text-sm font-medium border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </div>
                        <span className="text-gray-400 font-medium">-</span>
                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">৳</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder={globalMaxPrice.toString()}
                                value={selectedPrice.max}
                                onChange={(e) => setSelectedPrice({ ...selectedPrice, max: e.target.value.replace(/\D/g, '') })}
                                className="w-full pl-6 pr-2 py-2 text-sm font-medium border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={() => setOpenPopover(null)}
                        className="w-full py-2 bg-brand-primary text-white text-sm font-bold rounded-lg hover:brightness-110 transition-all"
                    >
                        Apply Price
                    </button>
                </div>
            </PopoverMenu>

            {/* Availability */}
            <PopoverMenu 
                id="availability"
                label={`Availability${selectedAvailability !== 'All' ? ' (In Stock)' : ''}`} 
                isActive={selectedAvailability !== 'All'}
                isOpen={openPopover === 'availability'} 
                onToggle={setOpenPopover}
                alignRight={true}
            >
                <div className="space-y-2 min-w-[180px]">
                    <label className="flex items-center gap-3 cursor-pointer group p-1">
                        <input
                            type="radio"
                            name="availability"
                            checked={selectedAvailability === 'All'}
                            onChange={() => { setSelectedAvailability('All'); setOpenPopover(null); }}
                            className="h-4 w-4 border border-gray-300 rounded-full text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">All Items</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group p-1">
                        <input
                            type="radio"
                            name="availability"
                            checked={selectedAvailability === 'In Stock'}
                            onChange={() => { setSelectedAvailability('In Stock'); setOpenPopover(null); }}
                            className="h-4 w-4 border border-gray-300 rounded-full text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                    </label>
                </div>
            </PopoverMenu>

        </div>
    );
}
