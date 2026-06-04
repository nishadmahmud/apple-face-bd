import ProductCard from "../Shared/ProductCard";
import SectionIntro from "../Shared/SectionIntro";
import SectionShell from "../Shared/SectionShell";

export default function FeaturedProducts({ products = [] }) {
  const displayProducts = Array.isArray(products) ? products : [];
  const [featured, ...rest] = displayProducts;
  const useBento = displayProducts.length >= 3;

  return (
    <SectionShell variant="light" border>
      <SectionIntro title="Featured" highlight="Products" href="/category" />

      {displayProducts.length > 0 ? (
        useBento ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 md:gap-4">
            <div className="col-span-2 row-span-2 min-h-[280px] lg:min-h-0">
              <ProductCard product={featured} />
            </div>
            {rest.map((product, idx) => (
              <ProductCard key={product.id || idx} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
            {displayProducts.map((product, idx) => (
              <ProductCard key={product.id || idx} product={product} />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg bg-card-bg">
          No featured products available right now.
        </div>
      )}
    </SectionShell>
  );
}
