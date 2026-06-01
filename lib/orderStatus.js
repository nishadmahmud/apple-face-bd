export function getStatusLabel(status) {
    const s = Number(status);
    if (s === 1) return "Order Received";
    if (s === 2) return "Confirmed";
    if (s === 3) return "Processing";
    if (s === 4) return "Delivered";
    if (s === 5) return "Canceled";
    if (s === 6) return "On Hold";
    return "Pending";
}

export function getStatusColor(status) {
    const s = Number(status);
    if (s === 1) return "bg-gray-100 text-gray-800 border border-gray-200";
    if (s === 2) return "bg-brand-primary/10 text-brand-primary border border-brand-primary/20";
    if (s === 3) return "bg-brand-primary/10 text-brand-primary border border-brand-primary/30";
    if (s === 4) return "bg-green-50 text-green-700 border border-green-200";
    if (s === 5) return "bg-red-50 text-red-700 border border-red-200";
    if (s === 6) return "bg-amber-50 text-amber-800 border border-amber-200";
    return "bg-gray-100 text-gray-800 border border-gray-200";
}
