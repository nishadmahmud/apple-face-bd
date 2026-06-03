"use client";

import HomeHero from "./HomeHero";

/**
 * @deprecated Use HomeHero with slides + banners. Kept for backward compatibility.
 */
export default function Hero({ slides = [], banners = [] }) {
  return <HomeHero slides={slides} banners={banners} />;
}
