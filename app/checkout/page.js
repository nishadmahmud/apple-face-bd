"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { saveSalesOrder, getCouponList, applyCoupon } from "../../lib/api";
import { resolveDistrictCityFromUser } from "../../lib/matchAddressToBangladesh";
import {
    MapPin,
    CreditCard,
    ShoppingBag,
    Shield,
    Truck,
    User,
    Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import AddressSelect from "../../components/Checkout/AddressSelect";

function cartLineKey(item) {
    return `${item.id}::${item.variantKey ?? "default"}`;
}

export default function CheckoutPage() {
    const { cartItems, deliveryFee, updateDeliveryFee, clearCart, removeFromCart } = useCart();
    const { user, loading: authLoading } = useAuth();

    const router = useRouter();

    /** Which checkout lines are included in the order (`true` = selected). */
    const [lineSelected, setLineSelected] = useState({});
    const prevCartKeysRef = useRef(new Set());

    useEffect(() => {
        const allKeys = cartItems.map(cartLineKey);
        const prevKeySet = prevCartKeysRef.current;

        setLineSelected((prev) => {
            const next = {};
            for (const k of allKeys) {
                const wasInCart = prevKeySet.has(k);
                if (!wasInCart) {
                    next[k] = true;
                } else {
                    next[k] = prev[k] === true;
                }
            }
            return next;
        });

        prevCartKeysRef.current = new Set(allKeys);
    }, [cartItems]);

    const selectedItems = useMemo(
        () => cartItems.filter((item) => lineSelected[cartLineKey(item)] === true),
        [cartItems, lineSelected]
    );

    const allLinesSelected = useMemo(
        () =>
            cartItems.length > 0 &&
            cartItems.every((item) => lineSelected[cartLineKey(item)] === true),
        [cartItems, lineSelected]
    );

    const allLinesDeselected = useMemo(
        () =>
            cartItems.length > 0 &&
            cartItems.every((item) => lineSelected[cartLineKey(item)] !== true),
        [cartItems, lineSelected]
    );

    const selectedSubTotal = useMemo(
        () =>
            selectedItems.reduce(
                (sum, item) => sum + Number(item.numericPrice || 0) * Number(item.quantity || 0),
                0
            ),
        [selectedItems]
    );

    const selectedCareTotal = useMemo(
        () =>
            selectedItems.reduce(
                (total, item) =>
                    total + Number(item.careTotalPerUnit || 0) * Number(item.quantity || 0),
                0
            ),
        [selectedItems]
    );

    // Format price helper function
    const formatPrice = (amount) => {
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    // District & City state
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        phone: "",
        email: "",
        address: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");

    const formRef = useRef(null);

    // Load saved details on mount
    useEffect(() => {
        const savedDetails = localStorage.getItem("CellTechBDCheckoutDetails");
        if (savedDetails) {
            try {
                const parsed = JSON.parse(savedDetails);
                setFormData(prev => ({
                    ...prev,
                    firstName: parsed.firstName || prev.firstName,
                    phone: parsed.phone || prev.phone,
                    email: parsed.email || prev.email,
                    address: parsed.address || prev.address,
                }));
                if (parsed.district) setSelectedDistrict(parsed.district);
                if (parsed.city) setSelectedCity(parsed.city);
            } catch (e) {
                console.error("Failed to parse saved checkout details", e);
            }
        }
    }, []);

    // Logged-in customer: prefill from profile (overrides localStorage for name / contact / address)
    useEffect(() => {
        if (authLoading || !user) return;

        let first = user.first_name || "";
        let last = user.last_name || "";
        if (!first && user.name) {
            const parts = String(user.name).split(" ");
            first = parts[0] || "";
            last = parts.slice(1).join(" ") || "";
        }
        const firstName = [first, last].filter(Boolean).join(" ").trim();

        setFormData({
            firstName,
            phone: String(user.mobile_number || user.phone || "").trim(),
            email: String(user.email || "").trim(),
            address: String(user.address || "").trim(),
        });

        const loc = resolveDistrictCityFromUser(user);
        if (!loc) return;

        if (loc.source === "structured") {
            if (loc.district) setSelectedDistrict(loc.district);
            setSelectedCity(loc.city ?? null);
            return;
        }
        if (loc.source === "heuristic") {
            setSelectedDistrict((d) => d || loc.district);
            setSelectedCity((c) => c || loc.city);
        }
    }, [authLoading, user]);

    // Update delivery fee based on selection
    const updateDeliveryFeeCallback = useCallback(() => {
        if (!selectedDistrict && !selectedCity) {
            updateDeliveryFee(0);
            return;
        }

        let fee = 130; // Default: Outside Dhaka

        if (
            selectedCity === "Demra" ||
            selectedCity?.includes("Savar") ||
            selectedDistrict === "Gazipur" ||
            selectedCity?.includes("Keraniganj")
        ) {
            fee = 90;
        } else if (selectedDistrict === "Dhaka") {
            fee = 70;
        } else {
            fee = 130;
        }
        updateDeliveryFee(fee);
    }, [selectedDistrict, selectedCity, updateDeliveryFee]);

    useEffect(() => {
        updateDeliveryFeeCallback();
    }, [updateDeliveryFeeCallback]);

    const grandTotal = selectedSubTotal + deliveryFee - couponDiscount;

    // Keep coupon discount consistent when only part of the cart is selected
    useEffect(() => {
        if (!appliedCoupon) return;

        if (selectedSubTotal <= 0) {
            setCouponDiscount(0);
            setAppliedCoupon(null);
            return;
        }

        const minOrderAmount = parseFloat(appliedCoupon.minimum_order_amount) || 0;
        if (minOrderAmount > 0 && selectedSubTotal < minOrderAmount) {
            setCouponDiscount(0);
            setAppliedCoupon(null);
            setCouponError(`Minimum order amount is ${formatPrice(minOrderAmount)}`);
            toast.error("Coupon removed: selected total is below the minimum order amount.");
            return;
        }

        const couponAmount = parseFloat(appliedCoupon.amount) || 0;
        const amountLimit = parseFloat(appliedCoupon.amount_limit) || 0;
        let discount = 0;

        if (appliedCoupon.coupon_amount_type === "percentage") {
            discount = Math.round(selectedSubTotal * (couponAmount / 100));
        } else {
            discount = couponAmount;
        }

        if (amountLimit > 0 && discount > amountLimit) {
            discount = amountLimit;
        }

        discount = Math.min(discount, selectedSubTotal);
        setCouponDiscount(discount);
    }, [selectedSubTotal, appliedCoupon]);

    // Coupon handling
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        setCouponLoading(true);
        setCouponError("");

        try {
            const response = await getCouponList();

            if (response.success && response.data) {
                const matchingCoupon = response.data.find(
                    coupon => coupon.coupon_code.toUpperCase() === couponCode.trim().toUpperCase()
                );

                if (matchingCoupon) {
                    const now = new Date();
                    const expireDate = new Date(matchingCoupon.expire_date);

                    if (expireDate < now) {
                        setCouponError("This coupon has expired");
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const minOrderAmount = parseFloat(matchingCoupon.minimum_order_amount) || 0;
                    if (minOrderAmount > 0 && selectedSubTotal < minOrderAmount) {
                        setCouponError(`Minimum order amount is ${formatPrice(minOrderAmount)}`);
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const couponAmount = parseFloat(matchingCoupon.amount) || 0;
                    const amountLimit = parseFloat(matchingCoupon.amount_limit) || 0;
                    let discount = 0;

                    if (matchingCoupon.coupon_amount_type === "percentage") {
                        discount = Math.round(selectedSubTotal * (couponAmount / 100));
                    } else {
                        discount = couponAmount;
                    }

                    if (amountLimit > 0 && discount > amountLimit) {
                        discount = amountLimit;
                    }

                    discount = Math.min(discount, selectedSubTotal);

                    setCouponDiscount(discount);
                    setAppliedCoupon(matchingCoupon);
                    toast.success(`Coupon applied! You saved ${formatPrice(discount)}`);
                } else {
                    setCouponError("Invalid coupon code");
                    setCouponDiscount(0);
                    setAppliedCoupon(null);
                }
            } else {
                setCouponError("Unable to validate coupon");
                setCouponDiscount(0);
                setAppliedCoupon(null);
            }
        } catch (error) {
            console.error("Coupon error:", error);
            setCouponError("Failed to apply coupon");
            setCouponDiscount(0);
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode("");
        setCouponDiscount(0);
        setAppliedCoupon(null);
        setCouponError("");
    };

    const selectAllLines = useCallback(() => {
        const next = {};
        for (const item of cartItems) {
            next[cartLineKey(item)] = true;
        }
        setLineSelected(next);
    }, [cartItems]);

    const deselectAllLines = useCallback(() => {
        const next = {};
        for (const item of cartItems) {
            next[cartLineKey(item)] = false;
        }
        setLineSelected(next);
    }, [cartItems]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedItems.length === 0) {
            toast.error("Select at least one product to place an order.");
            return;
        }

        if (!selectedDistrict || !selectedCity) {
            toast.error("Please select both District and Area");
            return;
        }

        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 11-digit Bangladeshi phone number");
            return;
        }

        setIsSubmitting(true);

        // Save details to localStorage
        try {
            const detailsToSave = {
                firstName: formData.firstName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                district: selectedDistrict,
                city: selectedCity
            };
            localStorage.setItem("CellTechBDCheckoutDetails", JSON.stringify(detailsToSave));
        } catch (error) {
            console.error("Failed to save checkout details to local storage", error);
        }

        const orderPayload = {
            pay_mode: paymentMethod,
            paid_amount: 0,
            user_id: process.env.NEXT_PUBLIC_USER_ID,
            sub_total: selectedSubTotal,
            vat: 0,
            tax: 0,
            discount: couponDiscount,
            product: selectedItems.map((item) => ({
                product_id: item.id,
                qty: item.quantity,
                price: item.numericPrice,
                mode: 1,
                size: item.variants?.storage || "Free Size",
                color: item.variants?.colors?.name || null,
                region: item.variants?.region || null,
                imei_id: item.variants?.imeiId || null,
                imei: item.variants?.imei || null,
                sales_id: process.env.NEXT_PUBLIC_USER_ID,
                care_plans: item.variants?.carePlans || [],
                care_total_per_unit: Number(item.careTotalPerUnit || 0),
            })),
            delivery_method_id: 1,
            delivery_info_id: 1,
            delivery_customer_name: formData.firstName,
            delivery_customer_address: `${formData.address}, ${selectedCity}, ${selectedDistrict}`,
            delivery_customer_phone: formData.phone,
            delivery_fee: deliveryFee,
            variants: [],
            imeis: [null],
            created_at: new Date().toISOString(),
            customer_name: formData.firstName,
            customer_phone: formData.phone,
            sales_id: process.env.NEXT_PUBLIC_USER_ID,
            wholeseller_id: 1,
            status: 1,
            delivery_city: selectedCity,
            delivery_district: selectedDistrict,
            detailed_address: formData.address,
        };

        try {
            if (appliedCoupon && couponCode) {
                try {
                    await applyCoupon(couponCode);
                } catch (couponError) {
                    console.warn("Error tracking coupon usage:", couponError);
                }
            }

            const response = await saveSalesOrder(orderPayload);

            if (response.success) {
                if (selectedItems.length === cartItems.length) {
                    clearCart();
                } else {
                    for (const item of selectedItems) {
                        removeFromCart(item.id, item.variantKey ?? "default");
                    }
                }
                toast.success("Order placed successfully!");
                const invoiceId = response.data?.invoice_id || response.invoice_id || "INV-" + Date.now();
                router.push(`/order-success?invoice=${invoiceId}`);
            } else {
                const errorMsg = response.message || response.error || "Failed to place order. Please try again.";
                toast.error(errorMsg);
                console.error("Order process failed:", {
                    status: response.status,
                    message: response.message,
                    error: response.error,
                    full_response: response
                });
            }
        } catch (error) {
            console.error("Critical error submitting order:", error);
            toast.error("An unexpected error occurred: " + (error.message || "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50">
                <div className="text-center px-4">
                    <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-12 w-12 text-brand-purple/40" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">
                        Your cart is empty
                    </h2>
                    <p className="mt-2 text-gray-500 max-w-xs mx-auto">
                        Add some products to your cart before checking out.
                    </p>
                    <Link
                        href="/" className="mt-6 inline-block rounded-xl bg-brand-purple px-8 py-3.5 text-white font-bold hover:bg-[#7b3ba8] transition-colors shadow-lg shadow-brand-purple/20"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-0 lg:pt-8 pb-[120px] md:pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Page Header */}
                    <div className="mb-6 md:mb-8 pt-6 md:pt-0">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Checkout</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Complete your order by providing delivery and payment details.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 lg:gap-8 lg:grid lg:grid-cols-[1.5fr_1fr]">

                        {/* ═══ Left Column: Forms ═══ */}
                        <div className="space-y-6">

                            {/* ── Delivery Information ── */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
                                <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-brand-purple">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            Delivery Address
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Where should we send your order?
                                        </p>
                                    </div>
                                </div>

                                <form
                                    id="checkout-form"
                                    ref={formRef}
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    required
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-purple focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                                                    placeholder="Your full name"
                                                    style={{ fontSize: '16px' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone Number */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    required
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-purple focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                                                    placeholder="01XXXXXXXXX"
                                                    style={{ fontSize: '16px' }}
                                                />
                                            </div>
                                            {formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone) && (
                                                <p className="text-xs text-red-500">
                                                    Invalid phone number format.
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Format: 01XXXXXXXXX (11 digits)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email (Optional) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Email <span className="text-gray-400 font-normal">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-purple focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                                                placeholder="email@example.com"
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Address Select (District -> Area) */}
                                    <div className="space-y-2">
                                        <AddressSelect
                                            selectedDistrict={selectedDistrict}
                                            setSelectedDistrict={setSelectedDistrict}
                                            selectedCity={selectedCity}
                                            setSelectedCity={setSelectedCity}
                                        />
                                    </div>

                                    {/* Detailed Address */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Detailed Address
                                        </label>
                                        <textarea
                                            required
                                            name="address"
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-purple focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-purple resize-none"
                                            placeholder="Street address, house number, landmarks..."
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>
                                </form>
                            </section>

                            {/* ── Payment Method ── */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
                                <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            Payment Method
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Select how you want to pay
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Cash on Delivery */}
                                    <label
                                        className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-brand-purple ${paymentMethod === "Cash"
                                            ? "border-brand-purple bg-purple-50/50 ring-1 ring-brand-purple"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Cash"
                                            className="sr-only"
                                            checked={paymentMethod === "Cash"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className="flex flex-1 flex-col">
                                            <span className="flex items-center gap-2 font-bold text-gray-900">
                                                <Truck className="h-4 w-4 text-brand-purple" />
                                                Cash on Delivery
                                            </span>
                                            <span className="mt-1 text-xs text-gray-500">
                                                Pay when you receive
                                            </span>
                                        </div>
                                        {paymentMethod === "Cash" && (
                                            <div className="absolute right-4 top-4">
                                                <div className="h-3 w-3 rounded-full bg-brand-purple" />
                                            </div>
                                        )}
                                    </label>

                                    {/* Online Payment (Coming Soon) */}
                                    <label className="relative flex cursor-not-allowed rounded-xl border-2 border-gray-100 p-4 opacity-50">
                                        <div className="flex flex-1 flex-col">
                                            <span className="flex items-center gap-2 font-bold text-gray-400">
                                                <CreditCard className="h-4 w-4" />
                                                Online Payment
                                            </span>
                                            <span className="mt-1 text-xs text-gray-400">
                                                Coming soon
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </section>
                        </div>

                        {/* ═══ Right Column: Order Summary ═══ */}
                        <div className="h-fit space-y-6 lg:sticky lg:top-24">
                            <section className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
                                <h2 className="mb-5 font-extrabold text-gray-900 text-lg">
                                    Order Summary
                                </h2>

                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                                    <p className="text-xs text-gray-500">
                                        Select products to include in this order
                                    </p>
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            type="button"
                                            onClick={selectAllLines}
                                            disabled={allLinesSelected}
                                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-brand-purple hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-700"
                                        >
                                            Select all
                                        </button>
                                        <button
                                            type="button"
                                            onClick={deselectAllLines}
                                            disabled={allLinesDeselected}
                                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-700"
                                        >
                                            Deselect all
                                        </button>
                                    </div>
                                </div>

                                {/* Cart Items */}
                                <div className="mb-5 max-h-[300px] space-y-4 overflow-y-auto pr-1">
                                    {cartItems.map((item, index) => (
                                        <div key={`${item.id}-${item.variantKey}-${index}`} className="flex gap-3">
                                            <label className="flex cursor-pointer items-start pt-1 shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={lineSelected[cartLineKey(item)] === true}
                                                    onChange={() => {
                                                        const k = cartLineKey(item);
                                                        setLineSelected((prev) => ({
                                                            ...prev,
                                                            [k]: !(prev[k] === true),
                                                        }));
                                                    }}
                                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                                                />
                                            </label>
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                                <Image
                                                    src={item.images?.[0] || item.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400"}
                                                    alt={item.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="flex justify-between">
                                                    <h3 className="line-clamp-1 text-sm font-bold text-gray-900 pr-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm font-extrabold text-brand-purple whitespace-nowrap">
                                                        {formatPrice(item.numericPrice * item.quantity)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.variants?.storage && (
                                                        <>
                                                            <span>·</span>
                                                            <span>{item.variants.storage}</span>
                                                        </>
                                                    )}
                                                    {item.variants?.colors?.name && (
                                                        <>
                                                            <span>·</span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.variants.colors.hex }}></span>
                                                                {item.variants.colors.name}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="mb-5 space-y-3 border-t border-gray-100 pt-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">{formatPrice(selectedSubTotal)}</span>
                                    </div>
                                    {selectedCareTotal > 0 && (
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Apple Face BD Care+</span>
                                            <span className="font-medium">{formatPrice(selectedCareTotal)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Delivery ({
                                            selectedCity ? (selectedCity === "Demra" || selectedCity?.includes("Savar") || selectedDistrict === "Gazipur" || selectedCity?.includes("Keraniganj"))
                                                ? "Special Area"
                                                : selectedDistrict === "Dhaka"
                                                    ? "Inside Dhaka"
                                                    : "Outside Dhaka"
                                                : "Select Area"
                                        })</span>
                                        <span className="font-medium">{deliveryFee > 0 ? formatPrice(deliveryFee) : "—"}</span>
                                    </div>
                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600 font-medium">
                                            <span>Coupon Discount</span>
                                            <span>-{formatPrice(couponDiscount)}</span>
                                        </div>
                                    )}

                                    {/* Coupon Input */}
                                    <div className="pt-2">
                                        {appliedCoupon ? (
                                            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-green-700">
                                                        🎉 {couponCode} applied
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={handleRemoveCoupon}
                                                    className="text-xs text-purple-600 hover:underline font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Coupon Code"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value.toUpperCase());
                                                        setCouponError("");
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !couponLoading && couponCode.trim()) {
                                                            e.preventDefault();
                                                            handleApplyCoupon();
                                                        }
                                                    }}
                                                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${couponError
                                                        ? "border-red-300 bg-red-50 focus:border-red-500"
                                                        : "border-gray-200 bg-gray-50 focus:border-brand-purple"
                                                        }`}
                                                    style={{ fontSize: '16px' }}
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading}
                                                    className="rounded-xl bg-brand-purple px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#7b3ba8] disabled:opacity-50"
                                                >
                                                    {couponLoading ? "..." : "Apply"}
                                                </button>
                                            </div>
                                        )}
                                        {couponError && (
                                            <p className="mt-1.5 text-xs text-purple-600">{couponError}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-5">
                                    <span className="text-base font-extrabold text-gray-900">
                                        Grand Total
                                    </span>
                                    <span className="text-xl font-extrabold text-brand-purple">
                                        {formatPrice(grandTotal)}
                                    </span>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isSubmitting || selectedItems.length === 0}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand-purple/20 transition-all hover:bg-[#7b3ba8] hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            Confirm & Place Order
                                            <Truck className="h-4 w-4" />
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-left text-xs leading-relaxed text-gray-800 sm:text-sm">
                                    <p className="font-semibold text-gray-900">Note:</p>
                                    <p className="mt-1">
                                        অনলাইন অর্ডার কনফার্ম করতে (ফুল পেমেন্ট/১,০২০) টাকা পেমেন্ট করে আপনার অর্ডারটি কনফার্ম করতে হবে এবং বকেয়া টাকার উপর ১% কন্ডিশন চার্জ যুক্ত হবে।
                                    </p>
                                    <p className="mt-2">
                                        অর্ডার সংক্রান্ত যেকোন প্রয়োজনে আমাদের কাস্টমার সার্ভিস প্রতিনিধির সাথে যোগাযোগ করুন-{' '}
                                        <a href="tel:01732167888" className="font-semibold text-brand-purple hover:underline">01732-167888</a>
                                    </p>
                                    <p className="mt-1">
                                        WhatsApp:{' '}
                                        <a href="https://wa.me/8801732167888" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-purple hover:underline">01732-167888</a>
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <Shield className="h-3 w-3" />
                                    Secure checkout · SSL encrypted
                                </div>
                            </section>

                            {/* Delivery Partners */}
                            <div className="flex justify-center items-center gap-6">
                                <svg viewBox="0 0 120 30" className="h-6 w-auto opacity-50 grayscale transition hover:grayscale-0 hover:opacity-100">
                                    <text x="0" y="20" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="24" fill="#E11220">Pathao</text>
                                </svg>
                                <svg viewBox="0 0 110 30" className="h-6 w-auto opacity-50 grayscale transition hover:grayscale-0 hover:opacity-100">
                                    <text x="0" y="20" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#4D148C">Fed</text>
                                    <text x="42" y="20" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#FF6600">Ex</text>
                                </svg>
                                <svg viewBox="0 0 80 30" className="h-6 w-auto opacity-50 grayscale transition hover:grayscale-0 hover:opacity-100">
                                    <text x="0" y="20" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="26" fill="#D40511">DHL</text>
                                </svg>
                            </div>

                            <div className="text-center text-xs text-gray-400 pb-4">
                                <Link href="/" className="hover:underline">Terms</Link> · <Link href="/" className="hover:underline">Privacy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
