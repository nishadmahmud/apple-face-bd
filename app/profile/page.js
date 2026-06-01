"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCustomerOrders, getCustomerCoupons, trackOrder, uploadSingleFile } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Home, Package, Heart, Tag, User, LogOut, ChevronDown, Clock, CheckCircle, Truck, PackageCheck, XCircle, CheckCircle2, PauseCircle, ClipboardList, MapPin, X, Camera, Edit3, Search } from "lucide-react";

const timelineStages = [
    { id: 1, label: "Order Received", icon: ClipboardList },
    { id: 2, label: "Confirmed", icon: PackageCheck },
    { id: 3, label: "Processing", icon: Truck },
    { id: 4, label: "Delivered", icon: Home },
];

const ORDER_TABS = [
    { id: "1", label: "Processing", Icon: Clock },
    { id: "2", label: "Confirmed", Icon: CheckCircle },
    { id: "3", label: "Delivering", Icon: Truck },
    { id: "4", label: "Delivered", Icon: PackageCheck },
    { id: "5", label: "Canceled", Icon: XCircle },
];

const OrderTimeline = ({ currentStatus }) => {
    const status = Number(currentStatus);
    return (
        <div className="py-4 px-2">
            <div className="hidden sm:block">
                <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 rounded-full" />
                    <div className="absolute left-0 top-5 h-1 bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${((Math.min(status, 4) - 1) / 3) * 100}%` }} />
                    {timelineStages.map((stage) => {
                        const isCompleted = status >= stage.id;
                        const isCurrent = status === stage.id;
                        const StageIcon = stage.icon;
                        return (
                            <div key={stage.id} className="relative flex flex-col items-center z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? "bg-brand-primary text-white shadow-lg" : "bg-white border-2 border-gray-300 text-gray-400"} ${isCurrent ? "ring-4 ring-brand-primary/20 scale-110" : ""}`}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-medium">{stage.id}</span>}
                                </div>
                                <div className={`mt-3 flex flex-col items-center ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                    <StageIcon className={`w-5 h-5 mb-1 ${isCompleted ? "text-brand-primary" : ""}`} />
                                    <span className={`text-xs font-medium text-center max-w-[80px] ${isCurrent ? "font-bold" : ""}`}>{stage.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="sm:hidden space-y-3">
                {timelineStages.map((stage, index) => {
                    const isCompleted = status >= stage.id;
                    const isCurrent = status === stage.id;
                    const StageIcon = stage.icon;
                    const isLast = index === timelineStages.length - 1;
                    return (
                        <div key={stage.id} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? "bg-brand-primary text-white" : "bg-white border-2 border-gray-300 text-gray-400"} ${isCurrent ? "ring-2 ring-brand-primary/20" : ""}`}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{stage.id}</span>}
                                </div>
                                {!isLast && <div className={`w-0.5 h-6 ${isCompleted ? "bg-brand-primary" : "bg-gray-200"}`} />}
                            </div>
                            <div className={`flex items-center gap-2 pt-1 ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                <StageIcon className={`w-4 h-4 ${isCompleted ? "text-brand-primary" : ""}`} />
                                <span className={`text-sm ${isCurrent ? "font-bold" : "font-medium"}`}>{stage.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function ProfileDashboard() {
    const { user, logout, loading, token, updateProfile } = useAuth();
    const router = useRouter();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [activeOrderTab, setActiveOrderTab] = useState("1");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [couponsLoading, setCouponsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: "", first_name: "", last_name: "", email: "", mobile_number: "", address: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);

    const [trackInvoiceId, setTrackInvoiceId] = useState("");
    const [trackOrderData, setTrackOrderData] = useState(null);
    const [trackLoading, setTrackLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (!loading && !user) router.push("/");
        else if (user) {
            let first = user.first_name || "";
            let last = user.last_name || "";
            if (!first && user.name) { const parts = user.name.split(" "); first = parts[0]; last = parts.slice(1).join(" "); }
            setFormData({ id: user.id || user.customer_id, first_name: first, last_name: last, email: user.email || "", mobile_number: user.mobile_number || user.phone || "", address: user.address || "" });
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !token || activeSection !== "orders") return;
            setOrdersLoading(true);
            try {
                const customerId = user.id || user.customer_id;
                const data = await getCustomerOrders(token, customerId, activeOrderTab);
                if (data.success) { let list = data.data?.data || data.data || []; setOrders(Array.isArray(list) ? list : []); }
                else setOrders([]);
            } catch { setOrders([]); }
            finally { setOrdersLoading(false); }
        };
        fetchOrders();
    }, [user, token, activeSection, activeOrderTab]);

    useEffect(() => {
        const fetchCoupons = async () => {
            if (!user || activeSection !== "coupons") return;
            setCouponsLoading(true);
            try {
                const data = await getCustomerCoupons(user.id || user.customer_id);
                if (data.success && data.data) setCoupons(Array.isArray(data.data) ? data.data : []);
                else setCoupons([]);
            } catch { setCoupons([]); }
            finally { setCouponsLoading(false); }
        };
        fetchCoupons();
    }, [user, activeSection]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            let imageUrl = user?.image || null;
            if (profileImage) {
                const imageFormData = new FormData();
                imageFormData.append("file_name", profileImage);
                imageFormData.append("user_id", String(process.env.NEXT_PUBLIC_USER_ID));
                const uploadRes = await uploadSingleFile(imageFormData, token);
                if (uploadRes?.success && uploadRes?.path) imageUrl = uploadRes.path;
                else { toast.error("Failed to upload image"); setIsUpdating(false); return; }
            }
            const result = await updateProfile({ id: formData.id, first_name: formData.first_name, last_name: formData.last_name, email: formData.email, phone: formData.mobile_number, address: formData.address, image: imageUrl });
            if (result.success) { toast.success("Profile updated!"); setIsEditing(false); setProfileImage(null); setProfileImagePreview(null); }
            else toast.error(result.message || "Failed to update");
        } catch { toast.error("Something went wrong"); }
        finally { setIsUpdating(false); }
    };

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        if (!trackInvoiceId.trim()) { toast.error("Enter Invoice ID"); return; }
        setTrackLoading(true); setTrackOrderData(null);
        try {
            const response = await trackOrder({ invoice_id: trackInvoiceId });
            if (response.success && response.data?.data?.length > 0) { setTrackOrderData(response.data.data[0]); toast.success("Order found!"); }
            else { toast.error("Order not found"); }
        } catch { toast.error("Something went wrong"); }
        finally { setTrackLoading(false); }
    };

    const getStatusLabel = (s) => { s = Number(s); if (s === 1) return "Order Received"; if (s === 2) return "Confirmed"; if (s === 3) return "Processing"; if (s === 4) return "Delivered"; if (s === 5) return "Canceled"; if (s === 6) return "On Hold"; return "Pending"; };
    const getStatusColor = (s) => { s = Number(s); if (s === 1) return "bg-blue-50 text-blue-700"; if (s === 2) return "bg-indigo-50 text-indigo-700"; if (s === 3) return "bg-purple-50 text-purple-700"; if (s === 4) return "bg-green-50 text-green-700"; if (s === 5) return "bg-purple-50 text-purple-700"; if (s === 6) return "bg-purple-50 text-purple-700"; return "bg-gray-100 text-gray-800"; };

    if (loading || !user) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div></div>);
    }

    const userName = user.first_name || user.name?.split(" ")[0] || "User";

    const sidebarItems = [
        { id: "dashboard", label: "Overview", icon: <Home className="w-4 h-4" /> },
        { id: "orders", label: "My Orders", icon: <Package className="w-4 h-4" />, group: "Orders" },
        { id: "tracking", label: "Track Order", icon: <Search className="w-4 h-4" /> },
        { id: "coupons", label: "Coupons", icon: <Tag className="w-4 h-4" />, group: "Credits" },
        { id: "profile", label: "Profile", icon: <User className="w-4 h-4" />, group: "Account" },
    ];

    const handleNavClick = (id) => { setActiveSection(id); setSidebarOpen(false); };

    return (
        <div className="min-h-screen bg-gray-50 pt-4 md:pt-6 pb-20 md:pb-6">
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[65] lg:hidden" onClick={() => setSidebarOpen(false)} />}

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                    <span className="font-medium text-sm">Menu</span>
                </button>

                <div className="flex gap-6 items-start">
                    {/* Sidebar */}
                    <aside className={`fixed lg:static top-0 left-0 w-72 bg-white z-[70] lg:z-auto transform lg:transform-none transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:block flex-shrink-0 h-screen lg:h-auto`}>
                        <div className="bg-white lg:rounded-2xl shadow-lg lg:sticky lg:top-24 h-full lg:h-auto flex flex-col overflow-hidden">
                            <div className="lg:hidden flex items-center justify-between p-4 bg-brand-primary text-white flex-shrink-0">
                                <span className="font-bold">Menu</span>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-5 bg-brand-primary hidden lg:block">
                                <Link href="/"className="flex items-center"><span className="text-xl font-extrabold text-white">Apple Face BD BD</span></Link>
                            </div>
                            <nav className="p-4 flex-1 overflow-y-auto pb-20 lg:pb-4 bg-gray-50/50">
                                {(() => {
                                    let lastGroup = null;
                                    return sidebarItems.map((item) => {
                                        const showGroup = item.group && item.group !== lastGroup;
                                        if (item.group) lastGroup = item.group;
                                        return (
                                            <div key={item.id}>
                                                {showGroup && <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">{item.group}</p>}
                                                <button onClick={() => handleNavClick(item.id)}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-3 mb-1 ${activeSection === item.id
                                                        ? "bg-brand-primary text-white shadow-md"
                                                        : "text-gray-700 hover:bg-white hover:shadow-md"}`}>
                                                    {item.icon}{item.label}
                                                </button>
                                            </div>
                                        );
                                    });
                                })()}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <button onClick={logout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-3">
                                        <LogOut className="w-4 h-4" />Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 w-full lg:w-auto min-w-0">

                        {/* ═══ DASHBOARD ═══ */}
                        {activeSection === "dashboard" && (
                            <>
                                <div className="bg-brand-primary rounded-2xl p-4 md:p-6 mb-4 md:mb-6 flex items-center gap-4 md:gap-6 shadow-xl">
                                    <div className="relative">
                                        <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-white/30">
                                            {user?.image ? (<Image src={user.image} alt="Profile" width={80} height={80} className="w-full h-full object-cover" unoptimized />) : (
                                                <svg className="w-7 h-7 md:w-10 md:h-10 text-white/70" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-base md:text-xl font-bold text-white truncate">{userName}</h1>
                                        <p className="text-white/80 text-xs md:text-sm truncate">{user?.email || user?.mobile_number || ""}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-[10px] md:text-xs font-bold rounded-full">MEMBER</span>
                                    </div>
                                    <button onClick={() => { setActiveSection("profile"); setIsEditing(true); }} className="px-3 py-1.5 md:px-5 md:py-2.5 bg-white text-gray-900 hover:bg-gray-100 rounded-lg text-xs md:text-sm font-semibold transition-colors whitespace-nowrap flex-shrink-0 shadow-lg">
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                                    {[
                                        { id: "orders", label: "Orders", desc: "Check order status", bgColor: "bg-blue-500", icon: <Package className="w-6 h-6 md:w-7 md:h-7 text-white" /> },
                                        { id: "tracking", label: "Track Order", desc: "Track shipments", bgColor: "bg-emerald-500", icon: <Truck className="w-6 h-6 md:w-7 md:h-7 text-white" /> },
                                        { id: "coupons", label: "Coupons", desc: "Available discounts", bgColor: "bg-amber-500", icon: <Tag className="w-6 h-6 md:w-7 md:h-7 text-white" /> },
                                        { id: "profile", label: "Profile", desc: "Edit your account", bgColor: "bg-brand-primary", icon: <User className="w-6 h-6 md:w-7 md:h-7 text-white" /> },
                                    ].map(card => (
                                        <button key={card.id} onClick={() => setActiveSection(card.id)} className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-gray-100">
                                            <div className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 ${card.bgColor} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                                {card.icon}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-sm md:text-base mb-0.5">{card.label}</h3>
                                            <p className="text-[10px] md:text-xs text-gray-500">{card.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ═══ ORDERS ═══ */}
                        {activeSection === "orders" && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6 bg-brand-primary">
                                    <h2 className="text-2xl font-bold text-white">My Orders</h2>
                                    <p className="text-white/60 text-sm mt-1">Track and manage your orders</p>
                                </div>
                                <div className="border-b overflow-x-auto bg-gray-50">
                                    <div className="flex">
                                        {ORDER_TABS.map(tab => {
                                            const TabIcon = tab.Icon;
                                            return (<button key={tab.id} onClick={() => setActiveOrderTab(tab.id)} className={`flex items-center gap-2 px-4 md:px-6 py-4 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeOrderTab === tab.id ? "border-brand-primary text-brand-primary bg-white" : "border-transparent text-gray-500 hover:text-gray-700"}`}><TabIcon size={16} />{tab.label}</button>);
                                        })}
                                    </div>
                                </div>
                                <div className="p-4 md:p-6">
                                    {ordersLoading ? (
                                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary" /></div>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map(order => (
                                                <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all group">
                                                    <div className="flex gap-4">
                                                        <div className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100">
                                                            {order.sales_details?.[0]?.product_info?.image_path ? (
                                                                <Image src={order.sales_details[0].product_info.image_path} alt="Product" fill className="object-cover" unoptimized />
                                                            ) : (<div className="flex h-full w-full items-center justify-center text-gray-300"><Package className="h-8 w-8" /></div>)}
                                                            {order.sales_details?.length > 1 && (<div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-0.5 text-center">+{order.sales_details.length - 1} more</div>)}
                                                        </div>
                                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                            <div>
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <div>
                                                                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">{order.sales_details?.[0]?.product_info?.name || `Order #${order.invoice_id}`}</h3>
                                                                        <p className="text-xs text-gray-500 font-mono">#{order.invoice_id}</p>
                                                                    </div>
                                                                    <div className="text-right flex-shrink-0">
                                                                        <p className="text-lg md:text-xl font-bold text-brand-primary">৳{(Number(order.sub_total ?? order.total ?? 0) + Number(order.delivery_fee ?? 0))}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString("en-US", { day: 'numeric', month: 'short' })}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                                                                <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                                                <p className="truncate">{order.delivery_customer_address || "No address"}</p>
                                                            </div>
                                                            <button onClick={() => setSelectedOrder(order)} className="mt-3 w-full py-2 px-3 bg-gray-100 hover:bg-brand-primary hover:text-white text-gray-700 text-xs font-semibold rounded-lg transition-all">View Details</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4"><Package className="w-10 h-10 text-gray-400" /></div>
                                            <h3 className="font-bold text-gray-900 text-lg mb-2">No orders found</h3>
                                            <p className="text-gray-500 text-sm">Orders will appear here once you make a purchase</p>
                                        </div>
                                    )}
                                </div>

                                {/* Order Details Modal */}
                                {selectedOrder && (
                                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                                            <div className="p-6 bg-brand-primary sticky top-0 z-10">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Order Details</h3>
                                                        <p className="text-white/60 text-sm mt-1">#{selectedOrder.invoice_id}</p>
                                                    </div>
                                                    <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                            <div className="p-6 space-y-6">
                                                <div className="flex flex-wrap gap-4 justify-between items-center p-4 bg-gray-50 rounded-xl">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Order Date</p>
                                                        <p className="font-semibold text-gray-900">{new Date(selectedOrder.created_at).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.tran_status || selectedOrder.status)}`}>{getStatusLabel(selectedOrder.tran_status || selectedOrder.status)}</div>
                                                </div>
                                                {![5, 6].includes(Number(selectedOrder.tran_status || selectedOrder.status)) && <OrderTimeline currentStatus={selectedOrder.tran_status || selectedOrder.status} />}
                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={18} />Products ({selectedOrder.sales_details?.length || 0})</h4>
                                                    <div className="space-y-3">
                                                        {selectedOrder.sales_details?.map((item, i) => (
                                                            <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                                                                <div className="h-16 w-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden relative">
                                                                    {item.product_info?.image_path ? <Image src={item.product_info.image_path} alt="Product" fill className="object-cover" unoptimized /> : <div className="flex h-full w-full items-center justify-center text-gray-400"><Package size={20} /></div>}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.product_info?.name || "Product"}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}{item.size ? ` • Size: ${item.size}` : ""}</p>
                                                                </div>
                                                                <div className="text-right"><p className="font-bold text-gray-900">৳{item.price * item.qty}</p></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
                                                    <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">৳{selectedOrder.sub_total || selectedOrder.total || 0}</span></div>
                                                    <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="font-medium">৳{selectedOrder.delivery_fee || 0}</span></div>
                                                    {Number(selectedOrder.coupon_discount || 0) > 0 && <div className="flex justify-between text-green-600"><span>Coupon</span><span>-৳{selectedOrder.coupon_discount}</span></div>}
                                                    <div className="flex justify-between pt-2 border-t font-bold text-lg"><span>Total</span><span className="text-brand-primary">৳{(Number(selectedOrder.sub_total ?? selectedOrder.total ?? 0) + Number(selectedOrder.delivery_fee ?? 0) - Number(selectedOrder.coupon_discount ?? 0))}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══ TRACKING ═══ */}
                        {activeSection === "tracking" && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6 bg-brand-primary">
                                    <h2 className="text-2xl font-bold text-white">Track Order</h2>
                                    <p className="text-white/60 text-sm mt-1">Enter your invoice ID to track</p>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleTrackOrder} className="flex gap-3 mb-6">
                                        <input type="text" value={trackInvoiceId} onChange={e => setTrackInvoiceId(e.target.value)} placeholder="Enter Invoice ID (e.g. INV-12345)" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm" />
                                        <button type="submit" disabled={trackLoading} className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:brightness-95 transition-colors disabled:opacity-70">
                                            {trackLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : "Track"}
                                        </button>
                                    </form>
                                    {trackOrderData && (
                                        <div className="border border-gray-100 rounded-xl p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">#{trackOrderData.invoice_id}</h3>
                                                    <p className="text-sm text-gray-500">{new Date(trackOrderData.created_at).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trackOrderData.tran_status || trackOrderData.status)}`}>{getStatusLabel(trackOrderData.tran_status || trackOrderData.status)}</div>
                                            </div>
                                            <OrderTimeline currentStatus={trackOrderData.tran_status || trackOrderData.status} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ═══ COUPONS ═══ */}
                        {activeSection === "coupons" && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6 bg-brand-primary">
                                    <h2 className="text-2xl font-bold text-white">My Coupons</h2>
                                    <p className="text-white/60 text-sm mt-1">Your available discount codes</p>
                                </div>
                                <div className="p-6">
                                    {couponsLoading ? (
                                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary" /></div>
                                    ) : coupons.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {coupons.map((coupon, i) => (
                                                <div key={i} className="border border-dashed border-brand-primary/30 rounded-xl p-4 bg-brand-primary/5 hover:shadow-md transition-all">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-full">{coupon.coupon_code || coupon.code}</span>
                                                        <span className="text-lg font-extrabold text-brand-primary">{coupon.discount_type === "percentage" ? `${coupon.discount}%` : `৳${coupon.discount}`}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-2">{coupon.description || "Use this code at checkout"}</p>
                                                    {coupon.min_order && <p className="text-xs text-gray-400 mt-1">Min order: ৳{coupon.min_order}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4"><Tag className="w-10 h-10 text-gray-400" /></div>
                                            <h3 className="font-bold text-gray-900 text-lg mb-2">No coupons yet</h3>
                                            <p className="text-gray-500 text-sm">Collected coupons will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ═══ PROFILE ═══ */}
                        {activeSection === "profile" && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6 bg-brand-primary flex items-center justify-between">
                                    <div><h2 className="text-2xl font-bold text-white">My Profile</h2><p className="text-white/60 text-sm mt-1">Manage your account details</p></div>
                                    {!isEditing && <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-semibold flex items-center gap-2"><Edit3 className="w-4 h-4" />Edit</button>}
                                </div>
                                <div className="p-6">
                                    {isEditing ? (
                                        <form onSubmit={handleProfileUpdate} className="space-y-5">
                                            <div className="flex justify-center mb-4">
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-100">
                                                        {profileImagePreview || user?.image ? (
                                                            <Image src={profileImagePreview || user.image} alt="Profile" width={96} height={96} className="w-full h-full object-cover" unoptimized />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-gray-400"><User className="w-10 h-10" /></div>
                                                        )}
                                                    </div>
                                                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:brightness-95 transition-colors">
                                                        <Camera className="w-4 h-4" />
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { setProfileImage(file); setProfileImagePreview(URL.createObjectURL(file)); } }} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">First Name</label>
                                                    <input type="text" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Last Name</label>
                                                    <input type="text" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Email</label>
                                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Phone</label>
                                                <input type="tel" value={formData.mobile_number} onChange={e => setFormData({ ...formData, mobile_number: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Address</label>
                                                <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm resize-none" />
                                            </div>
                                            <div className="flex gap-3">
                                                <button type="button" onClick={() => { setIsEditing(false); setProfileImage(null); setProfileImagePreview(null); }} className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                                                <button type="submit" disabled={isUpdating} className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-md hover:brightness-95 transition-all disabled:opacity-70">
                                                    {isUpdating ? "Saving..." : "Save Changes"}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-100 flex-shrink-0">
                                                    {user?.image ? <Image src={user.image} alt="Profile" width={80} height={80} className="w-full h-full object-cover" unoptimized /> : <div className="flex h-full w-full items-center justify-center text-gray-400"><User className="w-8 h-8" /></div>}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{user.first_name || user.name} {user.last_name || ""}</h3>
                                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { label: "Phone", value: user.mobile_number || user.phone || "Not set" },
                                                    { label: "Email", value: user.email || "Not set" },
                                                    { label: "Address", value: user.address || "Not set", full: true },
                                                ].map((field, i) => (
                                                    <div key={i} className={`p-4 bg-gray-50 rounded-xl ${field.full ? "md:col-span-2" : ""}`}>
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{field.label}</p>
                                                        <p className="text-gray-900 font-medium">{field.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
