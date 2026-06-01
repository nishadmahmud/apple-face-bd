import addressData from '../public/bangladesh-data.json';

const norm = (s) => String(s || '').toLowerCase().trim();

/**
 * Exact label match for a district name against country_states values.
 */
function findExactDistrictName(input) {
    const n = norm(input);
    if (!n) return null;
    const states = addressData.country_states || {};
    for (const name of Object.values(states)) {
        if (norm(name) === n) return name;
    }
    return null;
}

/**
 * Exact city label within a given district (state) display name.
 */
function findExactCityInDistrict(districtDisplayName, cityInput) {
    const stateId = Object.entries(addressData.country_states || {}).find(
        ([, label]) => norm(label) === norm(districtDisplayName)
    )?.[0];
    if (!stateId) return null;
    const cities = addressData.country_cities?.[stateId] || {};
    const want = norm(cityInput);
    if (!want) return null;
    for (const cityName of Object.values(cities)) {
        if (norm(cityName) === want) return cityName;
    }
    return null;
}

/**
 * Heuristic: longest district name substring match in address, then longest city in that district.
 * @returns {{ district: string, city: string|null, source: 'heuristic' }|null}
 */
function heuristicFromAddress(addressText) {
    const addr = norm(addressText);
    if (!addr) return null;

    const states = addressData.country_states || {};
    const candidates = Object.entries(states)
        .map(([id, name]) => ({ id, name, len: String(name).length }))
        .filter(({ name }) => addr.includes(norm(name)))
        .sort((a, b) => b.len - a.len);

    if (candidates.length === 0) return null;

    const { id: stateId, name: districtName } = candidates[0];
    const cities = addressData.country_cities?.[stateId] || {};
    const cityCandidates = Object.values(cities)
        .map((name) => ({ name, len: String(name).length }))
        .filter(({ name }) => addr.includes(norm(name)))
        .sort((a, b) => b.len - a.len);

    const city = cityCandidates[0]?.name || null;
    return { district: districtName, city, source: 'heuristic' };
}

/**
 * @param {Record<string, unknown>} user - customer from auth
 * @returns {{ district: string|null, city: string|null, source: 'structured'|'heuristic' }|null}
 */
export function resolveDistrictCityFromUser(user) {
    if (!user) return null;

    const rawDistrict =
        user.district ||
        user.delivery_district ||
        user.state_name ||
        user.state ||
        user.division;
    const rawCity =
        user.city ||
        user.delivery_city ||
        user.area ||
        user.thana ||
        user.upazila;

    if (rawDistrict) {
        const districtName = findExactDistrictName(rawDistrict);
        if (districtName) {
            if (rawCity) {
                const cityName = findExactCityInDistrict(districtName, rawCity);
                if (cityName) {
                    return { district: districtName, city: cityName, source: 'structured' };
                }
            }
            return { district: districtName, city: null, source: 'structured' };
        }
    }

    const addr = user.address || user.detailed_address || '';
    const h = heuristicFromAddress(addr);
    return h;
}
