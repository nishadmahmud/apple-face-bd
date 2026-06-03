"use client";

import AppleFaceTextLogo from "../Brand/AppleFaceTextLogo";

const SIZE_MAP = {
  xs: "af-loader--xs",
  sm: "af-loader--sm",
  md: "af-loader--md",
  lg: "af-loader--lg",
};

/**
 * Apple Face BD loader — simple ring (brand red accent).
 * Use showBrand on full-page loads only; inline/button uses ring only.
 */
export default function LoadingSpinner({
  size = "md",
  label,
  showBrand = false,
  variant = "default",
  inline = false,
  className = "",
}) {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const variantClass = variant === "light" ? "af-loader--light" : "";

  if (inline) {
    return (
      <div
        className={`af-loader ${sizeClass} ${variantClass} ${className}`}
        role="status"
        aria-label={label || "Loading"}
        aria-live="polite"
        aria-busy="true"
      />
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label || "Loading"}
    >
      {showBrand && (
        <AppleFaceTextLogo
          height={26}
          variant="onLight"
          className="h-6 w-auto opacity-90"
        />
      )}
      <div className={`af-loader ${sizeClass} ${variantClass}`} aria-hidden />
      {label ? (
        <p
          className={`text-center text-sm font-medium tracking-wide ${
            variant === "light" ? "text-white/90" : "text-gray-500"
          }`}
        >
          {label}
        </p>
      ) : null}
    </div>
  );
}
