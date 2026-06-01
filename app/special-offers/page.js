import { getCampaigns } from '../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronRight, FiTag, FiClock, FiBox } from 'react-icons/fi';

export const metadata = {
    title: 'Special Offers | Campaign Deals',
    description: 'Browse active campaign offers and discounted products.',
};

const formatDate = (value) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const toMoney = (v) => `? ${Number(v || 0).toLocaleString('en-IN')}`;

export default async function SpecialOffersPage() {
    let campaigns = [];

    try {
        const res = await getCampaigns();
        const list = res?.campaigns?.data;
        if (Array.isArray(list)) {
            campaigns = list;
        }
    } catch (error) {
        console.error('Failed to fetch campaigns:', error);
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-10">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 text-center">
                    <span className="inline-block px-4 py-1.5 bg-[#ff2a3b]/20 text-[#ff2a3b] text-xs font-bold rounded-full mb-5 border border-[#ff2a3b]/20 uppercase tracking-wider">
                        Live Campaigns
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                        Special <span className="text-brand-purple">Offers</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Explore active campaign deals and discounted products at Apple Face BD BD.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 -mt-0">
                {campaigns.length > 0 ? (
                    <div className="space-y-6">
                        {campaigns.map((campaign) => {
                            const products = Array.isArray(campaign.products) ? campaign.products : [];

                            return (
                                <section key={campaign.id} className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
                                    <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/70">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div>
                                                <h2 className="text-xl md:text-2xl font-black text-gray-900">{campaign.name || 'Campaign Offer'}</h2>
                                                <p className="text-sm text-gray-500 mt-1">{campaign.description || 'Limited-time campaign pricing across selected products.'}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-bold">
                                                    <FiTag size={12} />
                                                    {campaign.discount_type === 'percentage' ? `${campaign.discount || 0}% OFF` : `${campaign.discount || 0} OFF`}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">
                                                    <FiClock size={12} />
                                                    {formatDate(campaign.start_at)} - {formatDate(campaign.end_at)}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">
                                                    <FiBox size={12} /> {products.length} products
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 md:p-6">
                                        {products.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                                                {products.slice(0, 10).map((p) => {
                                                    const basePrice = Number(p.retails_price || 0);
                                                    const campaignDiscount = Number(campaign.discount || 0);
                                                    const campaignType = String(campaign.discount_type || '').toLowerCase();
                                                    const campaignPrice = campaignType === 'percentage'
                                                        ? Math.max(0, Math.round(basePrice * (1 - campaignDiscount / 100)))
                                                        : Math.max(0, basePrice - campaignDiscount);

                                                    return (
                                                        <Link
                                                            key={p.id}
                                                            href={`/product/${(p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${p.id}`}
                                                            className="group border border-gray-100 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all"
                                                        >
                                                            <div className="relative w-full aspect-square bg-gray-50">
                                                                <Image src={p.image_path || p.image_path1 || p.image_path2 || '/no-image.svg'} alt={p.name || 'Product'} fill className="object-contain p-2" unoptimized />
                                                            </div>
                                                            <div className="p-3">
                                                                <h3 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">{p.name}</h3>
                                                                <div className="mt-2">
                                                                    <p className="text-brand-purple font-extrabold text-sm">{toMoney(campaignPrice)}</p>
                                                                    {basePrice > campaignPrice && (
                                                                        <p className="text-[11px] text-gray-400 line-through">{toMoney(basePrice)}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No products attached to this campaign yet.</p>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">No active campaign right now</h2>
                        <p className="text-gray-500 max-w-md mx-auto">Please check again soon for new offers.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
