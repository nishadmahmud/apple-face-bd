import Link from 'next/link';
import { FiMapPin, FiPhone, FiMail, FiShield, FiTruck, FiUsers, FiHeart } from 'react-icons/fi';
import { SITE_INFO } from '../../lib/siteInfo';

export const metadata = {
    title: 'About Us | Apple Face BD BD',
    description: 'Learn about Apple Face BD BD — your trusted source for authentic gadgets with transparent pricing and after-sales support in Dhaka, Bangladesh.',
};

export default function AboutPage() {
    const primaryOutlet = SITE_INFO.outlets?.[0];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-10">
            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-24 text-center">
                    <span className="inline-block px-4 py-1.5 bg-brand-purple/20 text-brand-purple text-xs font-bold rounded-full mb-5 border border-brand-purple/20 uppercase tracking-wider">Since 2015</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">About <span className="text-brand-purple">Apple Face BD BD</span></h1>
                    <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Your trusted destination for authentic gadgets with transparent pricing, genuine warranty, and dedicated after-sales support across Bangladesh.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-10">

                    {/* Who We Are */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Apple Face BD BD is a trusted electronics retailer operating through our online store and physical outlet in Dhaka. We specialize in smartphones, laptops, tablets, and accessories — all 100% authentic with official warranty. Our mission is to help customers find the right device for their needs and budget, backed by honest pricing and reliable support.
                        </p>
                    </section>

                    {/* Why Choose Us */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Why Choose Us</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: <FiShield size={22} />, title: '100% Authentic Products', desc: 'Every product comes with official brand warranty and is sourced from authorized channels.' },
                                { icon: <FiTruck size={22} />, title: 'Fast Nationwide Delivery', desc: 'Same-day delivery inside Dhaka and 2-5 days delivery across Bangladesh.' },
                                { icon: <FiHeart size={22} />, title: 'After-Sales Support', desc: 'Dedicated support team to help with warranty claims, troubleshooting, and product guidance.' },
                                { icon: <FiUsers size={22} />, title: 'Transparent Pricing', desc: 'No hidden charges. Offer prices, EMI options, and regular prices clearly displayed.' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-brand-purple bg-brand-purple/10 p-2.5 rounded-lg flex-shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Our Outlet */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Our Outlet</h2>
                        {primaryOutlet && (
                            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-brand-purple bg-brand-purple/10 p-3 rounded-lg flex-shrink-0">
                                    <FiMapPin size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{primaryOutlet.name}</h3>
                                    {primaryOutlet.details.map((line) => (
                                        <p key={line} className="text-sm text-gray-600 mt-1">{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Contact Info */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Get in Touch</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href={`tel:${SITE_INFO.phoneDial}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-purple/30 transition-colors">
                                <div className="text-brand-purple bg-brand-purple/10 p-2.5 rounded-lg flex-shrink-0">
                                    <FiPhone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone / WhatsApp</p>
                                    <p className="font-semibold text-gray-800">{SITE_INFO.callDisplay}</p>
                                </div>
                            </a>
                            <a href={`mailto:${SITE_INFO.email}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-purple/30 transition-colors">
                                <div className="text-brand-purple bg-brand-purple/10 p-2.5 rounded-lg flex-shrink-0">
                                    <FiMail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                                    <p className="font-semibold text-gray-800">{SITE_INFO.email}</p>
                                </div>
                            </a>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-500 mb-4">Need help choosing a product or have a question?</p>
                        <Link href="/contact" className="inline-block bg-brand-purple text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-purple/20">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
