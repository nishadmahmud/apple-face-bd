"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, CheckCircle, Truck, PackageCheck, XCircle, Package, MapPin, X } from "lucide-react";
import OrderTimeline from "../Shared/OrderTimeline";
import LoadingSpinner from "../Shared/LoadingSpinner";
import EmptyState from "../Shared/EmptyState";
import { getStatusLabel, getStatusColor } from "../../lib/orderStatus";

const ORDER_TABS = [
    { id: "1", label: "Processing", Icon: Clock },
    { id: "2", label: "Confirmed", Icon: CheckCircle },
    { id: "3", label: "Delivering", Icon: Truck },
    { id: "4", label: "Delivered", Icon: PackageCheck },
    { id: "5", label: "Canceled", Icon: XCircle },
];

function SectionHeader({ title, subtitle }) {
    return (
        <div className="p-5 md:p-6 bg-brand-primary rounded-t-lg">
            <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
            {subtitle ? <p className="text-white/70 text-sm mt-1">{subtitle}</p> : null}
        </div>
    );
}

export default function ProfileOrders({ orders, ordersLoading, activeOrderTab, onOrderTabChange }) {
    const [selectedOrder, setSelectedOrder] = useState(null);

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <SectionHeader title="My Orders" subtitle="Track and manage your orders" />
            <div className="border-b overflow-x-auto bg-card-bg">
                <div className="flex">
                    {ORDER_TABS.map((tab) => {
                        const TabIcon = tab.Icon;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => onOrderTabChange(tab.id)}
                                className={`flex items-center gap-2 px-4 md:px-6 py-3.5 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                                    activeOrderTab === tab.id
                                        ? "border-brand-primary text-brand-primary bg-white"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <TabIcon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="p-4 md:p-6">
                {ordersLoading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size="md" />
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-brand-primary/30 hover:shadow-sm transition-all"
                            >
                                <div className="flex gap-4">
                                    <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 bg-card-bg rounded-lg overflow-hidden relative border border-gray-100">
                                        {order.sales_details?.[0]?.product_info?.image_path ? (
                                            <Image
                                                src={order.sales_details[0].product_info.image_path}
                                                alt="Product"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                        {order.sales_details?.length > 1 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-0.5 text-center">
                                                +{order.sales_details.length - 1} more
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
                                                    {order.sales_details?.[0]?.product_info?.name ||
                                                        `Order #${order.invoice_id}`}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-mono">#{order.invoice_id}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-lg font-bold text-brand-primary">
                                                    ৳
                                                    {Number(order.sub_total ?? order.total ?? 0) +
                                                        Number(order.delivery_fee ?? 0)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(order.created_at).toLocaleDateString("en-US", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                                            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                            <p className="truncate">
                                                {order.delivery_customer_address || "No address"}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedOrder(order)}
                                            className="mt-3 w-full py-2 px-3 bg-card-bg hover:bg-brand-primary hover:text-white text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 hover:border-brand-primary transition-all"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Package}
                        title="No orders found"
                        description="Orders will appear here once you make a purchase."
                        actionHref="/"
                        actionLabel="Start Shopping"
                    />
                )}
            </div>

            {selectedOrder && (
                <div
                    className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 md:p-6 bg-[#0a0a0a] sticky top-0 z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">Order Details</h3>
                                <p className="text-white/60 text-sm mt-0.5">#{selectedOrder.invoice_id}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 md:p-6 space-y-5">
                            <div className="flex flex-wrap gap-4 justify-between items-center p-4 bg-card-bg rounded-lg border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Order Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(selectedOrder.created_at).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div
                                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.tran_status || selectedOrder.status)}`}
                                >
                                    {getStatusLabel(selectedOrder.tran_status || selectedOrder.status)}
                                </div>
                            </div>
                            {![5, 6].includes(
                                Number(selectedOrder.tran_status || selectedOrder.status)
                            ) && (
                                <OrderTimeline
                                    currentStatus={selectedOrder.tran_status || selectedOrder.status}
                                    size="compact"
                                />
                            )}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Package size={18} />
                                    Products ({selectedOrder.sales_details?.length || 0})
                                </h4>
                                <div className="space-y-2">
                                    {selectedOrder.sales_details?.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-3 p-3 bg-card-bg rounded-lg border border-gray-100"
                                        >
                                            <div className="h-14 w-14 shrink-0 bg-gray-200 rounded-lg overflow-hidden relative">
                                                {item.product_info?.image_path ? (
                                                    <Image
                                                        src={item.product_info.image_path}
                                                        alt="Product"
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                        <Package size={18} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                                    {item.product_info?.name || "Product"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Qty: {item.qty}
                                                    {item.size ? ` • ${item.size}` : ""}
                                                </p>
                                            </div>
                                            <p className="font-bold text-gray-900 shrink-0">
                                                ৳{item.price * item.qty}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 bg-card-bg rounded-lg border border-gray-100 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">
                                        ৳{selectedOrder.sub_total || selectedOrder.total || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Delivery</span>
                                    <span className="font-medium">৳{selectedOrder.delivery_fee || 0}</span>
                                </div>
                                {Number(selectedOrder.coupon_discount || 0) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon</span>
                                        <span>-৳{selectedOrder.coupon_discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-base">
                                    <span>Total</span>
                                    <span className="text-brand-primary">
                                        ৳
                                        {Number(selectedOrder.sub_total ?? selectedOrder.total ?? 0) +
                                            Number(selectedOrder.delivery_fee ?? 0) -
                                            Number(selectedOrder.coupon_discount ?? 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
