const VARIANTS = {
  light: "bg-white text-gray-900",
  muted: "bg-card-bg text-gray-900",
  dark: "bg-[#0a0a0a] text-white",
};

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

  const inner = inset ? (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 md:p-6 shadow-sm">
      {children}
    </div>
  ) : (
    children
  );

  return (
    <section
      id={id}
      className={`${variantClass} ${paddingClass} ${borderClass} ${className}`}
    >
      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8">{inner}</div>
    </section>
  );
}
