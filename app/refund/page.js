import Link from 'next/link';
import LegalPageLayout from '../../components/Shared/LegalPageLayout';

export const metadata = {
    title: 'Refund Policy | Apple Face BD',
    description: 'Our refund and return policy. Learn about our hassle-free return process.',
};

const sections = [
    {
        title: 'Return Eligibility',
        items: [
            'Products must be returned within 7 days of delivery',
            'Items must be in original, unused condition with all packaging intact',
            'All accessories, manuals, and free gifts must be included',
            'Product must not be damaged, scratched, or show signs of use',
        ],
    },
    {
        title: 'Non-Returnable Items',
        items: [
            'Products with broken seals or missing original packaging',
            'Software, digital downloads, or activated products',
            'Items marked as "non-returnable" on the product page',
            'Products damaged by the customer',
        ],
    },
    {
        title: 'Refund Process',
        items: [
            'Contact us within 7 days of receiving your order',
            'Provide your order number and reason for return',
            'Our team will review and approve your return request',
            'Ship the product back to us (shipping costs may apply)',
            'Refund will be processed within 5-7 business days after receiving the product',
        ],
    },
    {
        title: 'Refund Methods',
        content:
            'Refunds are issued to the original payment method. For cash-on-delivery orders, refunds can be processed via bank transfer or mobile banking (bKash, Nagad). Please allow 5-7 business days for the refund to reflect in your account.',
    },
];

export default function RefundPage() {
    return (
        <LegalPageLayout
            eyebrow="Policy"
            title="Refund"
            highlight="Policy"
            description="Your satisfaction is our priority. Here's our refund and return policy."
            sections={sections}
            showContactFooter={false}
            footerNote={
                <div className="text-center">
                    <p className="text-gray-500 mb-4 text-sm">Need to initiate a return?</p>
                    <Link
                        href="/contact"
                        className="inline-block bg-brand-primary text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Contact Support
                    </Link>
                </div>
            }
        />
    );
}
