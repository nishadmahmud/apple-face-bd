"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { SITE_INFO } from "../../lib/siteInfo";
import { useCompare } from "../../context/CompareContext";

export default function FloatingActions() {
    const { compareCount } = useCompare();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const hasMessenger = SITE_INFO.messengerUrl && SITE_INFO.messengerUrl !== "#";
    const hasWhatsApp = SITE_INFO.whatsappNumberIntl;

    return (
        <div className="fixed right-3 md:right-6 bottom-[5.75rem] md:bottom-6 z-[80] flex flex-col gap-2.5">
            <Link
                href="/compare"
                className="relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#0a0a0a] text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Compare products"
                title="Compare"
            >
                <FiLayers size={20} className="md:w-[22px] md:h-[22px]" />
                {hydrated && compareCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                        {compareCount}
                    </span>
                )}
            </Link>
            {hasMessenger && (
                <a
                    href={SITE_INFO.messengerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#006AFF] text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
                    aria-label="Messenger"
                    title="Messenger Chat"
                >
                    <FaFacebookMessenger size={24} className="md:w-[27px] md:h-[27px]" />
                </a>
            )}
            {hasWhatsApp && (
                <a
                    href={`https://wa.me/${SITE_INFO.whatsappNumberIntl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-brand-primary text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
                    aria-label="WhatsApp"
                    title="WhatsApp Chat"
                >
                    <FaWhatsapp size={24} className="md:w-[27px] md:h-[27px]" />
                </a>
            )}
        </div>
    );
}
