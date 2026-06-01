"use client";

import { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../Shared/ProductCard';
import { getBrandwiseProducts, getProducts } from '../../lib/api';

export default function BrandProductSection({ brands = [] }) {
    const [activeBrandId, setActiveBrandId] = useState(0); // 0 = All
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Normalization helper for consistent product data
    const mapProduct = (p) => {
        const originalPrice = Number(p.retails_price || 0);
        const discountValue = Number(p.discount || 0);
        const discountType = String(p.discount_type || '').toLowerCase();
        const hasDiscount = discountValue > 0 && discountType !== '0';

        const price = hasDiscount
            ? discountType === 'percentage'
                ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
                : Math.max(0, originalPrice - discountValue)
            : originalPrice;

        return {
            id: p.id,
            name: p.name,
            price: `৳ ${price.toLocaleString('en-IN')}`,
            oldPrice: hasDiscount ? `৳ ${originalPrice.toLocaleString('en-IN')}` : null,
            discount: hasDiscount 
                ? (discountType === 'percentage' ? `-${discountValue}%` : `৳ ${discountValue}`) 
                : null,
            imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || "/no-image.svg",
            badge: p.status || null
        };
    };

    // Store products for each brand to avoid redundant fetches
    const [fetchedData, setFetchedData] = useState({}); // { brandId: [products] }
    const [allProducts, setAllProducts] = useState([]);

    // 1. Initial fetch: Combine products from all brands for the "All" tab
    useEffect(() => {
        if (!brands || brands.length === 0) return;

        const preFetchAll = async () => {
            setLoading(true);
            try {
                // Fetch products for each brand in parallel
                const promises = brands.map(brand => getBrandwiseProducts(brand.id));
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

                // Shuffle combined results slightly so it's not just all Apple then all Samsung
                const shuffled = combined.sort(() => 0.5 - Math.random());
                
                setFetchedData(dataMap);
                setAllProducts(shuffled);
                
                // If currently on "All" tab, set products state
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
    }, [brands]);

    // 2. Tab switching logic
    useEffect(() => {
        if (loading && Object.keys(fetchedData).length === 0) return;

        if (activeBrandId === 0) {
            setProducts(allProducts);
        } else {
            // Use cached data if available, otherwise fallback to empty (or fetch if needed)
            if (fetchedData[activeBrandId]) {
                setProducts(fetchedData[activeBrandId]);
            } else {
                setProducts([]);
            }
        }
    }, [activeBrandId, allProducts, fetchedData]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-white py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
                    <h2 className="text-xl md:text-[28px] font-extrabold tracking-tight">
                        <span className="text-gray-800">Top Brand </span>
                        <span className="text-brand-primary">Products</span>
                    </h2>
                    
                    {/* Navigation Arrows */}
                    {brands.length > 0 && (
                        <div className="hidden md:flex items-center gap-2">
                            <button 
                                onClick={() => scroll('left')}
                                className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-colors"
                            >
                                <FiChevronLeft size={18} className="text-gray-600" />
                            </button>
                            <button 
                                onClick={() => scroll('right')}
                                className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                            >
                                <FiChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Brand Filter Pills */}
                <div className="relative mb-8">
                    <div 
                        ref={scrollRef}
                        className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2"
                    >
                        {/* Always show "All" Tab if there are brands OR products */}
                        {(brands.length > 0 || products.length > 0) && (
                            <button
                                onClick={() => setActiveBrandId(0)}
                                className={`px-5 md:px-7 py-2 md:py-2.5 rounded-full text-sm md:text-base font-bold whitespace-nowrap transition-all duration-300 ${
                                    activeBrandId === 0 
                                    ? "bg-brand-primary text-white" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                All
                            </button>
                        )}

                        {/* API Brands */}
                        {brands.map((brand) => (
                            <button
                                key={brand.id}
                                onClick={() => setActiveBrandId(brand.id)}
                                className={`px-5 md:px-7 py-2 md:py-2.5 rounded-full text-sm md:text-base font-bold whitespace-nowrap transition-all duration-300 ${
                                    activeBrandId === brand.id 
                                    ? "bg-brand-primary text-white" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {brand.name}
                            </button>
                        ))}

                        {brands.length === 0 && !loading && products.length === 0 && (
                            <div className="text-gray-400 text-sm italic">No brands available at the moment.</div>
                        )}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="relative min-h-[300px]">
                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-pulse">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-gray-100 rounded-2xl h-[300px] md:h-[380px]" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 transition-all duration-500">
                            {products.length > 0 ? (
                                products.slice(0, 8).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-gray-400 font-medium italic">
                                    No products found.
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
