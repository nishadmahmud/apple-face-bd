"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { searchProducts, getProductById } from '../../lib/api';
import { useCompare } from '../../context/CompareContext';
import { FiSearch, FiTrash2, FiX } from 'react-icons/fi';

const MAX_SLOTS = 3;
const EMPTY_SLOT = { id: null, name: '', image: '/no-image.svg', brand: '', price: null, displayPrice: '', oldPrice: null, specs: [] };

function normalizeSpecMap(specs = []) {
  const map = new Map();
  specs.forEach((s) => {
    const key = String(s?.name || '').trim();
    if (!key) return;
    map.set(key, s?.description || s?.value || '-');
  });
  return map;
}

export default function ComparePage() {
  const { compareItems, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const [slotQueries, setSlotQueries] = useState(['', '', '']);
  const [activeSlot, setActiveSlot] = useState(0);
  const [searchingSlot, setSearchingSlot] = useState(null);
  const [slotResults, setSlotResults] = useState([[], [], []]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');

  const filledSlots = useMemo(() => compareItems.slice(0, MAX_SLOTS), [compareItems]);
  const slots = useMemo(() => {
    const slotItems = [...filledSlots];
    while (slotItems.length < MAX_SLOTS) slotItems.push(EMPTY_SLOT);
    return slotItems;
  }, [filledSlots]);

  const allSpecNames = useMemo(() => {
    const names = new Set();
    filledSlots.forEach((item) => (item.specs || []).forEach((s) => names.add(s?.name)));
    return Array.from(names);
  }, [filledSlots]);

  const runSearch = async (slotIndex, e, rawQuery) => {
    e?.preventDefault();
    const q = String(rawQuery ?? slotQueries[slotIndex] ?? '').trim();
    if (!q) {
      setSlotResults((prev) => {
        const next = [...prev];
        next[slotIndex] = [];
        return next;
      });
      return;
    }

    setActiveSlot(slotIndex);
    setSearchingSlot(slotIndex);
    setError('');

    try {
      const res = await searchProducts(q);
      const payload = res?.data || res;
      const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      const mapped = items.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand_name || p.brands?.name || '',
        image: p.image_path || p.image_path1 || p.image_path2 || '/no-image.svg',
        price: Number(p.retails_price || 0),
      }));
      setSlotResults((prev) => {
        const next = [...prev];
        next[slotIndex] = mapped.slice(0, 8);
        return next;
      });
    } catch {
      setError('Failed to search products.');
      setSlotResults((prev) => {
        const next = [...prev];
        next[slotIndex] = [];
        return next;
      });
    } finally {
      setSearchingSlot(null);
    }
  };

  useEffect(() => {
    const query = String(slotQueries[activeSlot] || '').trim();
    if (!query) return;
    const timer = setTimeout(() => {
      runSearch(activeSlot, undefined, query);
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotQueries, activeSlot]);

  const addProductToCompare = async (productId) => {
    if (filledSlots.length >= MAX_SLOTS) {
      setError(`You can compare up to ${MAX_SLOTS} products.`);
      return;
    }
    setError('');
    setLoadingId(productId);
    try {
      const res = await getProductById(productId);
      const p = res?.data || res;
      if (!p?.id) return;

      const mapped = {
        id: p.id,
        name: p.name,
        brand: p.brand_name || p.brands?.name || p.brand?.name || '',
        image: (Array.isArray(p.images) && p.images[0]) || p.image_path || '/no-image.svg',
        price: Number(p.retails_price || 0),
        displayPrice: `Tk ${Number(p.retails_price || 0).toLocaleString('en-IN')}`,
        oldPrice: Number(p.discount || 0) > 0 ? `Tk ${Number(p.retails_price || 0).toLocaleString('en-IN')}` : null,
        specs: Array.isArray(p.specifications) ? p.specifications : [],
      };
      addToCompare(mapped);
      setSlotResults((prev) => {
        const next = [...prev];
        next[activeSlot] = [];
        return next;
      });
    } catch {
      setError('Failed to load product details for comparison.');
    } finally {
      setLoadingId(null);
    }
  };
  const specMaps = useMemo(
    () => filledSlots.map((item) => normalizeSpecMap(item.specs)),
    [filledSlots]
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-8 md:pt-6 md:pb-12">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-5 md:mb-7">Compare Selected Product</h1>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="p-4 md:p-5 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Compare Products</h2>
            <p className="text-gray-600 text-lg leading-snug">Find and select products to see the differences and similarities between them</p>
            <button
              type="button"
              onClick={clearCompare}
              className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50"
            >
              <FiTrash2 size={14} />
              Clear Compare
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3">
            {slots.map((slot, idx) => (
            <div key={`${slot.id || 'empty'}-${idx}`} className={`p-3 md:p-4 border-r border-b md:border-b-0 last:border-r-0 border-gray-200 ${idx === 2 ? 'hidden md:block' : ''}`}>
              <form onSubmit={(e) => runSearch(idx, e)} className="relative mb-3">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  value={slotQueries[idx]}
                  onChange={(e) => {
                    const next = [...slotQueries];
                    next[idx] = e.target.value;
                    setSlotQueries(next);
                  }}
                  onFocus={() => setActiveSlot(idx)}
                  placeholder="Search..."
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                />
              </form>
              {searchingSlot === idx && (
                <div className="mb-3 border border-gray-100 rounded-xl px-3 py-3 text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-brand-primary animate-spin" />
                  Searching products...
                </div>
              )}
              {slotResults[idx].length > 0 && (
                <div className="mb-3 border border-gray-100 rounded-xl bg-white max-h-52 overflow-y-auto no-scrollbar">
                  {slotResults[idx].map((r) => (
                    <button
                      key={`${idx}-${r.id}`}
                      type="button"
                      onClick={() => addProductToCompare(r.id)}
                      className="w-full text-left px-3 py-2.5 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-[13px] font-semibold text-gray-800 leading-tight break-words line-clamp-2">{r.name}</p>
                        <p className="text-[12px] text-gray-500 leading-tight break-words line-clamp-1">{r.brand || 'Brand N/A'}</p>
                      </div>
                      <span className="text-[11px] font-bold text-brand-primary shrink-0">Add</span>
                    </button>
                  ))}
                </div>
              )}
              {slot.id ? (
                <div className="border border-gray-100 rounded-xl p-3 bg-white">
                  <div className="relative h-28 bg-gray-50 rounded-lg overflow-hidden mb-2">
                    <Image src={slot.image} alt={slot.name} fill className="object-contain" unoptimized />
                  </div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">{slot.brand || 'Brand'}</p>
                  <p className="text-sm font-bold text-gray-900 line-clamp-2">{slot.name}</p>
                  <p className="text-sm font-extrabold text-brand-primary mt-1">{slot.displayPrice || `Tk ${Number(slot.price || 0).toLocaleString('en-IN')}`}</p>
                  <button
                    onClick={() => removeFromCompare(slot.id)}
                    type="button"
                    className="mt-2 text-xs font-bold text-red-600 hover:underline inline-flex items-center gap-1"
                  >
                    <FiX size={12} />
                    Remove
                  </button>
                </div>
              ) : (
                <div className="h-[188px] border border-dashed border-gray-200 rounded-xl text-sm text-gray-400 flex items-center justify-center">
                  Select product
                </div>
              )}
            </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {filledSlots.length >= 1 && (
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div
                  className="grid bg-gray-50 text-sm font-bold text-gray-800"
                  style={{ gridTemplateColumns: `minmax(180px,1.1fr) repeat(${filledSlots.length}, minmax(220px,1fr))` }}
                >
                  <div className="p-3 md:p-4 border-r border-gray-100">Attribute</div>
                  {filledSlots.map((item, idx) => (
                    <div key={`head-${item.id}-${idx}`} className="p-3 md:p-4 border-r last:border-r-0 border-gray-100">{item.name}</div>
                  ))}
                </div>

                {['Name', 'Brand', 'Price'].map((row) => (
                  <div
                    key={row}
                    className="grid text-sm border-t border-gray-100"
                    style={{ gridTemplateColumns: `minmax(180px,1.1fr) repeat(${filledSlots.length}, minmax(220px,1fr))` }}
                  >
                    <div className="p-3 md:p-4 font-semibold text-gray-700 border-r border-gray-100">{row}</div>
                    {filledSlots.map((item, idx) => (
                      <div key={`${row}-${item.id}-${idx}`} className="p-3 md:p-4 text-gray-600 border-r last:border-r-0 border-gray-100">
                        {row === 'Name' ? item.name : row === 'Brand' ? (item.brand || '-') : (item.displayPrice || `Tk ${Number(item.price || 0).toLocaleString('en-IN')}`)}
                      </div>
                    ))}
                  </div>
                ))}

                {allSpecNames.map((name) => (
                  <div
                    key={name}
                    className="grid text-sm border-t border-gray-100"
                    style={{ gridTemplateColumns: `minmax(180px,1.1fr) repeat(${filledSlots.length}, minmax(220px,1fr))` }}
                  >
                    <div className="p-3 md:p-4 font-semibold text-gray-700 border-r border-gray-100">{name}</div>
                    {filledSlots.map((item, idx) => (
                      <div key={`${name}-${item.id}-${idx}`} className="p-3 md:p-4 text-gray-600 border-r last:border-r-0 border-gray-100">
                        {specMaps[idx]?.get(name) || '-'}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
