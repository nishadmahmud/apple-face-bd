"use client";

import OrderTimeline from "../Shared/OrderTimeline";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { getStatusLabel, getStatusColor } from "../../lib/orderStatus";

export default function ProfileTracking({
    trackInvoiceId,
    onTrackInvoiceIdChange,
    trackLoading,
    trackOrderData,
    onSubmit,
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 bg-brand-primary rounded-t-lg">
                <h2 className="text-xl md:text-2xl font-bold text-white">Track Order</h2>
                <p className="text-white/70 text-sm mt-1">Enter your invoice ID to track</p>
            </div>
            <div className="p-5 md:p-6">
                <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        value={trackInvoiceId}
                        onChange={(e) => onTrackInvoiceIdChange(e.target.value)}
                        placeholder="Enter Invoice ID (e.g. INV-12345)"
                        className="flex-1 px-4 py-3 bg-card-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                    />
                    <button
                        type="submit"
                        disabled={trackLoading}
                        className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 sm:min-w-[100px]"
                    >
                        {trackLoading ? (
                            <LoadingSpinner size="sm" variant="light" className="mx-auto" />
                        ) : (
                            "Track"
                        )}
                    </button>
                </form>
                {trackOrderData && (
                    <div className="border border-gray-200 rounded-lg p-5 bg-card-bg/30">
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">#{trackOrderData.invoice_id}</h3>
                                <p className="text-sm text-gray-500">
                                    {new Date(trackOrderData.created_at).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <div
                                className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(trackOrderData.tran_status || trackOrderData.status)}`}
                            >
                                {getStatusLabel(trackOrderData.tran_status || trackOrderData.status)}
                            </div>
                        </div>
                        {![5, 6].includes(Number(trackOrderData.tran_status || trackOrderData.status)) && (
                            <OrderTimeline
                                currentStatus={trackOrderData.tran_status || trackOrderData.status}
                                size="compact"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
