import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

export default function PageBreadcrumb({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <nav
      className={`flex flex-wrap items-center gap-1.5 text-sm text-gray-500 ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? <FiChevronRight size={14} className="shrink-0 text-gray-400" /> : null}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-brand-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast ? "text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-none" : ""
                }
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
