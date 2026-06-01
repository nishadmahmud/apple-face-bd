"use client";

import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { SITE_INFO } from '../../lib/siteInfo';

export default function FloatingActions() {
    const hasMessenger = SITE_INFO.messengerUrl && SITE_INFO.messengerUrl !== '#';
    const hasWhatsApp = SITE_INFO.whatsappNumberIntl;

    if (!hasMessenger && !hasWhatsApp) {
        return null;
    }

    return (
        <div className="fixed right-3 md:right-6 bottom-24 md:bottom-6 z-[80] flex flex-col gap-3">
            {hasMessenger && (
                <a
                    href={SITE_INFO.messengerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[#006AFF] text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white"
                    aria-label="Messenger"
                    title="Messenger Chat"
                >
                    <FaFacebookMessenger size={27} />
                </a>
            )}
            {hasWhatsApp && (
                <a
                    href={`https://wa.me/${SITE_INFO.whatsappNumberIntl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-brand-primary text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white"
                    aria-label="WhatsApp"
                    title="WhatsApp Chat"
                >
                    <FaWhatsapp size={27} />
                </a>
            )}
        </div>
    );
}
