import Link from "next/link";
import { SITE_INFO } from '../../lib/siteInfo';

export const metadata = {
    title: "Privacy Policy | Apple Face BD BD",
    description: "Apple Face BD BD privacy policy — how we collect, use, and protect your personal information.",
};

const sections = [
    {
        title: "1. Information We Collect",
        content: [
            "**Personal Information:** When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping address, and payment information.",
            "**Device Information:** We automatically collect information about the device and browser you use to access our website, including your IP address, browser type, operating system, and referring URLs.",
            "**Order Information:** Details of products you purchase, installation or maintenance services you request, order history, and delivery preferences.",
            "**Communication Data:** Records of correspondence when you contact our support team via email, phone, or social media.",
        ],
    },
    {
        title: "2. How We Use Your Information",
        content: [
            "To process and fulfill your orders and installation service requests.",
            "To communicate with you about your orders, deliveries, and service updates.",
            "To create and manage your customer account.",
            "To provide customer support and respond to inquiries.",
            "To send promotional offers, discounts, and newsletters (with your consent).",
            "To improve our website, products, and services based on usage patterns.",
            "To detect and prevent fraud or unauthorized activities.",
        ],
    },
    {
        title: "3. Information Sharing",
        content: [
            "We do **not** sell, trade, or rent your personal information to third parties.",
            "We may share your information with trusted delivery partners (e.g., Pathao, Steadfast) solely for order fulfillment.",
            "We may share information with payment processors to complete transactions securely.",
            "We may disclose information if required by law, regulation, or legal process.",
        ],
    },
    {
        title: "4. Data Security",
        content: [
            "We implement industry-standard security measures to protect your personal information.",
            "All payment transactions are encrypted using SSL/TLS technology.",
            "Access to personal data is restricted to authorized employees only.",
            "While we strive to protect your information, no method of electronic transmission is 100% secure.",
        ],
    },
    {
        title: "5. Cookies",
        content: [
            "We use cookies and similar technologies to enhance your browsing experience.",
            "Cookies help us remember your preferences, keep you logged in, and understand how you use our site.",
            "You can modify your browser settings to decline cookies, though some features may not function properly.",
        ],
    },
    {
        title: "6. Your Rights",
        content: [
            "You have the right to access, update, or delete your personal information through your account settings.",
            "You may opt out of marketing communications at any time by unsubscribing from our emails.",
            "You may request a copy of the data we hold about you by contacting us at celltechbd00@gmail.com.",
        ],
    },
    {
        title: "7. Changes to This Policy",
        content: [
            "We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date.",
            "Continued use of our website after changes constitutes acceptance of the updated policy.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-10">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-center">
                    <span className="inline-block px-4 py-1.5 bg-brand-purple/20 text-brand-purple text-xs font-bold rounded-full mb-4 border border-brand-purple/20">LEGAL</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
                    <p className="text-gray-400 text-sm md:text-base">Last updated: February 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                    <p className="text-sm text-gray-600 leading-relaxed mb-8">
                        At Apple Face BD BD, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
                    </p>

                    <div className="space-y-8">
                        {sections.map((section, i) => (
                            <div key={i}>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                                <ul className="space-y-2">
                                    {section.content.map((item, j) => (
                                        <li key={j} className="text-sm text-gray-600 leading-relaxed flex items-start gap-2">
                                            <span className="text-brand-purple mt-1.5 flex-shrink-0">•</span>
                                            <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>') }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-600">
                            If you have any questions about this Privacy Policy, please contact us at{" "}
                            <a href={`mailto:${SITE_INFO.email}`} className="text-brand-purple font-semibold hover:underline">{SITE_INFO.email}</a> or call{" "}
                            <a href={`tel:${SITE_INFO.phoneDial}`} className="text-brand-purple font-semibold hover:underline">{SITE_INFO.callDisplay}</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
