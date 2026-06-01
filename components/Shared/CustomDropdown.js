"use client";

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function CustomDropdown({ options, value, onChange, placeholder = "Select an option", className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options.find(opt => opt.label === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white border border-gray-200 text-gray-700 py-2 md:py-2.5 pl-3 md:pl-4 pr-3 md:pr-4 rounded-lg focus:outline-none focus:border-brand-purple text-xs md:text-sm transition-colors shadow-sm"
            >
                <span className="truncate">{displayValue}</span>
                <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden flex flex-col max-h-60 overflow-y-auto">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                onChange(option.value || option.label);
                                setIsOpen(false);
                            }}
                            className={`text-left px-4 py-2.5 text-xs md:text-sm hover:bg-purple-50 hover:text-brand-purple transition-colors ${(value === option.value || value === option.label) ? 'bg-purple-50 text-brand-purple font-semibold' : 'text-gray-700'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
