const VARIANTS = {
  light: "bg-white text-gray-900",
  muted: "bg-card-bg text-gray-900",
  dark: "bg-[#0a0a0a] text-white",
};

/** Shared horizontal padding — keep content inside max-w-site on all breakpoints */
export const SITE_GUTTER = "px-4 md:px-6 lg:px-8";

export default function SectionShell({
  children,
  variant = "light",
  className = "",
  border = false,
  id,
  tight = false,
  inset = false,
}) {
  const borderClass = border ? "border-b border-gray-200/80" : "";
  const paddingClass = tight ? "py-8 md:py-12" : "py-10 md:py-16";
  const variantClass = VARIANTS[variant] || VARIANTS.light;

  let inner = children;

  if (inset) {
    const panel = (
      <div className="rounded-xl border border-gray-200/80 bg-white p-4 md:p-6 shadow-sm">
        {children}
      </div>
    );
    inner =
      variant !== "light" ? (
        <div className={`${variantClass} rounded-lg p-3 md:p-4`}>{panel}</div>
      ) : (
        panel
      );
  } else if (variant !== "light") {
    inner = <div className={`${variantClass} rounded-lg`}>{children}</div>;
  }

  return (
    <section id={id} className={`${borderClass} ${className}`}>
      <div className={`max-w-site mx-auto w-full ${SITE_GUTTER} ${paddingClass}`}>
        {inner}
      </div>
    </section>
  );
}
