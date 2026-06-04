"use client";

import { useState } from "react";
import { FiShield, FiCheckCircle, FiTruck } from "react-icons/fi";
import SectionShell from "../Shared/SectionShell";

const TRUST_ITEMS = [
  { icon: FiShield, label: "Official warranty" },
  { icon: FiCheckCircle, label: "Genuine products" },
  { icon: FiTruck, label: "Fast delivery" },
];

const PREVIEW_BLOCKS = [
  {
    title: "Authentic Mobile Phones, Laptops, Gadgets in Bangladesh",
    body: "Looking for real mobile phones, laptops, and gadgets in Bangladesh? Choose Apple Face BD for trusted tech products. We offer official and unofficial smartphones, including the latest iPhones, Samsung, Xiaomi, OnePlus, and more.",
  },
  {
    title: "Best Mobile Phone Shop in Bangladesh",
    body: "We have official and unofficial products, focusing especially on iPhones. Customer satisfaction and international warranty support are our priorities.",
  },
];

const MORE_BLOCKS = [
  {
    title: "Why Choose Apple Face BD in Bangladesh?",
    list: [
      "A large collection of laptops from HP, Dell, Lenovo, Asus, Acer, and MacBook.",
      "Official Apple products including iPhones, MacBooks, and accessories.",
      "Latest iPads and tablets from Apple, Samsung, and Xiaomi.",
    ],
  },
  {
    title: "Popular Gaming Phone & Laptop Shop",
    body: "Apple Face BD is a trusted store for laptops, Apple products, iPhones, MacBooks, and premium tech gadgets at competitive prices.",
  },
  {
    title: "Best Laptop & MacBook Shop",
    body: "Huge collection for freelancers, office workers, students, and gamers—from HP, Dell, Apple, Asus, Acer, Lenovo, MSI, and more.",
  },
  {
    title: "Why Buy From Apple Face BD?",
    list: [
      "Genuine products with official warranties.",
      "Competitive pricing with frequent promotions.",
      "Reliable delivery across Bangladesh.",
      "Multiple payment options including COD and installments.",
    ],
  },
];

export default function HomeSEOContent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <SectionShell variant="muted" tight border>
      <h2 className="text-lg md:text-xl font-extrabold text-gray-900 mb-4">
        About <span className="text-brand-primary">Apple Face BD</span>
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {TRUST_ITEMS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-white border border-gray-200"
          >
            <Icon className="w-5 h-5 text-brand-primary" />
            <span className="text-[10px] md:text-xs font-bold text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-6 text-sm text-gray-500 leading-relaxed">
        {PREVIEW_BLOCKS.map((block) => (
          <div key={block.title}>
            <h3 className="text-base font-bold text-gray-900 mb-2">{block.title}</h3>
            <p>{block.body}</p>
          </div>
        ))}

        {expanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-2">
            {MORE_BLOCKS.map((block) => (
              <div key={block.title}>
                <h3 className="text-base font-bold text-gray-900 mb-2">{block.title}</h3>
                {block.body && <p>{block.body}</p>}
                {block.list && (
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    {block.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-6 text-sm font-bold text-brand-primary hover:underline"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </SectionShell>
  );
}
