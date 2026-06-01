"use client";

import { useState } from 'react';

export default function RepairPricing() {
    const [activeDevice, setActiveDevice] = useState('Smartphones');

    const devices = ['Smartphones', 'Laptops', 'Tablets'];

    const pricingData = {
        'Smartphones': [
            { model: "Premium Screen Replacement", main: "6,500", sub1: "1,500", sub2: "5,000" },
            { battery: "Standard Screen Replacement", main: "3,500", sub1: "1,000", sub2: "2,500" },
            { model: "Battery Replacement", main: "2,500", sub1: "500", sub2: "2,000" },
            { model: "Charging Port Repair", main: "1,800", sub1: "800", sub2: "1,000" },
            { model: "Camera Lens Replacement", main: "1,200", sub1: "400", sub2: "800" },
        ],
        'Laptops': [
            { model: "Screen Replacement", main: "8,500", sub1: "1,500", sub2: "7,000" },
            { model: "Battery Replacement", main: "4,500", sub1: "500", sub2: "4,000" },
            { model: "Keyboard Replacement", main: "3,500", sub1: "1,000", sub2: "2,500" },
            { model: "Motherboard Repair (Level 3)", main: "5,000", sub1: "5,000", sub2: "—" },
        ],
        'Tablets': [
            { model: "Glass & Digitizer", main: "4,500", sub1: "1,500", sub2: "3,000" },
            { model: "Battery Replacement", main: "3,500", sub1: "1,000", sub2: "2,500" },
            { model: "Logic Board Repair", main: "4,000", sub1: "4,000", sub2: "—" },
            { model: "Power Button Repair", main: "1,200", sub1: "800", sub2: "400" },
        ]
    };

    const activePricing = pricingData[activeDevice];

    return (
        <section className="bg-gray-50 py-16 md:py-28 border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="text-center mb-12 md:mb-20">
                    <span className="text-brand-purple uppercase tracking-[0.2em] text-xs font-bold mb-4 block">Transparent Service</span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Service <span className="text-gray-400 font-light italic">Menu</span>
                    </h2>
                </div>

                {/* Elegant Tabs */}
                <div className="flex justify-center mb-12 md:mb-16">
                    <div className="flex gap-2">
                        {devices.map((device) => (
                            <button
                                key={device}
                                onClick={() => setActiveDevice(device)}
                                className={`px-6 py-2 md:py-3 text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 border-b-2 ${activeDevice === device
                                    ? 'border-brand-purple text-gray-900'
                                    : 'border-transparent text-gray-400 hover:text-gray-900'
                                    }`}
                            >
                                {device}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editorial Pricing Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6">
                    {activePricing.map((item, idx) => (
                        <div key={idx} className="flex flex-col py-4 border-b border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">{item.model}</h3>
                                <div className="flex-grow border-b border-dotted border-gray-300 mx-4 mb-2"></div>
                                <span className="text-brand-purple font-bold text-lg md:text-xl">৳{item.main} <span className="text-[10px] md:text-xs text-gray-400 font-normal ml-1">Installation</span></span>
                            </div>

                            <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500 font-medium tracking-wide">
                                <span>Servicing: <span className="text-gray-900">৳{item.sub1}</span></span>
                                {item.sub2 !== "—" && (
                                    <>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>Part Replacement (Avg): <span className="text-gray-900">৳{item.sub2}</span></span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 md:mt-20 text-center">
                    <p className="text-[10px] md:text-sm text-gray-500 italic">
                        All repairs include premium parts, labor, and a 3-month comprehensive warranty guarantee.
                    </p>
                </div>
            </div>
        </section>
    );
}
