import Link from "next/link";
import Image from "next/image";
import { SITE_GUTTER } from "../Shared/SectionShell";

export default function WidePromoBanner({ banner, variant = "light" }) {
  if (!banner) return null;

  const bgClass = variant === "muted" ? "bg-card-bg" : "bg-white";

  return (
    <section className={`py-4 md:py-8 ${bgClass}`}>
      <div className={`max-w-site mx-auto w-full ${SITE_GUTTER}`}>
        <Link
          href={banner.link || "#"}
          className="block w-full relative aspect-[2/1] md:aspect-[21/9] lg:aspect-[4/1] rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
        >
          <Image
            src={banner.image}
            alt={banner.title || "Promotional Banner"}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            unoptimized
          />
        </Link>
      </div>
    </section>
  );
}
