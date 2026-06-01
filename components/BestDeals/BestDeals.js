import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '../Shared/SectionHeader';

export default function BestDeals({ deals = [] }) {
    const displayDeals = Array.isArray(deals) ? deals : [];

    return (
        <section className="bg-gray-50/50 py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-site mx-auto px-4 md:px-6">
                <SectionHeader title="Top" highlight="Deals" href="/special-offers" linkLabel="All Offers" />
                <p className="text-sm text-gray-500 -mt-4 mb-8 hidden sm:block">
                    Hand-picked offers from Apple Face BD — grab them before they&apos;re gone.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {displayDeals.length > 0 ? displayDeals.map((deal, idx) => (
                        <div key={deal.id || idx} className="group bg-white rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-400 flex flex-row items-stretch border border-gray-200 hover:ring-1 hover:ring-brand-primary/20">
                            <div className="w-2/5 md:w-2/5 relative flex-shrink-0 bg-card-bg border-r border-gray-100 p-3 md:p-6 flex items-center justify-center">
                                <div className="relative w-full aspect-square">
                                    <Image src={deal.imageUrl || '/no-image.svg'} alt={deal.title} fill unoptimized className="object-cover object-center group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                                </div>
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="bg-brand-primary text-white text-[9px] md:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{deal.badge || 'Offer'}</span>
                                </div>
                            </div>
                            <div className="w-3/5 md:w-3/5 p-4 md:p-6 flex flex-col justify-center">
                                <h3 className="text-sm md:text-lg font-bold tracking-tight text-gray-900 mb-2 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">{deal.title}</h3>
                                <p className="text-gray-500 text-[11px] md:text-sm leading-relaxed mb-3 md:mb-5 line-clamp-2">{deal.description}</p>

                                <div className="flex flex-wrap items-baseline gap-2 mb-3 md:mb-5 mt-auto">
                                    <span className="text-base md:text-2xl font-extrabold text-gray-900 leading-none">{deal.price}</span>
                                    {deal.oldPrice && <span className="text-gray-400 text-xs md:text-sm font-medium line-through">{deal.oldPrice}</span>}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 md:pt-4 mt-auto">
                                    {deal.savings && <span className="bg-brand-primary/10 text-brand-primary text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-md tracking-wide uppercase">{deal.savings}</span>}
                                    <Link href={deal.link || '/'} className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-white bg-gray-900 hover:bg-brand-primary px-4 py-2 rounded-lg transition-all ml-auto whitespace-nowrap">Shop Now
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="md:col-span-2 text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-white">
                            No deal items available right now.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
