import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreContext } from '../../Components/Context/StoreContext';
import { MapPin, CreditCard, Wallet, Banknote, CheckCircle2, ShieldCheck, ArrowRight, Tag, Lock, ChevronRight, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ onOrderPlaced }) => {
    const navigate = useNavigate();
    const { cartItems, food_list, getTotalCartAmount, token, openAuthModal } = useContext(StoreContext);
    const [selectedAddress, setSelectedAddress] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'razorpay' | 'cod' | 'wallet'
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const subtotal = getTotalCartAmount();
    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = subtotal > 30 || subtotal === 0 ? 0 : 3.99;
    const grandTotal = Math.max(0, subtotal + tax + deliveryFee - appliedDiscount);

    const addresses = [
        { id: 1, label: 'Home', address: '742 Evergreen Terrace, New York, NY 10001', isDefault: true },
        { id: 2, label: 'Work', address: '350 5th Ave, Empire State Building, NY 10118', isDefault: false }
    ];

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (couponCode.toUpperCase() === 'CRAVELY50') {
            setAppliedDiscount(Math.min(15, subtotal * 0.5));
            setCouponMessage('50% OFF Promo Applied!');
        } else if (couponCode.toUpperCase() === 'FREEDEL') {
            setAppliedDiscount(deliveryFee);
            setCouponMessage('Free Delivery Applied!');
        } else {
            setCouponMessage('Invalid promo code');
        }
    };

    const handlePlaceOrder = () => {
        if (!token) {
            if (openAuthModal) {
                openAuthModal({
                    mode: 'login',
                    title: 'Sign In to Complete Order',
                    subtitle: 'Sign in to complete payment. Your cart items are preserved!',
                    onSuccess: () => {}
                });
            }
            return;
        }

        setIsPlacingOrder(true);
        setTimeout(() => {
            setIsPlacingOrder(false);
            if (onOrderPlaced) onOrderPlaced();
            navigate('/myorders');
        }, 1500);
    };

    return (
        <div className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto py-8 font-sans">
            {/* Page Title */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-text-dark dark:text-[#f4f1ea]">
                    Checkout & Payment
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
                    Review your order, select delivery location & payment option
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: Delivery Address & Payment Methods */}
                <div className="lg:col-span-7 space-y-6">

                    {/* 1. Delivery Address Selector */}
                    <div className="bg-white dark:bg-[#2b1f1d] border border-gray-150 dark:border-[#3a2b27] rounded-3xl p-6 shadow-lg shadow-black/[0.03]">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="w-4.5 h-4.5" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-text-dark dark:text-[#f4f1ea]">
                                1. Delivery Address
                            </h3>
                        </div>

                        <div className="grid gap-3">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddress(addr.id)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                        selectedAddress === addr.id
                                            ? 'bg-primary/5 border-primary shadow-xs'
                                            : 'border-gray-200 dark:border-[#3a2b27] bg-gray-50/50 dark:bg-[#352723]/50'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                                        selectedAddress === addr.id ? 'border-primary bg-primary' : 'border-gray-300'
                                    }`}>
                                        {selectedAddress === addr.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold font-mono text-primary uppercase">{addr.label}</span>
                                        <p className="text-xs text-gray-600 dark:text-[#d3cfc4] mt-0.5 font-medium">{addr.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Payment Method Selector */}
                    <div className="bg-white dark:bg-[#2b1f1d] border border-gray-150 dark:border-[#3a2b27] rounded-3xl p-6 shadow-lg shadow-black/[0.03]">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <CreditCard className="w-4.5 h-4.5" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-text-dark dark:text-[#f4f1ea]">
                                2. Payment Gateway
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Stripe Option */}
                            <div
                                onClick={() => setPaymentMethod('stripe')}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                                    paymentMethod === 'stripe' ? 'bg-indigo-500/10 border-indigo-500 shadow-xs' : 'border-gray-200 dark:border-[#3a2b27]'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">S</div>
                                <div>
                                    <p className="text-xs font-bold text-text-dark dark:text-[#f4f1ea]">Stripe Card</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Credit / Debit Card</p>
                                </div>
                            </div>

                            {/* Razorpay Option */}
                            <div
                                onClick={() => setPaymentMethod('razorpay')}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                                    paymentMethod === 'razorpay' ? 'bg-blue-500/10 border-blue-500 shadow-xs' : 'border-gray-200 dark:border-[#3a2b27]'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">R</div>
                                <div>
                                    <p className="text-xs font-bold text-text-dark dark:text-[#f4f1ea]">Razorpay UPI</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Google Pay / PhonePe</p>
                                </div>
                            </div>

                            {/* Wallet Option */}
                            <div
                                onClick={() => setPaymentMethod('wallet')}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                                    paymentMethod === 'wallet' ? 'bg-primary/10 border-primary shadow-xs' : 'border-gray-200 dark:border-[#3a2b27]'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs"><Wallet className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs font-bold text-text-dark dark:text-[#f4f1ea]">Cravely Wallet</p>
                                    <p className="text-[10px] text-emerald-500 font-mono font-bold">Balance: $145.00</p>
                                </div>
                            </div>

                            {/* Cash on Delivery Option */}
                            <div
                                onClick={() => setPaymentMethod('cod')}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                                    paymentMethod === 'cod' ? 'bg-amber-500/10 border-amber-500 shadow-xs' : 'border-gray-200 dark:border-[#3a2b27]'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs"><Banknote className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs font-bold text-text-dark dark:text-[#f4f1ea]">Cash on Delivery</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Pay when delivered</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Order Summary & Checkout Action */}
                <div className="lg:col-span-5 bg-white dark:bg-[#2b1f1d] border border-gray-150 dark:border-[#3a2b27] rounded-3xl p-6 shadow-xl shadow-black/[0.03] space-y-5">
                    <h3 className="font-serif text-lg font-bold text-text-dark dark:text-[#f4f1ea] border-b border-gray-100 dark:border-[#3a2b27] pb-3">
                        Order Summary
                    </h3>

                    {/* Coupon Form */}
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Promo Code (e.g. CRAVELY50)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#3a2b27] bg-gray-50 dark:bg-[#352723] text-xs uppercase font-mono focus:outline-none"
                        />
                        <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">
                            Apply
                        </button>
                    </form>
                    {couponMessage && (
                        <p className={`text-[11px] font-mono font-bold ${appliedDiscount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {couponMessage}
                        </p>
                    )}

                    {/* Breakdown List */}
                    <div className="space-y-2.5 text-xs text-gray-600 dark:text-[#d3cfc4]">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes & Restaurant Charge (5%)</span>
                            <span className="font-mono font-bold">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Express Delivery Fee</span>
                            <span className="font-mono font-bold">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                        </div>
                        {appliedDiscount > 0 && (
                            <div className="flex justify-between text-emerald-500 font-bold">
                                <span>Discount</span>
                                <span className="font-mono">-${appliedDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-gray-100 dark:border-[#3a2b27] flex justify-between text-base font-bold text-text-dark dark:text-[#f4f1ea]">
                            <span>Total Payable</span>
                            <span className="font-serif text-xl text-primary font-black">${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder}
                        className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isPlacingOrder ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                <span>Place Order • ${grandTotal.toFixed(2)}</span>
                            </>
                        )}
                    </motion.button>

                    <div className="text-center text-[10px] text-gray-400 font-mono flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Encrypted & Secured by 256-bit SSL</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
