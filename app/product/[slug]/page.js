"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProductGallery from '../../../components/Product/ProductGallery';
import ProductInfo from '../../../components/Product/ProductInfo';
import ProductSidebar from '../../../components/Product/ProductSidebar';
import ProductTabs from '../../../components/Product/ProductTabs';
import ProductCard from '../../../components/Shared/ProductCard';
import FAQ from '../../../components/FAQ/FAQ';
import EmptyState from '../../../components/Shared/EmptyState';
import { FiPackage } from 'react-icons/fi';
import { useRecentlyViewed } from '../../../context/RecentlyViewedContext';
import { getProductById, getRelatedProduct } from '../../../lib/api';
import { readProductSeed, writeProductSeed } from '../../../lib/productSeedCache';
import { buildVariantGalleryImages } from '../../../lib/imageUtils';

const PRODUCT_SEED_TTL_MS = 15 * 60 * 1000;

function mapApiProductToViewModel(p) {
    const originalPrice = Number(p?.retails_price || 0);
    const discountValue = Number(p?.discount || 0);
    const discountType = String(p?.discount_type || '').toLowerCase();
    const hasDiscount = discountValue > 0 && discountType !== '0';

    const price = hasDiscount
        ? discountType === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue)
        : originalPrice;

    const discountLabel = hasDiscount
        ? discountType === 'percentage'
            ? `-${discountValue}%`
            : `৳ ${discountValue.toLocaleString('en-IN')}`
        : null;

    const colorList = Array.isArray(p?.color) ? p.color.filter(Boolean) : [];
    const imeiImages = Array.isArray(p?.imei_image) ? p.imei_image.filter(Boolean) : [];
    const imeiList = Array.isArray(p?.imeis) ? p.imeis : [];
    const rawImeis = imeiList.filter((i) => Number(i?.in_stock) === 1);

    const marketingImages =
        (Array.isArray(p?.images) && p.images.length > 0 && p.images) ||
        (Array.isArray(p?.image_paths) && p.image_paths.length > 0 && p.image_paths) ||
        (imeiImages.length > 0 && imeiImages) ||
        (p?.image_path ? [p.image_path] : []) ||
        ['/no-image.svg'];

    const images =
        colorList.length > 0 && rawImeis.length > 0
            ? buildVariantGalleryImages(colorList, imeiList, marketingImages)
            : marketingImages;
    const statusText = String(p?.status || '').toLowerCase();
    const parsedStock = Number(p?.current_stock ?? p?.in_stock ?? 0);
    const hasExplicitInStock = typeof p?.in_stock === 'number';
    const hasVariantStock = imeiList.length > 0;
    const inStock = hasVariantStock
        ? rawImeis.length > 0
        : hasExplicitInStock
            ? p.in_stock !== 0
            : Number.isFinite(parsedStock)
                ? parsedStock > 0
                : !statusText.includes('out');

    return {
        id: p.id,
        name: p.name,
        brandName: p.brand_name || p.brands?.name || p.brand?.name || '',
        brandImage: p.brand_image || p.brands?.image || p.brand?.image || null,
        inStock,
        stockLabel: inStock ? 'In Stock' : 'Out of Stock',
        price: `৳ ${price.toLocaleString('en-IN')}`,
        rawPrice: price,
        originalPrice,
        oldPrice: hasDiscount
            ? `৳ ${originalPrice.toLocaleString('en-IN')}`
            : null,
        discount: discountLabel,
        discountValue,
        discountType,
        hasDiscount,
        images,
        colorList,
        imeiImages,
        rawImeis,
        description: p.description || '',
        specifications: Array.isArray(p.specifications) ? p.specifications : [],
        category: {
            id: p.category_id || p.category?.id,
            name: p.category_name || p.category?.name,
            slug: p.category_slug || p.category?.slug || (p.category_name || p.category?.name)?.toLowerCase().replace(/\s+/g, '-')
        }
    };
}

function mapSeedToViewModel(seed) {
    const parsedRaw = Number(seed?.rawPrice || 0);
    const parsedFromLabel = Number(String(seed?.price || '').replace(/[^\d.]/g, ''));
    const basePrice = Number.isFinite(parsedRaw) && parsedRaw > 0
        ? parsedRaw
        : (Number.isFinite(parsedFromLabel) ? parsedFromLabel : 0);
    const safeName = seed?.name || 'Product';
    return {
        id: seed?.id,
        name: safeName,
        brandName: seed?.brandName || seed?.brand || '',
        brandImage: seed?.brandImage || null,
        inStock: typeof seed?.inStock === 'boolean' ? seed.inStock : true,
        stockLabel: typeof seed?.inStock === 'boolean' ? (seed.inStock ? 'In Stock' : 'Out of Stock') : 'In Stock',
        price: seed?.price || `৳ ${basePrice.toLocaleString('en-IN')}`,
        rawPrice: basePrice,
        originalPrice: basePrice,
        oldPrice: seed?.oldPrice || null,
        discount: seed?.discount || null,
        discountValue: 0,
        discountType: 'fixed',
        hasDiscount: Boolean(seed?.oldPrice || seed?.discount),
        images: Array.isArray(seed?.images) && seed.images.length > 0
            ? seed.images
            : [seed?.imageUrl || '/no-image.svg'],
        rawImeis: Array.isArray(seed?.rawImeis) ? seed.rawImeis : [],
        description: '',
        specifications: [],
        category: seed?.category || {}
    };
}

export default function ProductDetailsPage() {
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';

    // Parse product ID from slug (supports "product-name-12345" or just "12345")
    const productId = useMemo(() => {
        if (!slug) return null;
        const decoded = decodeURIComponent(slug).trim();

        // Case 1: slug is just the numeric ID
        if (/^\d+$/.test(decoded)) {
            const directId = Number(decoded);
            return Number.isFinite(directId) && directId > 0 ? directId : null;
        }

        // Case 2: slug is "name-<id>"
        const parts = decoded.split('-');
        const maybeId = parts[parts.length - 1];
        const idNum = Number(maybeId);
        return Number.isFinite(idNum) && idNum > 0 ? idNum : null;
    }, [slug]);

    const [productData, setProductData] = useState(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isHydrating, setIsHydrating] = useState(false);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [pricingInfo, setPricingInfo] = useState(null);
    const [selectedCarePlans, setSelectedCarePlans] = useState([]);
    const [fromCategory, setFromCategory] = useState(null); // { name, slug }
    const { addRecentlyViewed } = useRecentlyViewed();

    useEffect(() => {
        // Check if we came from a category page
        if (typeof document !== 'undefined' && document.referrer) {
            const referrer = document.referrer;
            if (referrer.includes('/category/')) {
                // Try to extract category slug from referrer if needed, 
                // but we'll get the real name from product data
                setFromCategory(true);
            }
        }
    }, []);

    useEffect(() => {
        if (!productId) {
            setIsInitialLoading(false);
            setIsHydrating(false);
            setError('Invalid product.');
            return;
        }

        let cancelled = false;

        const load = async () => {
            setError('');
            setIsHydrating(true);

            let hasSeed = false;
            if (typeof window !== 'undefined') {
                try {
                    const seed = readProductSeed(productId, PRODUCT_SEED_TTL_MS);
                    if (seed && !cancelled) {
                        hasSeed = true;
                        const seedMapped = mapSeedToViewModel(seed);
                        setProductData(seedMapped);
                        setSelectedCarePlans([]);
                        setPricingInfo({
                            selectedPrice: seedMapped.rawPrice,
                            offerPrice: seedMapped.rawPrice,
                            regularPrice: seedMapped.originalPrice,
                            hasDiscount: seedMapped.hasDiscount,
                            usingOfferPrice: true
                        });
                    }
                } catch {
                    // Ignore malformed cache and continue with network fetch.
                }
            }

            setIsInitialLoading(!hasSeed);
            setError('');
            try {
                const res = await getProductById(productId);
                const payload = res?.data || res;
                if (!payload || !payload.id) {
                    throw new Error('Product not found');
                }

                const p = payload;
                const mappedProduct = mapApiProductToViewModel(p);
                writeProductSeed(productId, {
                    id: mappedProduct.id,
                    name: mappedProduct.name,
                    brand: mappedProduct.brandName || '',
                    brandName: mappedProduct.brandName || '',
                    imageUrl: mappedProduct.images?.[0] || '/no-image.svg',
                    images: mappedProduct.images || [],
                    price: mappedProduct.price || '',
                    oldPrice: mappedProduct.oldPrice || null,
                    discount: mappedProduct.discount || null,
                    rawPrice: mappedProduct.rawPrice || 0,
                    inStock: mappedProduct.inStock,
                    stockLabel: mappedProduct.stockLabel,
                    rawImeis: mappedProduct.rawImeis || [],
                    category: mappedProduct.category || {}
                });

                if (!cancelled) {
                    setProductData(mappedProduct);
                    setSelectedCarePlans([]);
                    setPricingInfo({
                        selectedPrice: mappedProduct.rawPrice,
                        offerPrice: mappedProduct.rawPrice,
                        regularPrice: mappedProduct.originalPrice,
                        hasDiscount: mappedProduct.hasDiscount,
                        usingOfferPrice: true
                    });
                }

                // Load related products
                getRelatedProduct(p.id)
                    .then((relatedRes) => {
                        const relatedPayload = relatedRes?.data || relatedRes;
                        const relatedItems = Array.isArray(relatedPayload?.data)
                            ? relatedPayload.data
                            : Array.isArray(relatedPayload)
                                ? relatedPayload
                                : [];

                        if (!cancelled) {
                            const mappedRelated = relatedItems.map((rp) => {
                                const rpPrice = Number(rp.retails_price || 0);
                                return {
                                    id: rp.id,
                                    name: rp.name,
                                    price: `৳ ${rpPrice.toLocaleString('en-IN')}`,
                                    oldPrice: null,
                                    discount: null,
                                    imageUrl: rp.image_path || rp.image_path1 || rp.image_path2 || '/no-image.svg',
                                };
                            });
                            setRelatedProducts(mappedRelated.slice(0, 8));
                        }
                    })
                    .catch(() => {
                        // ignore related errors
                    });
            } catch (err) {
                console.error('Failed to load product details', err);
                if (!cancelled) {
                    setError('Failed to load product details.');
                }
            } finally {
                if (!cancelled) {
                    setIsInitialLoading(false);
                    setIsHydrating(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [productId]);

    const recentProductId = productData?.id || null;
    const recentProductName = productData?.name || '';
    const recentProductBrand = productData?.brandName || '';
    const recentProductPrice = productData?.price || '';
    const recentProductOldPrice = productData?.oldPrice || null;
    const recentProductImage = Array.isArray(productData?.images) ? (productData.images[0] || '/no-image.svg') : '/no-image.svg';

    useEffect(() => {
        if (!recentProductId) return;
        addRecentlyViewed({
            id: recentProductId,
            name: recentProductName,
            brand: recentProductBrand,
            imageUrl: recentProductImage,
            price: recentProductPrice,
            oldPrice: recentProductOldPrice
        });
    }, [recentProductId, recentProductName, recentProductBrand, recentProductPrice, recentProductOldPrice, recentProductImage, addRecentlyViewed]);

    const productName =
        productData?.name ||
        (slug
            ? decodeURIComponent(slug)
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (ch) => ch.toUpperCase())
            : 'Product');

    return (
        <div className="bg-card-bg min-h-screen pb-20 md:pb-10">
            <div className="max-w-site mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-4">
                <nav className="text-[11px] md:text-sm text-gray-500 flex items-center gap-2 font-medium min-w-0" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-brand-primary cursor-pointer transition-colors shrink-0">Home</Link>
                    <span className="shrink-0">/</span>
                    {fromCategory && productData?.category?.name && (
                        <>
                            <Link
                                href={`/category/${productData.category.slug}`}
                                className="hover:text-brand-primary cursor-pointer transition-colors capitalize truncate"
                            >
                                {productData.category.name}
                            </Link>
                            <span className="shrink-0">/</span>
                        </>
                    )}
                    <span className="text-gray-900 font-semibold capitalize truncate">{productName}</span>
                </nav>
            </div>

            <div className="max-w-site mx-auto px-4 md:px-6">

                {isInitialLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-sm text-gray-500">Loading product details…</p>
                    </div>
                ) : error || !productData ? (
                    <EmptyState
                        icon={FiPackage}
                        title="Product not found"
                        description={error || 'This product may have been removed or the link is incorrect.'}
                        actionHref="/"
                        actionLabel="Back to shop"
                    />
                ) : (
                    <>
                        <div className="w-full">
                            <ProductInfo
                                product={productData}
                                onPricingChange={setPricingInfo}
                                selectedCarePlans={selectedCarePlans}
                                galleryComponent={
                                    <ProductGallery images={productData?.images} />
                                }
                                sidebarComponent={
                                    <ProductSidebar
                                        product={productData}
                                        pricingInfo={pricingInfo}
                                        selectedCarePlans={selectedCarePlans}
                                        onSelectedCarePlansChange={setSelectedCarePlans}
                                    />
                                }
                            />
                        </div>
                        {isHydrating && (
                            <p className="text-xs text-gray-400 mt-3">Updating latest product details...</p>
                        )}

                        {/* Bottom: Tabs */}
                        <ProductTabs
                            productId={productData.id}
                            description={productData.description}
                            specifications={productData.specifications}
                        />

                        {/* Related Products Section */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-12 md:mt-16 pt-10 border-t border-gray-200">
                                <h2 className="flex items-center gap-3 text-xl md:text-2xl font-extrabold text-gray-900 mb-6 md:mb-8">
                                    <span className="w-1 h-7 bg-brand-primary rounded-full shrink-0" aria-hidden />
                                    Related Products
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                                    {relatedProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <FAQ />
                    </>
                )}
            </div>
        </div>
    );
}
