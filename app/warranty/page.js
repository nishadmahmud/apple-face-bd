import Link from 'next/link';

export const metadata = {
    title: 'Warranty Policy | Apple Face BD BD',
    description: 'Learn about our warranty policy for electronics and gadgets purchased from Apple Face BD BD.',
};

export default function WarrantyPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-gradient-to-br from-brand-purple/10 via-purple-50 to-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Warranty <span className="text-brand-purple">Policy</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        We stand behind every product we sell. Here's everything you need to know about our warranty coverage.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Warranty Coverage</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">All products sold through Apple Face BD BD come with the manufacturer's official warranty. The warranty period and coverage vary by product and brand. Warranty details are listed on each product page.</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Smartphones: Typically 1 year manufacturer warranty</li>
                        <li>Laptops: Typically 1-2 years manufacturer warranty</li>
                        <li>Accessories: Typically 6 months to 1 year warranty</li>
                        <li>Extended warranty options may be available at checkout</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Covered</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Manufacturing defects in materials and workmanship</li>
                        <li>Hardware failures under normal usage conditions</li>
                        <li>Software issues that are factory-related</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Not Covered</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Physical damage, water damage, or accidental drops</li>
                        <li>Damage caused by unauthorized modifications or repairs</li>
                        <li>Normal wear and tear</li>
                        <li>Damage caused by misuse or negligence</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Claim Warranty</h2>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                        <li>Contact our support team via phone or email with your order details</li>
                        <li>Describe the issue you're experiencing</li>
                        <li>Our team will guide you through the warranty claim process</li>
                        <li>Ship the product to our service center or visit in person</li>
                        <li>We'll process the claim and repair/replace the product</li>
                    </ol>
                </section>

                <div className="text-center pt-8 border-t border-gray-100">
                    <p className="text-gray-500 mb-4">Need to file a warranty claim?</p>
                    <Link href="/contact" className="inline-block bg-brand-purple text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-purple/20">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
