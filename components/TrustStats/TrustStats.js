import { FiShield, FiTruck, FiAward, FiLock } from 'react-icons/fi';

export default function TrustStats() {
    const stats = [
        { label: "Genuine Products", desc: "100% Authentic", icon: <FiAward /> },
        { label: "Official Warranty", desc: "Up to 2 Years", icon: <FiShield /> },
        { label: "Fast Delivery", desc: "Nationwide", icon: <FiTruck /> },
        { label: "Secure Payment", desc: "Safe checkout", icon: <FiLock /> }
    ];

    return (
        <section className="bg-white py-6 md:py-8 border-b border-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 divide-x-0 lg:divide-x divide-gray-100">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-3 md:gap-4 px-2 md:px-6 justify-center lg:justify-start group">
                            <div className="text-2xl md:text-3xl text-brand-purple group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] md:text-[13px] font-black text-gray-900 leading-tight">{stat.label}</span>
                                <span className="text-[9px] md:text-[11px] font-medium text-gray-500">{stat.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}