const VARIANTS = {
  light: "bg-white text-gray-900",
  muted: "bg-[#f7f7f7] text-gray-900",
  dark: "bg-[#0a0a0a] text-white",
};

export default function SectionShell({
  children,
  variant = "light",
  className = "",
  border = false,
}) {
  const borderClass = border ? "border-b border-gray-100" : "";
  return (
    <section className={`${VARIANTS[variant] || VARIANTS.light} py-10 md:py-16 ${borderClass} ${className}`}>
      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8">{children}</div>
    </section>
  );
}
