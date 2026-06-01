import Link from "next/link";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 md:py-20 bg-white rounded-lg border border-gray-200 text-center px-6 ${className}`}
    >
      {Icon ? (
        <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mb-5 border border-brand-primary/15">
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-brand-primary/40" />
        </div>
      ) : null}
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">{title}</h2>
      {description ? (
        <p className="text-gray-500 text-sm md:text-base max-w-sm mb-6">{description}</p>
      ) : null}
      {actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </Link>
      ) : onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
