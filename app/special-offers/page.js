import { getCampaigns } from '../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FiTag, FiClock, FiBox } from 'react-icons/fi';
import PageHero from '../../components/Shared/PageHero';
import EmptyState from '../../components/Shared/EmptyState';

export const metadata = {
    title: 'Special Offers | Apple Face BD',
    description: 'Browse active campaign offers and discounted products at Apple Face BD.',
};

const formatDate = (value) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const toMoney = (v) => `৳ ${Number(v || 0).toLocaleString('en-IN')}`;

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
        <div className="min-h-screen bg-card-bg pb-20 md:pb-10">
            <PageHero
                eyebrow="Live Campaigns"
                title="Special"
                highlight="Offers"
                description="Explore active campaign deals and discounted products at Apple Face BD."
            />

            <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
                {campaigns.length > 0 ? (
                    <div className="space-y-6">
                        {campaigns.map((campaign) => {
                            const products = Array.isArray(campaign.products) ? campaign.products : [];

                            return (
                                <section
                                    key={campaign.id}
                                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                                >
                                    <div className="p-4 md:p-6 border-b border-gray-200 bg-card-bg">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div>
                                                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
                                                    {campaign.name || 'Campaign Offer'}
                                                </h2>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {campaign.description ||
                                                        'Limited-time campaign pricing across selected products.'}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-bold border border-brand-primary/20">
                                                    <FiTag size={12} />
                                                    {campaign.discount_type === 'percentage'
                                                        ? `${campaign.discount || 0}% OFF`
                                                        : `${campaign.discount || 0} OFF`}
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
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
                                                {products.slice(0, 10).map((p) => {
                                                    const basePrice = Number(p.retails_price || 0);
                                                    const campaignDiscount = Number(campaign.discount || 0);
                                                    const campaignType = String(
                                                        campaign.discount_type || ''
                                                    ).toLowerCase();
                                                    const campaignPrice =
                                                        campaignType === 'percentage'
                                                            ? Math.max(
                                                                  0,
                                                                  Math.round(
                                                                      basePrice *
                                                                          (1 - campaignDiscount / 100)
                                                                  )
                                                              )
                                                            : Math.max(0, basePrice - campaignDiscount);

                                                    const slug = `${(p.name || 'product')
                                                        .toLowerCase()
                                                        .replace(/[^a-z0-9]+/g, '-')
                                                        .replace(/^-|-$/g, '')}-${p.id}`;

                                                    return (
                                                        <Link
                                                            key={p.id}
                                                            href={`/product/${slug}`}
                                                            className="group border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-brand-primary/40 hover:shadow-md transition-all"
                                                        >
                                                            <div className="relative w-full aspect-square bg-card-bg">
                                                                <Image
                                                                    src={
                                                                        p.image_path ||
                                                                        p.image_path1 ||
                                                                        p.image_path2 ||
                                                                        '/no-image.svg'
                                                                    }
                                                                    alt={p.name || 'Product'}
                                                                    fill
                                                                    className="object-contain p-2 group-hover:scale-[1.02] transition-transform"
                                                                    unoptimized
                                                                />
                                                            </div>
                                                            <div className="p-2.5 border-t border-gray-100">
                                                                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 min-h-[2rem] group-hover:text-brand-primary transition-colors">
                                                                    {p.name}
                                                                </h3>
                                                                <div className="mt-1.5">
                                                                    <p className="text-brand-primary font-extrabold text-sm">
                                                                        {toMoney(campaignPrice)}
                                                                    </p>
                                                                    {basePrice > campaignPrice && (
                                                                        <p className="text-[10px] text-gray-400 line-through">
                                                                            {toMoney(basePrice)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No products attached to this campaign yet.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        title="No active campaigns right now"
                        description="Please check again soon for new offers and discounts."
                        actionHref="/"
                        actionLabel="Browse Products"
                    />
                )}
            </div>
        </div>
    );
}
