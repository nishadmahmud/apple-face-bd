"use client";

import { useState, useMemo, useEffect, useCallback, cloneElement, isValidElement } from 'react';
import { FiShare2, FiMinus, FiPlus, FiX, FiHeart, FiLayers, FiSearch } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getEmiBanksForCalculator } from '../../lib/bankEmiData';
import VariantOptionChip from '../Shared/VariantOptionChip';

const EMI_BANKS_LIST = getEmiBanksForCalculator();
const EMI_MONTHS = [3, 6, 9, 12, 18, 24, 30, 36];
const COMMON_BRAND_LOGOS = {
    apple: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    samsung: 'https://cdn.brandfetch.io/iduaw_nOnR/theme/dark/idkTmfps1i.svg?c=1bxid64Mup7aczewSAYMX&t=1680282243777',
    xiaomi: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
    motorola: '/brand-logos/motorola.svg',
    oppo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/OPPO_LOGO_2019.svg',
    vivo: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Vivo_logo_2019.svg',
    anker: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Anker_logo.svg',
    baseus: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Baseus_logo.png',
    google: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
};
const BRAND_NAME_FALLBACKS = ['apple', 'samsung', 'xiaomi', 'mi', 'motorola', 'moto', 'oppo', 'vivo', 'anker', 'baseus', 'besus', 'google'];
const BRAND_PRODUCT_HINTS = {
    apple: ['iphone', 'ipad', 'macbook', 'airpods', 'apple watch'],
    samsung: ['galaxy', 'samsung'],
    xiaomi: ['xiaomi', 'redmi', 'poco', 'mi '],
    motorola: ['motorola', 'moto '],
    oppo: ['oppo'],
    vivo: ['vivo'],
    anker: ['anker'],
    baseus: ['baseus', 'besus'],
    google: ['pixel', 'google']
};

export default function ProductInfo({ product, onPricingChange, selectedCarePlans = [], galleryComponent, sidebarComponent }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { toggleCompare, isInCompare } = useCompare();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [showEmiModal, setShowEmiModal] = useState(false);
    const [emiBankSearch, setEmiBankSearch] = useState('');
    const [galleryIndex, setGalleryIndex] = useState(0);

    const imeis = useMemo(() => product.rawImeis || [], [product.rawImeis]);
    const hasVariants = imeis.length > 0;
    const colorList = useMemo(
        () => (Array.isArray(product.colorList) ? product.colorList.filter(Boolean) : []),
        [product.colorList]
    );

    const allColors = useMemo(() => {
        if (colorList.length > 0) {
            return colorList.map((name) => {
                const imei = imeis.find((i) => i.color === name);
                return { name, hex: imei?.color_code || '#e5e7eb' };
            });
        }

        const colorMap = new Map();
        imeis.forEach((i) => {
            if (i.color && !colorMap.has(i.color)) {
                colorMap.set(i.color, { name: i.color, hex: i.color_code || '#e5e7eb' });
            }
        });
        return Array.from(colorMap.values());
    }, [colorList, imeis]);

    const allStorages = useMemo(() => [...new Set(imeis.map((i) => i.storage).filter(Boolean))], [imeis]);
    const allRegions = useMemo(() => [...new Set(imeis.map((i) => i.region).filter(Boolean))], [imeis]);

    const [selectedColor, setSelectedColor] = useState(allColors[0]?.name || null);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    useEffect(() => {
        if (!hasVariants) return;

        const matchingImeis = imeis.filter((i) => !selectedColor || i.color === selectedColor);
        const availableStorages = [...new Set(matchingImeis.map((i) => i.storage).filter(Boolean))];

        if (availableStorages.length > 0) {
            if (!selectedStorage || !availableStorages.includes(selectedStorage)) {
                setSelectedStorage(availableStorages[0]);
            }
        } else {
            setSelectedStorage(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor]);

    useEffect(() => {
        if (!hasVariants) return;

        const matchingImeis = imeis.filter((i) => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            return match;
        });

        const availableRegions = [...new Set(matchingImeis.map((i) => i.region).filter(Boolean))];

        if (availableRegions.length > 0) {
            if (!selectedRegion || !availableRegions.includes(selectedRegion)) {
                setSelectedRegion(availableRegions[0]);
            }
        } else {
            setSelectedRegion(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor, selectedStorage]);

    const availableStorages = useMemo(() => {
        const matchingImeis = imeis.filter((i) => !selectedColor || i.color === selectedColor);
        return [...new Set(matchingImeis.map((i) => i.storage).filter(Boolean))];
    }, [imeis, selectedColor]);

    const availableRegions = useMemo(() => {
        const matchingImeis = imeis.filter((i) => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            return match;
        });
        return [...new Set(matchingImeis.map((i) => i.region).filter(Boolean))];
    }, [imeis, selectedColor, selectedStorage]);

    const matchedImei = useMemo(() => {
        if (!hasVariants) return null;

        let match = imeis.find(
            (i) =>
                (!selectedColor || i.color === selectedColor) &&
                (!selectedStorage || i.storage === selectedStorage) &&
                (!selectedRegion || i.region === selectedRegion)
        );

        if (!match) {
            match = imeis.find(
                (i) => (!selectedColor || i.color === selectedColor) && (!selectedStorage || i.storage === selectedStorage)
            );
        }

        if (!match) {
            match = imeis.find((i) => !selectedColor || i.color === selectedColor);
        }

        return match;
    }, [imeis, selectedColor, selectedStorage, selectedRegion, hasVariants]);

    const selectedBasePrice = useMemo(() => {
        if (matchedImei && matchedImei.sale_price) {
            return Number(matchedImei.sale_price);
        }
        return Number(product.originalPrice || product.rawPrice || 0);
    }, [matchedImei, product.originalPrice, product.rawPrice]);

    const discountValue = Number(product.discountValue || 0);
    const discountType = String(product.discountType || '').toLowerCase();
    const hasDiscount = Boolean(product.hasDiscount && discountValue > 0);
    const defaultEmiBank = useMemo(() => EMI_BANKS_LIST.find((bank) => bank.m6 != null) || EMI_BANKS_LIST[0], []);
    const [selectedEmiBankName, setSelectedEmiBankName] = useState(defaultEmiBank?.bank || '');
    const [selectedEmiMonths, setSelectedEmiMonths] = useState(6);

    const discountedPrice = useMemo(() => {
        if (!hasDiscount) return selectedBasePrice;
        if (discountType === 'percentage') {
            return Math.max(0, Math.round(selectedBasePrice * (1 - discountValue / 100)));
        }
        return Math.max(0, selectedBasePrice - discountValue);
    }, [selectedBasePrice, hasDiscount, discountType, discountValue]);

    const displayDiscount = useMemo(() => {
        if (!hasDiscount) return null;
        if (discountType === 'percentage') return `-${discountValue}%`;
        return `৳ ${discountValue.toLocaleString('en-IN')}`;
    }, [hasDiscount, discountType, discountValue]);

    const selectedEmiBank = useMemo(() => {
        return EMI_BANKS_LIST.find((bank) => bank.bank === selectedEmiBankName) || defaultEmiBank;
    }, [selectedEmiBankName, defaultEmiBank]);

    const selectedEmiRate = useMemo(() => {
        if (!selectedEmiBank) return 0;
        return Number(selectedEmiBank[`m${selectedEmiMonths}`] || 0);
    }, [selectedEmiBank, selectedEmiMonths]);

    useEffect(() => {
        if (!selectedEmiBank) return;
        if (selectedEmiBank[`m${selectedEmiMonths}`] != null) return;
        const fallbackMonth = EMI_MONTHS.find((m) => selectedEmiBank[`m${m}`] != null) || 6;
        setSelectedEmiMonths(fallbackMonth);
    }, [selectedEmiBank, selectedEmiMonths]);

    const offerPrice = discountedPrice;
    const regularPrice = Math.round(selectedBasePrice * (1 + selectedEmiRate / 100));
    const usingOfferPrice = true;
    const selectedUnitPrice = offerPrice;
    const selectedDisplayPrice = `TK ${selectedUnitPrice.toLocaleString('en-IN')}`;
    const selectedOldPrice = hasDiscount ? `৳ ${selectedBasePrice.toLocaleString('en-IN')}` : null;
    const inferredBrandName = useMemo(() => {
        const explicitBrand = String(product.brandName || '').trim();
        if (explicitBrand) return explicitBrand;

        const productNameLower = String(product.name || '').toLowerCase();
        const hit = BRAND_NAME_FALLBACKS.find((b) => productNameLower.includes(b));
        if (hit) {
            if (hit === 'mi') return 'Xiaomi';
            if (hit === 'besus') return 'Baseus';
            return hit.charAt(0).toUpperCase() + hit.slice(1);
        }

        const hinted = Object.entries(BRAND_PRODUCT_HINTS).find(([, hints]) => hints.some((h) => productNameLower.includes(h)));
        if (!hinted) return '';
        const [brandKey] = hinted;
        if (brandKey === 'xiaomi') return 'Xiaomi';
        return brandKey.charAt(0).toUpperCase() + brandKey.slice(1);
    }, [product.brandName, product.name]);
    const normalizedBrand = inferredBrandName.toLowerCase();
    const fallbackBrandLogo = useMemo(() => {
        if (!normalizedBrand) return null;
        if (normalizedBrand.includes('xiaomi') || normalizedBrand.includes('mi')) return COMMON_BRAND_LOGOS.xiaomi;
        if (normalizedBrand.includes('baseus') || normalizedBrand.includes('besus')) return COMMON_BRAND_LOGOS.baseus;
        const match = Object.entries(COMMON_BRAND_LOGOS).find(([key]) => normalizedBrand.includes(key));
        return match ? match[1] : null;
    }, [normalizedBrand]);
    const brandLogo = fallbackBrandLogo;
    const isInStock = Boolean(product.inStock);

    const filteredEmiBanks = useMemo(() => {
        const query = emiBankSearch.trim().toLowerCase();
        if (!query) return EMI_BANKS_LIST;
        return EMI_BANKS_LIST.filter((bank) => bank.bank.toLowerCase().includes(query));
    }, [emiBankSearch]);

    const selectedBankPlans = useMemo(() => {
        if (!selectedEmiBank) return [];
        return EMI_MONTHS
            .map((months) => {
                const rate = selectedEmiBank[`m${months}`];
                if (rate == null) return null;
                const total = Math.round(selectedBasePrice * (1 + rate / 100));
                const monthly = Math.round(total / months);
                return { months, rate: Number(rate), total, monthly };
            })
            .filter(Boolean);
    }, [selectedEmiBank, selectedBasePrice]);

    useEffect(() => {
        if (!onPricingChange) return;
        const emiStartFrom = selectedBankPlans.length > 0
            ? Math.min(...selectedBankPlans.map((p) => p.monthly))
            : Math.round(regularPrice / Math.max(selectedEmiMonths, 1));
        onPricingChange({
            selectedPrice: selectedUnitPrice,
            offerPrice,
            regularPrice,
            hasDiscount,
            usingOfferPrice,
            emiStartFrom
        });
    }, [onPricingChange, selectedUnitPrice, offerPrice, regularPrice, hasDiscount, usingOfferPrice, selectedBankPlans, selectedEmiMonths]);

    useEffect(() => {
        setGalleryIndex(0);
        if (colorList[0]) {
            setSelectedColor(colorList[0]);
            return;
        }
        const firstImeiColor = imeis.find((i) => i.color)?.color;
        if (firstImeiColor) setSelectedColor(firstImeiColor);
    }, [product.id, colorList, imeis]);

    const handleGalleryIndexChange = useCallback(
        (index) => {
            setGalleryIndex(index);
            const color = colorList[index] || allColors[index]?.name;
            if (color) setSelectedColor(color);
        },
        [colorList, allColors]
    );

    const handleColorSelect = useCallback(
        (colorName) => {
            setSelectedColor(colorName);
            const idx = colorList.indexOf(colorName);
            if (idx >= 0) setGalleryIndex(idx);
        },
        [colorList]
    );

    const galleryWithSync = useMemo(() => {
        if (!isValidElement(galleryComponent)) return galleryComponent;
        return cloneElement(galleryComponent, {
            selectedIndex: galleryIndex,
            onSelectedIndexChange: handleGalleryIndexChange
        });
    }, [galleryComponent, galleryIndex, handleGalleryIndexChange]);

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        }
    };

    const wishlistProduct = useMemo(() => {
        const primaryImage = Array.isArray(product.images) ? product.images[0] : product.imageUrl;
        return {
            id: product.id,
            name: product.name,
            price: selectedDisplayPrice,
            oldPrice: selectedOldPrice,
            discount: usingOfferPrice ? displayDiscount : null,
            imageUrl: primaryImage || '/no-image.svg',
            brand: inferredBrandName || product.brandName || ''
        };
    }, [
        product.id,
        product.name,
        product.images,
        product.imageUrl,
        product.brandName,
        selectedDisplayPrice,
        selectedOldPrice,
        displayDiscount,
        usingOfferPrice,
        inferredBrandName
    ]);
    const isWishlisted = isInWishlist(product.id);
    const compareProduct = useMemo(() => {
        const primaryImage = Array.isArray(product.images) ? product.images[0] : product.imageUrl;
        return {
            id: product.id,
            name: product.name,
            brand: inferredBrandName || product.brandName || '',
            image: primaryImage || '/no-image.svg',
            price: selectedUnitPrice,
            displayPrice: selectedDisplayPrice,
            oldPrice: selectedOldPrice,
            specs: Array.isArray(product.specifications) ? product.specifications : []
        };
    }, [
        product.id,
        product.name,
        product.images,
        product.imageUrl,
        product.brandName,
        product.specifications,
        inferredBrandName,
        selectedUnitPrice,
        selectedDisplayPrice,
        selectedOldPrice
    ]);
    const compared = isInCompare(product.id);
    const specPreview = useMemo(() => {
        if (!Array.isArray(product.specifications)) return '';
        return product.specifications
            .slice(0, 4)
            .map((s) => String(s?.value || '').trim())
            .filter(Boolean)
            .join(' · ');
    }, [product.specifications]);
    const renderQuickActions = (isMobile = false) => (
        <div className={`flex ${isMobile ? 'items-center justify-between gap-3 mt-3' : 'items-start justify-between gap-4'}`}>
            <span className={`font-bold rounded-md uppercase tracking-wider ${isMobile ? 'text-[10px] px-2 py-1' : 'text-[10px] px-2 py-1'} ${isInStock ? 'bg-brand-primary/10 text-brand-primary' : 'bg-red-50 text-red-600'}`}>
                Availability: {isInStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => toggleCompare(compareProduct)}
                    className={`cursor-pointer flex flex-col items-center gap-0.5 transition-colors ${compared ? 'text-brand-primary' : 'hover:text-brand-primary text-gray-400'}`}
                    aria-label={compared ? 'Remove from compare' : 'Add to compare'}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${compared ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-primary/5 text-brand-primary'}`}>
                        <FiLayers size={14} />
                    </div>
                    <span className="text-[8px] font-bold uppercase">{compared ? 'Compared' : 'Compare'}</span>
                </button>
                <button
                    onClick={() => toggleWishlist(wishlistProduct)}
                    className={`cursor-pointer flex flex-col items-center gap-0.5 transition-colors ${isWishlisted ? 'text-brand-red' : 'hover:text-brand-red text-gray-400'}`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isWishlisted ? 'bg-red-50 text-brand-red' : 'bg-red-50 text-red-500'}`}>
                        <FiHeart size={14} className={isWishlisted ? 'fill-current' : ''} />
                    </div>
                    <span className="text-[8px] font-bold uppercase">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
                <button onClick={handleShare} className="cursor-pointer flex flex-col items-center gap-0.5 hover:text-blue-500 text-gray-400 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><FiShare2 size={14} /></div>
                    <span className="text-[8px] font-bold uppercase">Share</span>
                </button>
            </div>
        </div>
    );

    const handleAddToCart = (openSidebar = true) => {
        const variants = {};
        if (selectedStorage) variants.storage = selectedStorage;
        if (selectedColor) variants.colors = { name: selectedColor };
        if (selectedRegion) variants.region = selectedRegion;
        variants.priceOption = usingOfferPrice ? 'offer' : 'regular';
        variants.customBasePrice = selectedUnitPrice;

        if (selectedCarePlans.length > 0) {
            variants.carePlans = selectedCarePlans.map((plan) => ({
                id: plan.id,
                name: plan.name,
                price: Number(plan.price || 0)
            }));
        }

        addToCart(product, quantity, Object.keys(variants).length > 0 ? variants : null, openSidebar);
    };

    const handleBuyNow = () => {
        handleAddToCart(false);
        router.push('/checkout');
    };

    const renderVariantSelectors = (displayClass) => {
        if (!hasVariants) return null;
        return (
            <div className={`bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm space-y-4 md:space-y-5 ${displayClass}`}>
                <div className="flex flex-col gap-1 text-[13px] mb-2 pb-4 border-b border-gray-100">
                    {(selectedStorage || selectedColor || selectedRegion) && (
                        <p>
                            <span className="font-semibold text-gray-400">Variant: </span>
                            <span className="font-bold text-brand-primary">{[selectedStorage, selectedColor, selectedRegion].filter(Boolean).join(' / ')}</span>
                        </p>
                    )}
                </div>

                {allColors.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3">
                            Color: <span className="font-medium text-brand-primary">{selectedColor || ''}</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {allColors.map((color) => (
                                <VariantOptionChip
                                    key={color.name}
                                    label={color.name}
                                    swatchHex={color.hex}
                                    selected={selectedColor === color.name}
                                    onClick={() => handleColorSelect(color.name)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {allStorages.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3">
                            Storage: <span className="font-medium text-brand-primary">{selectedStorage || ''}</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {allStorages.map((size) => (
                                <VariantOptionChip
                                    key={size}
                                    label={size}
                                    selected={selectedStorage === size}
                                    disabled={!availableStorages.includes(size)}
                                    onClick={() => setSelectedStorage(size)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {allRegions.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3">
                            Region: <span className="font-medium text-brand-primary">{selectedRegion || ''}</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {allRegions.map((region) => (
                                <VariantOptionChip
                                    key={region}
                                    label={region}
                                    selected={selectedRegion === region}
                                    disabled={!availableRegions.includes(region)}
                                    onClick={() => setSelectedRegion(region)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.95fr)] gap-6 lg:gap-8 items-start relative">

            {/* ========== COLUMN 1 (desktop): Gallery ========== */}
            <div className="w-full min-w-0 order-1 lg:order-1 lg:sticky lg:top-24">
                {galleryWithSync}
            </div>

            {/* ========== COLUMN 2 (desktop): Product info & pricing ========== */}
            <div className="flex flex-col gap-5 w-full order-2 lg:order-2 lg:sticky lg:top-24">

                {/* Title & Brand */}
                <div>
                    {(inferredBrandName || brandLogo) && (
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="w-6 h-6 rounded-full border border-gray-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                                {brandLogo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={brandLogo} alt={inferredBrandName || 'Brand'} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-[10px] font-bold text-gray-500">{(inferredBrandName || 'B').charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{inferredBrandName || 'Brand'}</p>
                        </div>
                    )}
                    <h1 className="text-xl md:text-2xl lg:text-[1.65rem] font-extrabold text-gray-900 leading-tight mb-2">{product.name}</h1>
                    {specPreview && (
                        <p className="text-[12px] leading-relaxed text-gray-500 font-medium line-clamp-2">
                            {specPreview}
                        </p>
                    )}
                    <div className="lg:hidden">
                        {renderQuickActions(true)}
                    </div>
                </div>

                {/* Price */}
                <div className="pb-4 border-b border-gray-100">
                    <div className="flex flex-wrap items-end gap-3 mb-1">
                        <p className="text-3xl md:text-4xl leading-none font-extrabold text-gray-900">{selectedDisplayPrice}</p>
                        {usingOfferPrice && displayDiscount && (
                            <span className="text-xs md:text-sm font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-md mb-1">{displayDiscount} Off</span>
                        )}
                    </div>
                    {selectedOldPrice && (
                        <div className="flex items-center gap-3">
                            <span className="text-lg md:text-xl text-gray-400 line-through font-medium">{selectedOldPrice}</span>
                        </div>
                    )}
                </div>

                {renderVariantSelectors('')}

                {/* Cart Actions */}
                <div className="flex flex-col gap-2.5 mt-1">
                    <div className="flex flex-row items-stretch gap-2 h-12">
                        <div className="flex items-center justify-between border-2 border-gray-200 rounded-lg py-1 px-1 w-[100px] shrink-0 bg-white">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiMinus size={14} />
                            </button>
                            <span className="font-bold text-gray-900 w-6 text-center text-sm">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiPlus size={14} />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="cursor-pointer flex-1 bg-white border-2 border-brand-primary text-brand-primary font-bold px-3 rounded-lg hover:bg-brand-primary/5 transition-colors text-sm whitespace-nowrap"
                        >
                            Add to Cart
                        </button>
                    </div>
                    <button
                        onClick={handleBuyNow}
                        className="cursor-pointer w-full bg-brand-primary text-white font-extrabold tracking-wide py-3.5 px-4 rounded-lg hover:opacity-90 transition-all text-sm"
                    >
                        Buy Now
                    </button>
                </div>
            </div>

            {/* ========== COLUMN 3 (desktop): Contact & support ========== */}
            <div className="flex flex-col gap-5 w-full order-3 lg:order-3 lg:sticky lg:top-24">

                {/* Quick Actions */}
                <div className="hidden lg:block">
                    {renderQuickActions(false)}
                </div>

                {/* Sidebar */}
                {sidebarComponent && (
                    <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
                        {isValidElement(sidebarComponent)
                            ? cloneElement(sidebarComponent, { onOpenEmiModal: () => setShowEmiModal(true) })
                            : sidebarComponent}
                    </div>
                )}
            </div>
        </div>

        {/* ========== EMI Modal (outside grid, fixed overlay) ========== */}
        {showEmiModal && (
            <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                <div className="w-full max-w-5xl bg-white rounded-lg border border-gray-200 shadow-2xl overflow-hidden h-[78vh]">
                    <div className="px-4 py-3 bg-[#0a0a0a] text-white flex items-center justify-between">
                        <h3 className="text-lg font-black">EMI Options</h3>
                        <button
                            type="button"
                            onClick={() => {
                                setShowEmiModal(false);
                                setEmiBankSearch('');
                            }}
                            className="p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    <div className="p-3 h-[calc(78vh-52px)] overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-3 items-stretch h-full">
                            <div className="hidden md:flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50/40 h-full flex-col min-h-0">
                                <div className="px-3 py-2.5 border-b border-gray-200 bg-gray-100 space-y-2">
                                    <p className="text-xs font-extrabold tracking-wide text-gray-700">BANK NAME</p>
                                    <div className="relative">
                                        <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="search"
                                            value={emiBankSearch}
                                            onChange={(e) => setEmiBankSearch(e.target.value)}
                                            placeholder="Search banks..."
                                            className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
                                    {filteredEmiBanks.length === 0 ? (
                                        <p className="px-3 py-6 text-sm text-gray-500 text-center">No banks found</p>
                                    ) : filteredEmiBanks.map((bank) => {
                                        const active = selectedEmiBank?.bank === bank.bank;
                                        return (
                                            <button
                                                key={bank.bank}
                                                type="button"
                                                onClick={() => setSelectedEmiBankName(bank.bank)}
                                                className={`w-full text-left px-3 py-2.5 border-b border-gray-200 flex items-center gap-2.5 transition-colors ${active ? 'bg-brand-primary/10' : 'hover:bg-gray-100'}`}
                                            >
                                                {bank.logo ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={bank.logo} alt={bank.bank} className="w-7 h-7 rounded-full object-contain border border-gray-200 bg-white" />
                                                ) : (
                                                    <span className="w-7 h-7 rounded-full bg-gray-200 text-[10px] flex items-center justify-center">{bank.initial || '?'}</span>
                                                )}
                                                <span className="text-sm font-semibold text-gray-700">{bank.bank}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4 h-full overflow-y-auto pr-1">
                                <div className="md:hidden">
                                    <p className="text-xs font-extrabold tracking-wide text-gray-700 mb-2">BANK NAME</p>
                                    <div className="relative mb-2">
                                        <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="search"
                                            value={emiBankSearch}
                                            onChange={(e) => setEmiBankSearch(e.target.value)}
                                            placeholder="Search banks..."
                                            className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                                        />
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                        {filteredEmiBanks.length === 0 ? (
                                            <p className="text-sm text-gray-500 py-2">No banks found</p>
                                        ) : filteredEmiBanks.map((bank) => {
                                            const active = selectedEmiBank?.bank === bank.bank;
                                            return (
                                                <button
                                                    key={bank.bank}
                                                    type="button"
                                                    onClick={() => setSelectedEmiBankName(bank.bank)}
                                                    className={`shrink-0 px-3 py-2 rounded-lg border text-sm font-semibold flex items-center gap-2 ${active ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-gray-200 text-gray-700 bg-white'}`}
                                                >
                                                    {bank.logo ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={bank.logo} alt={bank.bank} className="w-5 h-5 rounded-full object-contain border border-gray-200 bg-white" />
                                                    ) : (
                                                        <span className="w-5 h-5 rounded-full bg-gray-200 text-[10px] flex items-center justify-center">{bank.initial || '?'}</span>
                                                    )}
                                                    <span className="whitespace-nowrap">{bank.bank}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Amount</p>
                                    <div className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-2xl font-black text-brand-primary bg-gray-50">
                                        {`৳ ${selectedBasePrice.toLocaleString('en-IN')}`}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {EMI_MONTHS.map((month) => {
                                        const available = selectedEmiBank?.[`m${month}`] != null;
                                        return (
                                            <button
                                                key={month}
                                                type="button"
                                                disabled={!available}
                                                onClick={() => available && setSelectedEmiMonths(month)}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${selectedEmiMonths === month ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-gray-200 text-gray-600'} ${!available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                {month}M
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="grid grid-cols-3 bg-gray-100 border-b border-gray-200">
                                        <div className="px-3 py-2.5 text-base font-semibold text-gray-600">Plan</div>
                                        <div className="px-3 py-2.5 text-base font-semibold text-gray-600">EMI</div>
                                        <div className="px-3 py-2.5 text-base font-semibold text-gray-600 text-right">Total</div>
                                    </div>
                                    {selectedBankPlans.map((plan) => (
                                        <button
                                            key={plan.months}
                                            type="button"
                                            onClick={() => setSelectedEmiMonths(plan.months)}
                                            className={`w-full text-left grid grid-cols-3 border-b border-gray-100 last:border-b-0 ${selectedEmiMonths === plan.months ? 'bg-brand-primary/5' : ''}`}
                                        >
                                            <div className="px-3 py-2.5 text-xl font-bold text-gray-800">{plan.months}</div>
                                            <div className="px-3 py-2.5">
                                                <p className="text-xl font-black text-gray-800">৳ {plan.monthly.toLocaleString('en-IN')}</p>
                                                <p className="text-xs text-gray-500">(Charge {plan.rate}%)</p>
                                            </div>
                                            <div className="px-3 py-2.5 text-right text-xl font-black text-brand-primary">
                                                {plan.total.toLocaleString('en-IN')}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}



