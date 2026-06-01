export function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value = "") {
  const namedMap = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&lt;": "<",
    "&gt;": ">",
    "&zwnj;": "",
    "&zwj;": "",
  };

  let out = String(value || "");

  out = out.replace(
    /&nbsp;|&amp;|&quot;|&#39;|&lt;|&gt;|&zwnj;|&zwj;/g,
    (m) => namedMap[m] || m
  );

  out = out.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCodePoint(Number(dec))
  );
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );

  return out;
}

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readingTimeFromText(text = "") {
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(2, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export function parseBlogIdFromSlug(slug = "") {
  const decoded = decodeURIComponent(String(slug || "")).trim();
  if (!decoded) return null;
  if (/^\d+$/.test(decoded)) return Number(decoded);

  const parts = decoded.split("-");
  const maybeId = Number(parts[parts.length - 1]);
  return Number.isFinite(maybeId) && maybeId > 0 ? maybeId : null;
}

export function mapApiBlogToPost(blog) {
  if (!blog?.id) return null;

  const title = blog?.title || "Blog Post";
  const contentHtml = String(blog?.description || blog?.content || "").trim();
  const plainText = decodeHtmlEntities(stripHtml(contentHtml))
    .replace(/\bSee\s+less\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const excerpt =
    plainText.length > 180
      ? `${plainText.slice(0, 177)}...`
      : plainText || "Read our latest updates.";

  return {
    id: blog.id,
    slug: `${slugify(title)}-${blog.id}`,
    title,
    excerpt,
    content: contentHtml,
    date: new Date(blog?.created_at || blog?.updated_at || Date.now()).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    category: "Tech News",
    readTime: readingTimeFromText(plainText),
    image: blog?.image || "/no-image.svg",
  };
}

export function mapApiBlogsToPosts(blogs = []) {
  if (!Array.isArray(blogs)) return [];
  return blogs.map(mapApiBlogToPost).filter(Boolean);
}
