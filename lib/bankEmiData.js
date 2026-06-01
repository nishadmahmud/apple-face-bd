/**
 * EMI rates — Convenient Global EMI (PG), updated Feb 2024.
 * Single source for /emi page and product EMI calculator.
 */

export const EMI_MIN_TRANSACTION = "5,000";

const TENURE_KEYS = ["m3", "m6", "m9", "m12", "m18", "m24", "m30", "m36"];

/** Percentage charges by rate tier (before tenure masking). */
export const RATE_TIERS = {
    scb: { m3: 6.19, m6: 8.38, m9: 11.26, m12: 14.29, m18: 18.17, m24: 23.77, m30: null, m36: 31.59 },
    city: { m3: 6.72, m6: 8.34, m9: 10.58, m12: 12.92, m18: 16.62, m24: 21.97, m30: 23.39, m36: 27.85 },
    default: { m3: 5.65, m6: 7.27, m9: 9.514, m12: 11.85, m18: 15.55, m24: 20.9, m30: 22.32, m36: 26.78 },
};

/** Which tenure keys are available per group (PDF installment matrix). */
export const TENURE_GROUPS = {
    A: ["m3", "m6", "m9", "m12"],
    B: ["m3", "m6", "m9", "m12", "m18", "m24"],
    C: ["m3", "m6", "m9", "m12", "m24"],
    D: ["m3", "m6", "m9", "m12", "m18", "m24", "m36"],
    E: ["m3", "m6", "m9", "m12", "m18", "m24", "m36"],
    F: ["m3", "m6", "m9", "m12", "m18", "m24", "m30", "m36"],
};

/** Local assets in public/banks/ — preferred over remote URLs. */
const LOCAL_BANK_LOGOS = {
    scb: "/banks/scb.svg",
    city: "/banks/city.png",
    bbl: "/banks/bbl.svg",
    dbbl: "/banks/dbbl.svg",
    sebl: "/banks/sebl.svg",
    mtb: "/banks/mtb.jpg",
    ebl: "/banks/ebl.svg",
    lbf: "/banks/lbf.svg",
    ucbl: "/banks/ucbl.svg",
    premier: "/banks/premier.svg",
    dbl: "/banks/dbl.svg",
    meghana: "/banks/meghana.jpg",
    jbl: "/banks/jbl.svg",
    nrb: "/banks/nrb.svg",
    mdl: "/banks/mdl.svg",
    exim: "/banks/exim.svg",
    prime: "/banks/prime.svg",
    cbbl: "/banks/cbbl.png",
    trust: "/banks/trust.svg",
    mercantile: "/banks/mercantile.png",
    bal: "/banks/bal.svg",
    pubali: "/banks/pubali.png",
    islami: "/banks/islami.jpg",
    alarafah: "/banks/alarafah.png",
    ab: "/banks/ab.svg",
};

function bankLogo(id, remoteFallback) {
    return LOCAL_BANK_LOGOS[id] || remoteFallback || null;
}

const BANK_META = {
    scb: { logo: bankLogo("scb", "https://upload.wikimedia.org/wikipedia/commons/0/0c/Standard_Chartered_%282021%29.svg"), initial: "S", color: "bg-blue-900" },
    city: { logo: bankLogo("city", "https://images.seeklogo.com/logo-png/26/1/city-bank-logo-png_seeklogo-263036.png"), initial: "C", color: "bg-blue-600" },
    bbl: { logo: bankLogo("bbl", "https://cdn.brandfetch.io/idcfUmYxDL/w/1882/h/1882/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1764488567824"), initial: "B", color: "bg-orange-600" },
    sibl: { logo: bankLogo("sibl", "https://upload.wikimedia.org/wikipedia/commons/0/02/SJIBL_Logo_English_Blue-01.jpg"), initial: "S", color: "bg-emerald-600" },
    dbbl: { logo: bankLogo("dbbl", "https://upload.wikimedia.org/wikipedia/commons/1/16/Dutch-bangla-bank-ltd.svg"), initial: "D", color: "bg-green-600" },
    sebl: { logo: bankLogo("sebl", "https://upload.wikimedia.org/wikipedia/commons/1/1c/Logo_of_Southeast_Bank.svg"), initial: "S", color: "bg-teal-700" },
    sbl: { logo: bankLogo("sbl", "https://www.standardbankbd.com/Content/Images/standard-logo.png"), initial: "S", color: "bg-indigo-600" },
    mtb: { logo: bankLogo("mtb", "https://cdn.brandfetch.io/idw9NqUipN/w/368/h/270/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1766308741582"), initial: "M", color: "bg-rose-500" },
    ebl: { logo: bankLogo("ebl", "https://cdn.brandfetch.io/id-Sih_qNB/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1764583453827"), initial: "E", color: "bg-purple-500" },
    lbf: { logo: bankLogo("lbf", "https://upload.wikimedia.org/wikipedia/commons/f/f8/Logo_of_LankaBangla_Finance.svg"), initial: "L", color: "bg-lime-600" },
    ucbl: { logo: bankLogo("ucbl", "https://upload.wikimedia.org/wikipedia/en/b/b9/Logo_of_United_Commercial_Bank.svg"), initial: "U", color: "bg-gray-600" },
    premier: { logo: bankLogo("premier", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Logo_of_Premier_Bank-en.svg/2560px-Logo_of_Premier_Bank-en.svg.png"), initial: "P", color: "bg-amber-600" },
    dbl: { logo: bankLogo("dbl", "https://upload.wikimedia.org/wikipedia/commons/4/4c/Logo_of_Dhaka_Bank.svg"), initial: "D", color: "bg-green-700" },
    meghana: { logo: bankLogo("meghana", "https://upload.wikimedia.org/wikipedia/commons/c/cf/Meghna-Bank_Logo_JPG.jpg"), initial: "M", color: "bg-pink-500" },
    jbl: { logo: bankLogo("jbl", "https://upload.wikimedia.org/wikipedia/commons/d/d2/Logo_of_Jamuna_Bank.svg"), initial: "J", color: "bg-indigo-500" },
    ncc: { logo: bankLogo("ncc", "https://upload.wikimedia.org/wikipedia/en/b/b5/NCC_bank_logo.png"), initial: "N", color: "bg-cyan-500" },
    nrb: { logo: bankLogo("nrb", "https://upload.wikimedia.org/wikipedia/commons/6/65/Logo_of_NRB_Bank.svg"), initial: "N", color: "bg-cyan-600" },
    nrbc: { logo: bankLogo("nrbc", "https://images.seeklogo.com/logo-png/55/1/nrbc-bank-logo-png_seeklogo-551967.png"), initial: "N", color: "bg-sky-500" },
    sbac: { logo: bankLogo("sbac", "https://upload.wikimedia.org/wikipedia/commons/a/a2/SBAC_Bank_Ltd.png"), initial: "S", color: "bg-emerald-500" },
    mdl: { logo: bankLogo("mdl", "https://upload.wikimedia.org/wikipedia/commons/6/66/Logo_of_Midland_Bank.svg"), initial: "M", color: "bg-fuchsia-500" },
    exim: { logo: bankLogo("exim", "https://upload.wikimedia.org/wikipedia/commons/f/fd/Logo_of_Exim_Bank_%28Bangladesh%29.svg"), initial: "E", color: "bg-purple-600" },
    prime: { logo: bankLogo("prime", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Logo_of_Prime_Bank.svg/2560px-Logo_of_Prime_Bank.svg.png"), initial: "P", color: "bg-yellow-600" },
    cbbl: { logo: bankLogo("cbbl", "https://www.communitybankbd.com/wp-content/uploads/2020/10/community-cash.png"), initial: "C", color: "bg-blue-400" },
    trust: { logo: bankLogo("trust", "https://upload.wikimedia.org/wikipedia/bn/4/4a/%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%9F_%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%82%E0%A6%95%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg"), initial: "T", color: "bg-rose-600" },
    one: { logo: bankLogo("one", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Logo_of_ONE_Bank-en.svg/2560px-Logo_of_ONE_Bank-en.svg.png"), initial: "O", color: "bg-amber-500" },
    mercantile: { logo: bankLogo("mercantile", "https://images.seeklogo.com/logo-png/30/1/mercantile-bank-ltd-logo-png_seeklogo-308216.png"), initial: "M", color: "bg-pink-600" },
    bal: { logo: bankLogo("bal", "https://upload.wikimedia.org/wikipedia/commons/d/d6/Logo_of_Bank_Asia.svg"), initial: "B", color: "bg-orange-500" },
    pubali: { logo: bankLogo("pubali", "https://images.seeklogo.com/logo-png/51/1/pubali-bank-plc-logo-png_seeklogo-511721.png"), initial: "P", color: "bg-yellow-400" },
    islami: { logo: bankLogo("islami", "https://zarss-bibm.s3-ap-southeast-1.amazonaws.com/bibm_org/members_photo/x9OQKixv9r9WlsdxKXmo3uVWGoZn9GGjrJt0lhf6.jpeg"), initial: "I", color: "bg-teal-500" },
    modhumoti: { logo: bankLogo("modhumoti", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Logo_of_Modhumoti_Bank-en.svg/2560px-Logo_of_Modhumoti_Bank-en.svg.png"), initial: "M", color: "bg-violet-500" },
    alarafah: { logo: bankLogo("alarafah", "https://images.seeklogo.com/logo-png/36/1/al-arafah-islami-bank-limited-logo-png_seeklogo-367896.png"), initial: "A", color: "bg-red-600" },
    ab: { logo: bankLogo("ab", "https://upload.wikimedia.org/wikipedia/commons/7/73/Logo_of_AB_Bank.svg"), initial: "A", color: "bg-red-500" },
};

/** PDF SL 1–32 */
export const EMI_BANKS = [
    { id: "scb", bank: "Standard Chartered Bank", rateTier: "scb", tenureGroup: "E", ...BANK_META.scb },
    { id: "city", bank: "City Bank Limited", rateTier: "city", tenureGroup: "F", ...BANK_META.city },
    { id: "bbl", bank: "BRAC Bank Limited", rateTier: "default", tenureGroup: "B", ...BANK_META.bbl },
    { id: "sibl", bank: "Shahjalal Islami Bank Limited", rateTier: "default", tenureGroup: "A", ...BANK_META.sibl },
    { id: "dbbl", bank: "Dutch Bangla Bank Limited", rateTier: "default", tenureGroup: "D", ...BANK_META.dbbl },
    { id: "sebl", bank: "Southeast Bank Limited", rateTier: "default", tenureGroup: "F", ...BANK_META.sebl },
    { id: "sbl", bank: "Standard Bank Limited", rateTier: "default", tenureGroup: "B", ...BANK_META.sbl },
    { id: "mtb", bank: "Mutual Trust Bank Limited", rateTier: "default", tenureGroup: "D", ...BANK_META.mtb },
    { id: "ebl", bank: "Eastern Bank Limited", rateTier: "default", tenureGroup: "D", ...BANK_META.ebl },
    { id: "lbf", bank: "LankaBangla Finance", rateTier: "default", tenureGroup: "B", ...BANK_META.lbf },
    { id: "ucbl", bank: "United Commercial Bank", rateTier: "default", tenureGroup: "C", ...BANK_META.ucbl },
    { id: "premier", bank: "Premier Bank Limited", rateTier: "default", tenureGroup: "A", ...BANK_META.premier },
    { id: "dbl", bank: "Dhaka Bank Limited", rateTier: "default", tenureGroup: "A", ...BANK_META.dbl },
    { id: "meghana", bank: "Meghana Bank Limited", rateTier: "default", tenureGroup: "B", ...BANK_META.meghana },
    { id: "jbl", bank: "Jamuna Bank Limited", rateTier: "default", tenureGroup: "D", ...BANK_META.jbl },
    { id: "ncc", bank: "National Credit & Commerce Bank Limited", rateTier: "default", tenureGroup: "D", ...BANK_META.ncc },
    { id: "nrb", bank: "NRB Bank Limited", rateTier: "default", tenureGroup: "D", ...BANK_META.nrb },
    { id: "nrbc", bank: "NRBC Bank Limited", rateTier: "default", tenureGroup: "B", ...BANK_META.nrbc },
    { id: "sbac", bank: "South Bangla Agriculture Bank", rateTier: "default", tenureGroup: "B", ...BANK_META.sbac },
    { id: "mdl", bank: "Midland Bank Limited", rateTier: "default", tenureGroup: "B", ...BANK_META.mdl },
    { id: "exim", bank: "Exim Bank Limited", rateTier: "default", tenureGroup: "A", ...BANK_META.exim },
    { id: "prime", bank: "Prime Bank Limited", rateTier: "default", tenureGroup: "B", ...BANK_META.prime },
    { id: "cbbl", bank: "Community Bank Bangladesh Limited", rateTier: "default", tenureGroup: "D", ...BANK_META.cbbl },
    { id: "trust", bank: "Trust Bank Limited", rateTier: "default", tenureGroup: "D", ...BANK_META.trust },
    { id: "one", bank: "One Bank LTD.", rateTier: "default", tenureGroup: "A", ...BANK_META.one },
    { id: "mercantile", bank: "Mercantile Bank Limited", rateTier: "default", tenureGroup: "B", ...BANK_META.mercantile },
    { id: "bal", bank: "Bank Asia Limited", rateTier: "default", tenureGroup: "A", ...BANK_META.bal },
    { id: "pubali", bank: "Pubali Bank Limited", rateTier: "default", tenureGroup: "B", ...BANK_META.pubali },
    { id: "islami", bank: "Islami Bank Bangladesh PLC", rateTier: "default", tenureGroup: "D", ...BANK_META.islami },
    { id: "modhumoti", bank: "Modhumoti Bank PLC", rateTier: "default", tenureGroup: "B", ...BANK_META.modhumoti },
    { id: "alarafah", bank: "Al-Arafah Islami Bank Limited", rateTier: "default", tenureGroup: "A", ...BANK_META.alarafah },
    { id: "ab", bank: "AB Bank", rateTier: "default", tenureGroup: "A", ...BANK_META.ab },
];

/**
 * @param {{ rateTier: string, tenureGroup: string }} entry
 * @returns {{ m3: number|null, m6: number|null, ... }}
 */
export function buildBankRates(entry) {
    const tierRates = RATE_TIERS[entry.rateTier] || RATE_TIERS.default;
    const allowed = TENURE_GROUPS[entry.tenureGroup] || [];
    const rates = {};
    for (const key of TENURE_KEYS) {
        rates[key] = allowed.includes(key) ? tierRates[key] : null;
    }
    return rates;
}

/** Format rate for EMI policy table cells. */
export function formatRateCell(value) {
    if (value == null) return "N/A";
    const s = String(value);
    return s.includes("%") ? s : `${value}%`;
}

/** Row for /emi table: bank name, min trans, formatted tenure columns. */
export function getEmiTableRows() {
    return EMI_BANKS.map((entry) => {
        const rates = buildBankRates(entry);
        return {
            bank: entry.bank,
            minTrans: EMI_MIN_TRANSACTION,
            m3: formatRateCell(rates.m3),
            m6: formatRateCell(rates.m6),
            m9: formatRateCell(rates.m9),
            m12: formatRateCell(rates.m12),
            m18: formatRateCell(rates.m18),
            m24: formatRateCell(rates.m24),
            m30: formatRateCell(rates.m30),
            m36: formatRateCell(rates.m36),
        };
    });
}

/** Bank objects for EMICalculator (numeric rates + branding). */
export function getEmiBanksForCalculator() {
    return EMI_BANKS.map((entry) => ({
        bank: entry.bank,
        logo: entry.logo,
        initial: entry.initial,
        color: entry.color,
        ...buildBankRates(entry),
    }));
}
