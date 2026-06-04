import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import SectionHeader from "./SectionHeader";

export default function SectionIntro({
  variant = "default",
  title = "",
  highlight = "",
  subtitle,
  eyebrow,
  href,
  linkLabel = "See All",
  dark = false,
  className = "",
}) {
  if (variant === "default") {
    return (
      <SectionHeader
        title={title}
        highlight={highlight}
        href={href}
        linkLabel={linkLabel}
        dark={dark}
        className={className}
      />
    );
  }

  if (variant === "compact") {
    const titleColor = dark ? "text-white" : "text-gray-900";
    const subColor = dark ? "text-gray-400" : "text-gray-500";
    const linkColor = dark
      ? "text-gray-300 hover:text-white"
      : "text-brand-primary hover:underline";

    return (
      <div className={`flex items-end justify-between gap-4 mb-5 md:mb-6 ${className}`}>
        <div>
          <h2 className={`text-lg md:text-2xl font-extrabold tracking-tight ${titleColor}`}>
            {title}{" "}
            {highlight ? <span className="text-brand-primary">{highlight}</span> : null}
          </h2>
          {subtitle ? (
            <p className={`text-xs md:text-sm mt-1 ${subColor}`}>{subtitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link href={href} className={`text-sm font-bold shrink-0 ${linkColor}`}>
            {linkLabel}
          </Link>
        ) : null}
      </div>
    );
  }

  if (variant === "badge") {
    const titleColor = dark ? "text-white" : "text-gray-900";
    const subColor = dark ? "text-gray-400" : "text-gray-500";

    return (
      <div className={`mb-8 md:mb-10 ${className}`}>
        {eyebrow ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-3">
            {eyebrow}
          </span>
        ) : null}
        <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${titleColor}`}>
          {title}{" "}
          {highlight ? <span className="text-brand-primary">{highlight}</span> : null}
        </h2>
        {subtitle ? (
          <p className={`text-sm md:text-base mt-2 max-w-2xl ${subColor}`}>{subtitle}</p>
        ) : null}
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-brand-primary hover:underline"
          >
            {linkLabel}
            <FiArrowRight size={16} />
          </Link>
        ) : null}
      </div>
    );
  }

  return null;
}
