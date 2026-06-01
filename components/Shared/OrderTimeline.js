"use client";

import { Home, Truck, PackageCheck, ClipboardList, CheckCircle2 } from "lucide-react";

const timelineStages = [
    { id: 1, label: "Order Received", icon: ClipboardList },
    { id: 2, label: "Confirmed", icon: PackageCheck },
    { id: 3, label: "Processing", icon: Truck },
    { id: 4, label: "Delivered", icon: Home },
];

export default function OrderTimeline({ currentStatus, size = "default" }) {
    const status = Number(currentStatus);
    const isCompact = size === "compact";

    const circleLg = isCompact ? "w-10 h-10" : "w-12 h-12";
    const circleSm = isCompact ? "w-8 h-8" : "w-10 h-10";
    const ringLg = isCompact ? "ring-4 ring-brand-primary/20" : "ring-4 ring-brand-primary/20";
    const ringSm = isCompact ? "ring-2 ring-brand-primary/20" : "ring-3 ring-brand-primary/20";
    const barTop = isCompact ? "top-5" : "top-5";
    const py = isCompact ? "py-4" : "py-6";

    return (
        <div className={`${py} px-2`}>
            <div className="hidden sm:block">
                <div className="relative flex items-center justify-between">
                    <div className={`absolute left-0 right-0 ${barTop} h-1 bg-gray-200 rounded-full`} />
                    <div
                        className={`absolute left-0 ${barTop} h-1 bg-brand-primary rounded-full transition-all duration-500`}
                        style={{ width: `${((Math.min(status, 4) - 1) / 3) * 100}%` }}
                    />
                    {timelineStages.map((stage) => {
                        const isCompleted = status >= stage.id;
                        const isCurrent = status === stage.id;
                        const StageIcon = stage.icon;
                        return (
                            <div key={stage.id} className="relative flex flex-col items-center z-10">
                                <div
                                    className={`${circleLg} rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isCompleted
                                            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                                            : "bg-white border-2 border-gray-300 text-gray-400"
                                    } ${isCurrent ? `${ringLg} scale-110` : ""}`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className={isCompact ? "w-5 h-5" : "w-6 h-6"} />
                                    ) : (
                                        <span className="text-sm font-semibold">{stage.id}</span>
                                    )}
                                </div>
                                <div
                                    className={`mt-3 md:mt-4 flex flex-col items-center ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                                >
                                    <StageIcon
                                        className={`w-5 h-5 mb-1 ${isCompleted ? "text-brand-primary" : ""}`}
                                    />
                                    <span
                                        className={`text-xs font-medium text-center max-w-[80px] sm:max-w-[90px] ${isCurrent ? "font-bold" : ""}`}
                                    >
                                        {stage.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={`sm:hidden ${isCompact ? "space-y-3" : "space-y-4"}`}>
                {timelineStages.map((stage, index) => {
                    const isCompleted = status >= stage.id;
                    const isCurrent = status === stage.id;
                    const StageIcon = stage.icon;
                    const isLast = index === timelineStages.length - 1;
                    return (
                        <div key={stage.id} className={`flex items-start ${isCompact ? "gap-3" : "gap-4"}`}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`${circleSm} rounded-full flex items-center justify-center ${
                                        isCompleted
                                            ? "bg-brand-primary text-white shadow-md"
                                            : "bg-white border-2 border-gray-300 text-gray-400"
                                    } ${isCurrent ? ringSm : ""}`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className={isCompact ? "w-4 h-4" : "w-5 h-5"} />
                                    ) : (
                                        <span className="text-sm">{stage.id}</span>
                                    )}
                                </div>
                                {!isLast && (
                                    <div
                                        className={`w-0.5 ${isCompact ? "h-6" : "h-8"} ${isCompleted ? "bg-brand-primary" : "bg-gray-200"}`}
                                    />
                                )}
                            </div>
                            <div
                                className={`flex items-center gap-2 ${isCompact ? "pt-1" : "pt-2"} ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                            >
                                <StageIcon
                                    className={`w-5 h-5 ${isCompleted ? "text-brand-primary" : ""}`}
                                />
                                <span className={`text-sm ${isCurrent ? "font-bold" : "font-medium"}`}>
                                    {stage.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
