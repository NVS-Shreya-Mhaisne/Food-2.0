import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreContext } from '../Context/StoreContext';
import { 
    X, 
    Tag, 
    Percent, 
    Gift, 
    Truck, 
    Wallet, 
    Sparkles, 
    Check, 
    ChevronDown, 
    ChevronUp, 
    Search,
    AlertCircle,
    Copy,
    Info,
    ArrowRight
} from 'lucide-react';

const iconMap = {
    cravely50: Percent,
    welcome100: Gift,
    freedel: Truck,
    sweet20: Sparkles,
    cravepay: Wallet,
    savemore: Tag
};

const CouponDrawer = ({ isOpen, onClose }) => {
    const { 
        AVAILABLE_COUPONS, 
        appliedCoupon, 
        applyCoupon, 
        removeCoupon, 
        getTotalCartAmount 
    } = useContext(StoreContext);

    const [inputCode, setInputCode] = useState('');
    const [feedback, setFeedback] = useState({ type: null, text: '' });
    const [expandedTerms, setExpandedTerms] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const subtotal = getTotalCartAmount();

    const handleApply = (couponOrCode) => {
        const res = applyCoupon(couponOrCode);
        if (res.success) {
            setFeedback({ type: 'success', text: res.message });
            setTimeout(() => {
                setFeedback({ type: null, text: '' });
                onClose();
            }, 1200);
        } else {
            setFeedback({ type: 'error', text: res.message });
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!inputCode.trim()) return;
        handleApply(inputCode.trim());
    };

    const toggleTerms = (id) => {
        setExpandedTerms(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredCoupons = AVAILABLE_COUPONS.filter(coupon => 
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                />

                <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
                    <motion.div 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="w-screen max-w-[415px] bg-[#FFFBF9] dark:bg-[#2b1f1d] shadow-2xl flex flex-col justify-between border-l border-gray-150 dark:border-[#3a2b27]"
                    >
                        <div className="p-4 border-b border-gray-150 dark:border-[#3a2b27] bg-white/70 dark:bg-[#352723]/60">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Tag className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h2 className="font-serif text-base font-bold text-text-dark dark:text-[#f4f1ea] leading-tight">
                                            Coupons & Offers
                                        </h2>
                                        <p className="text-[10px] text-gray-500 dark:text-[#a09a8e] leading-tight">
                                            Claim instant discount on this order
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-1.5 text-gray-400 hover:text-text-dark dark:hover:text-white rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={handleManualSubmit} className="relative flex items-center gap-1.5 mt-2">
                                <div className="relative flex-1">
                                    <input 
                                        type="text" 
                                        value={inputCode}
                                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                        placeholder="ENTER PROMO CODE"
                                        className="w-full bg-white dark:bg-[#221715] border border-gray-200 dark:border-[#4a3833] focus:border-primary text-xs font-mono font-extrabold uppercase px-3 py-2 rounded-xl text-text-dark dark:text-[#e5e0d8] placeholder:text-gray-400 outline-none tracking-wider shadow-2xs"
                                    />
                                    {inputCode && (
                                        <button 
                                            type="button" 
                                            onClick={() => setInputCode('')}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!inputCode.trim()}
                                    className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs shrink-0"
                                >
                                    APPLY
                                </button>
                            </form>

                            <div className="relative mt-2">
                                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search coupons..."
                                    className="w-full bg-gray-50 dark:bg-[#352723] border border-gray-200/70 dark:border-[#4a3833] text-[11px] pl-8 pr-3 py-1.5 rounded-lg text-text-dark dark:text-[#e5e0d8] placeholder:text-gray-400 outline-none"
                                />
                            </div>

                            {feedback.text && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-2 p-2 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 ${
                                        feedback.type === 'success' 
                                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                                    }`}
                                >
                                    {feedback.type === 'success' ? <Check className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                                    <span>{feedback.text}</span>
                                </motion.div>
                            )}
                        </div>

                        {/* 2. COUPONS LIST BODY (COMPACT) */}
                        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 no-scrollbar">
                            <div className="flex items-center justify-between pb-0.5">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-[#7f796d]">
                                    AVAILABLE OFFERS ({filteredCoupons.length})
                                </span>
                                <span className="text-[10px] font-mono text-primary font-bold">
                                    Cart: ₹{subtotal}
                                </span>
                            </div>

                            {filteredCoupons.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <Tag className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                                    <p className="text-xs font-medium">No coupons match your search</p>
                                </div>
                            ) : (
                                filteredCoupons.map((coupon) => {
                                    const IconComponent = iconMap[coupon.id] || Tag;
                                    const isApplied = appliedCoupon?.code === coupon.code;
                                    const isEligible = subtotal >= coupon.minAmount;
                                    const amountNeeded = coupon.minAmount - subtotal;
                                    const isTermsOpen = !!expandedTerms[coupon.id];

                                    return (
                                        <div 
                                            key={coupon.id}
                                            className={`relative rounded-xl border transition-all overflow-hidden ${
                                                isApplied
                                                    ? 'bg-emerald-500/5 border-emerald-500 dark:border-emerald-500/80 shadow-xs'
                                                    : isEligible
                                                    ? 'bg-white dark:bg-[#352723]/60 border-gray-200 dark:border-[#4a3833] hover:border-primary/50 shadow-2xs'
                                                    : 'bg-gray-50/70 dark:bg-[#251b19]/60 border-gray-200/60 dark:border-[#352926] opacity-85'
                                            }`}
                                        >
                                            {/* Top Badge Strip */}
                                            <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 dark:border-[#4a3833]/40 bg-gray-50/40 dark:bg-black/10">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                                        isApplied 
                                                            ? 'bg-emerald-500 text-white' 
                                                            : 'bg-primary/10 text-primary'
                                                    }`}>
                                                        <IconComponent className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                                                        {coupon.badge}
                                                    </span>
                                                </div>

                                                {/* Promo Code Box */}
                                                <div className="px-2 py-0.5 rounded bg-white dark:bg-[#221715] border border-dashed border-gray-300 dark:border-[#4a3833] font-mono text-[10px] font-black tracking-wider text-text-dark dark:text-[#f4f1ea]">
                                                    {coupon.code}
                                                </div>
                                            </div>

                                            {/* Card Content (Compact) */}
                                            <div className="p-3">
                                                <h3 className="font-serif text-sm font-bold text-text-dark dark:text-[#f4f1ea] leading-tight">
                                                    {coupon.title}
                                                </h3>
                                                <p className="text-[11px] text-gray-500 dark:text-[#a09a8e] mt-0.5 leading-snug">
                                                    {coupon.subtitle}
                                                </p>

                                                {/* Action Bar / Eligibility Status */}
                                                <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-[#4a3833]/40 flex items-center justify-between">
                                                    {!isEligible ? (
                                                        <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                                                            <Info className="w-3 h-3 shrink-0" />
                                                            <span>Add ₹{amountNeeded} more</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[9px] font-mono text-gray-400 dark:text-[#7f796d]">
                                                            {coupon.expiry}
                                                        </span>
                                                    )}

                                                    {isApplied ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                                                <Check className="w-3 h-3" /> APPLIED
                                                            </span>
                                                            <button 
                                                                onClick={removeCoupon}
                                                                className="text-[10px] text-rose-500 font-bold underline cursor-pointer hover:text-rose-600 ml-1"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            disabled={!isEligible}
                                                            onClick={() => handleApply(coupon)}
                                                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                                                isEligible 
                                                                    ? 'bg-primary hover:bg-primary-hover text-white shadow-xs' 
                                                                    : 'bg-gray-200 dark:bg-[#3d2e2a] text-gray-400 dark:text-[#665a57] cursor-not-allowed'
                                                            }`}
                                                        >
                                                            {isEligible ? 'APPLY' : 'LOCKED'}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Expandable Terms */}
                                                <div className="mt-1.5">
                                                    <button 
                                                        onClick={() => toggleTerms(coupon.id)}
                                                        className="text-[9px] font-mono text-gray-400 hover:text-primary dark:text-[#7f796d] flex items-center gap-0.5 cursor-pointer transition-colors"
                                                    >
                                                        <span>Terms</span>
                                                        {isTermsOpen ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                                                    </button>

                                                    {isTermsOpen && (
                                                        <motion.ul 
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="mt-1 space-y-0.5 pl-3 text-[9px] text-gray-500 dark:text-[#a09a8e] list-disc font-sans"
                                                        >
                                                            {coupon.terms.map((t, idx) => (
                                                                <li key={idx}>{t}</li>
                                                            ))}
                                                        </motion.ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* 3. DRAWER FOOTER SUMMARY (COMPACT) */}
                        <div className="p-3 border-t border-gray-150 dark:border-[#3a2b27] bg-white/80 dark:bg-[#352723]/70 flex items-center justify-between text-xs">
                            <div>
                                <p className="text-[9px] uppercase font-mono text-gray-400 dark:text-[#7f796d]">Cart Subtotal</p>
                                <p className="font-mono font-extrabold text-sm text-text-dark dark:text-[#f4f1ea]">₹{subtotal}</p>
                            </div>
                            {appliedCoupon ? (
                                <div className="text-right">
                                    <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase block">Active</span>
                                    <span className="font-mono font-bold text-xs text-primary">{appliedCoupon.code}</span>
                                </div>
                            ) : (
                                <span className="text-[10px] text-gray-500 dark:text-[#a09a8e] font-medium">Select a coupon</span>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default CouponDrawer;