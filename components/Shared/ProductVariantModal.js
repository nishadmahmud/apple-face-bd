"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import VariantOptionChip from "./VariantOptionChip";

export default function ProductVariantModal({
    open,
    onClose,
    product,
    modalDisplayImage,
    selectedVariantPrice,
    allColors = [],
    variantSource = [],
    effectiveColor,
    effectiveStorage,
    effectiveRegion,
    onSelectColor,
    onSelectStorage,
    onSelectRegion,
    matchedImei,
    isResolvingVariants = false,
    onConfirmCart,
    onConfirmBuy,
}) {
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
            clearTimeout(timer);
        };
    }, [open, onClose]);

    const allStoragesForColor = useMemo(() => {
        const colorMatched = variantSource.filter(
            (i) => !effectiveColor || i.color === effectiveColor
        );
        return [...new Set(colorMatched.map((i) => i.storage).filter(Boolean))];
    }, [variantSource, effectiveColor]);

    const allRegionsForSelection = useMemo(() => {
        const matched = variantSource.filter((i) => {
            let valid = true;
            if (effectiveColor && i.color) valid = valid && i.color === effectiveColor;
            if (effectiveStorage && i.storage) valid = valid && i.storage === effectiveStorage;
            return valid;
        });
        return [...new Set(matched.map((i) => i.region).filter(Boolean))];
    }, [variantSource, effectiveColor, effectiveStorage]);

    const isStorageAvailable = (size) =>
        variantSource.some(
            (i) =>
                (!effectiveColor || i.color === effectiveColor) &&
                i.storage === size &&
                Number(i.in_stock) === 1
        );

    const isRegionAvailable = (region) =>
        variantSource.some((i) => {
            let valid =
                (!effectiveColor || i.color === effectiveColor) &&
                (!effectiveStorage || i.storage === effectiveStorage) &&
                i.region === region &&
                Number(i.in_stock) === 1;
            return valid;
        });

    const selectionLabel = [matchedImei?.storage, matchedImei?.color, matchedImei?.region]
        .filter(Boolean)
        .join(" · ");

    const canConfirm = matchedImei && Number(matchedImei?.in_stock) === 1;

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="variant-modal-title"
        >
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Black header */}
                <div className="bg-[#0a0a0a] px-4 py-3 flex items-start gap-3 shrink-0">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-white shrink-0">
                        {isResolvingVariants ? (
                            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                        ) : (
                            <Image
                                src={modalDisplayImage}
                                alt={product?.name || "Product"}
                                fill
                                unoptimized
                                className="object-contain p-1"
                            />
                        )}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                        <h3
                            id="variant-modal-title"
                            className="text-sm font-bold text-white line-clamp-2 leading-snug"
                        >
                            {product?.name}
                        </h3>
                        {isResolvingVariants ? (
                            <div className="mt-2 h-4 w-24 bg-white/20 rounded animate-pulse" />
                        ) : (
                            <p className="text-base font-extrabold text-brand-primary mt-1">
                                Tk {selectedVariantPrice.toLocaleString("en-IN")}
                            </p>
                        )}
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                        aria-label="Close"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                    {isResolvingVariants && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-4 h-4 rounded-full border-2 border-brand-primary/30 border-t-brand-primary animate-spin" />
                            Loading variants...
                        </div>
                    )}

                    {allColors.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-900 mb-2">
                                Color
                                {effectiveColor ? (
                                    <span className="font-medium text-brand-primary ml-1">
                                        · {effectiveColor}
                                    </span>
                                ) : null}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {allColors.map((color) => {
                                    const colorAvailable = variantSource.some(
                                        (i) =>
                                            i.color === color.name && Number(i.in_stock) === 1
                                    );
                                    return (
                                        <VariantOptionChip
                                            key={color.name}
                                            label={color.name}
                                            swatchHex={color.hex}
                                            selected={effectiveColor === color.name}
                                            disabled={!colorAvailable}
                                            onClick={() =>
                                                colorAvailable && onSelectColor(color.name)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {allStoragesForColor.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-900 mb-2">
                                Storage
                                {effectiveStorage ? (
                                    <span className="font-medium text-brand-primary ml-1">
                                        · {effectiveStorage}
                                    </span>
                                ) : null}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {allStoragesForColor.map((size) => (
                                    <VariantOptionChip
                                        key={size}
                                        label={size}
                                        selected={effectiveStorage === size}
                                        disabled={!isStorageAvailable(size)}
                                        onClick={() =>
                                            isStorageAvailable(size) && onSelectStorage(size)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {allRegionsForSelection.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-900 mb-2">
                                Region
                                {effectiveRegion ? (
                                    <span className="font-medium text-brand-primary ml-1">
                                        · {effectiveRegion}
                                    </span>
                                ) : null}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {allRegionsForSelection.map((region) => (
                                    <VariantOptionChip
                                        key={region}
                                        label={region}
                                        selected={effectiveRegion === region}
                                        disabled={!isRegionAvailable(region)}
                                        onClick={() =>
                                            isRegionAvailable(region) && onSelectRegion(region)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {selectionLabel ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs">
                            <span className="text-gray-500 font-medium">Selected: </span>
                            <span className="text-gray-900 font-bold">{selectionLabel}</span>
                        </div>
                    ) : null}
                </div>

                {/* Sticky footer */}
                <div className="shrink-0 border-t border-gray-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white flex flex-col sm:flex-row gap-2">
                    <button
                        type="button"
                        disabled={!canConfirm || isResolvingVariants}
                        onClick={onConfirmCart}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                            !canConfirm || isResolvingVariants
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-brand-primary text-white hover:opacity-90"
                        }`}
                    >
                        Add to Cart
                    </button>
                    <button
                        type="button"
                        disabled={!canConfirm || isResolvingVariants}
                        onClick={onConfirmBuy}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-colors ${
                            !canConfirm || isResolvingVariants
                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                : "border-[#0a0a0a] bg-[#0a0a0a] text-white hover:bg-brand-primary hover:border-brand-primary"
                        }`}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
