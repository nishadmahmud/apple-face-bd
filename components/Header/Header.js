"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiMic, FiChevronRight, FiGrid, FiChevronDown, FiHeart, FiGift, FiMapPin, FiTruck, FiLayers } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import { searchProducts } from '../../lib/api';
import { useWishlist } from '../../context/WishlistContext';

export default function Header({ categories = [] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
  const [activeSearchCategory, setActiveSearchCategory] = useState('all');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const displayCategories = Array.isArray(categories) ? categories : [];
  const orderedDisplayCategories = useMemo(() => {
    if (!Array.isArray(displayCategories) || displayCategories.length === 0) return [];

    const normalize = (value) => String(value || '').toLowerCase().trim();
    const isPhones = (cat) => normalize(cat?.name) === 'phones';
    const isUsedPhones = (cat) => {
      const name = normalize(cat?.name);
      return name === 'used phone' || name === 'used phones';
    };

    const phonesIdx = displayCategories.findIndex(isPhones);
    const usedIdx = displayCategories.findIndex(isUsedPhones);
    if (phonesIdx === -1 || usedIdx === -1 || usedIdx === phonesIdx + 1) return displayCategories;

    const ordered = [...displayCategories];
    const [usedCat] = ordered.splice(usedIdx, 1);
    const targetPhonesIdx = ordered.findIndex(isPhones);
    ordered.splice(targetPhonesIdx + 1, 0, usedCat);
    return ordered;
  }, [displayCategories]);

  const handleUserClick = () => {
    if (user) { router.push('/profile'); }
    else { openAuthModal('login'); }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const runSearch = async (q) => {
    if (!q) { setIsSearchOpen(false); setSearchResults([]); setSearchCategories([]); setSearchError(''); return; }
    setIsSearchOpen(true); setIsSearching(true); setSearchError('');
    try {
      const res = await searchProducts(q);
      const payload = res?.data || res;
      const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      const mapped = items.map((p) => {
        const basePrice = Number(p.retails_price || p.discounted_price || 0);
        const discountValue = Number(p.discount || 0);
        const discountType = String(p.discount_type || '').toLowerCase();
        const hasDiscount = discountValue > 0 && discountType !== '0';
        const price = hasDiscount ? (discountType === 'percentage' ? Math.max(0, Math.round(basePrice * (1 - discountValue / 100))) : Math.max(0, basePrice - discountValue)) : basePrice;
        const discountLabel = hasDiscount ? (discountType === 'percentage' ? `-${discountValue}%` : `৳ ${discountValue.toLocaleString('en-IN')}`) : null;
        const imageUrl = p.image_path || p.image_path1 || p.image_path2 || (Array.isArray(p.image_paths) && p.image_paths[0]) || '/no-image.svg';
        return { id: p.id, name: p.name, price: `৳ ${price.toLocaleString('en-IN')}`, oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString('en-IN')}` : null, discount: discountLabel, imageUrl, brand: p.brands?.name || '', categoryName: p.category?.name || 'Others' };
      });
      setSearchResults(mapped);
      setSearchCategories(Array.from(new Set(mapped.map((m) => m.categoryName))).sort());
      setActiveSearchCategory('all');
    } catch (err) {
      console.error('Search failed', err);
      setSearchError('Something went wrong. Please try again.');
      setSearchResults([]); setSearchCategories([]);
    } finally { setIsSearching(false); }
  };

  const handleSearchSubmit = async (e) => { e.preventDefault(); const q = searchQuery.trim(); if (!q) return; runSearch(q); };

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) { setIsSearchOpen(false); setSearchResults([]); setSearchCategories([]); setSearchError(''); return; }
    const timeout = setTimeout(() => { runSearch(q); }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => (prev ? y > 16 : y > 48));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isScrolled) setIsCategoriesOpen(false);
  }, [isScrolled]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--header-offset', isScrolled ? '56px' : '64px');
    root.style.setProperty('--header-offset-md', isScrolled ? '56px' : '76px');
    return () => {
      root.style.removeProperty('--header-offset');
      root.style.removeProperty('--header-offset-md');
    };
  }, [isScrolled]);

  const closeSearchModal = () => { setShowSearchModal(false); setIsSearchOpen(false); setSearchQuery(''); setSearchResults([]); setSearchCategories([]); };
  const openSearchModal = () => { setShowSearchModal(true); };
  const filteredSearchResults = useMemo(() => {
    if (activeSearchCategory === 'all') return searchResults;
    return searchResults.filter((p) => p.categoryName === activeSearchCategory);
  }, [searchResults, activeSearchCategory]);

  return (
    <>
      <header className={`w-full sticky top-0 z-[90] transition-shadow duration-500 ease-in-out ${isScrolled ? 'md:shadow-[0_4px_24px_rgba(0,0,0,0.12)]' : 'md:shadow-none'}`}>

        {/* ─── MOBILE HEADER ─── */}
        <div className={`md:hidden px-3 bg-gray-50/80 backdrop-blur-md transition-[padding] duration-500 ease-in-out ${isScrolled ? 'pt-0 pb-2.5' : 'pt-3 pb-2.5'}`}>
          <div className="bg-[#2D2D2D] rounded-full flex items-center justify-between px-2.5 py-2.5 shadow-xl relative border border-white/10">
            {/* Logo in White Pill */}
            <Link href="/" className="bg-white rounded-full px-3.5 py-2 flex items-center shadow-md flex-shrink-0" aria-label="Home">
              <Image src="/CTBD Text.png" alt="Apple Face BD BD" width={100} height={26} className="h-5 sm:h-6 w-auto object-contain" unoptimized priority />
            </Link>

            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className={`flex-grow flex items-center bg-white/10 focus-within:bg-white/20 border ${isSearchOpen || showSearchModal ? 'border-brand-primary' : 'border-white/5'} rounded-full px-2.5 py-1.5 mx-2 transition-colors`}>
              <FiSearch className={`${isSearchOpen || showSearchModal ? 'text-brand-primary' : 'text-gray-300'} mr-2 flex-shrink-0 w-3.5 h-3.5 transition-colors`} />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchModal(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-[16px] text-white placeholder-gray-300 min-w-0 w-full"
              />
              {(showSearchModal || searchQuery) && (
                <button type="button" onClick={() => { setSearchQuery(''); closeSearchModal(); }} className="text-gray-400 hover:text-white p-0.5 ml-1 flex-shrink-0">
                  <FiX size={14} />
                </button>
              )}
            </form>

            {/* Icons */}
            <div className="flex items-center gap-0.5 flex-shrink-0 mr-1">
              <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300 hover:text-brand-primary p-1.5 rounded-full hover:bg-white/5 transition-all" aria-label="Menu">
                <FiMenu size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── DESKTOP: Pill-Shaped Navigation Bar ─── */}
        <div
          className={`hidden md:block transition-[padding,background-color,box-shadow] duration-500 ease-in-out ${
            isScrolled ? 'bg-[#2D2D2D] py-0 px-0' : 'bg-transparent py-3 px-6'
          }`}
        >
          <div
            className={`mx-auto w-full transition-[max-width,padding] duration-500 ease-in-out ${
              isScrolled ? 'max-w-full px-4 lg:px-6' : 'max-w-6xl px-0'
            }`}
          >
            <div
              className={`bg-[#2D2D2D] flex items-center relative transition-[padding,box-shadow,border-radius] duration-500 ease-in-out py-1.5 px-3 ${
                isScrolled ? 'shadow-none' : 'shadow-xl'
              }`}
              style={{
                borderRadius: isScrolled ? '0px' : '9999px',
                transition: 'border-radius 500ms ease-in-out, padding 500ms ease-in-out, box-shadow 500ms ease-in-out',
              }}
            >

              {/* Left Nav Items */}
              <div className="flex items-center gap-0.5">
                {/* Categories Mega Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <button className="flex items-center gap-1.5 text-gray-300 hover:text-brand-primary text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-white/5 transition-all whitespace-nowrap">
                    Categories
                    <FiChevronDown size={13} className={`opacity-70 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full -left-4 mt-3 w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-200 z-50 overflow-hidden ${isCategoriesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-gray-800">All Categories</h3>
                          <Link href="/category" className="text-[11px] font-semibold text-brand-primary hover:underline">View All →</Link>
                        </div>
                        {orderedDisplayCategories.length > 0 ? (
                          <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto no-scrollbar">
                            {orderedDisplayCategories.map((cat, idx) => (
                              <Link key={cat.id || idx} href={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="flex flex-col items-center group/cat">
                                <div className="w-full aspect-square rounded-xl overflow-visible relative flex items-center justify-center group-hover/cat:bg-[#F0F0F0] transition-all">
                                  {(cat.image_url || cat.image || cat.image_path) ? (
                                    <div className="relative w-[75%] h-[75%]">
                                      <Image src={cat.image_url || cat.image || cat.image_path} alt={cat.name} fill className="object-contain group-hover/cat:scale-105 transition-transform duration-300" unoptimized />
                                    </div>
                                  ) : (
                                    <FiGrid size={20} className="text-gray-400" />
                                  )}
                                </div>
                                <span className="text-[11px] font-semibold text-gray-700 group-hover/cat:text-brand-primary transition-colors text-center line-clamp-2 leading-tight mt-2">{cat.name}</span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center text-sm text-gray-500">
                            Categories are loading...
                          </div>
                        )}
                      </div>
                    </div>
                </div>

                <Link href="/blogs" className="text-gray-300 hover:text-brand-primary text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-white/5 transition-all whitespace-nowrap">
                  Blogs
                </Link>
                <Link href="/about" className="text-gray-300 hover:text-brand-primary text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-white/5 transition-all whitespace-nowrap">
                  About
                </Link>
                <Link href="/contact" className="text-gray-300 hover:text-brand-primary text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-white/5 transition-all whitespace-nowrap">
                  Contact
                </Link>
              </div>

              {/* Center Logo in White Pill */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <Link href="/" className="bg-white rounded-full px-6 py-2 flex items-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <Image src="/CTBD Text.png" alt="Apple Face BD BD" width={120} height={30} className="h-5 md:h-6 w-auto object-contain" unoptimized />
                </Link>
              </div>

              {/* Right Nav + Action Icons */}
              <div className="flex items-center gap-0.5 ml-auto">
                <Link href="/compare" className="relative flex items-center gap-1 text-gray-300 hover:text-brand-primary text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-white/5 transition-all whitespace-nowrap" aria-label="Compare products">
                  <FiLayers size={14} className="opacity-90" />
                  Compare
                  {compareCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-brand-primary text-white text-[8px] font-bold min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center ring-1 ring-[#2D2D2D]">
                      {compareCount}
                    </span>
                  )}
                </Link>
                <Link href="/special-offers" className="flex items-center gap-1 text-brand-primary text-[13px] font-bold px-3 py-2.5 rounded-full hover:bg-white/5 transition-all whitespace-nowrap">
                  <FiGift size={14} />
                  Offers
                </Link>

                {/* Divider */}
                <div className="w-px h-5 bg-white/20 mx-1.5"></div>

                {/* Search Toggle */}
                <button
                  onClick={openSearchModal}
                  className="text-gray-300 hover:text-brand-primary p-2.5 rounded-full hover:bg-white/5 transition-all"
                  aria-label="Search"
                >
                  <FiSearch size={18} />
                </button>

                {/* Track Order */}
                <Link href="/track-order" className="text-gray-300 hover:text-brand-primary p-2.5 rounded-full hover:bg-white/5 transition-all" aria-label="Track Order">
                  <FiTruck size={18} />
                </Link>

                {/* Wishlist */}
                <Link href="/wishlist" className="text-gray-300 hover:text-brand-primary p-2.5 rounded-full hover:bg-white/5 transition-all relative" aria-label="Wishlist">
                  <FiHeart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 bg-brand-primary text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center ring-1 ring-[#1E3E28]">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <button onClick={openCart} className="text-gray-300 hover:text-brand-primary p-2.5 rounded-full hover:bg-white/5 transition-all relative" aria-label="Cart">
                  <FiShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-brand-primary text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center ring-1 ring-[#2D2D2D]">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* User / Profile (right-most) */}
                <button onClick={handleUserClick} className="text-gray-300 hover:text-brand-primary p-2.5 rounded-full hover:bg-white/5 transition-all" aria-label="Account">
                  {user?.image ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30">
                      <Image src={user.image} alt="Profile" width={24} height={24} className="w-full h-full object-cover" unoptimized />
                    </div>
                  ) : user ? (
                    <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-[10px] font-bold text-white">
                      {(user.first_name || user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <FiUser size={18} />
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Search Modal (Search Bar + Results in One) ─── */}
        {showSearchModal && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-[80]" onClick={closeSearchModal} />

            {/* Modal */}
            <div className="fixed inset-0 z-[85] flex items-start justify-center pt-16 md:pt-20 px-4 pointer-events-none">
              <div className="w-full max-w-6xl bg-[#F5F6F8] rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden border border-gray-200 pointer-events-auto">

                {/* Search Bar — Always at Top (Desktop Only) */}
                <div className="hidden md:block bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex-shrink-0">
                  <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-50 border border-gray-200 focus-within:border-brand-primary focus-within:shadow-[0_2px_12px_rgba(57,178,74,0.1)] rounded-full px-4 py-2.5 transition-all duration-300 group">
                    <FiSearch className="text-gray-400 group-focus-within:text-brand-primary mr-3 flex-shrink-0 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products, brands, categories..."
                      className="flex-grow bg-transparent border-none outline-none text-base text-gray-800 placeholder-gray-400 min-w-0 w-full"
                      style={{ fontSize: '16px' }}
                      autoFocus
                    />
                    <button type="button" onClick={closeSearchModal} className="text-gray-400 hover:text-gray-600 p-1 ml-2 flex-shrink-0">
                      <FiX size={18} />
                    </button>
                  </form>
                </div>

                {/* Results Area */}
                {isSearching ? (
                  <div className="p-12 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                  </div>
                ) : searchError ? (
                  <div className="p-8 text-center text-red-500 text-sm">{searchError}</div>
                ) : searchResults.length === 0 && searchQuery.trim() ? (
                  <div className="p-12 text-center text-gray-500">No products found matching &quot;{searchQuery}&quot;</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 text-sm">Start typing to search products...</div>
                ) : (
                  <>
                    {/* Mobile: Category Pills */}
                    <div className="md:hidden sticky top-0 bg-white z-10 border-b border-gray-200">
                      <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <h3 className="text-sm font-bold text-gray-800">{filteredSearchResults.length} Results</h3>
                        <button onClick={closeSearchModal} className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors">
                          <FiX size={16} />
                        </button>
                      </div>
                      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveSearchCategory('all')} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeSearchCategory === 'all' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-brand-primary'}`}>All ({searchResults.length})</button>
                        {searchCategories.map(cat => {
                          const count = searchResults.filter(p => p.categoryName === cat).length;
                          return <button key={cat} onClick={() => setActiveSearchCategory(cat)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeSearchCategory === cat ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-brand-primary'}`}>{cat} ({count})</button>;
                        })}
                      </div>
                    </div>

                    {/* Mobile: Product List */}
                    <div className="md:hidden flex-1 overflow-y-auto no-scrollbar">
                      {filteredSearchResults.map(product => (
                        <Link key={product.id} href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`} onClick={closeSearchModal}
                          className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white hover:bg-green-50/30 transition-colors">
                          <div className="w-14 h-14 relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-1 mix-blend-multiply" unoptimized />
                            {product.discount && <div className="absolute top-0.5 left-0.5 bg-brand-red text-white text-[8px] font-bold px-1 py-0.5 rounded">{product.discount}</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            {product.brand && <span className="text-[10px] font-semibold text-brand-primary">{product.brand}</span>}
                            <h4 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">{product.name}</h4>
                            <div className="flex items-baseline gap-1.5 mt-1">
                              <span className="font-bold text-sm text-gray-900">{product.price}</span>
                              {product.oldPrice && <span className="text-[10px] text-gray-400 line-through">{product.oldPrice}</span>}
                            </div>
                          </div>
                          <FiChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>

                    {/* Desktop: Sidebar + Grid */}
                    <div className="hidden md:flex flex-row flex-1 overflow-hidden">
                      {/* Category Sidebar */}
                      <div className="w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
                        <div className="p-4">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
                          <ul className="space-y-0.5">
                            <li>
                              <button onClick={() => setActiveSearchCategory('all')}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSearchCategory === 'all' ? 'bg-brand-primary text-white font-semibold' : 'text-gray-600 hover:bg-green-50 hover:text-brand-primary'}`}>
                                All Results ({searchResults.length})
                              </button>
                            </li>
                            {searchCategories.map(cat => {
                              const count = searchResults.filter(p => p.categoryName === cat).length;
                              return (
                                <li key={cat}>
                                  <button onClick={() => setActiveSearchCategory(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${activeSearchCategory === cat ? 'bg-brand-primary text-white font-semibold' : 'text-gray-600 hover:bg-green-50 hover:text-brand-primary'}`}>
                                    <span className="truncate pr-2">{cat}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeSearchCategory === cat ? 'bg-white/20' : 'bg-gray-200'}`}>{count}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>

                      {/* Product Grid */}
                      <div className="flex-1 overflow-y-auto p-4 bg-[#F5F6F8]">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-bold text-gray-800">
                            {activeSearchCategory === 'all' ? 'All Products' : activeSearchCategory}
                            <span className="text-gray-400 font-normal ml-2">({filteredSearchResults.length})</span>
                          </h3>
                        </div>
                        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                          {filteredSearchResults.map(product => (
                            <Link key={product.id} href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`} onClick={closeSearchModal}
                              className="group flex flex-col bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all p-2.5 hover:border-brand-primary/30">
                              <div className="aspect-[4/3] relative bg-gray-50 rounded-lg mb-2 overflow-hidden">
                                <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-1.5 mix-blend-multiply group-hover:scale-105 transition-transform duration-300" unoptimized />
                                {product.discount && <div className="absolute top-1 left-1 bg-brand-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{product.discount}</div>}
                              </div>
                              <div className="flex-1 flex flex-col min-h-0">
                                <span className="text-[9px] font-semibold text-brand-primary mb-0.5 truncate">{product.brand}</span>
                                <h4 className="text-[12px] font-medium text-gray-800 line-clamp-2 leading-tight mb-1.5 group-hover:text-brand-primary transition-colors">{product.name}</h4>
                                <div className="mt-auto flex items-baseline gap-1 flex-wrap">
                                  <span className="font-bold text-[13px] text-gray-900">{product.price}</span>
                                  {product.oldPrice && <span className="text-[10px] text-gray-400 line-through">{product.oldPrice}</span>}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </header>

      {/* ─── Mobile Sidebar Overlay ─── */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[100] md:hidden transition-opacity" onClick={closeSidebar} />}

      {/* ─── Mobile Sidebar Drawer ─── */}
      <div className={`fixed inset-y-0 left-0 w-[300px] bg-gray-50 z-[110] transform transition-transform duration-300 ease-in-out flex flex-col md:hidden shadow-[20px_0_40px_rgba(0,0,0,0.15)] rounded-r-[2rem] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Top Header & Header Profile Block */}
        <div className="bg-[#2D2D2D] text-white rounded-tr-[2rem] pt-6 pb-6 px-6 relative overflow-hidden flex-shrink-0 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <Link href="/" onClick={closeSidebar} className="bg-white rounded-full px-3.5 py-1.5 flex items-center shadow-md">
              <Image src="/CTBD Text.png" alt="Apple Face BD BD" width={100} height={24} className="h-5 w-auto object-contain" unoptimized />
            </Link>
            <button onClick={closeSidebar} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm">
              <FiX size={18} />
            </button>
          </div>

          <button onClick={() => { closeSidebar(); handleUserClick(); }} className="relative z-10 flex items-center gap-4 w-full p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-left group">
            {user?.image ? (
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-brand-primary"><Image src={user.image} alt="Profile" width={44} height={44} className="w-full h-full object-cover" unoptimized /></div>
            ) : user ? (
              <div className="w-11 h-11 rounded-full bg-brand-primary flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-brand-primary/30">{(user.first_name || user.name || 'U').charAt(0).toUpperCase()}</div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"><FiUser size={20} className="text-white" /></div>
            )}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[15px] font-bold text-white truncate group-hover:text-brand-primary transition-colors">{user ? (user.first_name || user.name || 'User') : 'Login / Sign Up'}</span>
              <span className="text-[11px] text-white/70 truncate">{user ? 'View your profile' : 'Access your account'}</span>
            </div>
            <FiChevronRight size={18} className="text-white/50 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-7 no-scrollbar pb-24">
          
          {/* Categories Grid */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center"><FiGrid size={12} className="text-brand-primary" /></div>
              <h3 className="text-[11px] font-black tracking-widest text-gray-800 uppercase">Shop by Category</h3>
            </div>
            
            {displayCategories.length > 0 ? (
              <div className="grid grid-cols-4 gap-1.5">
                {displayCategories.map((cat, idx) => (
                  <Link key={cat.id || idx} href={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`} onClick={closeSidebar}
                    className="flex flex-col items-center justify-center gap-1 p-1.5 bg-white border border-gray-100 rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.03)] hover:border-brand-primary/40 hover:shadow-md hover:shadow-brand-primary/5 transition-all duration-300 group">
                    {cat.image_url ? (
                      <div className="w-8 h-8 relative flex items-center justify-center bg-gray-50 rounded-lg group-hover:scale-105 transition-transform duration-300 p-0.5">
                        <Image src={cat.image_url} alt={cat.name} fill className="object-contain mix-blend-multiply" unoptimized />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:scale-105 transition-all duration-300">
                        <FiGrid size={14} className="text-gray-300 group-hover:text-brand-primary transition-colors" />
                      </div>
                    )}
                    <span className="text-[8.5px] font-bold text-gray-700 text-center leading-tight line-clamp-2 w-full pt-0.5 group-hover:text-brand-primary transition-colors break-words">{cat.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500 bg-white border border-gray-100 rounded-2xl shadow-sm">No categories available.</div>
            )}
          </div>

          {/* Navigation Menu */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"><FiMenu size={12} className="text-gray-600" /></div>
              <h3 className="text-[11px] font-black tracking-widest text-gray-800 uppercase">Quick Menu</h3>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <Link href="/" onClick={closeSidebar} className="flex items-center justify-between px-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-700 hover:border-brand-primary/40 hover:shadow-[0_4px_12px_rgba(57,178,74,0.08)] transition-all group">
                <span>Home</span><FiChevronRight size={16} className="text-gray-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/about" onClick={closeSidebar} className="flex items-center justify-between px-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-700 hover:border-brand-primary/40 hover:shadow-[0_4px_12px_rgba(57,178,74,0.08)] transition-all group">
                <span>About Us</span><FiChevronRight size={16} className="text-gray-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/blogs" onClick={closeSidebar} className="flex items-center justify-between px-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-700 hover:border-brand-primary/40 hover:shadow-[0_4px_12px_rgba(57,178,74,0.08)] transition-all group">
                <span>Blogs</span><FiChevronRight size={16} className="text-gray-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </Link>
              
              {/* Highlighted Blocks */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link href="/contact" onClick={closeSidebar} className="flex flex-col items-center justify-center py-4 bg-white border border-gray-100 rounded-2xl hover:border-brand-primary/40 hover:bg-brand-primary/5 shadow-sm hover:shadow-md transition-all text-center group">
                  <FiMapPin size={20} className="text-gray-400 mb-2 group-hover:text-brand-primary transition-colors" />
                  <span className="text-[11px] font-bold text-gray-700 group-hover:text-brand-primary transition-colors">Contact Us</span>
                </Link>
                <Link href="/track-order" onClick={closeSidebar} className="flex flex-col items-center justify-center py-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl hover:bg-brand-primary hover:border-brand-primary shadow-sm hover:shadow-lg hover:shadow-brand-primary/20 transition-all text-center group">
                  <FiTruck size={20} className="text-brand-primary mb-2 group-hover:text-white transition-colors" />
                  <span className="text-[11px] font-bold text-brand-primary group-hover:text-white transition-colors">Track Order</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Legal / Policies */}
          <div className="pt-2">
             <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/warranty" onClick={closeSidebar} className="text-[10px] font-bold text-gray-400 hover:text-brand-primary px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-brand-primary/30 transition-colors">Warranty</Link>
                <Link href="/refund" onClick={closeSidebar} className="text-[10px] font-bold text-gray-400 hover:text-brand-primary px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-brand-primary/30 transition-colors">Refund</Link>
                <Link href="/terms" onClick={closeSidebar} className="text-[10px] font-bold text-gray-400 hover:text-brand-primary px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-brand-primary/30 transition-colors">Terms</Link>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}
