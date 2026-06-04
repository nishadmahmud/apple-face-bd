"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { FiLayers, FiChevronUp } from "react-icons/fi";
import { SITE_INFO } from "../../lib/siteInfo";
import { useCompare } from "../../context/CompareContext";

const SCROLL_TOP_SIZE = 48;
const SCROLL_TOP_STROKE = 3;
const SCROLL_TOP_RADIUS = (SCROLL_TOP_SIZE - SCROLL_TOP_STROKE) / 2;
const SCROLL_TOP_CIRCUMFERENCE = 2 * Math.PI * SCROLL_TOP_RADIUS;

function ScrollToTopButton({ visible, percent, onClick }) {
    const dashOffset = SCROLL_TOP_CIRCUMFERENCE - (percent / 100) * SCROLL_TOP_CIRCUMFERENCE;
    const cx = SCROLL_TOP_SIZE / 2;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Back to top, ${percent}% scrolled`}
            title="Back to top"
            className={`relative w-12 h-12 rounded-full shadow-xl transition-all duration-300 ${
                visible
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-75 pointer-events-none"
            } hover:scale-110 active:scale-95`}
        >
            <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox={`0 0 ${SCROLL_TOP_SIZE} ${SCROLL_TOP_SIZE}`}
                aria-hidden
            >
                <circle
                    cx={cx}
                    cy={cx}
                    r={SCROLL_TOP_RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth={SCROLL_TOP_STROKE}
                />
                <circle
                    cx={cx}
                    cy={cx}
                    r={SCROLL_TOP_RADIUS}
                    fill="none"
                    stroke="#E31E24"
                    strokeWidth={SCROLL_TOP_STROKE}
                    strokeDasharray={SCROLL_TOP_CIRCUMFERENCE}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute inset-[3px] rounded-full bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
                <FiChevronUp size={14} strokeWidth={2.5} className="-mb-0.5" />
                <span className="text-[9px] font-bold leading-none tabular-nums">{percent}%</span>
            </span>
        </button>
    );
}

export default function FloatingActions() {
    const { compareCount } = useCompare();
    const [hydrated, setHydrated] = useState(false);
    const [scrollPercent, setScrollPercent] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const updateScrollProgress = useCallback(() => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const percent = maxScroll > 0 ? Math.min(100, Math.round((scrollTop / maxScroll) * 100)) : 0;
        setScrollPercent(percent);
        setShowScrollTop(scrollTop > 80);
    }, []);

    useEffect(() => {
        updateScrollProgress();
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                updateScrollProgress();
                ticking = false;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [updateScrollProgress]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const hasMessenger = SITE_INFO.messengerUrl && SITE_INFO.messengerUrl !== "#";
    const hasWhatsApp = SITE_INFO.whatsappNumberIntl;

    return (
        <div className="fixed right-3 md:right-6 bottom-[5.75rem] md:bottom-6 z-[80] flex flex-col gap-2.5">
            <ScrollToTopButton
                visible={showScrollTop}
                percent={scrollPercent}
                onClick={scrollToTop}
            />
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
