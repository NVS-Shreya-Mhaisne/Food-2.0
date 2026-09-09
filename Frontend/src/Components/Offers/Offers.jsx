import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Sparkles, Copy, Check, Clock, Flame, Percent, Gift, Truck, Wallet } from 'lucide-react';

const offersList = [
    {
        id: 1,
        title: "50% OFF First Order",
        subtitle: "Max discount up to ₹150 on top partner restaurants",
        code: "CRAVELY50",
        badge: "HOT DEAL",
        icon: Percent,
        gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
        accent: "text-orange-500",
        expiry: "Ends in 2 days"
    },
    {
        id: 2,
        title: "Free Gourmet Dessert",
        subtitle: "Complimentary chef dessert on orders above ₹499",
        code: "SWEETWEEKEND",
        badge: "CHEF SPECIAL",
        icon: Gift,
        gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
        accent: "text-pink-500",
        expiry: "Limited stock"
    },
    {
        id: 3,
        title: "Zero Delivery Fee",
        subtitle: "Unlimited free express delivery on all orders",
        code: "FREEDEL",
        badge: "VIP PERK",
        icon: Truck,
        gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
        accent: "text-emerald-500",
        expiry: "Always active"
    },
    {
        id: 4,
        title: "20% Cashback",
        subtitle: "Instant cashback when paying with Cravely Pay",
        code: "CRAVEPAY",
        badge: "BANK OFFER",
        icon: Wallet,
        gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
        accent: "text-blue-500",
        expiry: "Valid today"
    }
];

const Offers = () => {
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <section className="py-14 sm:py-18 bg-bg-warm/60 dark:bg-[#1a1210] relative overflow-hidden">
            {/* Background Lighting Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-3">
                        <Flame className="w-4 h-4 text-primary animate-bounce" />
                        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary">
                            SPECIAL PROMOTIONS & DEALS
                        </span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-text-dark dark:text-[#f4f1ea] tracking-tight">
                        Exclusive Cravely <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-[#ff806b]">Offers</span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-[#a09a8e] max-w-lg mt-2 font-medium">
                        Apply discount promo codes at checkout to unlock savings on your favorite gourmet dishes.
                    </p>
                </motion.div>

                {/* Offers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {offersList.map((offer, idx) => {
                        const Icon = offer.icon;
                        const isCopied = copiedCode === offer.code;

                        return (
                            <motion.div
                                key={offer.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className={`relative bg-white dark:bg-[#2b1f1d] border border-gray-100 dark:border-[#3a2b27] rounded-3xl p-5 shadow-lg shadow-black/[0.03] dark:shadow-black/20 flex flex-col justify-between overflow-hidden group`}
                            >
                                {/* Gradient Hover Backdrop */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                <div>
                                    {/* Card Header Tag */}
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <div className={`w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#352723] flex items-center justify-center border border-gray-100 dark:border-[#4a3833] ${offer.accent}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[9px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                            {offer.badge}
                                        </span>
                                    </div>

                                    {/* Title & Subtitle */}
                                    <h3 className="font-serif text-lg font-bold text-text-dark dark:text-[#f4f1ea] leading-tight mb-1">
                                        {offer.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-[#a09a8e] leading-relaxed mb-5">
                                        {offer.subtitle}
                                    </p>
                                </div>

                                {/* Promo Code Box & Expiry */}
                                <div>
                                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 dark:bg-[#352723] border border-dashed border-gray-200 dark:border-[#4a3833] mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-mono uppercase text-gray-400 dark:text-[#7f796d]">PROMO CODE</span>
                                            <span className="text-sm font-mono font-extrabold text-primary tracking-wide">{offer.code}</span>
                                        </div>

                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleCopy(offer.code)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                                isCopied
                                                    ? 'bg-emerald-500 text-white shadow-sm'
                                                    : 'bg-white dark:bg-[#2b1f1d] border border-gray-200 dark:border-[#4a3833] text-gray-700 dark:text-[#e5e0d8] hover:border-primary hover:text-primary'
                                            }`}
                                        >
                                            {isCopied ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    Copy
                                                </>
                                            )}
                                        </motion.button>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-[#7f796d] font-mono">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-amber-500" />
                                            {offer.expiry}
                                        </span>
                                        <span>T&C Apply</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default Offers;
