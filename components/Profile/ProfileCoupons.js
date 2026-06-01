"use client";

import { Tag } from "lucide-react";
import EmptyState from "../Shared/EmptyState";

export default function ProfileCoupons({ coupons, couponsLoading }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 bg-brand-primary rounded-t-lg">
                <h2 className="text-xl md:text-2xl font-bold text-white">My Coupons</h2>
                <p className="text-white/70 text-sm mt-1">Your available discount codes</p>
            </div>
            <div className="p-5 md:p-6">
                {couponsLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary" />
                    </div>
                ) : coupons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {coupons.map((coupon, i) => (
                            <div
                                key={i}
                                className="border border-dashed border-brand-primary/40 rounded-lg p-4 bg-brand-primary/5 hover:border-brand-primary/60 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2 gap-2">
                                    <span className="px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-full">
                                        {coupon.coupon_code || coupon.code}
                                    </span>
                                    <span className="text-lg font-extrabold text-brand-primary">
                                        {coupon.discount_type === "percentage"
                                            ? `${coupon.discount}%`
                                            : `৳${coupon.discount}`}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {coupon.description || "Use this code at checkout"}
                                </p>
                                {coupon.min_order && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Min order: ৳{coupon.min_order}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Tag}
                        title="No coupons yet"
                        description="Collected coupons will appear here."
                        actionHref="/"
                        actionLabel="Browse Products"
                    />
                )}
            </div>
        </div>
    );
}
