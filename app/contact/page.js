import Link from 'next/link';
import { FiMapPin, FiPhone, FiMail, FiClock, FiMessageCircle } from 'react-icons/fi';
import { SITE_INFO } from '../../lib/siteInfo';
import PageHero from '../../components/Shared/PageHero';

export const metadata = {
  title: 'Contact Us | Apple Face BD',
  description: 'Contact Apple Face BD for product help, orders, and store information in Dhaka, Bangladesh.',
};

const outlet = SITE_INFO.outlets?.[0];
const phoneHref = `tel:${SITE_INFO.callDialPrimary || SITE_INFO.phoneDial}`;
const emailHref = `mailto:${SITE_INFO.email}`;
const whatsappHref = SITE_INFO.whatsappNumberIntl
  ? `https://wa.me/${SITE_INFO.whatsappNumberIntl}`
  : '#';

const contactCardClass =
  'flex items-center gap-4 p-5 bg-card-bg rounded-lg border border-brand-primary/15';

const socialLinks = [
  {
    name: 'Facebook',
    href: SITE_INFO.social.facebook,
    label: 'Apple Face BD on Facebook',
  },
  {
    name: 'TikTok',
    href: SITE_INFO.social.tiktok,
    label: SITE_INFO.tiktokHandle || 'TikTok',
  },
].filter((item) => item.href);

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-card-bg pb-20 md:pb-10">
      <PageHero
        eyebrow="Support"
        title="Contact"
        highlight="Apple Face BD"
        description="Call, WhatsApp, or email us — or visit our Kuril showroom in Dhaka."
      />

      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 -mt-4 md:-mt-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-10 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={contactCardClass}>
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiPhone size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                <a href={phoneHref} className="font-bold text-gray-800 mt-0.5 hover:text-brand-primary transition-colors block">
                  {SITE_INFO.callDisplay}
                </a>
              </div>
            </div>

            <div className={contactCardClass}>
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiMessageCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">WhatsApp</p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-gray-800 mt-0.5 hover:text-brand-primary transition-colors block"
                >
                  {SITE_INFO.whatsappDisplay}
                </a>
              </div>
            </div>

            <div className={contactCardClass}>
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiMail size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                <a
                  href={emailHref}
                  className="font-bold text-gray-800 mt-0.5 break-all hover:text-brand-primary transition-colors block"
                >
                  {SITE_INFO.email}
                </a>
              </div>
            </div>

            <div className={contactCardClass}>
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiClock size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hours</p>
                <p className="font-bold text-gray-800 mt-0.5">10:00 AM – 9:00 PM</p>
                <p className="text-xs text-gray-500">Open daily</p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-brand-primary/20">
              Visit Our Store
            </h2>
            <div className="flex items-start gap-4 p-5 bg-card-bg rounded-lg border border-brand-primary/15 mb-4">
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiMapPin size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{outlet?.name || 'Apple Face BD'}</h3>
                {(outlet?.details || []).map((line) => (
                  <p key={line} className="text-sm text-gray-600 mt-1">{line}</p>
                ))}
                {outlet?.fullAddress ? (
                  <p className="text-sm text-gray-500 mt-2">{outlet.fullAddress}</p>
                ) : null}
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(outlet?.fullAddress || 'KA-244 Kuril Progoti Shoroni Dhaka')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-200 bg-card-bg flex items-center justify-center h-48 md:h-64 text-center px-6 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-colors group"
            >
              <p className="text-sm text-gray-600 group-hover:text-brand-primary">
                Open location in Google Maps
              </p>
            </a>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-brand-primary/20">
              Follow Us
            </h2>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-card-bg text-gray-800 text-sm font-bold border border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                  {item.name}
                  {item.name === 'TikTok' && item.label ? (
                    <span className="ml-1.5 text-gray-500 font-semibold">{item.label}</span>
                  ) : null}
                </a>
              ))}
            </div>
          </section>

          <div className="text-center pt-4 border-t border-gray-100">
            <Link href="/" className="text-brand-primary font-semibold hover:underline text-sm">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
