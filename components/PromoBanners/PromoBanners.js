import Link from 'next/link';
import Image from 'next/image';

export default function PromoBanners({ banners = [] }) {
    const displayBanners = Array.isArray(banners) ? banners.slice(0, 3) : [];

    if (displayBanners.length === 0) return null;

    return (
        <section className="bg-white py-6 md:py-10">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-5 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory">
                    {displayBanners.map((banner, idx) => (
                        <Link
                            href={banner.link || "/"}
                            key={banner.id || idx}
                            className="relative flex-none w-[75vw] sm:w-[45vw] md:w-full overflow-hidden rounded-xl bg-gray-50 group block h-[130px] sm:h-[160px] md:h-[200px] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-400 snap-center"
                        >
                            <Image
                                src={banner.image || banner.image_path || banner.image_url || "/no-image.svg"}
                                alt={banner.title || `Promo Banner ${idx + 1}`}
                                fill
                                unoptimized
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
