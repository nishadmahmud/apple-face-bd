"use client";

import { useState } from 'react';
import { FiPlus, FiMinus, FiHelpCircle } from 'react-icons/fi';

export default function FAQ() {
    const faqs = [
        { 
            question: "What is Apple Face BD BD?", 
            answer: "Apple Face BD BD is a multi-brand tech hub and retail chain in Bangladesh that sells genuine smartphones, laptops, gadgets, and home appliances from leading global brands." 
        },
        { 
            question: "Do you sell other smartphones besides iPhone?", 
            answer: "Yes, Apple Face BD BD sells all top Android phones from brands like Samsung, Xiaomi, OnePlus, Realme, Oppo, Vivo, and more—from budget to flagship level." 
        },
        { 
            question: "Does Apple Face BD BD sell original products?", 
            answer: "Yes, Apple Face BD BD focuses on genuine, brand-new devices and checks every product to ensure authenticity before delivery." 
        },
        { 
            question: "Can I buy laptops and MacBooks from Apple Face BD BD?", 
            answer: "Apple Face BD BD is a leading laptop shop and MacBook shop in Bangladesh with models from HP, Dell, Asus, Acer, Lenovo, MSI, and Apple MacBook Air/Pro." 
        },
        { 
            question: "Does Apple Face BD BD sell home appliances?", 
            answer: "Yes, through Apple Face BD BD outlets and our website, you can buy smart TVs, refrigerators, ACs, ovens, washing machines, and many other home appliances." 
        },
        { 
            question: "Do you offer used or pre-owned devices?", 
            answer: "Apple Face BD BD has a dedicated \"Used Device\" section where you can buy pre-owned phones and gadgets that are checked before sale." 
        },
        { 
            question: "Do you offer official brand warranties?", 
            answer: "Most products at Apple Face BD BD include official brand warranty or store warranty; warranty type and duration are clearly mentioned on each product page." 
        },
        { 
            question: "Is Apple Face BD BD available both online and offline?", 
            answer: "Yes, Apple Face BD BD has an online store and multiple physical outlets in locations like Bashundhara City, Jamuna Future Park, Mirpur, and Uttara in Dhaka." 
        }
    ];

    const [openIndex, setOpenIndex] = useState(0);

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section className="bg-white py-14 md:py-24 border-b border-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    
                    {/* Left Side: Header & CTA */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32 self-start">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6">
                            <FiHelpCircle className="w-3.5 h-3.5" />
                            <span>Help Center</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1]">
                            Got <span className="text-brand-primary">Questions?</span><br />
                            We hold the <span className="underline decoration-brand-primary/30 underline-offset-4">Answers.</span>
                        </h2>
                        <p className="text-base text-gray-500 mb-8 max-w-md leading-relaxed">
                            Can't find what you're looking for? Our support team is ready to assist you with any inquiries regarding our products and services.
                        </p>
                        <div className="flex flex-col gap-4">
                            <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-brand-primary transition-all duration-300">
                                Contact Support
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Accordion */}
                    <div className="lg:w-2/3 flex flex-col gap-4">
                        {faqs.map((faq, idx) => (
                            <div 
                                key={idx} 
                                className={`group bg-white rounded-2xl transition-all duration-500 border ${openIndex === idx ? 'border-brand-primary/20 shadow-[0_8px_30px_rgb(57,178,74,0.06)]' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <button
                                    onClick={() => toggle(idx)}
                                    className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                                >
                                    <div className="flex items-center gap-4 md:gap-6 pr-4">
                                        <span className={`text-lg md:text-xl font-black transition-colors duration-300 ${openIndex === idx ? 'text-brand-primary' : 'text-gray-300'}`}>
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                        <h4 className={`text-base md:text-[17px] font-extrabold leading-tight transition-colors duration-300 ${openIndex === idx ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                            {faq.question}
                                        </h4>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === idx ? 'bg-brand-primary text-white rotate-0' : 'bg-gray-50 text-gray-400 rotate-90'}`}>
                                        {openIndex === idx ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                                    </div>
                                </button>
                                <div 
                                    className={`grid transition-all duration-500 ease-in-out ${openIndex === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-5 md:px-6 pb-6 md:pb-7 flex gap-4 md:gap-6">
                                            {/* Spacer to match the index number alignment */}
                                            <div className="w-10 md:w-14 flex-shrink-0" />
                                            <p className="text-[15px] md:text-base text-gray-500 leading-relaxed max-w-2xl">
                                                {faq.answer.split(/(Apple Face BD BD)/g).map((part, i) => (
                                                    <span key={i} className={
                                                        part === "Apple Face BD BD"
                                                        ? "text-brand-primary font-bold"
                                                        : ""
                                                    }>
                                                        {part}
                                                    </span>
                                                ))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
