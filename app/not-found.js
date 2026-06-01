"use client";

import Link from 'next/link';
import { FiHome, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4 md:px-6 py-12 border-t border-gray-100">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Abstract 404 Illustration */}
        <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-primary/5 rounded-full animate-pulse duration-1000"></div>
            <div className="absolute inset-4 bg-brand-primary/10 rounded-full animate-pulse duration-700 delay-150"></div>
            <div className="absolute inset-8 bg-white border border-gray-100 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-center flex-col z-10">
                <span className="text-6xl md:text-8xl font-black text-brand-primary tracking-tighter drop-shadow-sm">404</span>
                <div className="h-1.5 w-16 bg-gray-200 rounded-full mt-2"></div>
            </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Got Lost?</h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-sm mx-auto font-medium">
                The page you are looking for has been moved, deleted, or possibly never existed.
            </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
            <Link 
                href="/" 
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary text-white font-bold rounded-full shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
                <FiHome className="w-5 h-5" />
                <span>Return Home</span>
            </Link>
            <Link 
                href="/category" 
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 font-bold rounded-full shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
                <FiSearch className="w-4 h-4 text-gray-400" />
                <span>Browse Store</span>
            </Link>
        </div>

      </div>
    </div>
  );
}
