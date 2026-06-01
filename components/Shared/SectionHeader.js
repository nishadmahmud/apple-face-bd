import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function SectionHeader({
  title = "",
  highlight = "",
  href,
  linkLabel = "See All",
  className = "",
  dark = false,
}) {
  const titleColor = dark ? "text-white" : "text-gray-900";
  const highlightColor = "text-brand-primary";
  const linkColor = dark
    ? "text-gray-300 hover:text-white"
    : "text-gray-600 hover:text-brand-primary";

  return (
    <div className={`flex items-end justify-between gap-4 mb-6 md:mb-8 ${className}`}>
      <div>
        <h2 className={`text-xl md:text-[28px] font-extrabold tracking-tight ${titleColor}`}>
          {title}{" "}
          {highlight ? <span className={highlightColor}>{highlight}</span> : null}
        </h2>
        <div className="h-1 w-14 md:w-20 bg-brand-primary mt-2 rounded-full" />
      </div>
      {href ? (
        <Link
          href={href}
          className={`flex items-center gap-2 text-sm font-bold transition-colors group shrink-0 ${linkColor}`}
        >
          <span className="hidden sm:inline">{linkLabel}</span>
          <span className="w-8 h-8 rounded-full border-2 border-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
            <FiArrowRight className="w-4 h-4 text-brand-primary group-hover:text-white" />
          </span>
        </Link>
      ) : null}
    </div>
  );
}
