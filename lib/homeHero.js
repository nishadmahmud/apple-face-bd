/**
 * Normalize home hero API responses into view models.
 */

function safeLink(url) {
  if (!url || typeof url !== "string") return "/";
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return "/";
}

function sortByOrder(items) {
  return [...items].sort((a, b) => {
    const orderA = Number(a.display_order ?? a.sort_order ?? a.order ?? a.id ?? 0);
    const orderB = Number(b.display_order ?? b.sort_order ?? b.order ?? b.id ?? 0);
    return orderA - orderB;
  });
}

/**
 * @param {Object|null} slidersRes - API response from getSlidersFromServer
 * @returns {Array<{ id: string|number, title: string, image: string, link: string }>}
 */
export function normalizeHeroSlides(slidersRes) {
  if (!slidersRes?.success) return [];

  const raw = slidersRes.sliders ?? slidersRes.data?.sliders ?? slidersRes.data;
  if (!Array.isArray(raw) || raw.length === 0) return [];

  return sortByOrder(raw).map((s, idx) => ({
    id: s.id ?? idx,
    title: s.title || "",
    image: s.image_path || s.image_url || s.image || "/no-image.svg",
    link: safeLink(s.link || s.button_url || "/category"),
  }));
}

/**
 * @param {Object|null} bannersRes - API response from getBannerFromServer
 * @param {number} limit - Max banners to return
 * @returns {Array<{ id: string|number, title: string, image: string, link: string }>}
 */
export function normalizeHeroBanners(bannersRes, limit = 3) {
  if (!bannersRes?.success) return [];

  const raw = bannersRes.banners ?? bannersRes.data?.banners ?? bannersRes.data;
  if (!Array.isArray(raw)) return [];

  const imageBanners = raw.filter((b) => !b.type || b.type === "image");

  return sortByOrder(imageBanners)
    .slice(0, limit)
    .map((b, idx) => ({
      id: b.id ?? idx,
      title: b.title || "",
      image: b.image_path || b.image_url || b.image || "/no-image.svg",
      link: safeLink(b.button_url || b.link || "/"),
    }));
}

/**
 * All image-type promo banners (for slicing elsewhere on the home page).
 */
export function normalizeHomeBanners(bannersRes) {
  if (!bannersRes?.success) return [];

  const raw = bannersRes.banners ?? bannersRes.data?.banners ?? bannersRes.data;
  if (!Array.isArray(raw)) return [];

  return sortByOrder(raw.filter((b) => !b.type || b.type === "image")).map((b, idx) => ({
    id: b.id ?? idx,
    title: b.title || "",
    image: b.image_path || b.image_url || b.image || "/no-image.svg",
    link: safeLink(b.button_url || b.link || "/"),
  }));
}

/**
 * Wide-image banners for mid-page promos.
 */
export function normalizeWideBanners(bannersRes) {
  if (!bannersRes?.success) return [];

  const raw = bannersRes.banners ?? bannersRes.data?.banners ?? bannersRes.data;
  if (!Array.isArray(raw)) return [];

  return sortByOrder(raw.filter((b) => b.type === "wide-image")).map((b, idx) => ({
    id: b.id ?? idx,
    title: b.title || "",
    image: b.image_path || b.image_url || b.image || "/no-image.svg",
    link: safeLink(b.button_url || b.link || "/"),
  }));
}
