import Link from 'next/link';
import Image from 'next/image';

export default function WidePromoBanner({ banner }) {
    if (!banner) return null;

    return (
        <section className="py-6 md:py-10 bg-white">
            <div className="max-w-site mx-auto px-4 md:px-6">
                <Link href={banner.link || '#'} className="block w-full relative aspect-video md:aspect-[21/9] lg:aspect-[4/1] rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                    <Image 
                        src={banner.image} 
                        alt={banner.title || "Promotional Banner"} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        unoptimized 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            </div>
        </section>
    );
}
