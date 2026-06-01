"use client";

export default function VariantOptionChip({
    label,
    selected = false,
    disabled = false,
    onClick,
    swatchHex = null,
    size = "default",
}) {
    const isSmall = size === "small";
    const isWhite =
        swatchHex &&
        (String(swatchHex).toLowerCase() === "#ffffff" ||
            String(swatchHex).toLowerCase() === "#fff");

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center gap-1.5 border-2 font-semibold transition-all duration-200
                ${isSmall ? "px-2 py-1 rounded-lg text-[10px]" : "px-2.5 py-1.5 rounded-xl text-xs"}
                ${
                    disabled
                        ? "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed line-through"
                        : selected
                          ? "border-brand-primary text-brand-primary bg-brand-primary/5 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-brand-primary/40 hover:bg-gray-50"
                }
            `}
        >
            {swatchHex ? (
                <span
                    className={`shrink-0 rounded-full shadow-inner ${isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} ${isWhite ? "border border-gray-300" : ""}`}
                    style={{ backgroundColor: swatchHex }}
                />
            ) : null}
            <span className="truncate max-w-[120px]">{label}</span>
        </button>
    );
}
