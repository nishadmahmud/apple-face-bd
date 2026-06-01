import Link from 'next/link';
import Image from 'next/image';

export default function WidePromoBanner({ banner }) {
    if (!banner) return null;

    return (
        <section className="py-6 md:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Link href={banner.link || '#'} className="block w-full relative aspect-video md:aspect-[21/9] lg:aspect-[4/1] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                    <Image 
                        src={banner.image} 
                        alt={banner.title || "Promotional Banner"} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        unoptimized 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </Link>
            </div>
        </section>
    );
}
