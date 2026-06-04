import ProductCard from "../Shared/ProductCard";
import SectionIntro from "../Shared/SectionIntro";
import SectionShell from "../Shared/SectionShell";

export default function FeaturedProducts({ products = [] }) {
  const displayProducts = Array.isArray(products) ? products : [];
  const visibleProducts = displayProducts.slice(0, 8);

  return (
    <SectionShell variant="light" border>
      <SectionIntro title="Featured" highlight="Products" href="/category" />

      {visibleProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {visibleProducts.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg bg-card-bg">
          No featured products available right now.
        </div>
      )}
    </SectionShell>
  );
}
