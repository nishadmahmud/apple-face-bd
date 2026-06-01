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
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-[90] pb-safe">
            <div className="flex justify-around items-center px-1 py-1.5">
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
                            className={`relative flex flex-col items-center justify-center w-full gap-0.5 py-1 transition-colors ${isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-primary rounded-full" />
                            )}
                            <div className="relative pt-1">
                                {isAuthItem && user?.image ? (
                                    <div className={`w-6 h-6 rounded-full overflow-hidden ring-2 ${isActive ? 'ring-brand-primary' : 'ring-gray-200'}`}>
                                        <Image src={user.image} alt="Profile" width={24} height={24} className="w-full h-full object-cover" unoptimized />
                                    </div>
                                ) : isAuthItem && user ? (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-brand-primary text-white' : 'bg-gray-900 text-white'}`}>
                                        {(user.first_name || user.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <>
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        {isCompareItem && compareCount > 0 && (
                                            <span className="absolute -top-1.5 -right-2 bg-brand-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                                {compareCount}
                                            </span>
                                        )}
                                        {isWishlistItem && wishlistCount > 0 && (
                                            <span className="absolute -top-1.5 -right-2 bg-brand-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                                {wishlistCount}
                                            </span>
                                        )}
                                        {isCartItem && cartCount > 0 && (
                                            <span className="absolute -top-1.5 -right-2 bg-brand-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                        {isSpecialOffers && (
                                            <span className="absolute -top-2 -right-3 text-[7px] font-black text-white bg-brand-primary px-1 py-0.5 rounded">
                                                HOT
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <span className={`text-[9px] font-semibold ${isSpecialOffers && !isActive ? 'text-brand-primary' : ''}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
