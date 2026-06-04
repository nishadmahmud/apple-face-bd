import HomeHero from "../components/Hero/HomeHero";
import ShopCategories from "../components/ShopCategories/ShopCategories";
import FlashSale from "../components/FlashSale/FlashSale";
import NewArrivals from "../components/NewArrivals/NewArrivals";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import BestDeals from "../components/BestDeals/BestDeals";
import Testimonials from "../components/Testimonials/Testimonials";
import BrandProductSection from "../components/BrandProductSection/BrandProductSection";
import FAQ from "../components/FAQ/FAQ";
import BlogTips from "../components/BlogTips/BlogTips";
import HomeSEOContent from "../components/HomeSEOContent/HomeSEOContent";
import WidePromoBanner from "../components/WidePromoBanner/WidePromoBanner";
import CampaignShowcase from "../components/CampaignShowcase/CampaignShowcase";

import {
  getSlidersFromServer,
  getCategoriesFromServer,
  getNewArrivalsFromServer,
  getBannerFromServer,
  getBestDealsFromServer,
  getBestSellersFromServer,
  getTopBrands,
} from "../lib/api";
import { getDummyBlogPosts } from "../lib/dummyBlogs";
import {
  normalizeHeroSlides,
  normalizeHeroBanners,
  normalizeHomeBanners,
  normalizeWideBanners,
} from "../lib/homeHero";

export const revalidate = 120;

function toMoney(v) {
  return `৳ ${Number(v || 0).toLocaleString("en-IN")}`;
}

function normalizeDiscount(discount, type) {
  const d = Number(discount || 0);
  if (!d || d <= 0) return null;
  return String(type).toLowerCase() === "percentage"
    ? `-${d}%`
    : `৳ ${d.toLocaleString("en-IN")}`;
}

function settle(fetcher, label) {
  return fetcher().catch((error) => {
    console.error(`Failed to fetch ${label}:`, error);
    return null;
  });
}

export default async function Home() {
  const [
    categoriesRes,
    bannersRes,
    slidersRes,
    newArrivalsRes,
    bestDealsRes,
    bestSellersRes,
    topBrandsRes,
  ] = await Promise.all([
    settle(getCategoriesFromServer, "categories"),
    settle(getBannerFromServer, "banners"),
    settle(getSlidersFromServer, "sliders"),
    settle(getNewArrivalsFromServer, "new arrivals"),
    settle(getBestDealsFromServer, "best deals"),
    settle(getBestSellersFromServer, "best sellers"),
    settle(getTopBrands, "top brands"),
  ]);

  const categories =
    categoriesRes?.success && Array.isArray(categoriesRes?.data)
      ? categoriesRes.data
      : [];

  const heroSlides = normalizeHeroSlides(slidersRes);
  const heroBanners = normalizeHeroBanners(bannersRes, 3);
  const homeBanners = normalizeHomeBanners(bannersRes);
  const wideBanners = normalizeWideBanners(bannersRes);
  const campaignBanners = homeBanners.slice(3, 5);

  const newArrivalsItems = newArrivalsRes?.success ? newArrivalsRes?.data?.data : null;
  const newArrivals = Array.isArray(newArrivalsItems)
    ? newArrivalsItems.slice(0, 10).map((p) => {
        const discountValue = Number(p.discount || 0);
        const discountType = p.discount_type;
        const hasDiscount = discountValue > 0 && String(discountType || "").toLowerCase() !== "0";
        const originalPrice = Number(p.retails_price || 0);
        const discountedPrice = hasDiscount
          ? String(discountType).toLowerCase() === "percentage"
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue)
          : originalPrice;

        return {
          id: p.id,
          name: p.name,
          brand: p.brands?.name || "Others",
          price: toMoney(discountedPrice),
          oldPrice: hasDiscount ? toMoney(originalPrice) : null,
          discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
          imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || "/no-image.svg",
          rawPrice: discountedPrice,
          rawImeis: Array.isArray(p.imeis) ? p.imeis : [],
          inStock: Number(p.in_stock ?? p.current_stock ?? 0) > 0,
        };
      })
    : [];

  const bestDealsItems = bestDealsRes?.success ? bestDealsRes?.data : null;
  const sortedBestDeals = Array.isArray(bestDealsItems)
    ? [...bestDealsItems].sort((a, b) => {
        const priceA = Number(a.discounted_price || a.retails_price || 0);
        const priceB = Number(b.discounted_price || b.retails_price || 0);
        return priceB - priceA;
      })
    : [];

  const bestDealsCards = sortedBestDeals.slice(0, 2).map((pp, idx) => {
    const originalPrice = Number(pp.retails_price || 0);
    const discountValue = Number(pp.discount || 0);
    const discountType = pp.discount_type;
    const hasDiscount = discountValue > 0 && String(discountType || "").toLowerCase() !== "0";
    const discountedPrice = hasDiscount
      ? String(discountType).toLowerCase() === "percentage"
        ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
        : Math.max(0, originalPrice - discountValue)
      : originalPrice;
    const savingsValue = Math.max(0, originalPrice - discountedPrice);
    const badge = hasDiscount
      ? String(discountType).toLowerCase() === "percentage"
        ? `-${discountValue}%`
        : `Save ৳${discountValue}`
      : idx === 0
        ? "BEST DEAL"
        : "HOT DEAL";

    const descParts = [];
    if (pp.brands?.name) descParts.push(pp.brands.name);
    if (pp.status) descParts.push(pp.status);
    if (savingsValue > 0) descParts.push(`Save ৳ ${savingsValue.toLocaleString("en-IN")}`);

    const slugName = pp.name ? pp.name.toLowerCase().replace(/\s+/g, "-") : "product";
    const slugWithId = pp.id ? `${slugName}-${pp.id}` : slugName;

    return {
      id: pp.id,
      title: pp.name,
      description: descParts.join(" • ") || "Limited time offer.",
      price: toMoney(discountedPrice),
      oldPrice: hasDiscount ? toMoney(originalPrice) : null,
      savings: savingsValue > 0 ? `Save ৳ ${savingsValue.toLocaleString("en-IN")}` : null,
      imageUrl: pp.image_path || pp.image_url || "/no-image.svg",
      badge,
      link: `/product/${slugWithId}`,
    };
  });

  const flashSaleProducts = Array.isArray(bestDealsItems)
    ? bestDealsItems
        .filter((p) => p.image_path || p.image_url)
        .slice(0, 10)
        .map((p) => {
          const originalPrice = Number(p.retails_price || 0);
          const discountValue = Number(p.discount || 0);
          const discountType = p.discount_type;
          const hasDiscount = discountValue > 0 && String(discountType || "").toLowerCase() !== "0";
          const discountedPrice = hasDiscount
            ? String(discountType).toLowerCase() === "percentage"
              ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
              : Math.max(0, originalPrice - discountValue)
            : originalPrice;

          return {
            id: p.id,
            name: p.name,
            price: toMoney(discountedPrice),
            oldPrice: hasDiscount ? toMoney(originalPrice) : null,
            discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
            imageUrl: p.image_path || p.image_url || "/no-image.svg",
            rawPrice: discountedPrice,
            rawImeis: Array.isArray(p.imeis) ? p.imeis : [],
            inStock: Number(p.in_stock ?? p.current_stock ?? 0) > 0,
          };
        })
    : [];

  const bestSellersItems = bestSellersRes?.success ? bestSellersRes?.data?.data || bestSellersRes?.data : null;
  const featuredProducts = Array.isArray(bestSellersItems)
    ? bestSellersItems.map((p) => {
        const originalPrice = Number(p.retails_price || 0);
        const discountValue = Number(p.discount || 0);
        const discountType = p.discount_type;
        const hasDiscount = discountValue > 0 && String(discountType || "").toLowerCase() !== "0";
        const discountedPrice = hasDiscount
          ? String(discountType).toLowerCase() === "percentage"
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue)
          : originalPrice;

        return {
          id: p.id,
          name: p.name,
          price: toMoney(discountedPrice),
          oldPrice: hasDiscount ? toMoney(originalPrice) : null,
          discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
          imageUrl: p.image_path || p.image_url || "/no-image.svg",
          rawPrice: discountedPrice,
          rawImeis: Array.isArray(p.imeis) ? p.imeis : [],
          inStock: Number(p.in_stock ?? p.current_stock ?? 0) > 0,
        };
      })
    : [];

  const campaignProducts =
    featuredProducts.length > 6 ? featuredProducts.slice(6, 12) : featuredProducts;

  const blogPosts = getDummyBlogPosts();
  const topBrands = topBrandsRes?.success && Array.isArray(topBrandsRes?.data) ? topBrandsRes.data : [];

  return (
    <>
      <HomeHero slides={heroSlides} banners={heroBanners} />
      <ShopCategories categories={categories} />
      <NewArrivals products={newArrivals} />
      <FlashSale products={flashSaleProducts} />
      <FeaturedProducts products={featuredProducts} />
      {wideBanners[0] && <WidePromoBanner banner={wideBanners[0]} variant="light" />}
      <BrandProductSection brands={topBrands} />
      <BestDeals deals={bestDealsCards} />
      <CampaignShowcase
        title="Top Digital Trends"
        splitBanners={campaignBanners}
        products={campaignProducts}
      />
      {wideBanners[1] && <WidePromoBanner banner={wideBanners[1]} variant="muted" />}
      <BlogTips posts={blogPosts} />
      <Testimonials />
      <FAQ />
      <HomeSEOContent />
    </>
  );
}
