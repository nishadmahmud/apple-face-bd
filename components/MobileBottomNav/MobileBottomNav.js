"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiShoppingCart, FiUser, FiZap, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getLoginUrl } from '../../lib/authRoutes';
import { useWishlist } from '../../context/WishlistContext';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount, openCart } = useCart();
    const { user } = useAuth();
    const { wishlistCount } = useWishlist();

    const navItems = [
        { name: 'Offers', href: '/special-offers', icon: FiZap, isSpecialOffers: true },
        { name: 'Cart', href: '#', icon: FiShoppingCart, isCartToggle: true },
        { name: 'Home', href: '/', icon: FiHome, isCenter: true },
        { name: 'Wishlist', href: '/wishlist', icon: FiHeart, isWishlist: true },
        { name: user ? 'Profile' : 'Login', href: '/profile', icon: FiUser, isAuth: true },
    ];

    const isActivePath = (href) => {
        if (href === '/') return pathname === '/';
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[90] px-3 pb-3 pb-safe pointer-events-none">
            <nav
                className="pointer-events-auto mx-auto max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] px-1 py-1.5"
                aria-label="Mobile navigation"
            >
                <div className="grid grid-cols-5 items-end">
                    {navItems.map((item) => {
                        const isActive = isActivePath(item.href);
                        const Icon = item.icon;
                        const isCartItem = item.isCartToggle;
                        const isWishlistItem = item.isWishlist;
                        const isAuthItem = item.isAuth;
                        const isSpecialOffers = item.isSpecialOffers;
                        const isCenter = item.isCenter;

                        const sharedClass = isCenter
                            ? 'relative -mt-5 flex flex-col items-center justify-center'
                            : `relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all ${
                                  isActive
                                      ? 'bg-brand-primary/15 text-brand-primary'
                                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`;

                        const inner = (
                            <>
                                {isCenter ? (
                                    <span
                                        className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-4 ring-[#0a0a0a] transition-colors ${
                                            isActive
                                                ? 'bg-brand-primary text-white shadow-brand-primary/40'
                                                : 'bg-white text-[#0a0a0a] shadow-black/20'
                                        }`}
                                    >
                                        <Icon size={22} strokeWidth={2.2} />
                                    </span>
                                ) : isAuthItem && user?.image ? (
                                    <div
                                        className={`w-7 h-7 rounded-full overflow-hidden ring-2 ${
                                            isActive ? 'ring-brand-primary' : 'ring-white/20'
                                        }`}
                                    >
                                        <Image
                                            src={user.image}
                                            alt="Profile"
                                            width={28}
                                            height={28}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ) : isAuthItem && user ? (
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                            isActive ? 'bg-brand-primary text-white' : 'bg-white/15 text-white'
                                        }`}
                                    >
                                        {(user.first_name || user.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        {isCartItem && cartCount > 0 && (
                                            <span className="absolute -top-1.5 -right-2 bg-brand-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                        {isWishlistItem && wishlistCount > 0 && (
                                            <span className="absolute -top-1.5 -right-2 bg-brand-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                                {wishlistCount}
                                            </span>
                                        )}
                                        {isSpecialOffers && (
                                            <span className="absolute -top-2 -right-3 text-[6px] font-black text-white bg-brand-primary px-1 py-0.5 rounded">
                                                HOT
                                            </span>
                                        )}
                                    </div>
                                )}
                                <span
                                    className={`text-[9px] font-semibold leading-none mt-0.5 ${
                                        isCenter
                                            ? isActive
                                                ? 'text-brand-primary'
                                                : 'text-gray-300'
                                            : isSpecialOffers && !isActive
                                              ? 'text-brand-primary'
                                              : ''
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </>
                        );

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={(e) => {
                                    if (isCartItem) {
                                        e.preventDefault();
                                        openCart();
                                    } else if (isAuthItem) {
                                        e.preventDefault();
                                        if (user) {
                                            router.push('/profile');
                                        } else {
                                            router.push(getLoginUrl({ redirect: '/profile' }));
                                        }
                                    }
                                }}
                                className={sharedClass}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {inner}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
