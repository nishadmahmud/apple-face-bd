import Link from 'next/link';
import { FiMapPin, FiPhone, FiMail, FiClock, FiMessageCircle } from 'react-icons/fi';
import { SITE_INFO } from '../../lib/siteInfo';
import PageHero from '../../components/Shared/PageHero';

export const metadata = {
  title: 'Contact Us | Apple Face BD',
  description: 'Contact Apple Face BD for product help, orders, and store information.',
};

const outlet = SITE_INFO.outlets?.[0];

const contactCardClass =
  'flex items-center gap-4 p-5 bg-card-bg rounded-lg border border-brand-primary/15';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-card-bg pb-20 md:pb-10">
      <PageHero
        eyebrow="Support"
        title="Contact"
        highlight="Apple Face BD"
        description="Reach out for product advice, order updates, or store visits. Contact details below are placeholders until launch."
      />

      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 -mt-4 md:-mt-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-10 space-y-10">
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
            Phone, email, address, and social links on this page are sample placeholders. Update{' '}
            <code className="text-xs bg-amber-100 px-1 rounded">lib/siteInfo.js</code> with real details before going live.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={contactCardClass}>
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiPhone size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                <p className="font-bold text-gray-800 mt-0.5">{SITE_INFO.callDisplay}</p>
              </div>
            </div>

            <div className={contactCardClass}>
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiMessageCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">WhatsApp</p>
                <p className="font-bold text-gray-800 mt-0.5">{SITE_INFO.whatsappDisplay}</p>
              </div>
            </div>

            <div className={contactCardClass}>
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiMail size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                <p className="font-bold text-gray-800 mt-0.5 break-all">{SITE_INFO.email}</p>
              </div>
            </div>

            <div className={contactCardClass}>
              <div className="text-brand-primary bg-brand-primary/10 p-3 rounded-lg shrink-0">
                <FiClock size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hours</p>
                <p className="font-bold text-gray-800 mt-0.5">10:00 AM – 9:00 PM</p>
                <p className="text-xs text-gray-500">Sample hours</p>
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
                <h3 className="font-bold text-gray-900 text-lg">{outlet?.name || 'Apple Face BD Showroom'}</h3>
                {(outlet?.details || []).map((line) => (
                  <p key={line} className="text-sm text-gray-600 mt-1">{line}</p>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-gray-300 bg-card-bg flex items-center justify-center h-48 md:h-64 text-center px-6">
              <p className="text-sm text-gray-500">
                Map embed will appear here once a real store address is configured.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-brand-primary/20">
              Follow Us
            </h2>
            <div className="flex flex-wrap gap-3">
              {['Facebook', 'Instagram', 'TikTok'].map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-card-bg text-gray-500 text-sm font-bold border border-gray-200 cursor-default"
                >
                  {name} (coming soon)
                </span>
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
