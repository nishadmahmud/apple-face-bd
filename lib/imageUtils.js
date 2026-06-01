/**
 * Gallery images in the same order as API `color[]`, using each variant's photo.
 * Keeps color buttons and thumbnails on the same index.
 */
export function buildVariantGalleryImages(colorList, imeis, fallbackImages = []) {
    const colors = Array.isArray(colorList) ? colorList.filter(Boolean) : [];
    const list = Array.isArray(imeis) ? imeis : [];
    const fallback = Array.isArray(fallbackImages) ? fallbackImages.filter(Boolean) : [];

    if (colors.length === 0) {
        return fallback.length > 0 ? fallback : ['/no-image.svg'];
    }

    const ordered = colors.map((color) => {
        const imei =
            list.find((i) => i.color === color && Number(i.in_stock) === 1) ||
            list.find((i) => i.color === color);
        return imei?.image_path || null;
    });

    if (ordered.length === colors.length && ordered.every(Boolean)) {
        return ordered;
    }

    return fallback.length > 0 ? fallback : ['/no-image.svg'];
}

export function normalizeImageKey(url) {
    if (!url) return '';
    const raw = String(url).trim();
    try {
        const parsed = raw.startsWith('http') ? new URL(raw) : null;
        const path = parsed ? parsed.pathname : raw;
        return decodeURIComponent(path.split('/').pop() || path).toLowerCase();
    } catch {
        return decodeURIComponent(raw.split('/').pop() || raw).toLowerCase();
    }
}

export function findImageIndex(imageArray, target) {
    if (!target || !Array.isArray(imageArray) || imageArray.length === 0) return -1;

    const exact = imageArray.findIndex((img) => img === target);
    if (exact >= 0) return exact;

    const targetKey = normalizeImageKey(target);
    if (!targetKey) return -1;

    return imageArray.findIndex((img) => normalizeImageKey(img) === targetKey);
}

export function resolveGalleryImage(imageArray, target) {
    if (!target) return null;
    const idx = findImageIndex(imageArray, target);
    return idx >= 0 ? imageArray[idx] : target;
}

/** Find first IMEI whose variant image matches a gallery thumbnail URL. */
export function findImeiByGalleryImage(imeis, imageUrl) {
    if (!imageUrl || !Array.isArray(imeis) || imeis.length === 0) return null;

    const targetKey = normalizeImageKey(imageUrl);
    if (!targetKey) return null;

    return (
        imeis.find((i) => {
            const candidates = [i?.image_path, i?.image, i?.image_url].filter(Boolean);
            return candidates.some((c) => normalizeImageKey(c) === targetKey);
        }) || null
    );
}

export function hexToRgb(hex) {
    if (!hex) return null;
    const raw = String(hex).replace('#', '').trim();
    if (raw.length === 3) {
        return {
            r: parseInt(raw[0] + raw[0], 16),
            g: parseInt(raw[1] + raw[1], 16),
            b: parseInt(raw[2] + raw[2], 16)
        };
    }
    if (raw.length < 6) return null;
    return {
        r: parseInt(raw.slice(0, 2), 16),
        g: parseInt(raw.slice(2, 4), 16),
        b: parseInt(raw.slice(4, 6), 16)
    };
}

export function colorDistance(rgbA, rgbB) {
    if (!rgbA || !rgbB) return Infinity;
    const dr = rgbA.r - rgbB.r;
    const dg = rgbA.g - rgbB.g;
    const db = rgbA.b - rgbB.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function getUniqueColorVariants(imeis = [], colorList = []) {
    const variants = [];
    const seen = new Set();
    const order =
        Array.isArray(colorList) && colorList.length > 0
            ? colorList
            : [...new Set(imeis.map((i) => i?.color).filter(Boolean))];

    for (const color of order) {
        if (!color || seen.has(color)) continue;
        const imei = imeis.find((i) => i?.color === color);
        if (!imei) continue;
        seen.add(color);
        variants.push({
            color,
            hex: imei.color_code || '#e5e7eb'
        });
    }

    return variants;
}

/** Sample average RGB from a remote image (browser only). */
export function getAverageRgbFromImageUrl(url) {
    if (typeof window === 'undefined' || !url) return Promise.resolve(null);

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const w = Math.min(img.naturalWidth || 64, 96);
                const h = Math.min(img.naturalHeight || 64, 96);
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(null);
                    return;
                }
                ctx.drawImage(img, 0, 0, w, h);
                const { data } = ctx.getImageData(0, 0, w, h);
                let r = 0;
                let g = 0;
                let b = 0;
                let count = 0;
                for (let i = 0; i < data.length; i += 16) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count += 1;
                }
                if (!count) {
                    resolve(null);
                    return;
                }
                resolve({ r: r / count, g: g / count, b: b / count });
            } catch {
                resolve(null);
            }
        };

        img.onerror = () => resolve(null);
        img.src = url;
    });
}

function registerColorForGallery(lookup, galleryUrl, galleryIndex, color) {
    if (!color) return;
    lookup.indexToColor[galleryIndex] = color;
    lookup.colorToGalleryIndex[color] = galleryIndex;
    const key = normalizeImageKey(galleryUrl);
    if (key) lookup.urlToColor.set(key, color);
}

/**
 * Sync lookup: URL matches only (no index guessing on marketing gallery).
 */
export function buildGalleryColorLookup({ galleryImages = [], colorList = [], imeiImages = [], imeis = [] } = {}) {
    const urlToColor = new Map();
    const indexToColor = [];
    const colorToGalleryIndex = {};

    const register = (url, color) => {
        if (!url || !color) return;
        const key = normalizeImageKey(url);
        if (key) urlToColor.set(key, color);
    };

    const colorsFromApi = Array.isArray(colorList) ? colorList.filter(Boolean) : [];
    const colorsFromImeis = [...new Set(imeis.map((i) => i?.color).filter(Boolean))];
    const colors = colorsFromApi.length > 0 ? colorsFromApi : colorsFromImeis;

    const gallery = Array.isArray(galleryImages) ? galleryImages.filter(Boolean) : [];
    const imeiImgs = Array.isArray(imeiImages) ? imeiImages.filter(Boolean) : [];

    gallery.forEach((img, gi) => {
        const fromImeiImage = findImageIndex(imeiImgs, img);
        if (fromImeiImage >= 0 && colors[fromImeiImage]) {
            registerColorForGallery({ urlToColor, indexToColor, colorToGalleryIndex }, img, gi, colors[fromImeiImage]);
            return;
        }

        const imei = findImeiByGalleryImage(imeis, img);
        if (imei?.color) {
            registerColorForGallery({ urlToColor, indexToColor, colorToGalleryIndex }, img, gi, imei.color);
        }
    });

    imeiImgs.forEach((img, idx) => {
        if (colors[idx]) register(img, colors[idx]);
    });

    for (const imei of imeis) {
        if (!imei?.color) continue;
        register(imei.image_path, imei.color);
        register(imei.image, imei.color);
        register(imei.image_url, imei.color);
        register(resolveGalleryImage(gallery, imei.image_path), imei.color);
    }

    return { urlToColor, indexToColor, colorToGalleryIndex, colors, imeis };
}

/**
 * Build gallery index ↔ color map when marketing `images[]` order differs from `color[]`.
 * Uses URL matches first, then color-code sampling from photos.
 */
export async function buildGalleryColorLookupAsync({
    galleryImages = [],
    colorList = [],
    imeiImages = [],
    imeis = []
} = {}) {
    const lookup = buildGalleryColorLookup({ galleryImages, colorList, imeiImages, imeis });
    const gallery = Array.isArray(galleryImages) ? galleryImages.filter(Boolean) : [];
    const imeiImgs = Array.isArray(imeiImages) ? imeiImages.filter(Boolean) : [];
    const colorVariants = getUniqueColorVariants(imeis, colorList);

    if (gallery.length === 0 || colorVariants.length === 0) return lookup;

    const unmapped = gallery
        .map((_, gi) => gi)
        .filter((gi) => !lookup.indexToColor[gi]);

    if (unmapped.length === 0 || typeof window === 'undefined') return lookup;

    const gallerySamples = await Promise.all(gallery.map((url) => getAverageRgbFromImageUrl(url)));

    const colors = lookup.colors.length ? lookup.colors : colorVariants.map((v) => v.color);
    const refUrls = colors.map((color, ci) => {
        if (imeiImgs[ci]) return imeiImgs[ci];
        const imei = imeis.find((i) => i?.color === color);
        return imei?.image_path || null;
    });

    const refSamples = await Promise.all(refUrls.map((url) => getAverageRgbFromImageUrl(url)));

    const usedColors = new Set(Object.keys(lookup.colorToGalleryIndex));

    for (const gi of unmapped) {
        const galleryRgb = gallerySamples[gi];
        if (!galleryRgb) continue;

        let bestColor = null;
        let bestDist = Infinity;

        colors.forEach((color, ci) => {
            if (usedColors.has(color)) return;

            const refRgb = refSamples[ci] || hexToRgb(colorVariants.find((v) => v.color === color)?.hex);
            if (!refRgb) return;

            const dist = colorDistance(galleryRgb, refRgb);
            if (dist < bestDist) {
                bestDist = dist;
                bestColor = color;
            }
        });

        if (bestColor) {
            registerColorForGallery(lookup, gallery[gi], gi, bestColor);
            usedColors.add(bestColor);
        }
    }

    return lookup;
}

export function resolveColorFromGallerySelection(lookup, imageUrl, imageIndex) {
    if (!lookup) return null;

    const { urlToColor, indexToColor, imeis = [] } = lookup;

    if (imageUrl) {
        const byUrl = urlToColor.get(normalizeImageKey(imageUrl));
        if (byUrl) return byUrl;

        const imei = findImeiByGalleryImage(imeis, imageUrl);
        if (imei?.color) return imei.color;
    }

    if (typeof imageIndex === 'number' && imageIndex >= 0 && indexToColor[imageIndex]) {
        return indexToColor[imageIndex];
    }

    return null;
}

/** Gallery image for a selected color using learned index map (never assumes color[] order === images[]). */
export function resolveGalleryImageForColor(galleryImages, selectedColor, lookup = null) {
    if (!selectedColor || !Array.isArray(galleryImages) || galleryImages.length === 0) return null;

    const idx = lookup?.colorToGalleryIndex?.[selectedColor];
    if (typeof idx === 'number' && idx >= 0) {
        return galleryImages[idx] || null;
    }

    return null;
}

export function getGalleryIndexForColor(selectedColor, lookup = null) {
    if (!selectedColor || !lookup?.colorToGalleryIndex) return null;
    const idx = lookup.colorToGalleryIndex[selectedColor];
    return typeof idx === 'number' && idx >= 0 ? idx : null;
}
