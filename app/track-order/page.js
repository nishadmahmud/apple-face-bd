"use client";

import { useState } from "react";
import { trackOrder } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Package, Search, MapPin } from "lucide-react";
import PageHero from "../../components/Shared/PageHero";
import OrderTimeline from "../../components/Shared/OrderTimeline";
import { getStatusLabel, getStatusColor } from "../../lib/orderStatus";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const [invoiceId, setInvoiceId] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

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
        <div className="min-h-screen bg-card-bg pb-20 md:pb-10">
            <PageHero
                eyebrow="Orders"
                title="Track Your"
                highlight="Order"
                description="Enter your invoice ID to see the real-time status of your order."
                className="!py-10 md:!py-12"
            />

            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 -mt-2">
                {/* Search Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 md:p-8 mb-6">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={invoiceId}
                                onChange={(e) => setInvoiceId(e.target.value)}
                                placeholder="Enter Invoice ID (e.g. INV-12345)"
                                className="w-full pl-12 pr-4 py-4 bg-card-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm md:text-base"
                                style={{ fontSize: "16px" }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-brand-primary text-white font-extrabold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoadingSpinner size="sm" variant="light" />
                                    Tracking...
                                </span>
                            ) : "Track Order"}
                        </button>
                    </form>
                </div>

                {/* Results (orderData, etc.) */}
                {orderData && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                                <div className={`py-8 px-6 text-center rounded-lg ${Number(orderData.tran_status || orderData.status) === 5 ? "bg-red-50 border border-red-100" : "bg-amber-50 border border-amber-100"}`}>
                                    <h3 className={`text-xl font-bold mb-2 ${Number(orderData.tran_status || orderData.status) === 5 ? "text-red-700" : "text-amber-800"}`}>
                                        {Number(orderData.tran_status || orderData.status) === 5 ? "Order Canceled" : "Order On Hold"}
                                    </h3>
                                    <p className={`text-sm ${Number(orderData.tran_status || orderData.status) === 5 ? "text-red-600" : "text-amber-700"}`}>
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
                                        <div key={i} className="flex gap-4 p-3 bg-card-bg rounded-lg border border-gray-100">
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
                                                <p className="font-bold text-brand-primary">৳{item.price * item.qty}</p>
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
                                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-lg"><span>Grand Total</span><span className="text-brand-primary">৳{(Number(orderData.sub_total ?? orderData.total ?? 0) + Number(orderData.delivery_fee ?? 0) - Number(orderData.coupon_discount ?? 0))}</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {searched && !loading && !orderData && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 md:p-16 text-center">
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
            <div className="min-h-screen flex items-center justify-center bg-card-bg">
                <LoadingSpinner size="lg" />
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
