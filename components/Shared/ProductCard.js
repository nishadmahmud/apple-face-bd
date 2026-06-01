"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProductById } from '../../lib/api';
import { readProductSeed, writeProductSeed } from '../../lib/productSeedCache';
import ProductVariantModal from './ProductVariantModal';

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

    const savingsAmount = useMemo(() => {
        if (!product.oldPrice) return 0;
        const current = parseMoneyToNumber(product.price);
        const old = parseMoneyToNumber(product.oldPrice);
        return old > current ? old - current : 0;
    }, [product.oldPrice, product.price]);

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

    const allColorsForModal = useMemo(() => {
        const colorMap = new Map();
        imeis.forEach((i) => {
            if (i?.color && !colorMap.has(i.color)) {
                colorMap.set(i.color, { name: i.color, hex: i.color_code || '#e5e7eb' });
            }
        });
        return Array.from(colorMap.values());
    }, [imeis]);
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

    const handleVariantConfirm = (action) => {
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
        addToCart(cartProduct, 1, variants, action !== 'buy');
        setShowVariantModal(false);
        if (action === 'buy') router.push('/checkout');
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

    const actionBtnH = isCompact ? 'h-8' : 'h-9';
    const iconSize = isCompact ? 'w-[14px] h-[14px]' : 'w-4 h-4';

    const wishlistButton = (className = '') => (
        <button
            type="button"
            className={`${actionBtnH} flex items-center justify-center rounded-lg border-2 transition-all duration-200 ${className} ${
                isWishlisted
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-brand-primary/50 text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10'
            }`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <FiHeart className={`${iconSize} ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
    );

    const cartButton = (className = '') => (
        <button
            type="button"
            className={`${actionBtnH} flex items-center justify-center gap-1.5 rounded-lg border-2 font-bold text-[10px] sm:text-xs transition-all duration-200 ${className} ${
                isOutOfStock
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isInCart
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-brand-primary bg-brand-primary text-white hover:opacity-90'
            }`}
            onClick={(e) => handleActionClick(e, 'cart')}
            aria-label={isOutOfStock ? 'Out of stock' : isInCart ? 'In cart' : 'Add to cart'}
            disabled={isOutOfStock || isResolvingVariants}
        >
            <FiShoppingCart className={`${iconSize} shrink-0`} />
            <span className="truncate sm:hidden">{isInCart ? 'In Cart' : 'Add to Cart'}</span>
            <span className="truncate hidden sm:inline">{isInCart ? 'In Cart' : 'Cart'}</span>
        </button>
    );

    const buyNowButton = (className = '') => (
        <button
            type="button"
            className={`${actionBtnH} rounded-lg font-bold text-xs transition-all duration-200 border-2 flex items-center justify-center ${className} ${
                isOutOfStock
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-[#0a0a0a] bg-[#0a0a0a] text-white hover:border-brand-primary hover:bg-brand-primary'
            }`}
            onClick={(e) => handleActionClick(e, 'buy')}
            disabled={isOutOfStock || isResolvingVariants}
        >
            <span className="truncate">
                {isOutOfStock ? 'Out of Stock' : isResolvingVariants ? 'Loading...' : 'Buy Now'}
            </span>
        </button>
    );

    return (
        <>
            <Link
                href={`/product/${slug}`}
                onClick={cacheProductSeed}
                className="group/card bg-white rounded-lg flex flex-col text-left transition-all duration-300 overflow-hidden relative h-full w-full border border-brand-primary/20 hover:border-brand-primary hover:shadow-md"
            >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover/card:bg-brand-primary transition-colors z-20 pointer-events-none rounded-l-lg" />

                {/* Image */}
                <div
                    className={`w-full relative flex items-center justify-center bg-card-bg overflow-hidden ${
                        isCompact ? 'aspect-[16/11]' : 'aspect-square'
                    }`}
                >
                    {productBrand && (
                        <span className="absolute top-2 left-2 z-10 text-[9px] font-bold uppercase tracking-wide text-white bg-[#0a0a0a]/85 px-2 py-0.5 rounded">
                            {productBrand}
                        </span>
                    )}

                    {discountBadgeText && (
                        <span className="absolute top-2 right-2 z-10 text-[9px] md:text-[10px] font-bold text-white bg-brand-primary px-2 py-0.5 rounded shadow-sm">
                            {discountBadgeText}
                        </span>
                    )}

                    {(product.isNew || product.badge === 'New Arrival') && !product.discount && (
                        <span className="absolute top-2 right-2 z-10 text-[9px] font-bold text-white bg-brand-primary px-2 py-0.5 rounded">
                            New
                        </span>
                    )}

                    <div className="relative w-full h-full p-3 sm:p-4">
                        <Image
                            src={product.imageUrl || '/no-image.svg'}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-contain group-hover/card:scale-[1.03] transition-transform duration-300"
                        />
                    </div>

                    {isOutOfStock && (
                        <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white bg-brand-primary px-3 py-1.5 rounded-full">
                                Out of stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className={`flex flex-col flex-1 min-w-0 ${isCompact ? 'p-2' : 'p-2.5 sm:p-3'}`}>
                    <h3
                        className={`text-gray-900 font-bold leading-snug line-clamp-2 ${
                            isCompact ? 'text-[11px] md:text-[13px] mb-1' : 'text-[12px] md:text-[14px] mb-1.5'
                        }`}
                    >
                        {product.name}
                    </h3>

                    <div className={`mt-auto ${isCompact ? 'mb-1.5' : 'mb-2'}`}>
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span
                                className={`font-extrabold text-brand-primary ${
                                    isCompact ? 'text-[13px] md:text-[15px]' : 'text-[14px] md:text-[16px]'
                                }`}
                            >
                                {formatPrice(product.price)}
                            </span>
                            {product.oldPrice && (
                                <span className="text-gray-400 text-[10px] md:text-[11px] font-medium line-through">
                                    {formatPrice(product.oldPrice)}
                                </span>
                            )}
                        </div>
                        {savingsAmount > 0 && (
                            <p className="text-[10px] text-brand-primary/80 font-semibold mt-0.5">
                                Save Tk {savingsAmount.toLocaleString('en-IN')}
                            </p>
                        )}
                    </div>

                    {/* Actions — mobile: cart+wishlist row, buy below; desktop: all one row */}
                    <div className="flex flex-col sm:flex-row gap-1.5 min-w-0 pt-0.5 border-t border-brand-primary/15">
                        <div className="flex gap-1.5 min-w-0 sm:contents">
                            {wishlistButton(isCompact ? 'w-8 shrink-0 px-0 sm:w-9' : 'w-9 shrink-0 px-0')}
                            {cartButton('flex-1 min-w-0 sm:flex-1')}
                        </div>
                        {buyNowButton('w-full sm:flex-1 sm:min-w-0')}
                    </div>
                </div>
            </Link>

            <ProductVariantModal
                open={showVariantModal && hasVariants}
                onClose={() => setShowVariantModal(false)}
                product={product}
                modalDisplayImage={modalDisplayImage}
                selectedVariantPrice={selectedVariantPrice}
                allColors={allColorsForModal.length > 0 ? allColorsForModal : allColors}
                variantSource={imeis}
                effectiveColor={effectiveColor}
                effectiveStorage={effectiveStorage}
                effectiveRegion={effectiveRegion}
                onSelectColor={setSelectedColor}
                onSelectStorage={setSelectedStorage}
                onSelectRegion={setSelectedRegion}
                matchedImei={matchedImei}
                isResolvingVariants={isResolvingVariants}
                onConfirmCart={() => handleVariantConfirm('cart')}
                onConfirmBuy={() => handleVariantConfirm('buy')}
            />

            {isResolvingVariants && !showVariantModal && (
                <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-brand-primary/30 border-t-brand-primary animate-spin" />
                            <p className="text-sm font-semibold text-gray-700">Loading variants...</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
