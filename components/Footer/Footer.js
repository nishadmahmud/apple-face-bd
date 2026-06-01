"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTiktok, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import AppleFaceTextLogo from '../Brand/AppleFaceTextLogo';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { SITE_INFO } from '../../lib/siteInfo';
import { getCategoriesFromServer } from '../../lib/api';

const DUMMY = {
  address: SITE_INFO.outlets?.[0]?.details?.join(', ') || 'Level 0, Demo Plaza, Sample Road, Dhaka 1000, Bangladesh',
  phone: SITE_INFO.callDisplay,
  email: SITE_INFO.email,
  outletName: SITE_INFO.outlets?.[0]?.name || 'Apple Face BD Showroom',
};

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getCategoriesFromServer()
      .then((res) => {
        if (isMounted && res?.success && Array.isArray(res.data)) {
          setCategories(res.data.slice(0, 8));
        }
      })
      .catch((err) => console.error('Failed to fetch footer categories', err));
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="mt-auto bg-[#0a0a0a] text-gray-400">
      <div className="border-b border-gray-800 bg-gradient-to-r from-[#111] via-[#0a0a0a] to-[#111]">
        <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-md">
              <Link href="/" className="inline-block mb-4" aria-label="Home">
                <AppleFaceTextLogo height={40} variant="onDark" className="h-10 w-auto" />
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed">
                Apple Face BD — your destination for authentic smartphones, accessories, and tech in Bangladesh.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10 text-sm">
              <div className="flex gap-3">
                <HiOutlineLocationMarker className="text-brand-primary shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-white text-xs uppercase tracking-wider mb-1">Store</p>
                  <p className="font-semibold text-gray-300">{DUMMY.outletName}</p>
                  <p className="text-gray-500 text-[13px] mt-1 leading-relaxed">{DUMMY.address}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <FaPhoneAlt className="text-brand-primary shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-bold text-white text-xs uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-gray-300 font-semibold">{DUMMY.phone}</p>
                  <p className="text-[11px] text-gray-600 mt-1">Placeholder — update before launch</p>
                </div>
              </div>
              <div className="flex gap-3">
                <HiOutlineMail className="text-brand-primary shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-white text-xs uppercase tracking-wider mb-1">Email</p>
                  <p className="text-gray-300 font-semibold break-all">{DUMMY.email}</p>
                  <p className="text-[11px] text-gray-600 mt-1">Placeholder — update before launch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          <div>
            <h3 className="text-white font-bold text-sm mb-4 pb-2 border-b border-gray-800">Shop</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/" className="hover:text-brand-primary transition-colors">Home</Link></li>
              <li><Link href="/category" className="hover:text-brand-primary transition-colors">All Categories</Link></li>
              <li><Link href="/special-offers" className="hover:text-brand-primary transition-colors">Special Offers</Link></li>
              <li><Link href="/compare" className="hover:text-brand-primary transition-colors">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-4 pb-2 border-b border-gray-800">Company</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-primary transition-colors">Contact</Link></li>
              <li><Link href="/blogs" className="hover:text-brand-primary transition-colors">Blog</Link></li>
              <li><Link href="/track-order" className="hover:text-brand-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-4 pb-2 border-b border-gray-800">Categories</h3>
            <ul className="space-y-2.5 text-[13px] capitalize">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <li key={`${cat.id || idx}`}>
                    <Link href={`/category/${cat.id}`} className="hover:text-brand-primary transition-colors line-clamp-1">
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-600">Loading…</li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-4 pb-2 border-b border-gray-800">Policies</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-primary transition-colors">Terms</Link></li>
              <li><Link href="/warranty" className="hover:text-brand-primary transition-colors">Warranty</Link></li>
              <li><Link href="/refund" className="hover:text-brand-primary transition-colors">Returns</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 bg-white">
        <div className="max-w-site mx-auto px-4 md:px-6 py-6 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Secure payments</p>
          <Image
            src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-01.png"
            alt="Payment methods"
            width={900}
            height={80}
            className="w-full max-w-3xl mx-auto h-auto object-contain"
            unoptimized
          />
        </div>
      </div>

      <div className="border-t border-gray-800 py-5">
        <div className="max-w-site mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Follow</span>
            <span className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 cursor-default" aria-hidden>
              <FaFacebook size={14} />
            </span>
            <span className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 cursor-default" aria-hidden>
              <FaInstagram size={14} />
            </span>
            <span className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 cursor-default" aria-hidden>
              <FaTiktok size={12} />
            </span>
            <span className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 cursor-default" aria-hidden>
              <FaWhatsapp size={14} />
            </span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Apple Face BD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
