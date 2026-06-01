"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCustomerOrders, getCustomerCoupons, trackOrder, uploadSingleFile } from "@/lib/api";
import toast from "react-hot-toast";
import PageBreadcrumb from "@/components/Shared/PageBreadcrumb";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import ProfileOverview from "@/components/Profile/ProfileOverview";
import ProfileOrders from "@/components/Profile/ProfileOrders";
import ProfileTracking from "@/components/Profile/ProfileTracking";
import ProfileCoupons from "@/components/Profile/ProfileCoupons";
import ProfileSettings from "@/components/Profile/ProfileSettings";

const SECTION_LABELS = {
    orders: "My Orders",
    tracking: "Track Order",
    coupons: "Coupons",
    profile: "Profile",
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
    const [formData, setFormData] = useState({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        address: "",
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);

    const [trackInvoiceId, setTrackInvoiceId] = useState("");
    const [trackOrderData, setTrackOrderData] = useState(null);
    const [trackLoading, setTrackLoading] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push("/");
        else if (user) {
            let first = user.first_name || "";
            let last = user.last_name || "";
            if (!first && user.name) {
                const parts = user.name.split(" ");
                first = parts[0];
                last = parts.slice(1).join(" ");
            }
            setFormData({
                id: user.id || user.customer_id,
                first_name: first,
                last_name: last,
                email: user.email || "",
                mobile_number: user.mobile_number || user.phone || "",
                address: user.address || "",
            });
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !token || activeSection !== "orders") return;
            setOrdersLoading(true);
            try {
                const customerId = user.id || user.customer_id;
                const data = await getCustomerOrders(token, customerId, activeOrderTab);
                if (data.success) {
                    let list = data.data?.data || data.data || [];
                    setOrders(Array.isArray(list) ? list : []);
                } else setOrders([]);
            } catch {
                setOrders([]);
            } finally {
                setOrdersLoading(false);
            }
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
            } catch {
                setCoupons([]);
            } finally {
                setCouponsLoading(false);
            }
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
                else {
                    toast.error("Failed to upload image");
                    setIsUpdating(false);
                    return;
                }
            }
            const result = await updateProfile({
                id: formData.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.mobile_number,
                address: formData.address,
                image: imageUrl,
            });
            if (result.success) {
                toast.success("Profile updated!");
                setIsEditing(false);
                setProfileImage(null);
                setProfileImagePreview(null);
            } else toast.error(result.message || "Failed to update");
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        if (!trackInvoiceId.trim()) {
            toast.error("Enter Invoice ID");
            return;
        }
        setTrackLoading(true);
        setTrackOrderData(null);
        try {
            const response = await trackOrder({ invoice_id: trackInvoiceId });
            if (response.success && response.data?.data?.length > 0) {
                setTrackOrderData(response.data.data[0]);
                toast.success("Order found!");
            } else {
                toast.error("Order not found");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setTrackLoading(false);
        }
    };

    const handleNavClick = (id) => {
        setActiveSection(id);
        setSidebarOpen(false);
    };

    const handleImageSelect = (file) => {
        setProfileImage(file);
        setProfileImagePreview(URL.createObjectURL(file));
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setProfileImage(null);
        setProfileImagePreview(null);
        if (user) {
            let first = user.first_name || "";
            let last = user.last_name || "";
            if (!first && user.name) {
                const parts = user.name.split(" ");
                first = parts[0];
                last = parts.slice(1).join(" ");
            }
            setFormData({
                id: user.id || user.customer_id,
                first_name: first,
                last_name: last,
                email: user.email || "",
                mobile_number: user.mobile_number || user.phone || "",
                address: user.address || "",
            });
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-card-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary" />
            </div>
        );
    }

    const userName = user.first_name || user.name?.split(" ")[0] || "User";
    const sectionTitle = SECTION_LABELS[activeSection];

    return (
        <div className="min-h-screen bg-card-bg pt-4 md:pt-6 pb-20 md:pb-10">
            <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-gray-200 hover:bg-white/80 transition-colors"
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                    <span className="font-medium text-sm">Menu</span>
                </button>

                <div className="flex gap-6 items-start">
                    <ProfileSidebar
                        activeSection={activeSection}
                        sidebarOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        onNavigate={handleNavClick}
                        onLogout={logout}
                    />

                    <div className="flex-1 w-full lg:w-auto min-w-0">
                        <PageBreadcrumb
                            className="hidden lg:flex mb-4"
                            items={[
                                { label: "Home", href: "/" },
                                { label: "My Account" },
                            ]}
                        />

                        {sectionTitle && (
                            <div className="hidden lg:block mb-4">
                                <h1 className="text-xl font-bold text-gray-900">{sectionTitle}</h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {activeSection === "orders" && "View and manage your purchases"}
                                    {activeSection === "tracking" && "Look up an order by invoice ID"}
                                    {activeSection === "coupons" && "Discount codes saved to your account"}
                                    {activeSection === "profile" && "Update your personal information"}
                                </p>
                            </div>
                        )}

                        {activeSection === "dashboard" && (
                            <ProfileOverview
                                user={user}
                                userName={userName}
                                onNavigate={handleNavClick}
                                onEditProfile={() => {
                                    setActiveSection("profile");
                                    setIsEditing(true);
                                }}
                            />
                        )}

                        {activeSection === "orders" && (
                            <ProfileOrders
                                orders={orders}
                                ordersLoading={ordersLoading}
                                activeOrderTab={activeOrderTab}
                                onOrderTabChange={setActiveOrderTab}
                            />
                        )}

                        {activeSection === "tracking" && (
                            <ProfileTracking
                                trackInvoiceId={trackInvoiceId}
                                onTrackInvoiceIdChange={setTrackInvoiceId}
                                trackLoading={trackLoading}
                                trackOrderData={trackOrderData}
                                onSubmit={handleTrackOrder}
                            />
                        )}

                        {activeSection === "coupons" && (
                            <ProfileCoupons coupons={coupons} couponsLoading={couponsLoading} />
                        )}

                        {activeSection === "profile" && (
                            <ProfileSettings
                                user={user}
                                isEditing={isEditing}
                                onStartEdit={() => setIsEditing(true)}
                                formData={formData}
                                onFormChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
                                profileImagePreview={profileImagePreview}
                                onImageSelect={handleImageSelect}
                                isUpdating={isUpdating}
                                onSubmit={handleProfileUpdate}
                                onCancel={handleCancelEdit}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
