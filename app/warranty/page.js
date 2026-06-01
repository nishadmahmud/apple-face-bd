import Link from 'next/link';
import LegalPageLayout from '../../components/Shared/LegalPageLayout';

export const metadata = {
    title: 'Warranty Policy | Apple Face BD',
    description: 'Learn about our warranty policy for electronics and gadgets purchased from Apple Face BD.',
};

const sections = [
    {
        title: 'Warranty Coverage',
        content:
            "All products sold through Apple Face BD come with the manufacturer's official warranty. The warranty period and coverage vary by product and brand. Warranty details are listed on each product page.",
    },
    {
        title: 'Coverage by Product Type',
        items: [
            'Smartphones: Typically 1 year manufacturer warranty',
            'Laptops: Typically 1-2 years manufacturer warranty',
            'Accessories: Typically 6 months to 1 year warranty',
            'Extended warranty options may be available at checkout',
        ],
    },
    {
        title: "What's Covered",
        items: [
            'Manufacturing defects in materials and workmanship',
            'Hardware failures under normal usage conditions',
            'Software issues that are factory-related',
        ],
    },
    {
        title: "What's Not Covered",
        items: [
            'Physical damage, water damage, or accidental drops',
            'Damage caused by unauthorized modifications or repairs',
            'Normal wear and tear',
            'Damage caused by misuse or negligence',
        ],
    },
    {
        title: 'How to Claim Warranty',
        items: [
            'Contact our support team via phone or email with your order details',
            "Describe the issue you're experiencing",
            'Our team will guide you through the warranty claim process',
            'Ship the product to our service center or visit in person',
            "We'll process the claim and repair/replace the product",
        ],
    },
];

export default function WarrantyPage() {
    return (
        <LegalPageLayout
            eyebrow="Policy"
            title="Warranty"
            highlight="Policy"
            description="We stand behind every product we sell. Here's everything you need to know about our warranty coverage."
            sections={sections}
            showContactFooter={false}
            footerNote={
                <div className="text-center">
                    <p className="text-gray-500 mb-4 text-sm">Need to file a warranty claim?</p>
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
