/** Build /category/[slug] href from API category object */
export function getCategoryHref(cat) {
  if (!cat) return '/category';

  if (cat.slug) {
    return `/category/${cat.slug}`;
  }

  const id = cat.category_id ?? cat.id;
  if (id != null && String(id) !== '') {
    return `/category/${id}`;
  }

  if (typeof cat.name === 'string' && cat.name.trim()) {
    return `/category/${String(cat.name).toLowerCase().replace(/\s+/g, '-')}`;
  }

  return '/category';
}
