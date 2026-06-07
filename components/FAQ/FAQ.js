"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import SectionIntro from "../Shared/SectionIntro";
import SectionShell from "../Shared/SectionShell";

const FAQ_ITEMS = [
  {
    question: "What is Apple Face?",
    answer:
      "Apple Face is a multi-brand tech hub and retail chain in Bangladesh that sells genuine smartphones, laptops, gadgets, and home appliances from leading global brands.",
  },
  {
    question: "Do you sell other smartphones besides iPhone?",
    answer:
      "Yes, we sell top Android phones from Samsung, Xiaomi, OnePlus, Realme, Oppo, Vivo, and more—from budget to flagship level.",
  },
  {
    question: "Does Apple Face sell original products?",
    answer:
      "Yes, we focus on genuine, brand-new devices and check every product to ensure authenticity before delivery.",
  },
  {
    question: "Can I buy laptops and MacBooks?",
    answer:
      "We stock models from HP, Dell, Asus, Acer, Lenovo, MSI, and Apple MacBook Air/Pro.",
  },
  {
    question: "Does Apple Face sell home appliances?",
    answer:
      "Yes—smart TVs, refrigerators, ACs, ovens, washing machines, and more through our outlets and website.",
  },
  {
    question: "Do you offer used or pre-owned devices?",
    answer:
      'We have a dedicated "Used Device" section with checked pre-owned phones and gadgets.',
  },
  {
    question: "Do you offer official brand warranties?",
    answer:
      "Most products include official brand warranty or store warranty; details are on each product page.",
  },
  {
    question: "Is Apple Face online and offline?",
    answer:
      "Yes—we have an online store and physical outlets in Dhaka including Bashundhara City, Jamuna Future Park, Mirpur, and Uttara.",
  },
];

function FaqAccordion({ items, openIndex, onToggle, indexOffset = 0 }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((faq, idx) => {
        const globalIdx = indexOffset + idx;
        const isOpen = openIndex === globalIdx;
        return (
          <div
            key={globalIdx}
            className={`rounded-lg border transition-all ${
              isOpen ? "border-brand-primary/30 bg-white shadow-sm" : "border-gray-200 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => onToggle(globalIdx)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left gap-3"
              aria-expanded={isOpen}
            >
              <h4 className="text-sm md:text-base font-bold text-gray-900 pr-2">{faq.question}</h4>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isOpen ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {isOpen ? <FiMinus size={16} /> : <FiPlus size={16} />}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-gray-500 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const mid = Math.ceil(FAQ_ITEMS.length / 2);
  const leftFaqs = FAQ_ITEMS.slice(0, mid);
  const rightFaqs = FAQ_ITEMS.slice(mid);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <SectionShell variant="muted" border>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <SectionIntro
          variant="compact"
          title="Got"
          highlight="Questions?"
          subtitle="Quick answers about products, warranty, and delivery."
          className="mb-0"
        />
        <a
          href="/contact"
          className="text-sm font-bold text-white bg-gray-900 hover:bg-brand-primary px-5 py-2.5 rounded-lg transition-colors shrink-0"
        >
          Contact Support
        </a>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
        <div className="md:hidden">
          <FaqAccordion items={FAQ_ITEMS} openIndex={openIndex} onToggle={toggle} />
        </div>
        <div className="hidden md:grid md:grid-cols-2 md:gap-6">
          <FaqAccordion items={leftFaqs} openIndex={openIndex} onToggle={toggle} indexOffset={0} />
          <FaqAccordion
            items={rightFaqs}
            openIndex={openIndex}
            onToggle={toggle}
            indexOffset={mid}
          />
        </div>
      </div>
    </SectionShell>
  );
}
