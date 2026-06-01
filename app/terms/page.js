import { SITE_INFO } from '../../lib/siteInfo';

export const metadata = {
    title: 'Terms & Conditions | Apple Face BD BD',
    description: 'Read our terms and conditions for using Apple Face BD BD services and products.',
};

const sections = [
    {
        title: '1. General Terms',
        content: 'By accessing and placing an order with Apple Face BD BD, you confirm that you agree to and are bound by the terms and conditions contained herein. These terms apply to the entire website and any email or other communication between you and Apple Face BD BD.',
    },
    {
        title: '2. Products & Pricing',
        items: [
            'All prices are listed in Bangladeshi Taka (BDT) and include applicable taxes unless stated otherwise.',
            'Prices are subject to change without prior notice.',
            'Product images are for illustration purposes and may differ slightly from the actual product.',
            'We reserve the right to limit order quantities.',
        ],
    },
    {
        title: '3. Orders & Payment',
        items: [
            'All orders are subject to acceptance and availability.',
            'We accept Cash on Delivery, bank transfers, and mobile banking payments.',
            'We reserve the right to refuse or cancel any order for any reason.',
            'Order confirmation does not guarantee product availability.',
        ],
    },
    {
        title: '4. Delivery',
        content: 'We deliver across Bangladesh. Delivery times vary depending on your location and product availability. Estimated delivery times are provided at checkout. We are not responsible for delays caused by courier services or force majeure events.',
    },
    {
        title: '5. Privacy Policy',
        content: 'We value your privacy. Personal information collected during the ordering process is used solely for order fulfillment and customer service. We do not sell or share your personal data with third parties except as necessary for order delivery and payment processing.',
    },
    {
        title: '6. Intellectual Property',
        content: 'All content on this website, including but not limited to text, images, graphics, logos, and software, is the property of Apple Face BD BD or its content suppliers and is protected by intellectual property laws.',
    },
    {
        title: '7. Limitation of Liability',
        content: 'Apple Face BD BD shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or products purchased through our platform.',
    },
    {
        title: '8. Contact',
        content: `If you have any questions about these Terms & Conditions, please contact us at ${SITE_INFO.email} or call ${SITE_INFO.callDisplay}.`,
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-10">
            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-center">
                    <span className="inline-block px-4 py-1.5 bg-brand-purple/20 text-brand-purple text-xs font-bold rounded-full mb-4 border border-brand-purple/20 uppercase tracking-wider">Legal</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Terms & Conditions</h1>
                    <p className="text-gray-400 text-sm md:text-base">Last updated: February 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                    <p className="text-sm text-gray-600 leading-relaxed mb-8">
                        Please read these terms and conditions carefully before using Apple Face BD BD&apos;s website and services. By using our platform, you agree to be bound by these terms.
                    </p>

                    <div className="space-y-8">
                        {sections.map((section, i) => (
                            <div key={i}>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                                {section.content && (
                                    <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                                )}
                                {section.items && (
                                    <ul className="space-y-2">
                                        {section.items.map((item, j) => (
                                            <li key={j} className="text-sm text-gray-600 leading-relaxed flex items-start gap-2">
                                                <span className="text-brand-purple mt-1.5 flex-shrink-0">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-600">
                            Questions? Reach us at{' '}
                            <a href={`mailto:${SITE_INFO.email}`} className="text-brand-purple font-semibold hover:underline">{SITE_INFO.email}</a>{' '}
                            or call{' '}
                            <a href={`tel:${SITE_INFO.phoneDial}`} className="text-brand-purple font-semibold hover:underline">{SITE_INFO.callDisplay}</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
