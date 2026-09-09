import React, { useContext, useState } from 'react';
import { StoreContext } from '../../Components/Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Sparkles, CheckCircle2, ChevronRight, X, Percent, ArrowRight, ShoppingBag, Plus, Minus, Trash2, Truck, Lock } from 'lucide-react';
import CouponDrawer from '../../Components/Coupons/CouponDrawer';

const Cart = () => {
    const {
        cartItems,
        food_list,
        addToCart,
        removeFromCart,
        deleteFromCart,
        getTotalCartAmount,
        url,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        getDeliveryFee,
        getPlatformFee,
        getRestaurantFee,
        getGstAndTax,
        getDiscountAmount,
        getFinalTotal,
        AVAILABLE_COUPONS,
        token,
        openAuthModal
    } = useContext(StoreContext);

    const navigate = useNavigate();
    const [promoInput, setPromoInput] = useState('');
    const [promoMessage, setPromoMessage] = useState({ type: null, text: '' });
    const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);

    const hasCartItems = Object.values(cartItems || {}).some(qty => qty > 0);
    const subtotal = getTotalCartAmount();
    const deliveryFee = getDeliveryFee();
    const platformFee = getPlatformFee ? getPlatformFee() : (subtotal > 0 ? 30 : 0);
    const restaurantFee = getRestaurantFee ? getRestaurantFee() : (subtotal > 0 ? 20 : 0);
    const gstAndTax = getGstAndTax ? getGstAndTax() : (subtotal > 0 ? 20 : 0);
    const discountAmount = getDiscountAmount();
    const finalTotal = getFinalTotal();

    const freeDeliveryThreshold = 500;
    const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
    const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
    const isFreeDelivery = subtotal > 500 || (appliedCoupon && appliedCoupon.discountType === 'freedelivery');

    const handleApplyPromo = (e) => {
        e.preventDefault();
        if (!promoInput.trim()) return;
        const res = applyCoupon(promoInput.trim());
        if (res.success) {
            setPromoMessage({ type: 'success', text: res.message });
            setPromoInput('');
        } else {
            setPromoMessage({ type: 'error', text: res.message });
        }
    };

    const handleProceedToCheckout = () => {
        if (!token) {
            if (openAuthModal) {
                openAuthModal({
                    mode: 'login',
                    title: 'Sign In to Proceed to Payment',
                    subtitle: 'Please sign in or create an account to proceed with your order. Your cart items will remain safely in your bag!',
                    onSuccess: () => navigate('/Order')
                });
            } else {
                navigate('/Order');
            }
        } else {
            navigate('/Order');
        }
    };

    return (
        <div className='w-[90%] sm:w-[85%] lg:w-[80%] mx-auto py-10 min-h-[65vh] font-sans'>

            {/* PAGE TITLE */}
            <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-text-dark dark:text-[#f4f1ea] tracking-tight">
                    Your Shopping Cart
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
                    Review your items, apply discount coupons & proceed to order
                </p>
            </motion.div>

            {!hasCartItems ? (
                /* EMPTY CART STATE */
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#2b1f1d] rounded-3xl border border-gray-150 dark:border-[#3a2b27] shadow-xl text-center px-4"
                >
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-text-dark dark:text-[#f4f1ea] mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-[#a09a8e] max-w-sm mb-6 font-medium">
                        Looks like you haven't added any delicious items to your cart yet.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center gap-2"
                    >
                        <span>Explore Menu</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            ) : (
                <>
                    {/* FREE DELIVERY ALERT / PROGRESS BANNER */}
                    {isFreeDelivery ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-4 shadow-sm"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
                                    <Truck className="w-5 h-5 animate-bounce" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-serif font-black text-emerald-800 dark:text-emerald-300 text-sm sm:text-base">
                                            🎉 Woohoo! Free Delivery Unlocked!
                                        </span>
                                        <span className="text-[10px] font-mono font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                            Saved ₹40
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-[#d3cfc4] mt-0.5 font-medium">
                                        Your order is above ₹500. We've waived your ₹40 express delivery charge!
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>100% Free Delivery</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#2b1f1d] border border-amber-500/30 dark:border-amber-500/20 shadow-md shadow-amber-500/5 relative overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-bold text-text-dark dark:text-[#f4f1ea]">
                                            Add items worth <span className="text-amber-500 font-mono font-extrabold text-sm sm:text-base">₹{amountForFreeDelivery}</span> more to unlock <span className="text-emerald-500 font-black uppercase">FREE DELIVERY</span>!
                                        </p>
                                        <p className="text-[11px] text-gray-500 dark:text-[#a09a8e]">
                                            All orders above ₹500 get completely free doorstep delivery.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/')}
                                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-700 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
                                >
                                    + Add More Food
                                </button>
                            </div>

                            {/* Animated Progress Bar */}
                            <div className="w-full h-2.5 bg-gray-100 dark:bg-[#3d2e2a] rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-amber-500 via-primary to-emerald-500 rounded-full"
                                />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 dark:text-[#7f796d] mt-1.5">
                                <span>₹0</span>
                                <span className="font-bold text-primary">₹{subtotal} / ₹500 ({progressPercent}%)</span>
                                <span>₹500 for FREE Delivery</span>
                            </div>
                        </motion.div>
                    )}

                    {/* ITEMS TABLE */}
                    <div className="bg-white dark:bg-[#2b1f1d] p-5 sm:p-7 rounded-3xl border border-gray-150 dark:border-[#3a2b27] shadow-lg shadow-black/[0.03] overflow-x-auto">
                        <div className="grid grid-cols-[1fr_1.5fr_1fr_1.2fr_1fr_0.5fr] items-center text-xs font-semibold text-gray-400 dark:text-[#7f796d] pb-3 font-mono uppercase tracking-wider border-b border-gray-100 dark:border-[#3a2b27] min-w-[600px]">
                            <p>Items</p>
                            <p>Title</p>
                            <p>Price</p>
                            <p>Quantity</p>
                            <p>Total</p>
                            <p className="text-right">Remove</p>
                        </div>

                        {food_list.map((item) => {
                            if (cartItems[item._id] > 0) {
                                return (
                                    <div key={item._id} className="min-w-[600px]">
                                        <div className='grid grid-cols-[1fr_1.5fr_1fr_1.2fr_1fr_0.5fr] items-center text-xs sm:text-sm text-text-dark dark:text-[#f4f1ea] py-4 font-medium'>
                                            <img
                                                className="w-14 h-14 object-cover rounded-2xl border border-gray-200 dark:border-[#3a2b27] shadow-sm"
                                                src={item.image.startsWith('http') ? item.image : `${url}/images/${item.image}`}
                                                alt={item.name}
                                            />
                                            <p className="font-serif font-bold text-sm sm:text-base pr-2">{item.name}</p>
                                            <p className="font-mono text-gray-600 dark:text-[#d3cfc4]">₹{item.price}</p>
                                            
                                            {/* QUANTITY CONTROL: ADD / REMOVE BUTTONS */}
                                            <div className="flex items-center">
                                                <div className="inline-flex items-center bg-gray-100 dark:bg-[#352723] rounded-xl p-1 border border-gray-200/80 dark:border-[#45332e] shadow-xs gap-1.5">
                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-white dark:bg-[#2b1f1d] text-gray-700 dark:text-[#f4f1ea] hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white active:scale-90 transition-all cursor-pointer shadow-xs"
                                                        title="Decrease quantity"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                    </button>
                                                    <span className="min-w-[20px] text-center font-mono font-bold text-xs sm:text-sm text-text-dark dark:text-[#f4f1ea] px-1">
                                                        {cartItems[item._id]}
                                                    </span>
                                                    <button
                                                        onClick={() => addToCart(item._id)}
                                                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-white dark:bg-[#2b1f1d] text-gray-700 dark:text-[#f4f1ea] hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white active:scale-90 transition-all cursor-pointer shadow-xs"
                                                        title="Increase quantity"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="font-mono font-extrabold text-primary">₹{item.price * cartItems[item._id]}</p>
                                            
                                            {/* FULL ITEM REMOVE BUTTON */}
                                            <div className="text-right">
                                                <button
                                                    onClick={() => (deleteFromCart ? deleteFromCart(item._id) : removeFromCart(item._id))}
                                                    className='p-2 rounded-xl text-gray-400 dark:text-[#7f796d] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer font-bold transition-all inline-flex items-center justify-center'
                                                    title="Remove item completely"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <hr className="border-t border-gray-100 dark:border-[#3a2b27]/60" />
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* CART BOTTOM CONTROLS: CART TOTALS & COMPACT PROMO / COUPON BOX */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                        {/* LEFT COLUMN: DETAILED BILL SUMMARY */}
                        <div className="md:col-span-7 bg-white dark:bg-[#2b1f1d] p-5 sm:p-7 rounded-3xl border border-gray-150 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20 flex flex-col justify-between">
                            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-dark dark:text-[#f4f1ea] border-b border-gray-100 dark:border-[#3a2b27] pb-3 mb-4">
                                Bill Details
                            </h2>

                            <div className="flex flex-col gap-3 text-xs sm:text-sm text-gray-600 dark:text-[#a09a8e]">
                                {/* Subtotal */}
                                <div className="flex justify-between items-center">
                                    <p>Item Total</p>
                                    <p className="font-mono font-bold text-text-dark dark:text-[#f4f1ea]">₹{subtotal}</p>
                                </div>

                                {/* Delivery Fee */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <p>Delivery Fee</p>
                                        {subtotal > 500 && (
                                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                                Free above ₹500
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-mono font-bold">
                                        {deliveryFee === 0 ? (
                                            <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                                                <span className="line-through text-gray-400 text-xs font-normal">₹40</span> FREE
                                            </span>
                                        ) : (
                                            `₹${deliveryFee}`
                                        )}
                                    </p>
                                </div>

                                {/* Platform Fee */}
                                <div className="flex justify-between items-center">
                                    <p>Platform Fee</p>
                                    <p className="font-mono font-bold text-text-dark dark:text-[#f4f1ea]">₹{platformFee}</p>
                                </div>

                                {/* Restaurant Fee */}
                                <div className="flex justify-between items-center">
                                    <p>Restaurant Packaging & Handling Fee</p>
                                    <p className="font-mono font-bold text-text-dark dark:text-[#f4f1ea]">₹{restaurantFee}</p>
                                </div>

                                {/* GST and Taxes */}
                                <div className="flex justify-between items-center">
                                    <p>GST & Restaurant Taxes</p>
                                    <p className="font-mono font-bold text-text-dark dark:text-[#f4f1ea]">₹{gstAndTax}</p>
                                </div>

                                {/* DISCOUNT APPLIED ROW */}
                                {discountAmount > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            <span>Coupon Discount ({appliedCoupon.code})</span>
                                        </div>
                                        <span className="font-mono font-extrabold">-₹{discountAmount}</span>
                                    </motion.div>
                                )}

                                <hr className="border-t border-gray-200/60 dark:border-[#3a2b27] my-1" />

                                <div className="flex justify-between text-base font-bold text-text-dark dark:text-[#f4f1ea] items-center pt-1">
                                    <span>To Pay</span>
                                    <span className="font-serif font-black text-primary text-2xl">
                                        ₹{finalTotal}
                                    </span>
                                </div>
                            </div>

                            {!token && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300 font-medium"
                                >
                                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                    <span>
                                        Sign in required to proceed to payment. <strong className="font-bold">Your cart will be kept intact!</strong>
                                    </span>
                                </motion.div>
                            )}

                            <button
                                onClick={handleProceedToCheckout}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary/20 cursor-pointer mt-4 flex items-center justify-center gap-2"
                            >
                                <span>{token ? "PROCEED TO CHECKOUT" : "SIGN IN & PROCEED TO CHECKOUT"}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* RIGHT COLUMN: COMPACT PROMO CODE & VIEW COUPONS BOX */}
                        <div className="md:col-span-5 bg-white dark:bg-[#2b1f1d] p-4 sm:p-5 rounded-3xl border border-gray-150 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20 flex flex-col justify-between space-y-3.5">

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-serif text-base font-bold text-text-dark dark:text-[#f4f1ea] flex items-center gap-1.5">
                                        <Tag className="w-4 h-4 text-primary" />
                                        <span>Coupons & Offers</span>
                                    </h3>
                                    <span className="text-[9px] font-mono font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 uppercase">
                                        OFFERS
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 dark:text-[#a09a8e]">
                                    Apply coupons for extra savings
                                </p>
                            </div>

                            {/* APPLIED COUPON STATUS CARD */}
                            {appliedCoupon ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-1.5 relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <div>
                                                <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                                                    {appliedCoupon.code}
                                                </span>
                                                <p className="text-[10px] text-gray-600 dark:text-[#d3cfc4] font-medium">
                                                    {appliedCoupon.title}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-xs text-rose-500 hover:text-rose-600 font-bold underline cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="pt-1.5 border-t border-emerald-500/20 flex items-center justify-between text-[10px]">
                                        <span className="text-emerald-700 dark:text-emerald-300 font-bold font-mono">
                                            {appliedCoupon.discountType === 'freedelivery'
                                                ? 'Saved Delivery Fee!'
                                                : `Saved ₹${discountAmount}!`}
                                        </span>
                                        <button
                                            onClick={() => setIsCouponDrawerOpen(true)}
                                            className="text-primary hover:underline font-bold"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                /* MANUAL PROMO FORM (COMPACT) */
                                <form onSubmit={handleApplyPromo} className="space-y-2">
                                    <div className='flex items-center bg-bg-warm dark:bg-[#352723] rounded-xl overflow-hidden border border-gray-200 dark:border-[#4a3833] focus-within:border-primary transition-colors p-0.5'>
                                        <input
                                            type="text"
                                            value={promoInput}
                                            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                            placeholder='ENTER PROMO CODE'
                                            className="w-full bg-transparent border-none outline-none px-3 py-2 text-xs font-mono font-bold text-text-dark dark:text-[#e5e0d8] placeholder:text-gray-400 uppercase tracking-wider"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!promoInput.trim()}
                                            className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs"
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    {promoMessage.text && (
                                        <p className={`text-[11px] font-semibold ${promoMessage.type === 'success' ? 'text-emerald-500' : 'text-rose-500'
                                            }`}>
                                            {promoMessage.text}
                                        </p>
                                    )}
                                </form>
                            )}

                            {/* COMPACT VIEW COUPONS BUTTON */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setIsCouponDrawerOpen(true)}
                                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 border border-primary/20 hover:border-primary/50 text-text-dark dark:text-[#f4f1ea] flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-[10px] font-bold text-primary uppercase font-mono block leading-tight">
                                            {AVAILABLE_COUPONS.length} Coupons Available
                                        </span>
                                        <p className="text-xs font-serif font-bold text-text-dark dark:text-[#f4f1ea] leading-tight">
                                            Browse Offers & Deals
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                            </motion.button>

                        </div>

                    </div>
                </>
            )}

            {/* SWIGGY/ZEPTO STYLE COUPON DRAWER SLIDE-OVER */}
            <CouponDrawer
                isOpen={isCouponDrawerOpen}
                onClose={() => setIsCouponDrawerOpen(false)}
            />

        </div>
    );
};

export default Cart;
