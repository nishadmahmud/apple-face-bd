"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronRight, FiGrid, FiHeart, FiGift, FiTruck, FiMapPin, FiZap, FiHome, FiFileText, FiInfo, FiShuffle } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getLoginUrl } from '../../lib/authRoutes';
import { searchProducts } from '../../lib/api';
import { useWishlist } from '../../context/WishlistContext';
import AppleFaceTextLogo from '../Brand/AppleFaceTextLogo';
import AppleFaceMark from '../Brand/AppleFaceMark';
import { getCategoryHref } from '../../lib/categoryLinks';
import LoadingSpinner from '../Shared/LoadingSpinner';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();
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
    else { router.push(getLoginUrl({ redirect: '/profile' })); }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const getCategoryImage = (cat) => cat?.image || cat?.image_path || cat?.image_url || null;

  useEffect(() => {
    if (!isSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isSidebarOpen]);

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
    setHydrated(true);
  }, []);

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
    const root = document.documentElement;
    root.style.setProperty('--header-offset', isScrolled ? '50px' : '54px');
    root.style.setProperty('--header-offset-md', isScrolled ? '96px' : '104px');
    return () => {
      root.style.removeProperty('--header-offset');
      root.style.removeProperty('--header-offset-md');
    };
  }, [isScrolled]);

  const closeSearchModal = () => { setShowSearchModal(false); setIsSearchOpen(false); setSearchQuery(''); setSearchResults([]); setSearchCategories([]); };
  const filteredSearchResults = useMemo(() => {
    if (activeSearchCategory === 'all') return searchResults;
    return searchResults.filter((p) => p.categoryName === activeSearchCategory);
  }, [searchResults, activeSearchCategory]);

  return (
    <>
      <header className={`w-full sticky top-0 z-[90] bg-[#0a0a0a] transition-shadow duration-300 ${isScrolled ? 'shadow-lg shadow-black/30' : 'shadow-sm'}`}>

        {/* ─── MOBILE: compact top bar ─── */}
        <div className="md:hidden flex items-center gap-2 px-3 py-2.5 bg-[#0a0a0a] border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 min-w-0 shrink" aria-label="Home">
            <AppleFaceMark size={32} className="w-8 h-8 object-contain shrink-0" />
            <AppleFaceTextLogo height={22} variant="onDark" className="h-5 w-auto" />
          </Link>

          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className={`flex-1 min-w-0 flex items-center gap-2 rounded-full px-3 py-2 text-left transition-colors ${
              showSearchModal
                ? 'bg-white/15 ring-1 ring-brand-primary/40'
                : 'bg-white/10 hover:bg-white/15'
            }`}
            aria-label="Search products"
          >
            <FiSearch className="shrink-0 w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 truncate">Search products...</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="shrink-0 p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <FiMenu size={20} />
          </button>
        </div>

        {/* ─── DESKTOP: strip 1 — logo, search, actions (black) ─── */}
        <div className="hidden md:block border-b border-white/10">
          <div className="max-w-site mx-auto px-4 lg:px-6">
            <div className="flex items-center gap-3 lg:gap-4 py-3 w-full min-w-0">
              <Link href="/" className="shrink-0" aria-label="Home">
                <AppleFaceTextLogo height={30} variant="onDark" className="h-7 w-auto" />
              </Link>

              <form
                onSubmit={handleSearchSubmit}
                className={`flex-1 min-w-0 w-full flex items-center gap-2 bg-white/10 border rounded-lg px-4 py-2.5 transition-colors ${isSearchOpen || showSearchModal ? 'border-brand-primary ring-1 ring-brand-primary/30' : 'border-white/15 hover:border-white/25'}`}
              >
                <FiSearch className={`${isSearchOpen || showSearchModal ? 'text-brand-primary' : 'text-gray-400'} shrink-0 w-5 h-5`} />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSearchModal(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands..."
                  className="bg-transparent border-none outline-none text-base text-white placeholder-gray-400 min-w-0 w-full flex-1"
                  style={{ fontSize: '16px' }}
                />
                {(showSearchModal || searchQuery) && (
                  <button type="button" onClick={() => { setSearchQuery(''); closeSearchModal(); }} className="text-gray-400 hover:text-white p-1 shrink-0">
                    <FiX size={16} />
                  </button>
                )}
              </form>

              <div className="flex items-center gap-0.5 shrink-0">
                <Link
                  href="/track-order"
                  className="text-gray-300 hover:text-white p-2.5 rounded-lg hover:bg-white/10 transition-all"
                  aria-label="Track order"
                  title="Track order"
                >
                  <FiTruck size={18} />
                </Link>
                <Link href="/wishlist" className="relative text-gray-300 hover:text-white p-2.5 rounded-lg hover:bg-white/10 transition-all" aria-label="Wishlist">
                  <FiHeart size={18} />
                  {hydrated && wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 bg-brand-primary text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <button onClick={openCart} className="relative text-gray-300 hover:text-white p-2.5 rounded-lg hover:bg-white/10 transition-all" aria-label="Cart">
                  <FiShoppingCart size={18} />
                  {hydrated && cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-brand-primary text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button onClick={handleUserClick} className="text-gray-300 hover:text-white p-2.5 rounded-lg hover:bg-white/10 transition-all" aria-label="Account">
                  {user?.image ? (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20">
                      <Image src={user.image} alt="Profile" width={28} height={28} className="w-full h-full object-cover" unoptimized />
                    </div>
                  ) : user ? (
                    <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center text-[10px] font-bold text-white">
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

        {/* ─── DESKTOP: strip 2 — categories + offers (unchanged) ─── */}
        <div className="hidden md:block bg-white border-b border-gray-200">
          <div className="max-w-site mx-auto px-4 lg:px-6">
            <div className="flex items-center gap-3 pb-2.5 border-t border-gray-100 pt-2 min-h-[44px]">
              <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar">
                <Link
                  href="/category"
                  className="shrink-0 text-sm font-bold text-gray-900 hover:text-brand-primary px-3 py-2 rounded-md hover:bg-red-50 transition-colors whitespace-nowrap"
                >
                  All
                </Link>
                {orderedDisplayCategories.length > 0 ? (
                  orderedDisplayCategories.map((cat, idx) => (
                    <Link
                      key={cat.id || idx}
                      href={getCategoryHref(cat)}
                      className="shrink-0 text-sm font-semibold text-gray-600 hover:text-brand-primary px-3 py-2 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap capitalize"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 px-2">Loading categories...</span>
                )}
              </div>
              <Link
                href="/special-offers"
                className="shrink-0 flex items-center gap-1.5 text-brand-primary text-sm font-bold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap ml-2"
              >
                <FiGift size={15} />
                Offers
                <span className="bg-brand-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Hot</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Search Modal ─── */}
        {showSearchModal && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-[80]" onClick={closeSearchModal} />

            {/* Modal */}
            <div className="fixed inset-0 z-[85] flex items-start justify-center pt-[var(--header-offset,56px)] md:pt-[calc(var(--header-offset-md,104px)+0.5rem)] px-4 pointer-events-none">
              <div className="w-full max-w-site bg-[#F5F6F8] rounded-2xl shadow-2xl max-h-[min(80vh,calc(100vh-var(--header-offset,54px)-1rem))] md:max-h-[min(80vh,calc(100vh-var(--header-offset-md,104px)-2rem))] flex flex-col overflow-hidden border border-gray-200 pointer-events-auto">

                {/* Mobile: search input inside modal */}
                <div className="md:hidden flex items-center gap-2 px-3 py-3 bg-white border-b border-gray-200 shrink-0">
                  <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2.5 min-w-0">
                    <FiSearch className="shrink-0 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search phones, laptops, gadgets..."
                      autoFocus
                      className="bg-transparent border-none outline-none text-[16px] text-gray-900 placeholder-gray-400 min-w-0 w-full flex-1"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center"
                        aria-label="Clear search"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </form>
                  <button
                    type="button"
                    onClick={closeSearchModal}
                    className="shrink-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                    aria-label="Close search"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="hidden md:flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-gray-200 shrink-0">
                  <p className="text-sm font-bold text-gray-800 truncate pr-4">
                    {searchQuery.trim() ? `Results for “${searchQuery.trim()}”` : 'Search products'}
                  </p>
                  <button type="button" onClick={closeSearchModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0" aria-label="Close search">
                    <FiX size={18} />
                  </button>
                </div>

                {/* Results Area */}
                {isSearching ? (
                    <div className="p-12 flex justify-center items-center">
                    <LoadingSpinner size="md" />
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
                      <div className="flex items-center justify-between px-4 pt-3 pb-2">
                        <h3 className="text-sm font-bold text-gray-800">{filteredSearchResults.length} Results</h3>
                      </div>
                      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveSearchCategory('all')} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeSearchCategory === 'all' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-brand-primary'}`}>All ({searchResults.length})</button>
                        {searchCategories.map(cat => {
                          const count = searchResults.filter(p => p.categoryName === cat).length;
                          return <button key={cat} onClick={() => setActiveSearchCategory(cat)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeSearchCategory === cat ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-brand-primary'}`}>{cat} ({count})</button>;
                        })}
                      </div>
                    </div>

                    {/* Mobile: Product List */}
                    <div className="md:hidden flex-1 overflow-y-auto no-scrollbar">
                      {filteredSearchResults.map(product => (
                        <Link key={product.id} href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`} onClick={closeSearchModal}
                          className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white hover:bg-red-50/40 transition-colors">
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
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSearchCategory === 'all' ? 'bg-brand-primary text-white font-semibold' : 'text-gray-600 hover:bg-red-50 hover:text-brand-primary'}`}>
                                All Results ({searchResults.length})
                              </button>
                            </li>
                            {searchCategories.map(cat => {
                              const count = searchResults.filter(p => p.categoryName === cat).length;
                              return (
                                <li key={cat}>
                                  <button onClick={() => setActiveSearchCategory(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${activeSearchCategory === cat ? 'bg-brand-primary text-white font-semibold' : 'text-gray-600 hover:bg-red-50 hover:text-brand-primary'}`}>
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

      {/* ─── Mobile menu overlay ─── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/55 z-[100] md:hidden backdrop-blur-[2px]"
          onClick={closeSidebar}
          aria-hidden
        />
      )}

      {/* ─── Mobile menu drawer ─── */}
      <aside
        className={`fixed inset-y-0 left-0 w-[min(88vw,320px)] z-[110] flex flex-col md:hidden bg-white border-r-[3px] border-brand-primary shadow-2xl transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isSidebarOpen}
        aria-label="Main menu"
      >
        {/* Header */}
        <div className="shrink-0 bg-[#0a0a0a] px-4 pt-4 pb-3 border-b-2 border-brand-primary">
          <div className="flex items-center justify-between gap-3 mb-3">
            <Link href="/" onClick={closeSidebar} aria-label="Home">
              <AppleFaceTextLogo height={24} variant="onDark" className="h-6 w-auto" />
            </Link>
            <button
              type="button"
              onClick={closeSidebar}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <FiX size={20} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => { closeSidebar(); handleUserClick(); }}
            className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            {user?.image ? (
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0">
                <Image src={user.image} alt="" width={36} height={36} className="w-full h-full object-cover" unoptimized />
              </div>
            ) : user ? (
              <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-sm font-bold text-white shrink-0">
                {(user.first_name || user.name || 'U').charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <FiUser size={18} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user ? (user.first_name || user.name || 'My account') : 'Sign in'}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user ? 'Orders & profile' : 'Login or register'}
              </p>
            </div>
            <FiChevronRight size={16} className="text-gray-500 shrink-0" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Shortcut row */}
          <div className="grid grid-cols-4 gap-px bg-gray-200 border-b border-gray-200">
            {[
              { href: '/', label: 'Home', icon: FiHome },
              { href: '/special-offers', label: 'Offers', icon: FiZap, accent: true },
              { href: '/track-order', label: 'Track', icon: FiTruck },
              { href: '/compare', label: 'Compare', icon: FiShuffle },
            ].map(({ href, label, icon: Icon, accent }) => (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`flex flex-col items-center justify-center gap-1 py-3.5 bg-white active:bg-gray-50 transition-colors ${
                  accent ? 'text-brand-primary' : 'text-gray-700'
                }`}
              >
                <Icon size={18} className={accent ? 'text-brand-primary' : 'text-gray-500'} />
                <span className={`text-[10px] font-bold ${accent ? 'text-brand-primary' : 'text-gray-600'}`}>{label}</span>
              </Link>
            ))}
          </div>

          {/* Categories — matches home ShopCategories look */}
          <div className="bg-[#3d3d3d] px-3 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white tracking-wide">
                Browse <span className="text-brand-primary">Categories</span>
              </h3>
              <Link
                href="/category"
                onClick={closeSidebar}
                className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors"
              >
                View all →
              </Link>
            </div>

            {orderedDisplayCategories.length > 0 ? (
              <div className="grid grid-cols-4 gap-x-1 gap-y-3">
                {orderedDisplayCategories.map((cat, idx) => {
                  const src = getCategoryImage(cat);
                  return (
                    <Link
                      key={cat.category_id ?? cat.id ?? idx}
                      href={getCategoryHref(cat)}
                      onClick={closeSidebar}
                      className="group flex flex-col items-center gap-1.5 text-center"
                    >
                      <div className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-brand-primary transition-all shadow-sm">
                        {src ? (
                          <div className="relative w-[70%] h-[70%]">
                            <Image
                              src={src}
                              alt={cat.name || 'Category'}
                              fill
                              unoptimized
                              className="object-contain group-hover:scale-110 transition-transform duration-200"
                            />
                          </div>
                        ) : (
                          <FiGrid size={18} className="text-gray-300 group-hover:text-brand-primary transition-colors" />
                        )}
                      </div>
                      <span className="text-[8.5px] font-semibold text-gray-300 capitalize line-clamp-2 leading-tight group-hover:text-white transition-colors">
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-xs text-gray-500 py-6">Categories loading…</p>
            )}
          </div>

          {/* Secondary links */}
          <nav className="px-4 py-4" aria-label="Site links">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">More</p>
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden bg-card-bg">
              {[
                { href: '/contact', label: 'Contact & store', icon: FiMapPin },
                { href: '/about', label: 'About Apple Face BD', icon: FiInfo },
                { href: '/blogs', label: 'Blog & news', icon: FiFileText },
                { href: '/wishlist', label: 'Wishlist', icon: FiHeart, badge: hydrated && wishlistCount > 0 ? wishlistCount : null },
              ].map(({ href, label, icon: Icon, badge }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeSidebar}
                    className="flex items-center gap-3 px-3.5 py-3 text-sm font-semibold text-gray-800 hover:bg-white hover:text-brand-primary transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                      <Icon size={16} />
                    </span>
                    <span className="flex-1">{label}</span>
                    {badge ? (
                      <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {badge}
                      </span>
                    ) : (
                      <FiChevronRight size={14} className="text-gray-300" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Footer policies */}
        <div className="shrink-0 px-4 py-3 border-t border-gray-100 bg-card-bg">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] font-semibold text-gray-500">
            <Link href="/warranty" onClick={closeSidebar} className="hover:text-brand-primary transition-colors">Warranty</Link>
            <span className="text-gray-300" aria-hidden>·</span>
            <Link href="/refund" onClick={closeSidebar} className="hover:text-brand-primary transition-colors">Refund</Link>
            <span className="text-gray-300" aria-hidden>·</span>
            <Link href="/terms" onClick={closeSidebar} className="hover:text-brand-primary">Terms</Link>
          </div>
        </div>
      </aside>
    </>
  );
}
