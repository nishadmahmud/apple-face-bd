/** Region / SIM group config for Phones & Used Phones category filters */

export const ANDROID_REGION_OPTIONS = [
    'China',
    'China Global',
    'Global/Int',
    'India',
];

export const APPLE_REGION_OPTIONS = [
    'USA',
    'Canada',
    'Japan',
    'Hong Kong',
    'Singapore',
    'Australia',
    'India',
    'China',
];

export const SIM_NETWORK_OPTIONS = [
    'Single Sim',
    'Single E-Sim',
    'Dual Sim',
    'Dual E-Sim',
    'Sim + E-Sim',
];

const REGION_ALIASES = {
    'china global': ['china global', 'china (global)', 'cn global'],
    'global/int': ['global/int', 'global', 'international', 'global int', 'global (int)'],
    'hong kong': ['hong kong', 'hk', 'hongkong'],
    'usa': ['usa', 'us', 'united states', 'u.s.a', 'u.s.'],
    'single sim': ['single sim', 'single-sim', '1 sim', 'single nano sim'],
    'single e-sim': ['single e-sim', 'single esim', 'single e sim', 'e-sim', 'esim'],
    'dual sim': ['dual sim', 'dual-sim', '2 sim', 'double sim'],
    'dual e-sim': ['dual e-sim', 'dual esim', 'dual e sim'],
    'sim + e-sim': ['sim + e-sim', 'sim+e-sim', 'sim and e-sim', 'sim + esim', 'hybrid sim'],
};

const APPLE_BRAND_RE = /apple/i;

export function normalizeFilterKey(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[/_-]+/g, ' ');
}

function matchesCanonical(canonical, raw) {
    const key = normalizeFilterKey(canonical);
    const rawKey = normalizeFilterKey(raw);
    if (!rawKey) return false;
    if (rawKey === key) return true;
    const aliases = REGION_ALIASES[key] || [];
    return aliases.some((a) => rawKey === a || rawKey.includes(a) || a.includes(rawKey));
}

export function isPhoneCategory(categoryName = '', slug = '') {
    const hay = `${slug} ${categoryName}`.toLowerCase();
    if (/used[- ]?phones?/.test(hay)) return true;
    if (/\bphones?\b/.test(hay) && !/headphone|earphone|microphone/.test(hay)) return true;
    if (/\bmobiles?\b/.test(hay)) return true;
    return false;
}

export function isAppleBrand(brand = '') {
    return APPLE_BRAND_RE.test(String(brand || '').trim());
}

export function isAndroidBrand(brand = '') {
    const b = String(brand || '').trim();
    if (!b || b === 'All') return false;
    if (isAppleBrand(b)) return false;
    return true;
}

const SIM_IMEI_FIELDS = ['sim', 'sim_type', 'network', 'network_type', 'sim_network'];

export function isSimLabel(value) {
    return SIM_NETWORK_OPTIONS.some((opt) => matchesCanonical(opt, value));
}

/** Detect SIM / eSIM / hybrid labels stored in region or sim fields (e.g. "E-Sim JP", "SIM + eSim AUS") */
export function looksLikeSimOrNetwork(value) {
    if (isSimLabel(value)) return true;
    const raw = String(value || '').trim();
    if (!raw) return false;

    if (/\b(e[\s-]?sim|esim)\b/i.test(raw)) return true;
    if (/\bsim\b/i.test(raw)) return true;
    if (/sim\s*\+|\+\s*e?\s*sim/i.test(raw)) return true;
    if (/\bnetwork\b/i.test(raw)) return true;

    return false;
}

export function makeRegionFilterKey(groupId, regionValue) {
    return `${groupId}::${regionValue}`;
}

/** @returns {{ groupId: string, regionValue: string }} */
export function parseRegionFilterKey(filterKey) {
    const str = String(filterKey || '');
    const idx = str.indexOf('::');
    if (idx === -1) {
        return { groupId: 'other', regionValue: str };
    }
    return {
        groupId: str.slice(0, idx),
        regionValue: str.slice(idx + 2),
    };
}

export function extractImeiFilterValues(imei = {}) {
    const values = new Set();
    if (imei.region) values.add(String(imei.region).trim());

    SIM_IMEI_FIELDS.forEach((field) => {
        if (imei[field]) values.add(String(imei[field]).trim());
    });

    return [...values].filter(Boolean);
}

function collectRawValuesFromProducts(products, { regionsOnly = false, simsOnly = false } = {}) {
    const regions = new Set();
    const sims = new Set();

    products.forEach((p) => {
        (p.rawImeis || []).forEach((imei) => {
            extractImeiFilterValues(imei).forEach((v) => {
                if (looksLikeSimOrNetwork(v)) {
                    sims.add(v);
                } else {
                    regions.add(v);
                }
            });
        });
    });

    if (regionsOnly) return [...regions];
    if (simsOnly) return [...sims];
    return { regions: [...regions], sims: [...sims] };
}

function resolveAvailableInGroup(groupId, canonicalOptions, availableRawValues) {
    const resolved = [];
    canonicalOptions.forEach((label) => {
        const hit = availableRawValues.find((raw) => matchesCanonical(label, raw));
        if (hit) {
            resolved.push({
                label,
                value: hit,
                filterKey: makeRegionFilterKey(groupId, hit),
            });
        }
    });
    return resolved;
}

/**
 * Does this product + imei row match one selected grouped region key?
 */
export function imeiMatchesRegionFilter(product, imei, filterKey) {
    const { groupId, regionValue } = parseRegionFilterKey(filterKey);
    const brand = product?.brand || '';
    const imeiValues = extractImeiFilterValues(imei);

    const valueMatch = imeiValues.some(
        (v) => v === regionValue || matchesCanonical(regionValue, v)
    );
    if (!valueMatch) return false;

    if (groupId === 'android') return isAndroidBrand(brand);
    if (groupId === 'apple') return isAppleBrand(brand);
    if (groupId === 'sim') return true;
    if (groupId === 'other') return true;
    return true;
}

/**
 * Build grouped region dropdown — Android/Apple lists only show regions
 * that exist on products of that platform (not shared "India" on both sides).
 */
export function buildPhoneRegionFilterGroups({
    categoryName = '',
    slug = '',
    products = [],
    selectedBrand = 'All',
}) {
    if (!isPhoneCategory(categoryName, slug)) {
        return { enabled: false, groups: [] };
    }

    const brand = selectedBrand === 'All' ? '' : selectedBrand;
    const showAndroid = !brand || isAndroidBrand(brand);
    const showApple = !brand || isAppleBrand(brand);

    const androidProducts = products.filter((p) => isAndroidBrand(p.brand));
    const appleProducts = products.filter((p) => isAppleBrand(p.brand));

    const androidRegions = collectRawValuesFromProducts(androidProducts, { regionsOnly: true });
    const appleRegions = collectRawValuesFromProducts(appleProducts, { regionsOnly: true });
    const allSims = collectRawValuesFromProducts(products, { simsOnly: true });
    const allRegions = collectRawValuesFromProducts(products, { regionsOnly: true });

    const groups = [];
    const usedInGroups = new Set();

    if (showAndroid) {
        const items = resolveAvailableInGroup('android', ANDROID_REGION_OPTIONS, androidRegions);
        if (items.length > 0) {
            groups.push({ id: 'android', title: 'Android', items });
            items.forEach((i) => usedInGroups.add(normalizeFilterKey(i.value)));
        }
    }

    if (showApple) {
        const items = resolveAvailableInGroup('apple', APPLE_REGION_OPTIONS, appleRegions);
        if (items.length > 0) {
            groups.push({ id: 'apple', title: 'Apple', items });
            items.forEach((i) => usedInGroups.add(normalizeFilterKey(i.value)));
        }
    }

    const simItems = [];
    const simUsed = new Set();

    resolveAvailableInGroup('sim', SIM_NETWORK_OPTIONS, allSims).forEach((item) => {
        simItems.push(item);
        simUsed.add(normalizeFilterKey(item.value));
    });

    allSims
        .filter((raw) => !simUsed.has(normalizeFilterKey(raw)))
        .sort((a, b) => a.localeCompare(b))
        .forEach((raw) => {
            simItems.push({
                label: raw,
                value: raw,
                filterKey: makeRegionFilterKey('sim', raw),
            });
            simUsed.add(normalizeFilterKey(raw));
        });

    if (simItems.length > 0) {
        groups.push({ id: 'sim', title: 'SIM / Network', items: simItems });
        simItems.forEach((i) => usedInGroups.add(normalizeFilterKey(i.value)));
    }

    const otherRegions = allRegions.filter(
        (r) => !usedInGroups.has(normalizeFilterKey(r)) && !looksLikeSimOrNetwork(r)
    );
    if (otherRegions.length > 0) {
        groups.push({
            id: 'other',
            title: 'Other',
            items: otherRegions.sort().map((r) => ({
                label: r,
                value: r,
                filterKey: makeRegionFilterKey('other', r),
            })),
        });
    }

    return {
        enabled: groups.length > 0,
        groups,
        flatRegionList: allRegions.sort(),
    };
}
