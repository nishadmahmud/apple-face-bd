"use client";

import Image from 'next/image';

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        
        {/* Outer Circular Animation Wrapper */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
            
            {/* Outer glowing pulsed ring */}
            <div className="absolute inset-0 rounded-full border border-brand-primary/10 bg-brand-primary/5 animate-ping opacity-50"></div>
            
            {/* Spinning Rings */}
            <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-brand-primary animate-spin opacity-80"></div>
            <div className="absolute inset-0 rounded-full border-b-2 border-r-2 border-brand-primary animate-spin opacity-40" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>

            {/* Logo in center */}
            <div className="relative z-10 bg-white rounded-full px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center animate-pulse border border-gray-100">
              <Image 
                src="/CTBD Text.png"
                alt="Apple Face BD BD Loading..." 
                width={110} 
                height={26}
                className="w-[90px] md:w-[110px] object-contain"
                unoptimized
              />
            </div>
            
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="text-gray-400 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">Processing</span>
        </div>

      </div>
    </div>
  );
}
