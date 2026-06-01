import { FiMapPin, FiPhone, FiMail, FiClock, FiMessageCircle } from 'react-icons/fi';
import { SITE_INFO } from '../../lib/siteInfo';

export const metadata = {
    title: 'Contact Us | Apple Face BD BD',
    description: 'Get in touch with Apple Face BD BD for product help, order support, and outlet information.',
};

export default function ContactPage() {
    const primaryOutlet = SITE_INFO.outlets?.[0];
    const mapQuery = primaryOutlet
        ? encodeURIComponent([primaryOutlet.name, ...(primaryOutlet.details || [])].join(', '))
        : encodeURIComponent('Bashundhara City, Panthapath, Dhaka, Bangladesh');

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-10">
            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-24 text-center">
                    <span className="inline-block px-4 py-1.5 bg-brand-purple/20 text-brand-purple text-xs font-bold rounded-full mb-5 border border-brand-purple/20 uppercase tracking-wider">Support</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">Contact <span className="text-brand-purple">Apple Face BD BD</span></h1>
                    <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Reach us by phone, WhatsApp, or email. We&apos;re here to help with product inquiries, orders, and support.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-10">

                    {/* Contact Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a href={`tel:${SITE_INFO.phoneDial}`} className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-purple/30 transition-colors group">
                            <div className="text-brand-purple bg-brand-purple/10 p-3 rounded-lg flex-shrink-0 group-hover:bg-brand-purple/20 transition-colors">
                                <FiPhone size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                                <p className="font-bold text-gray-800 mt-0.5">{SITE_INFO.callDisplay}</p>
                            </div>
                        </a>

                        <a href={`https://wa.me/${SITE_INFO.whatsappNumberIntl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition-colors group">
                            <div className="text-green-600 bg-green-50 p-3 rounded-lg flex-shrink-0 group-hover:bg-green-100 transition-colors">
                                <FiMessageCircle size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">WhatsApp</p>
                                <p className="font-bold text-gray-800 mt-0.5">{SITE_INFO.whatsappDisplay}</p>
                            </div>
                        </a>

                        <a href={`mailto:${SITE_INFO.email}`} className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-purple/30 transition-colors group">
                            <div className="text-brand-purple bg-brand-purple/10 p-3 rounded-lg flex-shrink-0 group-hover:bg-brand-purple/20 transition-colors">
                                <FiMail size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                                <p className="font-bold text-gray-800 mt-0.5">{SITE_INFO.email}</p>
                            </div>
                        </a>

                        <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-blue-500 bg-blue-50 p-3 rounded-lg flex-shrink-0">
                                <FiClock size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Working Hours</p>
                                <p className="font-bold text-gray-800 mt-0.5">10:00 AM – 9:00 PM</p>
                                <p className="text-xs text-gray-500">Open daily</p>
                            </div>
                        </div>
                    </div>

                    {/* Outlet Location */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Visit Our Store</h2>
                        {primaryOutlet && (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-brand-purple bg-brand-purple/10 p-3 rounded-lg flex-shrink-0">
                                        <FiMapPin size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{primaryOutlet.name}</h3>
                                        {primaryOutlet.details.map((line) => (
                                            <p key={line} className="text-sm text-gray-600 mt-1">{line}</p>
                                        ))}
                                        <p className="text-xs text-gray-400 mt-2">Please call before visiting to confirm availability.</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                    <iframe
                                        title={`Map to ${primaryOutlet.name}`}
                                        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full h-72 md:h-96 border-0"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Social Links */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Follow Us</h2>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { name: 'Facebook', href: SITE_INFO.social?.facebook, bg: 'bg-[#1877F2]' },
                                { name: 'Instagram', href: SITE_INFO.social?.instagram, bg: 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
                                { name: 'TikTok', href: SITE_INFO.social?.tiktok, bg: 'bg-black' },
                            ].map((social) => (
                                <a key={social.name} href={social.href || '#'} target="_blank" rel="noopener noreferrer" className={`${social.bg} text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity`}>
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
