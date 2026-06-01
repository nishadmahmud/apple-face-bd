"use client";

import { useState } from 'react';
import { BsTruck, BsCreditCard } from 'react-icons/bs';
import { FiCheckCircle, FiMessageCircle, FiShield, FiX } from 'react-icons/fi';
import { SITE_INFO } from '../../lib/siteInfo';

export default function ProductSidebar({ product, pricingInfo, selectedCarePlans = [], onSelectedCarePlansChange, onOpenEmiModal }) {
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);

    const fallbackPrice = Number(product?.rawPrice || product?.originalPrice || 0);
    const selectedPrice = Number(pricingInfo?.selectedPrice || fallbackPrice);
    const emiMonthlyStart = Number(pricingInfo?.emiStartFrom || Math.round(selectedPrice / 6));

    const categoryName = String(product?.category?.name || '').toLowerCase();
    const productNameLower = String(product?.name || '').toLowerCase();
    const isAdapter = productNameLower.includes('adapter');
    const isCable = productNameLower.includes('cable');
    const isLaptop = categoryName.includes('laptop') || productNameLower.includes('macbook') || productNameLower.includes('laptop');
    const isPhoneCategory = categoryName.includes('phone') || categoryName.includes('mobile');

    let carePlansToShow;
    if (isAdapter) {
        carePlansToShow = [{ id: 'warranty_adapter', name: '12 Month Instant Replacement Warranty', description: 'Instant replacement for manufacturing issues', price: 0 }];
    } else if (isCable) {
        carePlansToShow = [{ id: 'warranty_cable', name: '6 Month Instant Replacement Warranty', description: 'Instant replacement for manufacturing issues', price: 0 }];
    } else if (isLaptop) {
        carePlansToShow = [{ id: 'care_laptop', name: 'Apple Face BD Care+ 1 Year', description: 'Brand new replacement support', price: Math.round(selectedPrice * 0.05) }];
    } else if (isPhoneCategory) {
        carePlansToShow = [
            { id: 'care_phone', name: 'Apple Face BD Care+ 1 Year', description: 'Brand new replacement support', price: Math.round(selectedPrice * 0.05) },
            { id: 'screen_care', name: 'Apple Face BD Screen Care+ (730 days)', description: 'One-time display replacement (excluding physical damage)', price: Math.round(selectedPrice * 0.06) },
            { id: 'parts', name: '1 Year Parts Warranty', description: 'Coverage for key internal parts', price: Math.round(selectedPrice * 0.04) }
        ];
    } else {
        carePlansToShow = [
            { id: 'warranty_6', name: '6 Months Extended Warranty', description: 'Extended hardware coverage', price: Math.round(selectedPrice * 0.10) },
            { id: 'warranty_12', name: '12 Months Extended Warranty', description: 'Extended hardware coverage', price: Math.round(selectedPrice * 0.20) }
        ];
    }

    const toggleCarePlan = (plan) => {
        if (!onSelectedCarePlansChange) return;
        const exists = selectedCarePlans.some((p) => p.id === plan.id);
        if (exists) {
            onSelectedCarePlansChange(selectedCarePlans.filter((p) => p.id !== plan.id));
            return;
        }
        onSelectedCarePlansChange([...selectedCarePlans, plan]);
    };

    return (
        <div className="flex flex-col gap-4">
            <button
                type="button"
                onClick={() => setShowDeliveryModal(true)}
                className="bg-white border text-left border-gray-200 rounded-lg p-4 flex gap-4 items-center shadow-sm hover:border-brand-primary/30 transition-colors"
            >
                <div className="bg-blue-50 text-blue-500 p-3 rounded-full shrink-0">
                    <BsTruck size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-extrabold text-[#1a3b34]">Delivery Information</h4>
                    <p className="text-[12px] text-gray-500">Inside Dhaka and outside Dhaka timing</p>
                </div>
            </button>

            <button
                type="button"
                onClick={() => onOpenEmiModal?.()}
                className="bg-white border text-left border-gray-200 rounded-lg p-4 flex gap-4 items-center shadow-sm hover:border-brand-primary/30 transition-colors cursor-pointer w-full"
            >
                <div className="bg-red-50 text-brand-primary p-3 rounded-full shrink-0">
                    <BsCreditCard size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-extrabold text-[#1a3b34]">EMI Availability</h4>
                    <p className="text-[12px] text-gray-500">EMI starts from ৳ {emiMonthlyStart.toLocaleString('en-IN')}/month</p>
                    <p className="text-[11px] text-brand-primary mt-1 font-semibold">Click to view all EMI options</p>
                </div>
            </button>

            <a
                href={`https://wa.me/${SITE_INFO.whatsappNumberIntl}?text=${encodeURIComponent(`Hi, I want details about ${product?.name || 'this product'}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border text-left border-gray-200 rounded-lg p-4 flex gap-4 items-center shadow-sm hover:border-brand-primary/30 transition-colors"
            >
                <div className="bg-green-50 text-green-600 p-3 rounded-full shrink-0">
                    <FiMessageCircle size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-extrabold text-[#1a3b34]">WhatsApp Support</h4>
                    <p className="text-[12px] text-gray-500">{SITE_INFO.whatsappDisplay}</p>
                </div>
            </a>

            <a
                href={SITE_INFO.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border text-left border-gray-200 rounded-lg p-4 flex gap-4 items-center shadow-sm hover:border-brand-primary/30 transition-colors"
            >
                <div className="bg-blue-50 text-blue-600 p-3 rounded-full shrink-0">
                    <FiMessageCircle size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-extrabold text-[#1a3b34]">Messenger Support</h4>
                    <p className="text-[12px] text-gray-500">Chat with us on Facebook Messenger</p>
                </div>
            </a>

            {/* Apple Face BD Care+ - Commented out for now
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-black text-white px-4 py-3 flex items-center gap-2">
                    <FiShield className="text-brand-primary" size={16} />
                    <span className="font-bold text-sm">Apple Face BD Care+</span>
                </div>
                <div className="p-3 space-y-2 bg-white">
                    {carePlansToShow.map((plan) => {
                        const active = selectedCarePlans.some((p) => p.id === plan.id);
                        return (
                            <label
                                key={plan.id}
                                className={`cursor-pointer border rounded-lg p-3 flex items-start gap-2 transition-all ${active ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={() => toggleCarePlan(plan)}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{plan.name}</p>
                                        <p className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">৳ {plan.price.toLocaleString('en-IN')}</p>
                                    </div>
                                    {plan.description && <p className="text-xs text-gray-500 mt-1">{plan.description}</p>}
                                </div>
                            </label>
                        );
                    })}

                    <p className="text-[11px] text-gray-500 flex items-center gap-1 pt-1">
                        <FiCheckCircle className="text-green-600" />
                        I agree to Apple Face BD&apos;s <a href="/terms" target="_blank" className="underline hover:text-brand-primary">terms & conditions</a>
                    </p>
                </div>
            </div>
            */}

            {showDeliveryModal && (
                <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-lg border border-gray-200 shadow-2xl overflow-hidden">
                        <div className="px-4 py-3 bg-[#0a0a0a] text-white flex items-center justify-between">
                            <h3 className="text-lg font-black">Estimated Delivery</h3>
                            <button onClick={() => setShowDeliveryModal(false)} className="p-2 rounded-md hover:bg-white/10 text-white/80">
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="rounded-xl border border-gray-200 p-3">
                                <p className="text-sm font-bold text-gray-900">Inside Dhaka</p>
                                <p className="text-sm text-gray-600 mt-1">Estimated delivery: <span className="font-semibold text-gray-900">0-2 days</span></p>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-3">
                                <p className="text-sm font-bold text-gray-900">Outside Dhaka</p>
                                <p className="text-sm text-gray-600 mt-1">Estimated delivery: <span className="font-semibold text-gray-900">2-5 days</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
