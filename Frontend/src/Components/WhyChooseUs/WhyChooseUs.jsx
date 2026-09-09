import React from 'react';
import { motion } from 'framer-motion';
import { Zap, MapPin, Sparkles, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';

const features = [
    {
        id: 1,
        title: "Ultra-Fast 20-Min Delivery",
        description: "Equipped with temperature-controlled thermal bags so your food arrives hot, fresh, and pristine.",
        icon: Zap,
        badge: "LIGHTNING SPEED",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    },
    {
        id: 2,
        title: "500+ Gourmet Partners",
        description: "Hand-picked Michelin-star chefs, top local bistros, and 100% verified hygienic kitchens.",
        icon: Award,
        badge: "VERIFIED QUALITY",
        color: "text-primary bg-primary/10 border-primary/20"
    },
    {
        id: 3,
        title: "Live GPS Order Tracking",
        description: "Watch your driver's real-time position on the live map from the kitchen counter to your doorstep.",
        icon: MapPin,
        badge: "REAL-TIME MAP",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
        id: 4,
        title: "24/7 AI Food Concierge",
        description: "Smart voice and text assistant that curates dish suggestions tailored to your mood and cravings.",
        icon: Sparkles,
        badge: "AI POWERED",
        color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-10 sm:py-14 bg-white/40 dark:bg-[#211714]/40 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center mb-8"
                >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-2">
                        <HeartHandshake className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                            THE CRAVELY PROMISE
                        </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-dark dark:text-[#f4f1ea] tracking-tight">
                        Why Food Lovers <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-[#ff806b]">Choose Us</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] max-w-md mt-2 font-medium">
                        We blend cutting-edge technology with culinary excellence for an effortless dining experience.
                    </p>
                </motion.div>

                {/* Features Grid - Sleek Compact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {features.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08, duration: 0.4 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-bg-warm/40 dark:bg-[#2b1f1d]/40 backdrop-blur-md border border-gray-150/60 dark:border-[#3a2b27]/60 rounded-2xl p-4 sm:p-5 shadow-md shadow-black/[0.02] dark:shadow-black/20 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-primary/40 group"
                            >
                                <div>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 transition-transform duration-300 group-hover:scale-105 ${item.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-gray-400 dark:text-[#7f796d] block mb-1">
                                        {item.badge}
                                    </span>

                                    <h3 className="font-serif text-base sm:text-lg font-bold text-text-dark dark:text-[#f4f1ea] leading-snug mb-1.5 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-[11px] text-gray-500 dark:text-[#a09a8e] leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-3 mt-3 border-t border-gray-100 dark:border-[#3a2b27] flex items-center gap-1.5 text-[10px] font-mono font-bold text-primary">
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                    <span>Guaranteed Standard</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;
