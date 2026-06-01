"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiHeart, FiX } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProductById } from '../../lib/api';
import { readProductSeed, writeProductSeed } from '../../lib/productSeedCache';

export default function ProductCard({ product, variant = 'default' }) {
    const isCompact = variant === 'compact';
    const router = useRouter();
    const { addToCart, cartItems } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);
    const isInCart = cartItems.some((item) => item.id === product.id);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [pendingAction, setPendingAction] = useState('cart');
    const [runtimeImeis, setRuntimeImeis] = useState([]);
    const [isResolvingVariants, setIsResolvingVariants] = useState(false);
    
    const nameSlug = product.name
        ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : 'product';
    const slug = product.id ? `${nameSlug}-${product.id}` : nameSlug;

    const formatPrice = (priceStr) => {
        if (!priceStr) return '';
        return priceStr.replace('Tk', 'Tk.').replace('৳', '৳');
    };

    const productBrand = String(
        product.brand || product.brand_name || product.brands?.name || ''
    ).trim();

    const parseMoneyToNumber = (value) => {
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (!value) return 0;
        const normalized = String(value).replace(/[^\d.]/g, '');
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const discountBadgeText = (() => {
        if (!product.discount) return '';
        const normalized = String(product.discount).replace('৳', 'Tk').trim();
        return /off$/i.test(normalized) ? normalized : `${normalized} Off`;
    })();

    const imeis = useMemo(() => {
        if (Array.isArray(runtimeImeis) && runtimeImeis.length > 0) return runtimeImeis;
        if (Array.isArray(product?.rawImeis) && product.rawImeis.length > 0) return product.rawImeis;
        if (Array.isArray(product?.imeis) && product.imeis.length > 0) return product.imeis;
        return [];
    }, [runtimeImeis, product?.rawImeis, product?.imeis]);
    const hasVariants = imeis.length > 0;
    const inStockImeis = useMemo(
        () => imeis.filter((i) => Number(i?.in_stock) === 1),
        [imeis]
    );
    const variantSource = inStockImeis.length > 0 ? inStockImeis : imeis;

    const allColors = useMemo(() => {
        const colorMap = new Map();
        variantSource.forEach((i) => {
            if (i?.color && !colorMap.has(i.color)) {
                colorMap.set(i.color, { name: i.color, hex: i.color_code || '#e5e7eb' });
            }
        });
        return Array.from(colorMap.values());
    }, [variantSource]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const effectiveColor = useMemo(() => {
        if (!hasVariants) return null;
        if (selectedColor && allColors.some((c) => c.name === selectedColor)) return selectedColor;
        return allColors[0]?.name || null;
    }, [hasVariants, selectedColor, allColors]);

    const availableStorages = useMemo(() => {
        const colorMatched = variantSource.filter((i) => !effectiveColor || i.color === effectiveColor);
        return [...new Set(colorMatched.map((i) => i.storage).filter(Boolean))];
    }, [variantSource, effectiveColor]);

    const effectiveStorage = useMemo(() => {
        if (!hasVariants) return null;
        if (selectedStorage && availableStorages.includes(selectedStorage)) return selectedStorage;
        return availableStorages[0] || null;
    }, [hasVariants, selectedStorage, availableStorages]);

    const availableRegions = useMemo(() => {
        const matched = variantSource.filter((i) => {
            let valid = true;
            if (effectiveColor && i.color) valid = valid && i.color === effectiveColor;
            if (effectiveStorage && i.storage) valid = valid && i.storage === effectiveStorage;
            return valid;
        });
        return [...new Set(matched.map((i) => i.region).filter(Boolean))];
    }, [variantSource, effectiveColor, effectiveStorage]);

    const effectiveRegion = useMemo(() => {
        if (!hasVariants) return null;
        if (selectedRegion && availableRegions.includes(selectedRegion)) return selectedRegion;
        return availableRegions[0] || null;
    }, [hasVariants, selectedRegion, availableRegions]);

    const matchedImei = useMemo(() => {
        if (!hasVariants) return null;

        let match = variantSource.find(
            (i) =>
                (!effectiveColor || i.color === effectiveColor) &&
                (!effectiveStorage || i.storage === effectiveStorage) &&
                (!effectiveRegion || i.region === effectiveRegion)
        );

        if (!match) {
            match = variantSource.find(
                (i) => (!effectiveColor || i.color === effectiveColor) && (!effectiveStorage || i.storage === effectiveStorage)
            );
        }

        if (!match) {
            match = variantSource.find((i) => !effectiveColor || i.color === effectiveColor);
        }

        return match || null;
    }, [hasVariants, variantSource, effectiveColor, effectiveStorage, effectiveRegion]);

    const selectedVariantPrice = useMemo(() => {
        const variantPrice = Number(matchedImei?.sale_price);
        if (Number.isFinite(variantPrice) && variantPrice > 0) return variantPrice;
        const raw = Number(product.rawPrice);
        if (Number.isFinite(raw) && raw > 0) return raw;
        return parseMoneyToNumber(product.price);
    }, [matchedImei?.sale_price, product.rawPrice, product.price]);
    const colorDrivenImage = useMemo(() => {
        if (!effectiveColor) return null;
        const colorImeis = variantSource.filter((i) => i.color === effectiveColor && i.image_path);
        return colorImeis[0]?.image_path || null;
    }, [variantSource, effectiveColor]);
    const modalDisplayImage = colorDrivenImage || matchedImei?.image_path || product.imageUrl || '/no-image.svg';

    const isOutOfStock = (() => {
        if (hasVariants) return inStockImeis.length === 0;
        if (typeof product?.inStock === 'boolean') return !product.inStock;
        const stockValue = Number(product?.current_stock ?? product?.in_stock);
        if (Number.isFinite(stockValue)) return stockValue <= 0;
        const status = String(product?.stockLabel || product?.status || '').toLowerCase();
        return status.includes('out of stock');
    })();

    const isPhoneLikeProduct = useMemo(() => {
        const category = String(product?.category?.name || product?.category_name || '').toLowerCase();
        const name = String(product?.name || '').toLowerCase();
        return category.includes('phone') || category.includes('mobile') || name.includes('iphone') || name.includes('galaxy');
    }, [product?.category?.name, product?.category_name, product?.name]);

    const cacheProductSeed = () => {
        if (typeof window === 'undefined' || !product?.id) return;
        try {
            const numericRawPrice = Number(product.rawPrice);
            const fallbackPrice = parseMoneyToNumber(product.price);
            const finalRawPrice = Number.isFinite(numericRawPrice) && numericRawPrice > 0
                ? numericRawPrice
                : fallbackPrice;
            writeProductSeed(product.id, {
                id: product.id,
                name: product.name || '',
                brand: productBrand,
                brandName: productBrand,
                imageUrl: product.imageUrl || '/no-image.svg',
                images: Array.isArray(product.images) ? product.images : [product.imageUrl || '/no-image.svg'],
                price: product.price || '',
                oldPrice: product.oldPrice || null,
                discount: product.discount || null,
                rawPrice: finalRawPrice,
                inStock: typeof product.inStock === 'boolean' ? product.inStock : undefined,
                stockLabel: product.stockLabel || undefined,
                ...(Array.isArray(product.rawImeis) && product.rawImeis.length > 0
                    ? { rawImeis: product.rawImeis }
                    : {})
            });
        } catch {
            // Ignore sessionStorage errors (private mode/quota).
        }
    };

    const buildVariantPayload = () => {
        if (!hasVariants || !matchedImei) return null;

        const variants = {
            priceOption: 'offer',
            customBasePrice: selectedVariantPrice
        };
        if (matchedImei.storage) variants.storage = matchedImei.storage;
        if (matchedImei.color) variants.colors = { name: matchedImei.color, hex: matchedImei.color_code || '' };
        if (matchedImei.region) variants.region = matchedImei.region;

        const imeiId = matchedImei.id || matchedImei.imei_id || matchedImei.imeiId || null;
        const imeiValue = matchedImei.imei || matchedImei.imei_no || null;
        if (imeiId) variants.imeiId = imeiId;
        if (imeiValue) variants.imei = imeiValue;

        return variants;
    };

    const handleAddToCart = (e, openSidebar = true, variants = null) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;
        addToCart(product, 1, variants, openSidebar);
    };

    const handleBuyNow = (e) => {
        if (isOutOfStock) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        handleAddToCart(e, false, null);
        router.push('/checkout');
    };

    const handleActionClick = async (e, action) => {
        // Always block card navigation first because buttons live inside the card Link.
        e.preventDefault();
        e.stopPropagation();

        if (isOutOfStock) {
            return;
        }
        setPendingAction(action);
        const variantImeis = hasVariants ? imeis : await loadVariantsIfNeeded();
        if (Array.isArray(variantImeis) && variantImeis.length > 0) {
            setShowVariantModal(true);
            return;
        }
        if (action === 'buy') {
            handleBuyNow(e);
            return;
        }
        handleAddToCart(e, true, null);
    };

    const handleVariantConfirm = () => {
        if (!matchedImei) return;
        const variants = buildVariantPayload();
        const selectedImage = modalDisplayImage || product.imageUrl || '/no-image.svg';
        const existingImages = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
        const mergedImages = [selectedImage, ...existingImages.filter((img) => img !== selectedImage)];
        const cartProduct = {
            ...product,
            imageUrl: selectedImage,
            images: mergedImages
        };
        addToCart(cartProduct, 1, variants, pendingAction !== 'buy');
        setShowVariantModal(false);
        if (pendingAction === 'buy') router.push('/checkout');
    };

    const loadVariantsIfNeeded = async () => {
        if (imeis.length > 0 || !product?.id || !isPhoneLikeProduct) return imeis;

        const cached = readProductSeed(product.id);
        const cachedImeis = Array.isArray(cached?.rawImeis) ? cached.rawImeis : [];
        if (cachedImeis.length > 0) {
            setRuntimeImeis(cachedImeis);
            return cachedImeis;
        }

        setIsResolvingVariants(true);
        try {
            const res = await getProductById(product.id);
            const payload = res?.data || res;
            const fetchedImeis = Array.isArray(payload?.imeis) ? payload.imeis : [];
            if (fetchedImeis.length > 0) setRuntimeImeis(fetchedImeis);
            writeProductSeed(product.id, {
                id: product.id,
                name: product.name || payload?.name || '',
                brand: productBrand,
                brandName: productBrand,
                imageUrl: product.imageUrl || payload?.image_path || '/no-image.svg',
                images: Array.isArray(payload?.images) && payload.images.length > 0
                    ? payload.images
                    : [product.imageUrl || payload?.image_path || '/no-image.svg'],
                price: product.price || '',
                oldPrice: product.oldPrice || null,
                discount: product.discount || null,
                rawPrice: Number(product.rawPrice || 0),
                rawImeis: fetchedImeis
            });
            return fetchedImeis;
        } catch (error) {
            console.error('Failed to fetch variant data for product card', error);
            return [];
        } finally {
            setIsResolvingVariants(false);
        }
    };

    return (
        <>
            <Link
                href={`/product/${slug}`}
                onClick={cacheProductSeed}
                className="bg-white rounded-2xl flex flex-col text-left hover:-translate-y-1 transition-all duration-400 group overflow-hidden relative h-full w-full border border-gray-200 hover:border-brand-primary/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
                {/* Image Area */}
                <div className={`w-full ${isCompact ? 'aspect-[16/11] md:aspect-[16/10]' : 'aspect-square'} relative flex items-center justify-center bg-card-bg rounded-t-2xl overflow-hidden`}>
                {/* Category/Brand tag */}
                {productBrand && (
                    <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        {productBrand}
                    </span>
                )}

                {/* Discount badge */}
                {discountBadgeText && (
                    <span className="absolute top-3 right-3 z-10 text-[10px] md:text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 md:px-3 py-1 rounded-lg shadow-sm">
                        {discountBadgeText}
                    </span>
                )}

                {(product.isNew || product.badge === 'New Arrival') && !product.discount && (
                    <span className="absolute top-3 right-3 z-10 text-[10px] font-bold text-white bg-brand-primary px-2 py-0.5 rounded-md">
                        New
                    </span>
                )}

                <Image
                    src={product.imageUrl || '/no-image.svg'}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                </div>

            {/* Content Area — tighter horizontal padding on mobile so action row fits */}
                <div className="flex flex-col flex-1 p-2.5 sm:p-3 md:p-4 min-w-0">
                <h3 className={`text-gray-900 font-bold ${isCompact ? 'text-[12px] md:text-[14px]' : 'text-[13px] md:text-[15px]'} leading-snug line-clamp-2 mb-1.5 md:mb-2 group-hover:text-brand-primary transition-colors`}>
                    {product.name}
                </h3>

                {/* Price Row */}
                <div className={`flex items-baseline gap-2 ${isCompact ? 'mb-2 md:mb-3' : 'mb-3'} mt-auto`}>
                    <span className={`text-gray-900 font-extrabold ${isCompact ? 'text-[14px] md:text-[16px]' : 'text-[15px] md:text-[17px]'}`}>
                        {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                        <span className="text-gray-400 text-[11px] md:text-[12px] font-medium line-through">
                            {formatPrice(product.oldPrice)}
                        </span>
                    )}
                </div>

                    {/* Mobile: cart + wishlist top (50/50 rectangles), Buy full width below. sm+: single row pills. */}
                    <div className="flex flex-col gap-2 min-w-0 sm:flex-row sm:items-stretch sm:gap-2">
                        <div className="flex w-full min-w-0 gap-1.5 order-1 sm:order-2 sm:w-auto sm:shrink-0 sm:justify-end sm:gap-2">
                            <button
                                type="button"
                                className={`flex-1 basis-0 h-8 min-h-0 rounded-md border-2 flex items-center justify-center transition-all duration-300 sm:h-10 sm:flex-none sm:w-10 sm:min-h-0 sm:rounded-full ${isWishlisted ? 'border-orange-400 bg-orange-400 text-white' : 'border-orange-300 text-orange-400 hover:bg-orange-50 active:opacity-90'}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleWishlist(product);
                                }}
                                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <FiHeart className={`w-[15px] h-[15px] sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                type="button"
                                className={`flex-1 basis-0 h-8 min-h-0 rounded-md border-2 flex items-center justify-center transition-all duration-300 sm:h-10 sm:flex-none sm:w-10 sm:min-h-0 sm:rounded-full ${isOutOfStock ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : isInCart ? 'border-brand-primary bg-brand-primary text-white' : 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white active:opacity-90'}`}
                                onClick={(e) => handleActionClick(e, 'cart')}
                                aria-label={isOutOfStock ? 'Out of stock' : isInCart ? 'In cart' : 'Add to cart'}
                                disabled={isOutOfStock || isResolvingVariants}
                            >
                                <FiShoppingCart className="w-[15px] h-[15px] sm:w-4 sm:h-4" />
                            </button>
                        </div>
                        <button
                            type="button"
                            className={`order-2 w-full sm:order-1 sm:flex-1 sm:min-w-0 ${isCompact ? 'h-8 sm:h-9 md:h-10' : 'h-9 sm:h-9 md:h-10'} rounded-full border-2 flex items-center justify-center transition-all duration-300 px-2 ${isOutOfStock ? 'border-gray-200 bg-gray-100 cursor-not-allowed' : 'border-brand-primary hover:bg-brand-primary group/buy'}`}
                            onClick={(e) => handleActionClick(e, 'buy')}
                            aria-label={isOutOfStock ? 'Out of stock' : 'Buy now'}
                            disabled={isOutOfStock || isResolvingVariants}
                        >
                            <span className={`${isOutOfStock || isResolvingVariants ? 'text-gray-400' : 'text-brand-primary group-hover/buy:text-white'} font-bold text-center leading-tight ${isCompact ? 'text-[10px] sm:text-[11px] md:text-[12px]' : 'text-[10px] sm:text-[12px] md:text-[13px]'} tracking-tight max-sm:whitespace-normal max-sm:line-clamp-2 sm:whitespace-nowrap`}>
                                {isOutOfStock ? 'Out of Stock' : isResolvingVariants ? 'Loading...' : 'Buy Now'}
                            </span>
                        </button>
                    </div>
                </div>
            </Link>

            {showVariantModal && hasVariants && (
                <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowVariantModal(false)}>
                    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-base font-extrabold text-gray-900">Choose Variant</h3>
                            <button onClick={() => setShowVariantModal(false)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500" aria-label="Close">
                                <FiX size={16} />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                                    <Image
                                        src={modalDisplayImage}
                                        alt={product.name}
                                        fill
                                        unoptimized
                                        className="object-contain p-1"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-800 line-clamp-2">{product.name}</p>
                                    <p className="text-sm font-extrabold text-gray-900 mt-1">
                                        Tk {selectedVariantPrice.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                            {allColors.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-2">Color</p>
                                    <div className="flex flex-wrap gap-2">
                                        {allColors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${effectiveColor === color.name ? 'border-brand-primary text-brand-primary bg-brand-primary/5' : 'border-gray-200 text-gray-600'}`}
                                            >
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {availableStorages.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-2">Storage</p>
                                    <div className="flex flex-wrap gap-2">
                                        {availableStorages.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedStorage(size)}
                                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${effectiveStorage === size ? 'border-brand-primary text-brand-primary bg-brand-primary/5' : 'border-gray-200 text-gray-600'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {availableRegions.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-2">Region</p>
                                    <div className="flex flex-wrap gap-2">
                                        {availableRegions.map((region) => (
                                            <button
                                                key={region}
                                                onClick={() => setSelectedRegion(region)}
                                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${effectiveRegion === region ? 'border-brand-primary text-brand-primary bg-brand-primary/5' : 'border-gray-200 text-gray-600'}`}
                                            >
                                                {region}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
                                <p className="text-gray-500 font-medium">Selected</p>
                                <p className="text-gray-900 font-bold mt-0.5">
                                    {[matchedImei?.storage, matchedImei?.color, matchedImei?.region].filter(Boolean).join(' / ') || 'No variant selected'}
                                </p>
                            </div>
                            <button
                                type="button"
                                disabled={!matchedImei || Number(matchedImei?.in_stock) !== 1}
                                onClick={handleVariantConfirm}
                                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${!matchedImei || Number(matchedImei?.in_stock) !== 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-brand-primary text-white hover:opacity-90'}`}
                            >
                            {isResolvingVariants ? 'Loading variants...' : pendingAction === 'buy' ? 'Buy Now' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isResolvingVariants && !showVariantModal && (
                <div className="fixed inset-0 z-[110] bg-black/35 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-brand-primary/30 border-t-brand-primary animate-spin"></div>
                            <p className="text-sm font-semibold text-gray-700">Loading variants...</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
