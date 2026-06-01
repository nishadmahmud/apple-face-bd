import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiPhoneCall } from 'react-icons/fi';

export default function CTABanner() {
    return (
        <section className="bg-white py-12 md:py-24 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="relative rounded-3xl overflow-hidden bg-brand-blue shadow-2xl flex flex-col md:flex-row">

                    {/* Left: Content */}
                    <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-10">
                        <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/20">
                            Expert Advice
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.15] mb-4">
                            Need Help Building Your Dream Setup?
                        </h2>
                        <p className="text-white/80 text-sm md:text-lg mb-8 max-w-md font-medium">
                            Talk to our PC building and tech experts. We provide free consultations to help you pick the perfect gear.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <Link href="/"className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 hover:shadow-xl text-sm md:text-base">
                                Contact Experts <FiArrowRight size={18} />
                            </Link>
                            <a href="/"className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl border-2 border-white/30 hover:bg-white/10 transition-colors text-sm md:text-base">
                                <FiPhoneCall size={18} /> 01714404100
                            </a>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="md:w-1/2 relative min-h-[300px] md:min-h-auto flex items-end justify-end">
                        {/* Abstract background graphics */}
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-transparent z-10 md:bg-gradient-to-l opacity-80 md:opacity-100"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop" // Cool tech setup vibe
                            alt="Tech Setup"
                            fill
                            unoptimized
                            className="object-cover object-center z-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
