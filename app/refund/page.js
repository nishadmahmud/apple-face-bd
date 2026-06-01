import Link from 'next/link';

export const metadata = {
    title: 'Refund Policy | Apple Face BD BD',
    description: 'Our refund and return policy. Learn about our hassle-free return process.',
};

export default function RefundPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-gradient-to-br from-brand-purple/10 via-purple-50 to-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Refund <span className="text-brand-purple">Policy</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Your satisfaction is our priority. Here's our refund and return policy.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Eligibility</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Products must be returned within 7 days of delivery</li>
                        <li>Items must be in original, unused condition with all packaging intact</li>
                        <li>All accessories, manuals, and free gifts must be included</li>
                        <li>Product must not be damaged, scratched, or show signs of use</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Products with broken seals or missing original packaging</li>
                        <li>Software, digital downloads, or activated products</li>
                        <li>Items marked as "non-returnable" on the product page</li>
                        <li>Products damaged by the customer</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                        <li>Contact us within 7 days of receiving your order</li>
                        <li>Provide your order number and reason for return</li>
                        <li>Our team will review and approve your return request</li>
                        <li>Ship the product back to us (shipping costs may apply)</li>
                        <li>Refund will be processed within 5-7 business days after receiving the product</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Methods</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Refunds are issued to the original payment method. For cash-on-delivery orders, refunds can be processed via bank transfer or mobile banking (bKash, Nagad). Please allow 5-7 business days for the refund to reflect in your account.
                    </p>
                </section>

                <div className="text-center pt-8 border-t border-gray-100">
                    <p className="text-gray-500 mb-4">Need to initiate a return?</p>
                    <Link href="/contact" className="inline-block bg-brand-purple text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-purple/20">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
