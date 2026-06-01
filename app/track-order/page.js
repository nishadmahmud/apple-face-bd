"use client";

import { useState } from "react";
import { trackOrder } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Home, Package, Truck, PackageCheck, ClipboardList, CheckCircle2, Search, MapPin, ArrowLeft } from "lucide-react";

const timelineStages = [
    { id: 1, label: "Order Received", icon: ClipboardList },
    { id: 2, label: "Confirmed", icon: PackageCheck },
    { id: 3, label: "Processing", icon: Truck },
    { id: 4, label: "Delivered", icon: Home },
];

const OrderTimeline = ({ currentStatus }) => {
    const status = Number(currentStatus);
    return (
        <div className="py-6 px-2">
            {/* Desktop */}
            <div className="hidden sm:block">
                <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 rounded-full" />
                    <div className="absolute left-0 top-5 h-1 bg-gradient-to-r from-brand-purple to-purple-400 rounded-full transition-all duration-500" style={{ width: `${((Math.min(status, 4) - 1) / 3) * 100}%` }} />
                    {timelineStages.map((stage) => {
                        const isCompleted = status >= stage.id;
                        const isCurrent = status === stage.id;
                        const StageIcon = stage.icon;
                        return (
                            <div key={stage.id} className="relative flex flex-col items-center z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? "bg-gradient-to-br from-brand-purple to-purple-500 text-white shadow-lg shadow-purple-500/30" : "bg-white border-2 border-gray-300 text-gray-400"} ${isCurrent ? "ring-4 ring-purple-100 scale-110" : ""}`}>
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-semibold">{stage.id}</span>}
                                </div>
                                <div className={`mt-4 flex flex-col items-center ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                    <StageIcon className={`w-5 h-5 mb-1 ${isCompleted ? "text-brand-purple" : ""}`} />
                                    <span className={`text-xs font-medium text-center max-w-[90px] ${isCurrent ? "font-bold" : ""}`}>{stage.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Mobile */}
            <div className="sm:hidden space-y-4">
                {timelineStages.map((stage, index) => {
                    const isCompleted = status >= stage.id;
                    const isCurrent = status === stage.id;
                    const StageIcon = stage.icon;
                    const isLast = index === timelineStages.length - 1;
                    return (
                        <div key={stage.id} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? "bg-gradient-to-br from-brand-purple to-purple-500 text-white shadow-md" : "bg-white border-2 border-gray-300 text-gray-400"} ${isCurrent ? "ring-3 ring-purple-100" : ""}`}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm">{stage.id}</span>}
                                </div>
                                {!isLast && <div className={`w-0.5 h-8 ${isCompleted ? "bg-brand-purple" : "bg-gray-200"}`} />}
                            </div>
                            <div className={`flex items-center gap-2 pt-2 ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                <StageIcon className={`w-5 h-5 ${isCompleted ? "text-brand-purple" : ""}`} />
                                <span className={`text-sm ${isCurrent ? "font-bold" : "font-medium"}`}>{stage.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const [invoiceId, setInvoiceId] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const getStatusLabel = (s) => { s = Number(s); if (s === 1) return "Order Received"; if (s === 2) return "Confirmed"; if (s === 3) return "Processing"; if (s === 4) return "Delivered"; if (s === 5) return "Canceled"; if (s === 6) return "On Hold"; return "Pending"; };
    const getStatusColor = (s) => { s = Number(s); if (s === 1) return "bg-blue-50 text-blue-700 border-blue-200"; if (s === 2) return "bg-indigo-50 text-indigo-700 border-indigo-200"; if (s === 3) return "bg-purple-50 text-purple-700 border-purple-200"; if (s === 4) return "bg-green-50 text-green-700 border-green-200"; if (s === 5) return "bg-purple-50 text-purple-700 border-purple-200"; if (s === 6) return "bg-purple-50 text-purple-700 border-purple-200"; return "bg-gray-100 text-gray-800"; };

    const handleTrack = async (e) => {
        if (e) e.preventDefault();
        const idToTrack = invoiceId || searchParams.get('invoice');
        if (!idToTrack?.trim()) { toast.error("Please enter an Invoice ID"); return; }
        setLoading(true);
        setOrderData(null);
        setSearched(true);
        try {
            const response = await trackOrder({ invoice_id: idToTrack.trim() });
            if (response.success && response.data?.data?.length > 0) {
                setOrderData(response.data.data[0]);
                toast.success("Order found!");
            } else {
                toast.error("Order not found. Please check your Invoice ID.");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-track if invoice is provided in URL
    useEffect(() => {
        const urlInvoice = searchParams.get('invoice');
        if (urlInvoice) {
            setInvoiceId(urlInvoice);
            // Trigger tracking with a small delay to ensure states are ready
            const timer = setTimeout(() => {
                 handleTrack();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-10">
            {/* Same content as before */}
            {/* Hero Header */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-purple/5 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-brand-purple/10">
                        <Truck className="w-8 h-8 md:w-10 md:h-10 text-brand-purple" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">Track Your Order</h1>
                    <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">
                        Enter your invoice ID to see the real-time status of your order.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                {/* Search Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 mb-6">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={invoiceId}
                                onChange={(e) => setInvoiceId(e.target.value)}
                                placeholder="Enter Invoice ID (e.g. INV-12345)"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-sm md:text-base"
                                style={{ fontSize: "16px" }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-brand-purple text-white font-extrabold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                    Tracking...
                                </span>
                            ) : "Track Order"}
                        </button>
                    </form>
                </div>

                {/* Results (orderData, etc.) */}
                {orderData && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Order Header */}
                        <div className="p-5 md:p-8 border-b border-gray-100">
                            <div className="flex flex-wrap gap-4 justify-between items-center">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Invoice ID</p>
                                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">#{orderData.invoice_id}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{new Date(orderData.created_at).toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className={`px-5 py-2.5 rounded-full text-sm font-bold border ${getStatusColor(orderData.tran_status || orderData.status)}`}>
                                    {getStatusLabel(orderData.tran_status || orderData.status)}
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        {![5, 6].includes(Number(orderData.tran_status || orderData.status)) && (
                            <div className="px-5 md:px-8">
                                <OrderTimeline currentStatus={orderData.tran_status || orderData.status} />
                            </div>
                        )}

                        {/* Special Status (Canceled / On Hold) */}
                        {[5, 6].includes(Number(orderData.tran_status || orderData.status)) && (
                            <div className="px-5 md:px-8 py-8">
                                <div className={`py-8 px-6 text-center rounded-xl ${Number(orderData.tran_status || orderData.status) === 5 ? "bg-purple-50" : "bg-purple-50"}`}>
                                    <h3 className={`text-xl font-bold mb-2 ${Number(orderData.tran_status || orderData.status) === 5 ? "text-purple-700" : "text-purple-700"}`}>
                                        {Number(orderData.tran_status || orderData.status) === 5 ? "Order Canceled" : "Order On Hold"}
                                    </h3>
                                    <p className={`text-sm ${Number(orderData.tran_status || orderData.status) === 5 ? "text-purple-600" : "text-purple-600"}`}>
                                        {Number(orderData.tran_status || orderData.status) === 5 ? "This order has been canceled." : "This order is currently on hold."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Products */}
                        {orderData.sales_details?.length > 0 && (
                            <div className="px-5 md:px-8 pb-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={18} />Products ({orderData.sales_details.length})</h3>
                                <div className="space-y-3">
                                    {orderData.sales_details.map((item, i) => (
                                        <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                                            <div className="h-16 w-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden relative">
                                                {item.product_info?.image_path ? (
                                                    <Image src={item.product_info.image_path} alt="Product" fill className="object-cover" unoptimized />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-400"><Package size={20} /></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.product_info?.name || "Product"}</p>
                                                <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}{item.size ? ` • Size: ${item.size}` : ""}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-bold text-brand-purple">৳{item.price * item.qty}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delivery Info */}
                        <div className="px-5 md:px-8 pb-6">
                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><MapPin size={18} />Delivery Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-400 text-xs mb-0.5">Name</p>
                                        <p className="font-medium text-gray-900">{orderData.delivery_customer_name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs mb-0.5">Phone</p>
                                        <p className="font-medium text-gray-900">{orderData.delivery_customer_phone || "N/A"}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-gray-400 text-xs mb-0.5">Address</p>
                                        <p className="font-medium text-gray-900">{orderData.delivery_customer_address || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="px-5 md:px-8 pb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">৳{orderData.sub_total || orderData.total || 0}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Delivery Fee</span><span className="font-medium">৳{orderData.delivery_fee || 0}</span></div>
                                {Number(orderData.coupon_discount || 0) > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-৳{orderData.coupon_discount}</span></div>}
                                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-lg"><span>Grand Total</span><span className="text-brand-purple">৳{(Number(orderData.sub_total ?? orderData.total ?? 0) + Number(orderData.delivery_fee ?? 0) - Number(orderData.coupon_discount ?? 0))}</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {searched && !loading && !orderData && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-100">
                            <Search className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h3>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto">We couldn&apos;t find an order with that invoice ID. Please double-check and try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
