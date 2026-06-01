"use client";

import Image from "next/image";
import { Package, Tag, User, Search } from "lucide-react";

const QUICK_LINKS = [
    { id: "orders", label: "Orders", desc: "Check order status", icon: Package },
    { id: "tracking", label: "Track Order", desc: "Track shipments", icon: Search },
    { id: "coupons", label: "Coupons", desc: "Available discounts", icon: Tag },
    { id: "profile", label: "Profile", desc: "Edit your account", icon: User },
];

export default function ProfileOverview({ user, userName, onNavigate, onEditProfile }) {
    return (
        <>
            <div className="bg-[#0a0a0a] rounded-lg p-4 md:p-6 mb-4 md:mb-6 flex items-center gap-4 md:gap-6 border border-gray-200">
                <div className="relative shrink-0">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-brand-primary/40">
                        {user?.image ? (
                            <Image
                                src={user.image}
                                alt="Profile"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        ) : (
                            <User className="w-7 h-7 md:w-10 md:h-10 text-white/70" />
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-base md:text-xl font-bold text-white truncate">{userName}</h1>
                    <p className="text-white/70 text-xs md:text-sm truncate">
                        {user?.email || user?.mobile_number || ""}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-brand-primary/20 text-brand-primary text-[10px] md:text-xs font-bold rounded-full border border-brand-primary/30">
                        MEMBER
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onEditProfile}
                    className="px-3 py-1.5 md:px-5 md:py-2.5 bg-brand-primary text-white hover:opacity-90 rounded-lg text-xs md:text-sm font-semibold transition-opacity whitespace-nowrap shrink-0"
                >
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {QUICK_LINKS.map((card) => {
                    const Icon = card.icon;
                    return (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() => onNavigate(card.id)}
                            className="bg-white rounded-lg p-4 md:p-5 text-center border border-gray-200 hover:border-brand-primary/40 hover:shadow-sm transition-all group"
                        >
                            <div className="w-11 h-11 md:w-12 md:h-12 mx-auto mb-3 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm mb-0.5">{card.label}</h3>
                            <p className="text-[10px] md:text-xs text-gray-500">{card.desc}</p>
                        </button>
                    );
                })}
            </div>
        </>
    );
}
