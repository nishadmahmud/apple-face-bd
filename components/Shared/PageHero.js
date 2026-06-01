export default function PageHero({
  eyebrow,
  title,
  highlight = "",
  description,
  meta,
  dark = true,
  align = "center",
  className = "",
}) {
  const alignClass =
    align === "left"
      ? "text-left items-start"
      : "text-center items-center";

  return (
    <div
      className={`${dark ? "bg-[#0a0a0a] text-white" : "bg-card-bg text-gray-900 border-b border-gray-200"} ${className}`}
    >
      <div
        className={`max-w-site mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 flex flex-col ${alignClass}`}
      >
        {eyebrow ? (
          <span className="inline-block px-4 py-1.5 bg-brand-primary/15 text-brand-primary text-xs font-bold rounded-full mb-4 border border-brand-primary/25 uppercase tracking-wider">
            {eyebrow}
          </span>
        ) : null}
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight ${dark ? "text-white" : "text-gray-900"}`}
        >
          {title}{" "}
          {highlight ? <span className="text-brand-primary">{highlight}</span> : null}
        </h1>
        {description ? (
          <p
            className={`text-sm md:text-base max-w-2xl leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"} ${align === "center" ? "mx-auto" : ""}`}
          >
            {description}
          </p>
        ) : null}
        {meta ? (
          <p className={`text-sm mt-2 ${dark ? "text-gray-500" : "text-gray-500"}`}>{meta}</p>
        ) : null}
      </div>
    </div>
  );
}
