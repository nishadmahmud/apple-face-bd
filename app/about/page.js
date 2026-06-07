import Link from 'next/link';
import { FiMapPin, FiPhone, FiMail, FiShield, FiTruck, FiUsers, FiHeart } from 'react-icons/fi';
import { SITE_INFO } from '../../lib/siteInfo';
import PageHero from '../../components/Shared/PageHero';

export const metadata = {
  title: 'About Us | Apple Face',
  description: 'Learn about Apple Face — authentic gadgets, transparent pricing, and customer support in Bangladesh.',
};

const outlet = SITE_INFO.outlets?.[0];
const phoneHref = `tel:${SITE_INFO.callDialPrimary || SITE_INFO.phoneDial}`;
const emailHref = `mailto:${SITE_INFO.email}`;
const whatsappHref = SITE_INFO.whatsappNumberIntl
  ? `https://wa.me/${SITE_INFO.whatsappNumberIntl}`
  : '#';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-card-bg pb-20 md:pb-10">
      <PageHero
        eyebrow="About us"
        title="About"
        highlight="Apple Face"
        description="A modern tech retailer focused on authentic devices, clear pricing, and dependable after-sales care across Bangladesh."
      />

      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 -mt-4 md:-mt-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-10 space-y-10">
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-brand-primary/20">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Apple Face is building a trusted shopping experience for smartphones, laptops, tablets, and accessories.
              We work with authorized supply channels and aim to make every purchase straightforward — from product selection
              to warranty support.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-brand-primary/20">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <FiShield size={22} />, title: 'Authentic Products', desc: 'Genuine devices with official warranty where applicable.' },
                { icon: <FiTruck size={22} />, title: 'Nationwide Delivery', desc: 'Fast shipping options across Bangladesh.' },
                { icon: <FiHeart size={22} />, title: 'After-Sales Support', desc: 'Help with warranty, setup, and product questions.' },
                { icon: <FiUsers size={22} />, title: 'Transparent Pricing', desc: 'Clear prices with offers and EMI shown upfront.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-card-bg rounded-lg border border-brand-primary/15">
                  <div className="text-brand-primary bg-brand-primary/10 p-2.5 rounded-lg shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-brand-primary/20">
              Our Outlet
            </h2>
            <div className="flex items-start gap-4 p-5 bg-card-bg rounded-lg border border-brand-primary/15">
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiMapPin size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{outlet?.name || 'Apple Face'}</h3>
                {(outlet?.details || []).map((line) => (
                  <p key={line} className="text-sm text-gray-600 mt-1">{line}</p>
                ))}
                {outlet?.fullAddress ? (
                  <p className="text-sm text-gray-500 mt-2">{outlet.fullAddress}</p>
                ) : null}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-brand-primary/20">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-card-bg rounded-lg border border-brand-primary/15">
                <div className="text-brand-primary bg-brand-primary/10 p-2.5 rounded-lg shrink-0">
                  <FiPhone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone & WhatsApp</p>
                  <a href={phoneHref} className="font-semibold text-gray-800 hover:text-brand-primary transition-colors block">
                    {SITE_INFO.callDisplay}
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-primary font-medium hover:underline mt-0.5 inline-block"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-card-bg rounded-lg border border-brand-primary/15">
                <div className="text-brand-primary bg-brand-primary/10 p-2.5 rounded-lg shrink-0">
                  <FiMail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                  <a
                    href={emailHref}
                    className="font-semibold text-gray-800 hover:text-brand-primary transition-colors break-all"
                  >
                    {SITE_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-gray-500 mb-4">Questions about a product or your order?</p>
            <Link
              href="/contact"
              className="inline-block bg-[#0a0a0a] text-white font-bold px-8 py-3 rounded-lg hover:bg-brand-primary transition-colors"
            >
              Contact page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
