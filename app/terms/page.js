import LegalPageLayout from '../../components/Shared/LegalPageLayout';
import { SITE_INFO } from '../../lib/siteInfo';

export const metadata = {
    title: 'Terms & Conditions | Apple Face',
    description: 'Read our terms and conditions for using Apple Face services and products.',
};

const sections = [
    {
        title: '1. General Terms',
        content:
            'By accessing and placing an order with Apple Face, you confirm that you agree to and are bound by the terms and conditions contained herein. These terms apply to the entire website and any email or other communication between you and Apple Face.',
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
        content:
            'We deliver across Bangladesh. Delivery times vary depending on your location and product availability. Estimated delivery times are provided at checkout. We are not responsible for delays caused by courier services or force majeure events.',
    },
    {
        title: '5. Privacy Policy',
        content:
            'We value your privacy. Personal information collected during the ordering process is used solely for order fulfillment and customer service. We do not sell or share your personal data with third parties except as necessary for order delivery and payment processing.',
    },
    {
        title: '6. Intellectual Property',
        content:
            'All content on this website, including but not limited to text, images, graphics, logos, and software, is the property of Apple Face or its content suppliers and is protected by intellectual property laws.',
    },
    {
        title: '7. Limitation of Liability',
        content:
            'Apple Face shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or products purchased through our platform.',
    },
    {
        title: '8. Contact',
        content: `If you have any questions about these Terms & Conditions, please contact us at ${SITE_INFO.email} or call ${SITE_INFO.callDisplay}.`,
    },
];

export default function TermsPage() {
    return (
        <LegalPageLayout
            eyebrow="Legal"
            title="Terms &"
            highlight="Conditions"
            meta="Last updated: February 2026"
            intro="Please read these terms and conditions carefully before using Apple Face's website and services. By using our platform, you agree to be bound by these terms."
            sections={sections}
        />
    );
}
