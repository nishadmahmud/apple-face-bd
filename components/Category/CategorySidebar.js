"use client";

import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

export default function CategorySidebar({
    isOpen,
    onClose,
    derivedFilters = { storageList: [], regionList: [], colorList: [] },
    globalMinPrice = 0,
    globalMaxPrice = 1000000,
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
    const [expandedSections, setExpandedSections] = useState({
        price: true,
        storage: true,
        region: true,
        color: true,
        availability: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleCheckboxChange = (value, list, setList) => {
        if (list.includes(value)) {
            setList(list.filter(item => item !== value));
        } else {
            setList([...list, value]);
        }
    };

    const handleReset = () => {
        setSelectedPrice({ min: '', max: '' });
        setSelectedStorage([]);
        setSelectedRegion([]);
        setSelectedColor([]);
        setSelectedAvailability('All');
    };

    const { storageList, regionList, colorList } = derivedFilters;

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside className={`
        fixed inset-y-0 left-0 lg:left-0 z-50 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-full lg:shadow-none lg:border lg:border-gray-200 lg:rounded-xl lg:p-5 lg:bg-white flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 lg:p-0 lg:pb-5 border-b border-gray-100 mb-5">
                    <span className="font-bold text-lg text-brand-purple">
                        Filters
                    </span>
                    <button onClick={handleReset} className="text-[11px] font-semibold bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700">
                        Reset
                    </button>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-full ml-2">
                        <FiX size={20} />
                    </button>
                </div>

                <div className="p-5 lg:p-0 space-y-6 overflow-y-auto h-full lg:h-auto pb-20 lg:pb-0 flex-grow">

                    {/* Price Range */}
                    <div className="border-b border-gray-100 pb-6">
                        <button
                            onClick={() => toggleSection('price')}
                            className="flex items-center justify-between w-full text-left font-bold text-brand-purple mb-4 uppercase text-sm tracking-wider"
                        >
                            <span>Price Range</span>
                            {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {expandedSections.price && (() => {
                            const range = Math.max(globalMaxPrice - globalMinPrice, 1);
                            const minVal = Number(selectedPrice.min || globalMinPrice);
                            const maxVal = Number(selectedPrice.max || globalMaxPrice);

                            const leftPct = Math.max(0, Math.min(100, ((minVal - globalMinPrice) / range) * 100));
                            const rightPct = Math.max(0, Math.min(100, 100 - ((maxVal - globalMinPrice) / range) * 100));

                            return (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-full">
                                            <input
                                                type="number"
                                                placeholder={globalMinPrice.toString()}
                                                value={selectedPrice.min}
                                                onChange={(e) => setSelectedPrice({ ...selectedPrice, min: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-purple"
                                            />
                                        </div>
                                        <span className="text-gray-400 font-medium">-</span>
                                        <div className="relative w-full">
                                            <input
                                                type="number"
                                                placeholder={globalMaxPrice.toString()}
                                                value={selectedPrice.max}
                                                onChange={(e) => setSelectedPrice({ ...selectedPrice, max: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-purple"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative h-2 bg-gray-200 rounded-full mt-6 mx-2">
                                        <div
                                            className="absolute h-full bg-brand-purple rounded-full"
                                            style={{
                                                left: `${leftPct}%`,
                                                right: `${rightPct}%`
                                            }}
                                        />

                                        <input
                                            type="range"
                                            min={globalMinPrice}
                                            max={globalMaxPrice}
                                            value={minVal}
                                            onChange={(e) => {
                                                const val = Math.min(Number(e.target.value), maxVal - 1);
                                                setSelectedPrice(prev => ({ ...prev, min: val }));
                                            }}
                                            className="absolute w-full -top-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-purple [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-purple [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 z-10"
                                        />

                                        <input
                                            type="range"
                                            min={globalMinPrice}
                                            max={globalMaxPrice}
                                            value={maxVal}
                                            onChange={(e) => {
                                                const val = Math.max(Number(e.target.value), minVal + 1);
                                                setSelectedPrice(prev => ({ ...prev, max: val }));
                                            }}
                                            className="absolute w-full -top-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-purple [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-purple [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 z-20"
                                        />
                                    </div>
                                    <div className="h-2"></div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Storage */}
                    {storageList.length > 0 && (
                        <div className="border-b border-gray-100 pb-6">
                            <button
                                onClick={() => toggleSection('storage')}
                                className="flex items-center justify-between w-full text-left font-bold text-brand-purple mb-4 uppercase text-sm tracking-wider"
                            >
                                <span>Storage</span>
                                {expandedSections.storage ? <FiChevronUp /> : <FiChevronDown />}
                            </button>

                            {expandedSections.storage && (
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                    {storageList.map(storage => (
                                        <label key={storage} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStorage.includes(storage)}
                                                    onChange={() => handleCheckboxChange(storage, selectedStorage, setSelectedStorage)}
                                                    className="peer h-4 w-4 border border-gray-300 rounded text-brand-purple focus:ring-brand-purple"
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 group-hover:text-brand-purple transition-colors">{storage}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Region */}
                    {regionList.length > 0 && (
                        <div className="border-b border-gray-100 pb-6">
                            <button
                                onClick={() => toggleSection('region')}
                                className="flex items-center justify-between w-full text-left font-bold text-brand-purple mb-4 uppercase text-sm tracking-wider"
                            >
                                <span>Region</span>
                                {expandedSections.region ? <FiChevronUp /> : <FiChevronDown />}
                            </button>

                            {expandedSections.region && (
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                    {regionList.map(region => (
                                        <label key={region} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRegion.includes(region)}
                                                    onChange={() => handleCheckboxChange(region, selectedRegion, setSelectedRegion)}
                                                    className="peer h-4 w-4 border border-gray-300 rounded text-brand-purple focus:ring-brand-purple"
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 group-hover:text-brand-purple transition-colors">{region}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Colors */}
                    {colorList.length > 0 && (
                        <div className="border-b border-gray-100 pb-6">
                            <button
                                onClick={() => toggleSection('color')}
                                className="flex items-center justify-between w-full text-left font-bold text-brand-purple mb-4 uppercase text-sm tracking-wider"
                            >
                                <span>Color</span>
                                {expandedSections.color ? <FiChevronUp /> : <FiChevronDown />}
                            </button>

                            {expandedSections.color && (
                                <div className="flex flex-wrap gap-3">
                                    {colorList.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => handleCheckboxChange(color.name, selectedColor, setSelectedColor)}
                                            className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 relative ${selectedColor.includes(color.name)
                                                ? 'ring-2 ring-brand-purple ring-offset-2 border-brand-purple'
                                                : 'border-gray-200'
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {color.hex === '#ffffff' || color.hex.toLowerCase() === '#fff' ? (
                                                <span className="absolute inset-0 rounded-full border border-gray-200"></span>
                                            ) : null}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Availability */}
                    <div className="pb-6">
                        <button
                            onClick={() => toggleSection('availability')}
                            className="flex items-center justify-between w-full text-left font-bold text-brand-purple mb-4 uppercase text-sm tracking-wider"
                        >
                            <span>Availability</span>
                            {expandedSections.availability ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {expandedSections.availability && (
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="availability"
                                        checked={selectedAvailability === 'All'}
                                        onChange={() => setSelectedAvailability('All')}
                                        className="h-4 w-4 border border-gray-300 rounded-full text-brand-purple focus:ring-brand-purple"
                                    />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-brand-purple">All</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="availability"
                                        checked={selectedAvailability === 'In Stock'}
                                        onChange={() => setSelectedAvailability('In Stock')}
                                        className="h-4 w-4 border border-gray-300 rounded-full text-brand-purple focus:ring-brand-purple"
                                    />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-brand-purple">In Stock</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Footer Actions */}
                <div className="lg:hidden p-4 border-t border-gray-100 bg-white flex gap-3 mt-auto">
                    <button onClick={handleReset} className="flex-1 py-3 border border-gray-200 rounded-xl text-brand-purple font-bold text-sm">
                        Reset
                    </button>
                    <button onClick={onClose} className="flex-1 py-3 bg-brand-purple text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-purple/20">
                        Apply Filters
                    </button>
                </div>
            </aside>
        </>
    );
}
