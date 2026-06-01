"use client";

import { useState } from 'react';
import ProductCard from '../Shared/ProductCard';

export default function DiscountedParts() {
    const [activeTab, setActiveTab] = useState('Accessories');

    const tabs = ['Accessories', 'Components'];

    const products = {
        'Accessories': [
            { id: 1, name: "Spigen iPhone 15 Pro Case", price: "1200 TK", oldPrice: "1800", discount: "-33%", imageUrl: "https://images.unsplash.com/photo-1574226516831-e1dff420e507?q=80&w=400" },
            { id: 2, name: "UGREEN 65W GaN Fast Charger", price: "2500 TK", oldPrice: "3500", discount: "-28%", imageUrl: "https://images.unsplash.com/photo-1615526659134-4bcde6622ec9?q=80&w=400" },
            { id: 3, name: "Anker USB-C to Lightning Cable", price: "1500 TK", oldPrice: "2000", discount: "-25%", imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=400" },
            { id: 4, name: "Apple MagSafe Charger", price: "4500 TK", oldPrice: "5500", discount: "-18%", imageUrl: "https://images.unsplash.com/photo-1622323863152-7b0df020054e?q=80&w=400" },
            { id: 5, name: "Logitech Desk Mat Studio Series", price: "3000 TK", oldPrice: "4000", discount: "-25%", imageUrl: "https://images.unsplash.com/photo-1613909207039-6b173b755f85?q=80&w=400" },
            { id: 6, name: "Sony Replacement Ear Pads", price: "1800 TK", oldPrice: "2500", discount: "-28%", imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400" },
            { id: 7, name: "Baseus Magnetic Car Holder", price: "1000 TK", oldPrice: "1500", discount: "-33%", imageUrl: "https://images.unsplash.com/photo-1588620353536-41b997ccec7f?q=80&w=400" },
        ],
        'Components': [
            { id: 8, name: "Corsair Vengeance 32GB DDR5", price: "14500 TK", oldPrice: "18000", discount: "-19%", imageUrl: "https://images.unsplash.com/photo-1562976540-1502f75923ba?q=80&w=400" },
            { id: 9, name: "Samsung 980 Pro 1TB NVMe", price: "12500 TK", oldPrice: "15000", discount: "-16%", imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=400" },
            { id: 10, name: "Noctua NH-D15 CPU Cooler", price: "11500 TK", oldPrice: "13500", discount: "-14%", imageUrl: "https://images.unsplash.com/photo-1555617789-54d6fa3d9d30?q=80&w=400" },
            { id: 11, name: "Corsair RM850x Power Supply", price: "16500 TK", oldPrice: "20000", discount: "-17%", imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400" },
            { id: 12, name: "Thermal Grizzly Kryonaut", price: "1200 TK", oldPrice: "1500", discount: "-20%", imageUrl: "https://images.unsplash.com/photo-1647427017045-31f0b0980753?q=80&w=400" },
            { id: 13, name: "Arctic P12 PWM Case Fan 5-Pack", price: "3500 TK", oldPrice: "4500", discount: "-22%", imageUrl: "https://images.unsplash.com/photo-1581423855523-7fa3dcf10287?q=80&w=400" },
        ]
    };

    const activeProducts = products[activeTab];

    return (
        <section className="bg-white py-8 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="text-center mb-5 md:mb-10">
                    <h2 className="text-lg md:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
                        <span className="text-brand-purple">MOST</span> DISCOUNTED
                    </h2>
                </div>

                <div className="flex justify-center border-b border-gray-200 mb-5 md:mb-10">
                    <div className="flex gap-6 md:gap-8 overflow-x-auto hide-scrollbar pb-[-1px]">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 md:pb-3 text-xs md:text-sm font-bold uppercase transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'text-brand-purple border-b-2 border-brand-purple'
                                    : 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-3 md:gap-6 pb-2 snap-x snap-mandatory flex-nowrap" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
                    {activeProducts.map((product) => (
                        <div key={product.id} className="min-w-[150px] w-[150px] md:min-w-[240px] md:w-[240px] flex-shrink-0 snap-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
