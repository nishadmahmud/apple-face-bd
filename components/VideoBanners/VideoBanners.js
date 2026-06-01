'use client';
import Link from 'next/link';

export default function VideoBanners({ banner }) {
    if (!banner) return null;

    return (
        <section className="py-6 md:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-black w-full aspect-video md:aspect-[21/9] lg:aspect-[4/1] group">
                    <video
                        src={banner.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    {banner.link && banner.link !== "/" && banner.link !== "#" && (
                        <Link href={banner.link} className="absolute inset-0 z-10 flex items-end p-6 bg-gradient-to-t from-black/60 to-transparent">
                            <span className="text-white font-bold bg-brand-primary px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform shadow-lg">Shop Now</span>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
