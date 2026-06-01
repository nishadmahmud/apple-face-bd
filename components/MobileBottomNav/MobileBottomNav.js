"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiShoppingCart, FiUser, FiZap, FiLayers, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import { useWishlist } from '../../context/WishlistContext';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount, openCart } = useCart();
    const { user, openAuthModal } = useAuth();
    const { compareCount } = useCompare();
    const { wishlistCount } = useWishlist();

    const navItems = [
        { name: 'Home', href: '/', icon: FiHome },
        { name: 'Compare', href: '/compare', icon: FiLayers, isCompare: true },
        { name: 'Offers', href: '/special-offers', icon: FiZap, isSpecialOffers: true },
        { name: 'Wishlist', href: '/wishlist', icon: FiHeart, isWishlist: true },
        { name: 'Cart', href: '#', icon: FiShoppingCart, isCartToggle: true },
        { name: user ? 'Profile' : 'Login', href: '/profile', icon: FiUser, isAuth: true },
    ];

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 bg-[#2D2D2D] shadow-2xl rounded-full z-[90] border border-white/10 pb-safe">
            <div className="flex justify-around items-center px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    const isCartItem = item.isCartToggle;
                    const isCompareItem = item.isCompare;
                    const isWishlistItem = item.isWishlist;
                    const isAuthItem = item.isAuth;
                    const isSpecialOffers = item.isSpecialOffers;

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
                                        openAuthModal('login');
                                    }
                                }
                            }}
                            className={`flex flex-col items-center justify-center w-full gap-1 transition-colors ${isActive ? 'text-brand-primary' : 'text-gray-400 hover:text-white'}`}
                        >
                            <div className="relative">
                                {isAuthItem && user?.image ? (
                                    <div className={`w-6 h-6 rounded-full overflow-hidden ring-2 ${isActive ? 'ring-brand-primary' : 'ring-gray-600'}`}>
                                        <Image src={user.image} alt="Profile" width={24} height={24} className="w-full h-full object-cover" unoptimized />
                                    </div>
                                ) : isAuthItem && user ? (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ${isActive ? 'bg-brand-primary text-white ring-brand-primary' : 'bg-gray-700 text-gray-300 ring-gray-600'}`}>
                                        {(user.first_name || user.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <>
                                        <Icon
                                            size={20}
                                            className={isCartItem && cartCount > 0 && !isActive ? 'text-[#ff2a3b]' : ''}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                        {isCompareItem && compareCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                                                {compareCount}
                                            </span>
                                        )}
                                        {isWishlistItem && wishlistCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                                                {wishlistCount}
                                            </span>
                                        )}
                                        {isCartItem && cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-[#ff2a3b] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                                                {cartCount}
                                            </span>
                                        )}
                                        {isSpecialOffers && (
                                            <span className="absolute -top-2 -right-3 text-[8px] font-black text-white bg-[#ff2a3b] px-1.5 py-0.5 rounded-full animate-pulse">
                                                HOT
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <span className={`text-[10px] font-semibold tracking-wide ${isSpecialOffers ? 'animate-pulse text-[#ff2a3b]' : ''}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
