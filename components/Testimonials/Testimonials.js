"use client";

import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';

export default function Testimonials() {
    const reviews = [
        { id: 1, name: "Rahim Ahmed", role: "Custom PC Builder", rating: 5, text: "Got all my components delivered within 24 hours. Everything was perfectly packaged. Top-notch service!", avatar: "RA", color: "bg-blue-500" },
        { id: 2, name: "Tasnia Farin", role: "Content Creator", rating: 5, text: "Bought the A7 IV bundle. Genuine product and the lowest price in the market. Highly recommended!", avatar: "TF", color: "bg-purple-500" },
        { id: 3, name: "Imran Khan", role: "Gamer", rating: 5, text: "My PS5 arrived safely. Customer support was very responsive when I asked about warranty details. The packaging was extremely secure.", avatar: "IK", color: "bg-orange-500" },
        { id: 4, name: "Nusrat Jahan", role: "Software Engineer", rating: 5, text: "Upgraded my WFH setup with a new monitor and ergonomic chair from Apple Face BD. Life-changing experience with their delivery team!", avatar: "NJ", color: "bg-brand-primary" },
        { id: 5, name: "Sakib Hasan", role: "Smartphone Buyer", rating: 5, text: "Pre-ordered the new iPhone, got it on release day. Seamless experience from start to finish. Best tech shop in BD.", avatar: "SH", color: "bg-red-500" },
        { id: 6, name: "Maliha Rahman", role: "Audiophile", rating: 5, text: "The Sony headphones are 100% authentic. Great sound, fast delivery, couldn't ask for more from a gadgets shop.", avatar: "MR", color: "bg-indigo-500" },
    ];

    return (
        <section className="bg-[#F9FAFB] py-16 md:py-24 border-b border-gray-100 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-site mx-auto px-4 md:px-6 relative z-10">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
                            <span>Testimonials</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-4 leading-tight">
                            Trusted by <span className="text-brand-primary">Thousands</span> <br className="hidden lg:block" />
                            of Tech Enthusiasts.
                        </h2>
                        <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                            Don't just take our word for it. Here's what our community has to say about their experience with Apple Face BD.
                        </p>
                    </div>

                    {/* Overall Rating Card */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                            <span className="text-2xl font-black">4.9</span>
                        </div>
                        <div>
                            <div className="flex gap-0.5 text-brand-primary mb-1">
                                {[...Array(5)].map((_, i) => <FaStar key={i} size={14} />)}
                            </div>
                            <p className="text-xs font-bold text-gray-900">2,500+ Reviews</p>
                            <p className="text-[10px] text-gray-400 font-medium">Verified Customer Ratings</p>
                        </div>
                    </div>
                </div>

                {/* Mobile: Automatic Side Scrolling (Marquee) */}
                <div className="md:hidden relative overflow-hidden py-4 -mx-4 h-[420px]">
                    <div className="animate-marquee flex gap-4 px-4 h-full">
                        {[...reviews, ...reviews].map((review, idx) => (
                            <div key={`${review.id}-${idx}`} className="w-[85vw] shrink-0 h-full">
                                <ReviewCard review={review} isMobile={true} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop: Staggered Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-6 md:gap-8 lg:mt-0">
                        <ReviewCard review={reviews[0]} />
                        <ReviewCard review={reviews[3]} />
                    </div>
                    {/* Column 2 */}
                    <div className="flex flex-col gap-6 md:gap-8 lg:mt-12">
                        <ReviewCard review={reviews[1]} />
                        <ReviewCard review={reviews[4]} />
                    </div>
                    {/* Column 3 */}
                    <div className="flex flex-col gap-6 md:gap-8 lg:mt-0">
                        <ReviewCard review={reviews[2]} />
                        <ReviewCard review={reviews[5]} />
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 md:mt-24 text-center">
                    <p className="text-gray-500 font-medium mb-6">Want to see more success stories?</p>
                    <a href="https://g.page/celltechbd/review" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-primary font-black hover:gap-3 transition-all duration-300">
                        Read Google Reviews <span>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}

function ReviewCard({ review, isMobile = false }) {
    return (
        <div className={`group bg-white rounded-[32px] ${isMobile ? 'p-6' : 'p-8 md:p-10'} border border-gray-100 hover:border-brand-primary/20 hover:shadow-[0_20px_50px_rgba(57,178,74,0.08)] transition-all duration-500 relative flex flex-col h-full`}>
            <div className={`absolute ${isMobile ? 'top-6 right-6' : 'top-8 right-8'} text-brand-primary/5 group-hover:text-brand-primary/10 transition-colors duration-500`}>
                <FaQuoteLeft size={48} />
            </div>
            
            <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-[12px] ${i < review.rating ? 'text-brand-primary' : 'text-gray-200'}`} />
                ))}
            </div>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8 font-medium relative z-10">
                "{review.text}"
            </p>

            <div className="flex items-center gap-4 mt-auto pt-8 border-t border-gray-50 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${review.color || 'bg-brand-primary'} flex items-center justify-center text-white font-black text-sm shadow-inner shrink-0 shadow-black/5`}>
                    {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="text-[15px] font-black text-gray-900 leading-tight truncate">{review.name}</h4>
                        <FiCheckCircle className="text-brand-primary w-3.5 h-3.5 shrink-0" title="Verified Customer" />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase truncate">{review.role}</p>
                </div>
            </div>
        </div>
    );
}
