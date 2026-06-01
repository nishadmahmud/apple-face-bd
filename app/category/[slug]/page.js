"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoriesFromServer, getCategoryWiseProducts, getProductsBySubcategory } from '../../../lib/api';
import CategoryTopFilters from '../../../components/Category/CategoryTopFilters';
import ProductGrid from '../../../components/Category/ProductGrid';
import { FiCheckCircle } from 'react-icons/fi';
import { buildPhoneRegionFilterGroups, imeiMatchesRegionFilter } from '../../../lib/phoneRegionFilters';

function mapProduct(p) {
    const originalPrice = Number(p.retails_price || 0);
    const discountValue = Number(p.discount || 0);
    const discountType = p.discount_type;
    const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

    const discountedPrice = hasDiscount
        ? (String(discountType).toLowerCase() === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue))
        : originalPrice;

    const discount = hasDiscount
        ? (String(discountType).toLowerCase() === 'percentage' ? `-${discountValue}%` : `৳ ${discountValue}`)
        : null;

    return {
        id: p.id,
        name: p.name,
        price: `৳ ${discountedPrice.toLocaleString('en-IN')}`,
        oldPrice: hasDiscount ? `৳ ${originalPrice.toLocaleString('en-IN')}` : null,
        discount,
        imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || '/no-image.svg',
        brand: p.brand_name || '',
        stock: p.current_stock || 0,
        rawPrice: discountedPrice,
        rawImeis: p.imeis || []
    };
}

export default function CategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const rawSlug = params?.slug || '';
    const requestedSubcategorySlug = (searchParams?.get('subcat') || '').toLowerCase().trim();
    const requestedSubcategoryId = searchParams?.get('subcat_id') || '';

    // Read the requested page exclusively from URL parameters.
    const urlPage = Math.max(1, parseInt(searchParams?.get('page') || '1', 10));

    const [categoryId, setCategoryId] = useState(rawSlug);
    const [categoryName, setCategoryName] = useState(() =>
        decodeURIComponent(rawSlug)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
    );

    // Instead of holding 1 page, we hold ALL products for this category.
    const [allProducts, setAllProducts] = useState([]);
    const [filterOptions, setFilterOptions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bannerImage, setBannerImage] = useState("https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2000&auto=format&fit=crop");
    const [categoryImage, setCategoryImage] = useState("/no-image.svg");
    const [activeSubcategory, setActiveSubcategory] = useState(null);

    // Filter State
    const [selectedBrands, setSelectedBrands] = useState(['All']);
    const [selectedPrice, setSelectedPrice] = useState({ min: '', max: '' });
    const [selectedStorage, setSelectedStorage] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState('All');

    const selectedBrand = selectedBrands[0] || 'All';
    const isBrandFiltered = selectedBrand !== 'All';

    const brandScopedProducts = useMemo(() => {
        if (!isBrandFiltered) return allProducts;
        return allProducts.filter((p) => p.brand === selectedBrand);
    }, [allProducts, isBrandFiltered, selectedBrand]);

    const prevBrandRef = useRef(selectedBrand);
    useEffect(() => {
        if (prevBrandRef.current === selectedBrand) return;
        prevBrandRef.current = selectedBrand;
        setSelectedStorage([]);
        setSelectedRegion([]);
        setSelectedColor([]);
        setSelectedPrice({ min: '', max: '' });
    }, [selectedBrand]);

    useEffect(() => {
        let isMounted = true;

        const fetchCategoryData = async () => {
            setIsLoading(true);
            let resolvedCatId = rawSlug;
            let resolvedSubcategoryId = requestedSubcategoryId || null;
            let resolvedSubcategoryName = '';
            const normalize = (val) => val ? String(val).toLowerCase().trim().replace(/\s+/g, '-') : '';

            try {
                const catRes = await getCategoriesFromServer();
                if (catRes?.success && Array.isArray(catRes.data)) {
                    const slugLower = String(rawSlug).toLowerCase();

                    const found = catRes.data.find((c) =>
                        String(c.category_id) === String(rawSlug) ||
                        String(c.id) === String(rawSlug) ||
                        normalize(c.name) === slugLower
                    );

                    if (found) {
                        resolvedCatId = found.category_id ?? found.id ?? resolvedCatId;
                        if (isMounted) {
                            setCategoryId(resolvedCatId);
                            if (found.name) setCategoryName(found.name);

                            const cBanner = found.banner || found.banner_image || '';
                            const cImg = found.image_path || found.image_url || '';
                            
                            if (cBanner) setBannerImage(cBanner);
                            if (cImg) setCategoryImage(cImg);
                            
                            // fallbacks if one is completely missing
                            if (!cBanner && cImg) setBannerImage(cImg);
                            if (!cImg && cBanner) setCategoryImage(cBanner);
                        }

                        if ((requestedSubcategorySlug || requestedSubcategoryId) && Array.isArray(found.sub_category)) {
                            const matchedSubcategory = found.sub_category.find((sub) =>
                                String(sub?.id) === String(requestedSubcategoryId) ||
                                normalize(sub?.slug || sub?.name) === requestedSubcategorySlug
                            );

                            if (matchedSubcategory) {
                                resolvedSubcategoryId = matchedSubcategory.id;
                                resolvedSubcategoryName = matchedSubcategory.name || '';
                                if (isMounted) {
                                    setActiveSubcategory({
                                        id: matchedSubcategory.id,
                                        name: matchedSubcategory.name || '',
                                    });
                                }
                            } else if (isMounted) {
                                setActiveSubcategory(null);
                            }
                        } else if (isMounted) {
                            setActiveSubcategory(null);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to resolve category:', err);
            }

            try {
                const fetchProducts = (pageNo) =>
                    resolvedSubcategoryId
                        ? getProductsBySubcategory(resolvedSubcategoryId, pageNo)
                        : getCategoryWiseProducts(resolvedCatId, pageNo);

                // Fetch the FIRST page to get initial data and pagination limits fast
                const firstPageData = await fetchProducts(1);

                if (isMounted && firstPageData?.success && Array.isArray(firstPageData.data)) {
                    // Start rendering first page immediately
                    let globalProductsArray = [...firstPageData.data];
                    setAllProducts(globalProductsArray.map(mapProduct).sort((a, b) => b.stock - a.stock));

                    if (firstPageData.filter_options) setFilterOptions(firstPageData.filter_options);
                    setIsLoading(false); // First render ready!

                    // Now, fetch all remaining pages in the background
                    const totalPages = firstPageData.pagination?.last_page || 1;
                    if (totalPages > 1) {
                        const remainingPagesToFetch = [];
                        for (let p = 2; p <= totalPages; p++) {
                            remainingPagesToFetch.push(p);
                        }

                        // We fetch them in chunks of 5 pages directly.
                        for (let i = 0; i < remainingPagesToFetch.length; i += 5) {
                            if (!isMounted) break; // abort if unmounted
                            const chunk = remainingPagesToFetch.slice(i, i + 5);

                            const chunkResults = await Promise.allSettled(
                                chunk.map(page => fetchProducts(page))
                            );

                            chunkResults.forEach((res) => {
                                if (res.status === 'fulfilled' && res.value?.success && Array.isArray(res.value.data)) {
                                    globalProductsArray.push(...res.value.data);
                                }
                            });

                            // Aggressively append the background-fetched products into state 
                            // so that user doesn't even notice it buffering behind the scenes.
                            if (isMounted) {
                                setAllProducts([...globalProductsArray].map(mapProduct).sort((a, b) => b.stock - a.stock));
                            }
                        }
                    }
                } else if (isMounted) {
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch category products:', err);
                if (isMounted) setIsLoading(false);
            }
        };

        if (rawSlug) fetchCategoryData();

        return () => { isMounted = false; };
    }, [rawSlug, requestedSubcategorySlug, requestedSubcategoryId]); // Notice 'currentPage/urlPage' is not here: it only fetches on component mount/category/subcategory change

    const displayCategoryName = activeSubcategory?.name
        ? `${categoryName} - ${activeSubcategory.name}`
        : categoryName;

    // Compute dynamic filter lists — when a brand is selected, option lists use that brand's products only.
    const derivedFilters = useMemo(() => {
        const productsForOptions = isBrandFiltered ? brandScopedProducts : allProducts;

        const brandsList = ['All'];
        if (filterOptions?.brands) {
            brandsList.push(...Object.values(filterOptions.brands));
        } else {
            brandsList.push(...new Set(allProducts.map(p => p.brand).filter(Boolean)));
        }

        const scopedImeis = productsForOptions.flatMap((p) => p.rawImeis || []);

        // Storage List
        let storageList = [];
        if (!isBrandFiltered && filterOptions?.storages) {
            storageList = Object.values(filterOptions.storages);
        } else {
            storageList = [...new Set(scopedImeis.map((i) => i.storage).filter(Boolean))].sort();
        }

        // Region List
        let regionList = [];
        if (!isBrandFiltered && filterOptions?.regions) {
            regionList = Object.values(filterOptions.regions);
        } else {
            regionList = [...new Set(scopedImeis.map((i) => i.region).filter(Boolean))].sort();
        }

        // Color List
        let colorList = [];
        if (!isBrandFiltered && filterOptions?.colors && Array.isArray(filterOptions.colors) && filterOptions.colors.length > 0) {
            colorList = filterOptions.colors.map(c => ({
                name: c,
                hex: c.toLowerCase() === 'black' ? '#000000' :
                    c.toLowerCase() === 'white' ? '#ffffff' : '#cccccc'
            }));
        } else {
            const colorMap = new Map();
            scopedImeis.forEach((i) => {
                if (i.color) {
                    if (!colorMap.has(i.color) || colorMap.get(i.color) === '#cccccc') {
                        colorMap.set(i.color, i.color_code || '#cccccc');
                    }
                }
            });
            colorList = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
        }

        // Price Boundary Calculation
        let minPrice = Infinity;
        let maxPrice = 0;

        productsForOptions.forEach(p => {
            if (p.rawPrice > 0 && p.rawPrice < minPrice) minPrice = p.rawPrice;
            if (p.rawPrice > maxPrice) maxPrice = p.rawPrice;

            if (p.rawImeis && p.rawImeis.length > 0) {
                p.rawImeis.forEach(imei => {
                    const imeiPrice = Number(imei.discount_price || imei.price || 0);
                    if (imeiPrice > 0) {
                        if (imeiPrice < minPrice) minPrice = imeiPrice;
                        if (imeiPrice > maxPrice) maxPrice = imeiPrice;
                    }
                });
            }
        });

        if (minPrice === Infinity) minPrice = 0;

        const roundDown = val => Math.floor(val / 100) * 100;
        const roundUp = val => Math.ceil(val / 100) * 100;

        const globalMinPrice = roundDown(minPrice);
        const globalMaxPrice = roundUp(maxPrice);

        const regionFilterGroups = buildPhoneRegionFilterGroups({
            categoryName,
            slug: rawSlug,
            products: productsForOptions,
            selectedBrand,
        });

        return {
            brandsList: [...new Set(brandsList)],
            storageList,
            regionList: regionFilterGroups.enabled ? regionFilterGroups.flatRegionList : regionList,
            regionFilterGroups,
            colorList,
            globalMinPrice,
            globalMaxPrice
        };
    }, [allProducts, brandScopedProducts, filterOptions, isBrandFiltered, categoryName, rawSlug, selectedBrand]);

    // Apply Filters front-end across the ENTIRE product dataset
    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            if (selectedBrands.length > 0 && selectedBrands[0] !== 'All') {
                if (!selectedBrands.includes(p.brand)) return false;
            }
            if (selectedPrice.min !== '' && p.rawPrice < Number(selectedPrice.min)) return false;
            if (selectedPrice.max !== '' && p.rawPrice > Number(selectedPrice.max)) return false;
            if (selectedAvailability === 'In Stock' && p.stock <= 0) return false;

            const hasImeiFilters = selectedStorage.length > 0 || selectedRegion.length > 0 || selectedColor.length > 0;
            if (hasImeiFilters) {
                const hasMatchingImei = (p.rawImeis || []).some((i) => {
                    let match = true;
                    if (selectedStorage.length > 0 && !selectedStorage.includes(i.storage)) match = false;
                    if (selectedColor.length > 0 && !selectedColor.includes(i.color)) match = false;
                    if (selectedRegion.length > 0) {
                        const regionOk = selectedRegion.some((filterKey) =>
                            imeiMatchesRegionFilter(p, i, filterKey)
                        );
                        if (!regionOk) match = false;
                    }
                    return match;
                });
                if (!hasMatchingImei) return false;
            }

            return true;
        });
    }, [allProducts, selectedBrands, selectedPrice, selectedStorage, selectedRegion, selectedColor, selectedAvailability]);

    // Frontend pagination limits
    const itemsPerPage = 20;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const validCurrentPage = Math.min(urlPage, totalPages); // Protect against invalid out-of-bounds ?page= variables.

    // Splice ONLY what is needed onto the screen instantly!
    const paginatedProductsForScreen = useMemo(() => {
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, validCurrentPage, itemsPerPage]);

    return (
        <div className="bg-white min-h-screen pt-4 pb-8 md:pt-4 md:pb-12 w-full">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6">

                {/* Top Banner Image */}
                <div className="w-full relative rounded-xl md:rounded-3xl overflow-hidden mb-4 md:mb-8" style={{ aspectRatio: '21/5' }}>
                    <Image
                        src={bannerImage}
                        alt={`${categoryName} Banner`}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </div>

                {/* Breadcrumbs */}
                <div className="text-[10px] md:text-sm text-gray-500 mb-4 md:mb-6 flex items-center gap-1.5 md:gap-2 font-medium">
                    <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
                    <span>/</span>
                    <span className="hover:text-brand-primary transition-colors cursor-pointer">Categories</span>
                    <span>/</span>
                    <span className="text-gray-900 font-bold capitalize">{displayCategoryName}</span>
                </div>

                {/* Grid: category + sticky filters on row 1; products on row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] md:gap-x-6 md:gap-y-4 md:items-end mb-4 md:mb-8">
                    <div className="flex items-center gap-3 md:gap-6 shrink-0 order-1">
                        <div className="w-14 h-14 md:w-24 md:h-24 rounded-full border border-gray-100 overflow-hidden relative shadow-sm bg-white shrink-0">
                            <Image
                                src={categoryImage}
                                alt={`${categoryName} Icon`}
                                fill
                                unoptimized
                                className="object-contain p-1 md:p-3"
                            />
                        </div>
                        <div className="flex flex-col gap-0.5 md:gap-1 min-w-0">
                            <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-1.5 md:gap-2">
                                {displayCategoryName}
                                <FiCheckCircle className="text-blue-500 fill-blue-100 shrink-0 w-4 h-4 md:w-6 md:h-6" />
                            </h1>
                            <p className="text-[10px] md:text-sm text-gray-500 font-medium">
                                Showing {paginatedProductsForScreen.length} items
                            </p>
                        </div>
                    </div>

                    <div className="order-2 w-full -mx-4 px-4 py-2 overflow-x-auto no-scrollbar md:sticky md:top-[var(--header-offset-md,76px)] md:z-40 md:mx-0 md:px-4 md:py-3 md:bg-white/95 md:backdrop-blur-md md:overflow-visible md:w-auto md:self-start md:justify-self-end md:rounded-2xl md:border md:border-gray-200/90 md:shadow-sm">
                            <CategoryTopFilters
                                derivedFilters={derivedFilters}
                                regionFilterGroups={derivedFilters.regionFilterGroups}
                            globalMinPrice={derivedFilters.globalMinPrice}
                            globalMaxPrice={derivedFilters.globalMaxPrice}
                            selectedBrands={selectedBrands}
                            setSelectedBrands={setSelectedBrands}
                            selectedPrice={selectedPrice}
                            setSelectedPrice={setSelectedPrice}
                            selectedStorage={selectedStorage}
                            setSelectedStorage={setSelectedStorage}
                            selectedRegion={selectedRegion}
                            setSelectedRegion={setSelectedRegion}
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                            selectedAvailability={selectedAvailability}
                            setSelectedAvailability={setSelectedAvailability}
                        />
                    </div>

                    <div className="order-3 md:col-span-2 w-full">
                    {/* Main Content (Product Grid) - Full Width */}
                    <div>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                                <div className="w-8 h-8 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400 font-medium">Loading products...</p>
                            </div>
                        ) : paginatedProductsForScreen.length > 0 ? (
                            <ProductGrid
                                products={paginatedProductsForScreen}
                                categoryName={displayCategoryName}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                                <p className="text-gray-400 font-medium">No products match your filters.</p>
                            </div>
                        )}

                        {/* Pagination Overlay logic is now entirely Client-side aware */}
                        {!isLoading && totalPages > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                                {Array.from({ length: totalPages }, (_, i) => {
                                    let pageNum = i + 1;

                                    // Basic slicing window to prevent hundred page spans wrapping.
                                    if (totalPages > 6) {
                                        if (pageNum < validCurrentPage - 2 && pageNum !== 1) return null;
                                        if (pageNum > validCurrentPage + 2 && pageNum !== totalPages) return null;
                                        if (pageNum === validCurrentPage - 2 && pageNum > 2) return <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">...</span>;
                                        if (pageNum === validCurrentPage + 2 && pageNum < totalPages - 1) return <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">...</span>;
                                    }

                                    return (
                                        <Link
                                            key={pageNum}
                                            href={`/category/${rawSlug}?page=${pageNum}${requestedSubcategorySlug ? `&subcat=${encodeURIComponent(requestedSubcategorySlug)}` : ''}${requestedSubcategoryId ? `&subcat_id=${requestedSubcategoryId}` : ''}`}
                                            scroll={true}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${pageNum === validCurrentPage
                                                ? 'bg-brand-purple text-white shadow-md'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
