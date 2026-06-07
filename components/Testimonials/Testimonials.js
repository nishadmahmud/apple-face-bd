"use client";

import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import SectionIntro from "../Shared/SectionIntro";
import SectionShell from "../Shared/SectionShell";

export default function Testimonials() {
  const reviews = [
    { id: 1, name: "Rahim Ahmed", role: "Custom PC Builder", rating: 5, text: "Got all my components delivered within 24 hours. Everything was perfectly packaged. Top-notch service!", avatar: "RA", color: "bg-blue-500" },
    { id: 2, name: "Tasnia Farin", role: "Content Creator", rating: 5, text: "Bought the A7 IV bundle. Genuine product and the lowest price in the market. Highly recommended!", avatar: "TF", color: "bg-purple-500" },
    { id: 3, name: "Imran Khan", role: "Gamer", rating: 5, text: "My PS5 arrived safely. Customer support was very responsive when I asked about warranty details.", avatar: "IK", color: "bg-orange-500" },
    { id: 4, name: "Nusrat Jahan", role: "Software Engineer", rating: 5, text: "Upgraded my WFH setup with a new monitor from Apple Face. Great delivery experience!", avatar: "NJ", color: "bg-brand-primary" },
    { id: 5, name: "Sakib Hasan", role: "Smartphone Buyer", rating: 5, text: "Pre-ordered the new iPhone, got it on release day. Seamless from start to finish.", avatar: "SH", color: "bg-red-500" },
    { id: 6, name: "Maliha Rahman", role: "Audiophile", rating: 5, text: "The Sony headphones are 100% authentic. Great sound, fast delivery.", avatar: "MR", color: "bg-indigo-500" },
  ];

  return (
    <SectionShell variant="light" border>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 md:mb-10">
        <SectionIntro
          variant="badge"
          eyebrow="Testimonials"
          title="Trusted by"
          highlight="Thousands"
          subtitle="What our customers say about shopping with Apple Face."
          className="mb-0"
        />
        <div className="bg-card-bg p-5 rounded-lg border border-gray-200 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-lg bg-brand-primary flex items-center justify-center text-white">
            <span className="text-xl font-black">4.9</span>
          </div>
          <div>
            <div className="flex gap-0.5 text-brand-primary mb-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={12} />
              ))}
            </div>
            <p className="text-xs font-bold text-gray-900">2,500+ Reviews</p>
          </div>
        </div>
      </div>

      <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
        {reviews.map((review) => (
          <div key={review.id} className="w-[85vw] max-w-sm shrink-0 snap-center">
            <ReviewCard review={review} compact />
          </div>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="https://g.page/celltechbd/review"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-brand-primary hover:underline"
        >
          Read Google Reviews →
        </a>
      </div>
    </SectionShell>
  );
}

function ReviewCard({ review, compact = false }) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 hover:border-brand-primary/20 hover:shadow-sm transition-all flex flex-col h-full ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <FaQuoteLeft className="text-brand-primary/15 mb-3" size={compact ? 28 : 36} />
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-[10px] ${i < review.rating ? "text-brand-primary" : "text-gray-200"}`}
          />
        ))}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow">&ldquo;{review.text}&rdquo;</p>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div
          className={`w-10 h-10 rounded-lg ${review.color} flex items-center justify-center text-white font-bold text-xs`}
        >
          {review.avatar}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <h4 className="text-sm font-bold text-gray-900 truncate">{review.name}</h4>
            <FiCheckCircle className="text-brand-primary w-3 h-3 shrink-0" />
          </div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase">{review.role}</p>
        </div>
      </div>
    </div>
  );
}
