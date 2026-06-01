"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getCategoriesFromServer, getCategoryWiseProducts, getProductsBySubcategory } from "../../../lib/api";
import { buildPhoneRegionFilterGroups, imeiMatchesRegionFilter } from "../../../lib/phoneRegionFilters";
import { countActiveCategoryFilters, resetCategoryFilters } from "../../../lib/categoryFilters";
import CategoryHeader from "../../../components/Category/CategoryHeader";
import CategoryFilterSidebar from "../../../components/Category/CategoryFilterSidebar";
import CategoryFilterBar from "../../../components/Category/CategoryFilterBar";
import CategoryProductListing from "../../../components/Category/CategoryProductListing";

function mapProduct(p) {
    const originalPrice = Number(p.retails_price || 0);
    const discountValue = Number(p.discount || 0);
    const discountType = p.discount_type;
    const hasDiscount = discountValue > 0 && String(discountType || "").toLowerCase() !== "0";

    const discountedPrice = hasDiscount
        ? String(discountType).toLowerCase() === "percentage"
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue)
        : originalPrice;

    const discount = hasDiscount
        ? String(discountType).toLowerCase() === "percentage"
            ? `-${discountValue}%`
            : `৳ ${discountValue}`
        : null;

    return {
        id: p.id,
        name: p.name,
        price: `৳ ${discountedPrice.toLocaleString("en-IN")}`,
        oldPrice: hasDiscount ? `৳ ${originalPrice.toLocaleString("en-IN")}` : null,
        discount,
        imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || "/no-image.svg",
        brand: p.brand_name || "",
        stock: p.current_stock || 0,
        rawPrice: discountedPrice,
        rawImeis: p.imeis || [],
    };
}

const filterProps = (state) => ({
    derivedFilters: state.derivedFilters,
    regionFilterGroups: state.derivedFilters.regionFilterGroups,
    globalMinPrice: state.derivedFilters.globalMinPrice,
    globalMaxPrice: state.derivedFilters.globalMaxPrice,
    selectedBrands: state.selectedBrands,
    setSelectedBrands: state.setSelectedBrands,
    selectedPrice: state.selectedPrice,
    setSelectedPrice: state.setSelectedPrice,
    selectedStorage: state.selectedStorage,
    setSelectedStorage: state.setSelectedStorage,
    selectedRegion: state.selectedRegion,
    setSelectedRegion: state.setSelectedRegion,
    selectedColor: state.selectedColor,
    setSelectedColor: state.setSelectedColor,
    selectedAvailability: state.selectedAvailability,
    setSelectedAvailability: state.setSelectedAvailability,
});

export default function CategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const rawSlug = params?.slug || "";
    const requestedSubcategorySlug = (searchParams?.get("subcat") || "").toLowerCase().trim();
    const requestedSubcategoryId = searchParams?.get("subcat_id") || "";
    const urlPage = Math.max(1, parseInt(searchParams?.get("page") || "1", 10));

    const [categoryId, setCategoryId] = useState(rawSlug);
    const [categoryName, setCategoryName] = useState(() =>
        decodeURIComponent(rawSlug)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
    );
    const [subCategories, setSubCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [filterOptions, setFilterOptions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bannerImage, setBannerImage] = useState(
        "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2000&auto=format&fit=crop"
    );
    const [categoryImage, setCategoryImage] = useState("/no-image.svg");
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [sortBy, setSortBy] = useState("Default");

    const [selectedBrands, setSelectedBrands] = useState(["All"]);
    const [selectedPrice, setSelectedPrice] = useState({ min: "", max: "" });
    const [selectedStorage, setSelectedStorage] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState("All");

    const selectedBrand = selectedBrands[0] || "All";
    const isBrandFiltered = selectedBrand !== "All";

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
        setSelectedPrice({ min: "", max: "" });
    }, [selectedBrand]);

    useEffect(() => {
        if (!filterDrawerOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [filterDrawerOpen]);

    useEffect(() => {
        let isMounted = true;

        const fetchCategoryData = async () => {
            setIsLoading(true);
            let resolvedCatId = rawSlug;
            let resolvedSubcategoryId = requestedSubcategoryId || null;
            const normalize = (val) =>
                val ? String(val).toLowerCase().trim().replace(/\s+/g, "-") : "";

            try {
                const catRes = await getCategoriesFromServer();
                if (catRes?.success && Array.isArray(catRes.data)) {
                    const slugLower = String(rawSlug).toLowerCase();

                    const found = catRes.data.find(
                        (c) =>
                            String(c.category_id) === String(rawSlug) ||
                            String(c.id) === String(rawSlug) ||
                            normalize(c.name) === slugLower
                    );

                    if (found) {
                        resolvedCatId = found.category_id ?? found.id ?? resolvedCatId;
                        if (isMounted) {
                            setCategoryId(resolvedCatId);
                            if (found.name) setCategoryName(found.name);
                            setSubCategories(
                                Array.isArray(found.sub_category) ? found.sub_category : []
                            );

                            const cBanner = found.banner || found.banner_image || "";
                            const cImg = found.image_path || found.image_url || "";

                            if (cBanner) setBannerImage(cBanner);
                            if (cImg) setCategoryImage(cImg);
                            if (!cBanner && cImg) setBannerImage(cImg);
                            if (!cImg && cBanner) setCategoryImage(cBanner);
                        }

                        if (
                            (requestedSubcategorySlug || requestedSubcategoryId) &&
                            Array.isArray(found.sub_category)
                        ) {
                            const matchedSubcategory = found.sub_category.find(
                                (sub) =>
                                    String(sub?.id) === String(requestedSubcategoryId) ||
                                    normalize(sub?.slug || sub?.name) === requestedSubcategorySlug
                            );

                            if (matchedSubcategory) {
                                resolvedSubcategoryId = matchedSubcategory.id;
                                if (isMounted) {
                                    setActiveSubcategory({
                                        id: matchedSubcategory.id,
                                        name: matchedSubcategory.name || "",
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
                console.error("Failed to resolve category:", err);
            }

            try {
                const fetchProducts = (pageNo) =>
                    resolvedSubcategoryId
                        ? getProductsBySubcategory(resolvedSubcategoryId, pageNo)
                        : getCategoryWiseProducts(resolvedCatId, pageNo);

                const firstPageData = await fetchProducts(1);

                if (isMounted && firstPageData?.success && Array.isArray(firstPageData.data)) {
                    let globalProductsArray = [...firstPageData.data];
                    setAllProducts(
                        globalProductsArray.map(mapProduct).sort((a, b) => b.stock - a.stock)
                    );

                    if (firstPageData.filter_options) setFilterOptions(firstPageData.filter_options);
                    setIsLoading(false);

                    const totalPages = firstPageData.pagination?.last_page || 1;
                    if (totalPages > 1) {
                        const remainingPagesToFetch = [];
                        for (let p = 2; p <= totalPages; p++) {
                            remainingPagesToFetch.push(p);
                        }

                        for (let i = 0; i < remainingPagesToFetch.length; i += 5) {
                            if (!isMounted) break;
                            const chunk = remainingPagesToFetch.slice(i, i + 5);

                            const chunkResults = await Promise.allSettled(
                                chunk.map((page) => fetchProducts(page))
                            );

                            chunkResults.forEach((res) => {
                                if (
                                    res.status === "fulfilled" &&
                                    res.value?.success &&
                                    Array.isArray(res.value.data)
                                ) {
                                    globalProductsArray.push(...res.value.data);
                                }
                            });

                            if (isMounted) {
                                setAllProducts(
                                    [...globalProductsArray]
                                        .map(mapProduct)
                                        .sort((a, b) => b.stock - a.stock)
                                );
                            }
                        }
                    }
                } else if (isMounted) {
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Failed to fetch category products:", err);
                if (isMounted) setIsLoading(false);
            }
        };

        if (rawSlug) fetchCategoryData();

        return () => {
            isMounted = false;
        };
    }, [rawSlug, requestedSubcategorySlug, requestedSubcategoryId]);

    const displayCategoryName = activeSubcategory?.name
        ? `${categoryName} - ${activeSubcategory.name}`
        : categoryName;

    const derivedFilters = useMemo(() => {
        const productsForOptions = isBrandFiltered ? brandScopedProducts : allProducts;

        const brandsList = ["All"];
        if (filterOptions?.brands) {
            brandsList.push(...Object.values(filterOptions.brands));
        } else {
            brandsList.push(...new Set(allProducts.map((p) => p.brand).filter(Boolean)));
        }

        const scopedImeis = productsForOptions.flatMap((p) => p.rawImeis || []);

        let storageList = [];
        if (!isBrandFiltered && filterOptions?.storages) {
            storageList = Object.values(filterOptions.storages);
        } else {
            storageList = [...new Set(scopedImeis.map((i) => i.storage).filter(Boolean))].sort();
        }

        let regionList = [];
        if (!isBrandFiltered && filterOptions?.regions) {
            regionList = Object.values(filterOptions.regions);
        } else {
            regionList = [...new Set(scopedImeis.map((i) => i.region).filter(Boolean))].sort();
        }

        let colorList = [];
        if (
            !isBrandFiltered &&
            filterOptions?.colors &&
            Array.isArray(filterOptions.colors) &&
            filterOptions.colors.length > 0
        ) {
            colorList = filterOptions.colors.map((c) => ({
                name: c,
                hex:
                    c.toLowerCase() === "black"
                        ? "#000000"
                        : c.toLowerCase() === "white"
                          ? "#ffffff"
                          : "#cccccc",
            }));
        } else {
            const colorMap = new Map();
            scopedImeis.forEach((i) => {
                if (i.color) {
                    if (!colorMap.has(i.color) || colorMap.get(i.color) === "#cccccc") {
                        colorMap.set(i.color, i.color_code || "#cccccc");
                    }
                }
            });
            colorList = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
        }

        let minPrice = Infinity;
        let maxPrice = 0;

        productsForOptions.forEach((p) => {
            if (p.rawPrice > 0 && p.rawPrice < minPrice) minPrice = p.rawPrice;
            if (p.rawPrice > maxPrice) maxPrice = p.rawPrice;

            if (p.rawImeis?.length > 0) {
                p.rawImeis.forEach((imei) => {
                    const imeiPrice = Number(imei.discount_price || imei.price || 0);
                    if (imeiPrice > 0) {
                        if (imeiPrice < minPrice) minPrice = imeiPrice;
                        if (imeiPrice > maxPrice) maxPrice = imeiPrice;
                    }
                });
            }
        });

        if (minPrice === Infinity) minPrice = 0;

        const roundDown = (val) => Math.floor(val / 100) * 100;
        const roundUp = (val) => Math.ceil(val / 100) * 100;

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
            globalMaxPrice,
        };
    }, [
        allProducts,
        brandScopedProducts,
        filterOptions,
        isBrandFiltered,
        categoryName,
        rawSlug,
        selectedBrand,
    ]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter((p) => {
            if (selectedBrands.length > 0 && selectedBrands[0] !== "All") {
                if (!selectedBrands.includes(p.brand)) return false;
            }
            if (selectedPrice.min !== "" && p.rawPrice < Number(selectedPrice.min)) return false;
            if (selectedPrice.max !== "" && p.rawPrice > Number(selectedPrice.max)) return false;
            if (selectedAvailability === "In Stock" && p.stock <= 0) return false;

            const hasImeiFilters =
                selectedStorage.length > 0 ||
                selectedRegion.length > 0 ||
                selectedColor.length > 0;
            if (hasImeiFilters) {
                const hasMatchingImei = (p.rawImeis || []).some((i) => {
                    let match = true;
                    if (selectedStorage.length > 0 && !selectedStorage.includes(i.storage))
                        match = false;
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
    }, [
        allProducts,
        selectedBrands,
        selectedPrice,
        selectedStorage,
        selectedRegion,
        selectedColor,
        selectedAvailability,
    ]);

    const sortedFilteredProducts = useMemo(() => {
        const list = [...filteredProducts];
        if (sortBy === "Price: Low to High") {
            list.sort((a, b) => a.rawPrice - b.rawPrice);
        } else if (sortBy === "Price: High to Low") {
            list.sort((a, b) => b.rawPrice - a.rawPrice);
        }
        return list;
    }, [filteredProducts, sortBy]);

    const itemsPerPage = 20;
    const totalPages = Math.max(1, Math.ceil(sortedFilteredProducts.length / itemsPerPage));
    const validCurrentPage = Math.min(urlPage, totalPages);

    const paginatedProducts = useMemo(() => {
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        return sortedFilteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedFilteredProducts, validCurrentPage, itemsPerPage]);

    const activeFilterCount = countActiveCategoryFilters({
        selectedBrands,
        selectedPrice,
        selectedStorage,
        selectedRegion,
        selectedColor,
        selectedAvailability,
    });

    const handleClearFilters = () => {
        resetCategoryFilters({
            setSelectedBrands,
            setSelectedPrice,
            setSelectedStorage,
            setSelectedRegion,
            setSelectedColor,
            setSelectedAvailability,
        });
    };

    const sidebarFilterProps = filterProps({
        derivedFilters,
        selectedBrands,
        setSelectedBrands,
        selectedPrice,
        setSelectedPrice,
        selectedStorage,
        setSelectedStorage,
        selectedRegion,
        setSelectedRegion,
        selectedColor,
        setSelectedColor,
        selectedAvailability,
        setSelectedAvailability,
    });

    return (
        <div className="bg-card-bg min-h-screen pb-20 md:pb-10 pt-4 md:pt-6 w-full">
            <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8">
                <CategoryHeader
                    bannerImage={bannerImage}
                    categoryImage={categoryImage}
                    displayCategoryName={displayCategoryName}
                    totalCount={filteredProducts.length}
                    isLoading={isLoading}
                    brandsList={derivedFilters.brandsList}
                    selectedBrands={selectedBrands}
                    onSelectBrand={setSelectedBrands}
                    categorySlug={rawSlug}
                    subCategories={subCategories}
                    activeSubcategory={activeSubcategory}
                />

                <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6 lg:items-start">
                    <CategoryFilterSidebar variant="desktop" isOpen onClose={() => {}} {...sidebarFilterProps} />

                    <div className="min-w-0">
                        <CategoryFilterBar
                            activeFilterCount={activeFilterCount}
                            onOpenFilters={() => setFilterDrawerOpen(true)}
                        />

                        <CategoryProductListing
                            products={paginatedProducts}
                            totalCount={sortedFilteredProducts.length}
                            isLoading={isLoading}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            onClearFilters={handleClearFilters}
                            totalPages={totalPages}
                            currentPage={validCurrentPage}
                            categorySlug={rawSlug}
                            subcatSlug={requestedSubcategorySlug}
                            subcatId={requestedSubcategoryId}
                        />
                    </div>
                </div>

                <CategoryFilterSidebar
                    variant="drawer"
                    isOpen={filterDrawerOpen}
                    onClose={() => setFilterDrawerOpen(false)}
                    {...sidebarFilterProps}
                />
            </div>
        </div>
    );
}
