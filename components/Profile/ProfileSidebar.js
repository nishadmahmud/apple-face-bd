"use client";

import Link from "next/link";
import { Home, Package, Tag, User, LogOut, Search, X } from "lucide-react";

export const PROFILE_NAV_ITEMS = [
    { id: "dashboard", label: "Overview", icon: Home },
    { id: "orders", label: "My Orders", icon: Package, group: "Orders" },
    { id: "tracking", label: "Track Order", icon: Search },
    { id: "coupons", label: "Coupons", icon: Tag, group: "Credits" },
    { id: "profile", label: "Profile", icon: User, group: "Account" },
];

export default function ProfileSidebar({
    activeSection,
    sidebarOpen,
    onClose,
    onNavigate,
    onLogout,
}) {
    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[65] lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            <aside
                className={`fixed lg:static top-0 left-0 w-72 bg-white z-[70] lg:z-auto transform lg:transform-none transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                } lg:block shrink-0 h-screen lg:h-auto`}
            >
                <div className="bg-white lg:rounded-lg border border-gray-200 lg:shadow-sm lg:sticky lg:top-24 h-full lg:h-auto flex flex-col overflow-hidden">
                    <div className="lg:hidden flex items-center justify-between p-4 bg-[#0a0a0a] text-white shrink-0">
                        <span className="font-bold">Menu</span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-4 bg-[#0a0a0a] hidden lg:block shrink-0">
                        <Link href="/" className="flex items-center">
                            <span className="text-lg font-extrabold text-white">Apple Face</span>
                        </Link>
                    </div>
                    <nav className="p-3 flex-1 overflow-y-auto pb-20 lg:pb-4 bg-card-bg">
                        {(() => {
                            let lastGroup = null;
                            return PROFILE_NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const showGroup = item.group && item.group !== lastGroup;
                                if (item.group) lastGroup = item.group;
                                const isActive = activeSection === item.id;
                                return (
                                    <div key={item.id}>
                                        {showGroup && (
                                            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-5">
                                                {item.group}
                                            </p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => onNavigate(item.id)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-3 mb-1 ${
                                                isActive
                                                    ? "bg-brand-primary text-white shadow-sm"
                                                    : "text-gray-700 hover:bg-white hover:border hover:border-gray-200"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4 shrink-0" />
                                            {item.label}
                                        </button>
                                    </div>
                                );
                            });
                        })()}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onLogout}
                                className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all flex items-center gap-3"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}
