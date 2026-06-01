"use client";

import Image from "next/image";
import { User, Camera, Edit3 } from "lucide-react";

const inputClass =
    "w-full px-4 py-3 bg-card-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm";

export default function ProfileSettings({
    user,
    isEditing,
    onStartEdit,
    formData,
    onFormChange,
    profileImagePreview,
    onImageSelect,
    isUpdating,
    onSubmit,
    onCancel,
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 bg-brand-primary rounded-t-lg flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">My Profile</h2>
                    <p className="text-white/70 text-sm mt-1">Manage your account details</p>
                </div>
                {!isEditing && (
                    <button
                        type="button"
                        onClick={onStartEdit}
                        className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-semibold flex items-center gap-2 shrink-0"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit
                    </button>
                )}
            </div>
            <div className="p-5 md:p-6">
                {isEditing ? (
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="flex justify-center mb-2">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-card-bg overflow-hidden border-4 border-brand-primary/20">
                                    {profileImagePreview || user?.image ? (
                                        <Image
                                            src={profileImagePreview || user.image}
                                            alt="Profile"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                                            <User className="w-10 h-10" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:opacity-90 transition-opacity">
                                    <Camera className="w-4 h-4" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) onImageSelect(file);
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => onFormChange({ first_name: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => onFormChange({ last_name: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => onFormChange({ email: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.mobile_number}
                                onChange={(e) => onFormChange({ mobile_number: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                                Address
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => onFormChange({ address: e.target.value })}
                                rows={3}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-card-bg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
                            >
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-card-bg overflow-hidden border-4 border-brand-primary/20 shrink-0">
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        alt="Profile"
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <User className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {user.first_name || user.name} {user.last_name || ""}
                                </h3>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Phone", value: user.mobile_number || user.phone || "Not set" },
                                { label: "Email", value: user.email || "Not set" },
                                { label: "Address", value: user.address || "Not set", full: true },
                            ].map((field, i) => (
                                <div
                                    key={i}
                                    className={`p-4 bg-card-bg rounded-lg border border-brand-primary/15 ${field.full ? "md:col-span-2" : ""}`}
                                >
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        {field.label}
                                    </p>
                                    <p className="text-gray-900 font-medium">{field.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
