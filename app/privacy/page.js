import LegalPageLayout from '../../components/Shared/LegalPageLayout';
import { SITE_INFO } from '../../lib/siteInfo';

export const metadata = {
    title: 'Privacy Policy | Apple Face',
    description: 'Apple Face privacy policy — how we collect, use, and protect your personal information.',
};

const sections = [
    {
        title: '1. Information We Collect',
        items: [
            '**Personal Information:** When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping address, and payment information.',
            '**Device Information:** We automatically collect information about the device and browser you use to access our website, including your IP address, browser type, operating system, and referring URLs.',
            '**Order Information:** Details of products you purchase, installation or maintenance services you request, order history, and delivery preferences.',
            '**Communication Data:** Records of correspondence when you contact our support team via email, phone, or social media.',
        ],
    },
    {
        title: '2. How We Use Your Information',
        items: [
            'To process and fulfill your orders and installation service requests.',
            'To communicate with you about your orders, deliveries, and service updates.',
            'To create and manage your customer account.',
            'To provide customer support and respond to inquiries.',
            'To send promotional offers, discounts, and newsletters (with your consent).',
            'To improve our website, products, and services based on usage patterns.',
            'To detect and prevent fraud or unauthorized activities.',
        ],
    },
    {
        title: '3. Information Sharing',
        items: [
            'We do **not** sell, trade, or rent your personal information to third parties.',
            'We may share your information with trusted delivery partners (e.g., Pathao, Steadfast) solely for order fulfillment.',
            'We may share information with payment processors to complete transactions securely.',
            'We may disclose information if required by law, regulation, or legal process.',
        ],
    },
    {
        title: '4. Data Security',
        items: [
            'We implement industry-standard security measures to protect your personal information.',
            'All payment transactions are encrypted using SSL/TLS technology.',
            'Access to personal data is restricted to authorized employees only.',
            'While we strive to protect your information, no method of electronic transmission is 100% secure.',
        ],
    },
    {
        title: '5. Cookies',
        items: [
            'We use cookies and similar technologies to enhance your browsing experience.',
            'Cookies help us remember your preferences, keep you logged in, and understand how you use our site.',
            'You can modify your browser settings to decline cookies, though some features may not function properly.',
        ],
    },
    {
        title: '6. Your Rights',
        items: [
            'You have the right to access, update, or delete your personal information through your account settings.',
            'You may opt out of marketing communications at any time by unsubscribing from our emails.',
            `You may request a copy of the data we hold about you by contacting us at ${SITE_INFO.email}.`,
        ],
    },
    {
        title: '7. Changes to This Policy',
        items: [
            'We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date.',
            'Continued use of our website after changes constitutes acceptance of the updated policy.',
        ],
    },
];

export default function PrivacyPage() {
    return (
        <LegalPageLayout
            eyebrow="Legal"
            title="Privacy"
            highlight="Policy"
            meta="Last updated: February 2026"
            intro="At Apple Face, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase."
            sections={sections}
        />
    );
}
