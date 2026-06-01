"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTiktok, FaPhoneAlt, FaWhatsapp, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { SITE_INFO } from '../../lib/siteInfo';
import { getCategoriesFromServer } from '../../lib/api';

export default function Footer() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let isMounted = true;
        getCategoriesFromServer().then(res => {
            if (isMounted && res?.success && Array.isArray(res.data)) {
                setCategories(res.data.slice(0, 8));
            }
        }).catch(err => console.error("Failed to fetch footer categories", err));
        return () => { isMounted = false; };
    }, []);

    return (
        <footer className="bg-footer-bg text-gray-600 mt-auto">

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-14 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

                    {/* Column 1: Logo + Contact */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="inline-block" aria-label="Home">
                            <Image
                                src="/CELL LOGO-01~2.jpg.jpeg"
                                alt="Apple Face BD BD"
                                width={260}
                                height={65}
                                className="h-14 md:h-16 w-auto object-contain"
                                unoptimized
                            />
                        </Link>

                        <div className="flex flex-col gap-3">
                            <h3 className="text-[15px] font-bold text-gray-900">Get In Touch</h3>
                            <div className="flex items-start gap-2 text-sm">
                                <HiOutlineLocationMarker className="mt-0.5 text-brand-primary shrink-0" size={18} />
                                <span className="text-gray-500 text-[13px] leading-relaxed font-medium">
                                    {SITE_INFO.outlets?.[0]?.details?.join(', ') || 'Basement -1, Shop No 70, Bashundhara City, Panthapath, Dhaka 1215, Bangladesh'}
                                </span>
                            </div>
                            <a href={`tel:${SITE_INFO.phoneDial}`} className="inline-flex items-center gap-2 text-[14px] font-bold text-gray-700 hover:text-brand-primary transition-colors">
                                <FaPhoneAlt className="text-brand-primary shrink-0" size={14} />
                                <span>{SITE_INFO.callDisplay}</span>
                            </a>
                            <a href={`mailto:${SITE_INFO.email}`} className="inline-flex items-center gap-2 text-[13px] text-gray-700 font-medium hover:text-brand-primary transition-colors">
                                <HiOutlineMail className="text-brand-primary shrink-0" size={18} />
                                <span>{SITE_INFO.email}</span>
                            </a>
                        </div>

                        {/* Store & Feedback */}
                        <div className="flex items-center gap-3 mt-1">
                            <Link
                                href="/contact"
                                className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-full shadow-sm hover:shadow-md hover:bg-green-600 transition-all text-center"
                            >
                                Shop Location
                            </Link>
                            <Link
                                href="/contact"
                                className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all text-center"
                            >
                                Feedback
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-3 lg:pl-4">
                        <h3 className="text-[15px] font-bold text-gray-900 mb-1">Quick Links</h3>
                        <div className="flex flex-col gap-2.5 text-[13px] font-medium text-gray-500">
                            <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
                            <Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link>
                            <Link href="/blogs" className="hover:text-brand-primary transition-colors">Blog Insights</Link>
                            <Link href="/contact" className="hover:text-brand-primary transition-colors">Contact Us</Link>
                            <Link href="/track-order" className="hover:text-brand-primary transition-colors">Track My Order</Link>
                            <Link href="/special-offers" className="hover:text-brand-primary transition-colors">Special Offers</Link>
                        </div>
                    </div>

                    {/* Column 3: Dynamic Categories */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-[15px] font-bold text-gray-900 mb-1">Top Categories</h3>
                        <div className="flex flex-col gap-2.5 text-[13px] font-medium text-gray-500">
                            {categories.length > 0 ? (
                                categories.map((cat, idx) => (
                                    <Link key={`${cat.id || cat.slug || cat.name || 'cat'}-${idx}`} href={`/category/${cat.id}`} className="hover:text-brand-primary transition-colors capitalize line-clamp-1">
                                        {cat.name}
                                    </Link>
                                ))
                            ) : (
                                <div className="animate-pulse flex flex-col gap-3 mt-1">
                                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-2 w-3/4 bg-gray-200 rounded-full"></div>)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 4: Policies */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-[15px] font-bold text-gray-900 mb-1">Legal & Policies</h3>
                        <div className="flex flex-col gap-2.5 text-[13px] font-medium text-gray-500">
                            <Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
                            <Link href="/warranty" className="hover:text-brand-primary transition-colors">Warranty Policy</Link>
                            <Link href="/refund" className="hover:text-brand-primary transition-colors">Return & Refund Policy</Link>
                            <Link href="/terms" className="hover:text-brand-primary transition-colors">Terms & Conditions</Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Pay With Full Width Section */}
            <div className="border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xs md:text-sm font-extrabold text-gray-400 mb-4 md:mb-6 uppercase tracking-widest">
                        Secure SSLCommerz Payment Gateway
                    </h3>
                    <div className="w-full max-w-[1000px] relative px-2">
                        <Image
                            src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-01.png"
                            alt="100% Secure Payment Methods by SSLCommerz"
                            width={1100}
                            height={120}
                            className="w-full h-auto object-contain mx-auto"
                            unoptimized
                        />
                    </div>
                </div>
            </div>

            {/* Social Bar */}
            <div className="border-t border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <span className="text-sm font-bold text-gray-700">Connect with us</span>
                    <div className="flex items-center gap-3">
                        <a href="https://www.facebook.com/CellTech69" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-md shadow-sm transition-all" aria-label="Facebook">
                            <FaFacebook size={16} />
                        </a>
                        <a href={`https://wa.me/${SITE_INFO.whatsappNumberIntl}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-md shadow-sm transition-all" aria-label="WhatsApp">
                            <FaWhatsapp size={16} />
                        </a>
                        <a href="mailto:celltechbd00@gmail.com" className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-md shadow-sm transition-all" aria-label="Email">
                            <HiOutlineMail size={16} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-center">
                    <p className="text-xs text-gray-400 font-medium">
                        &copy; {new Date().getFullYear()} Apple Face BD BD | All Rights Reserved.
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                        Developed by{" "}
                        <a
                            href="https://www.squadinnovators.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-primary font-bold hover:underline"
                        >
                            Squad Innovators
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
