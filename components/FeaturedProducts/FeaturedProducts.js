import Link from 'next/link';
import ProductCard from '../Shared/ProductCard';
import SectionHeader from '../Shared/SectionHeader';

export default function FeaturedProducts({ products = [] }) {
    const displayProducts = Array.isArray(products) ? products : [];

    return (
        <section className="bg-[#f7f7f7] py-10 md:py-16 border-y border-gray-100">
            <div className="max-w-site mx-auto px-4 md:px-6">
                <SectionHeader title="Featured" highlight="Products" href="/category" />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
                    {displayProducts.length > 0 ? displayProducts.map((product, idx) => (
                        <ProductCard key={product.id || idx} product={product} />
                    )) : (
                        <div className="col-span-full text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg bg-white">
                            No featured products available right now.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
