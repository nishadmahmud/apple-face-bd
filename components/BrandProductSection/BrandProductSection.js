"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProductCard from "../Shared/ProductCard";
import SectionIntro from "../Shared/SectionIntro";
import SectionShell from "../Shared/SectionShell";
import { getBrandwiseProducts } from "../../lib/api";

const MOBILE_VISIBLE = 6;

export default function BrandProductSection({ brands = [] }) {
  const [activeBrandId, setActiveBrandId] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const tabsRef = useRef(null);

  const mapProduct = (p) => {
    const originalPrice = Number(p.retails_price || 0);
    const discountValue = Number(p.discount || 0);
    const discountType = String(p.discount_type || "").toLowerCase();
    const hasDiscount = discountValue > 0 && discountType !== "0";

    const price = hasDiscount
      ? discountType === "percentage"
        ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
        : Math.max(0, originalPrice - discountValue)
      : originalPrice;

    return {
      id: p.id,
      name: p.name,
      price: `৳ ${price.toLocaleString("en-IN")}`,
      oldPrice: hasDiscount ? `৳ ${originalPrice.toLocaleString("en-IN")}` : null,
      discount: hasDiscount
        ? discountType === "percentage"
          ? `-${discountValue}%`
          : `৳ ${discountValue}`
        : null,
      imageUrl:
        p.image_path || p.image_path1 || p.image_path2 || p.image_url || "/no-image.svg",
      badge: p.status || null,
    };
  };

  const [fetchedData, setFetchedData] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    if (!brands || brands.length === 0) return;

    const preFetchAll = async () => {
      setLoading(true);
      try {
        const promises = brands.map((brand) => getBrandwiseProducts(brand.id));
        const results = await Promise.all(promises);

        let combined = [];
        const dataMap = {};

        results.forEach((response, index) => {
          if (response?.success) {
            const brandId = brands[index].id;
            const rawData = response.data?.data || response.data || [];
            const dataArray = Array.isArray(rawData) ? rawData : [];
            const mapped = dataArray.map(mapProduct);

            dataMap[brandId] = mapped;
            combined = [...combined, ...mapped];
          }
        });

        const shuffled = combined.sort(() => 0.5 - Math.random());

        setFetchedData(dataMap);
        setAllProducts(shuffled);

        if (activeBrandId === 0) {
          setProducts(shuffled);
        }
      } catch (err) {
        console.error("Error pre-fetching brand products:", err);
      } finally {
        setLoading(false);
      }
    };

    preFetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brands]);

  useEffect(() => {
    if (loading && Object.keys(fetchedData).length === 0) return;

    if (activeBrandId === 0) {
      setProducts(allProducts);
    } else if (fetchedData[activeBrandId]) {
      setProducts(fetchedData[activeBrandId]);
    } else {
      setProducts([]);
    }
  }, [activeBrandId, allProducts, fetchedData, loading]);

  const visibleProducts = products.slice(0, 10);
  const mobileProducts = products.slice(0, MOBILE_VISIBLE);

  return (
    <SectionShell variant="light" border>
      <SectionIntro title="Top Brand" highlight="Products" href="/category" linkLabel="View all" />

      <div
        ref={tabsRef}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar border-b border-gray-200 mb-6"
      >
        {(brands.length > 0 || products.length > 0) && (
          <button
            type="button"
            onClick={() => setActiveBrandId(0)}
            className={`pb-2.5 text-sm font-bold whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeBrandId === 0
                ? "text-brand-primary border-brand-primary"
                : "text-gray-500 border-transparent hover:text-gray-900"
            }`}
          >
            All
          </button>
        )}
        {brands.map((brand) => (
          <button
            key={brand.id}
            type="button"
            onClick={() => setActiveBrandId(brand.id)}
            className={`pb-2.5 text-sm font-bold whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeBrandId === brand.id
                ? "text-brand-primary border-brand-primary"
                : "text-gray-500 border-transparent hover:text-gray-900"
            }`}
          >
            {brand.name}
          </button>
        ))}
      </div>

      <div className="relative min-h-[200px]">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-gray-100 rounded-lg h-[280px] md:h-[340px]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="md:hidden grid grid-cols-2 gap-3">
              {mobileProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {products.length > MOBILE_VISIBLE && (
              <div className="mt-4 text-center md:hidden">
                <Link
                  href="/category"
                  className="text-sm font-bold text-brand-primary hover:underline"
                >
                  View all products
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center text-gray-400 font-medium italic">
            No products found.
          </div>
        )}
      </div>
    </SectionShell>
  );
}
