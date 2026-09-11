import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, Plus, Minus, ShoppingBag, Flame, Sparkles, Check, Send, Award, Clock } from 'lucide-react';
import { StoreContext } from '../Context/StoreContext';

const FoodDetailsModal = ({ item, isOpen, onClose }) => {
    const { cartItems, addToCart, removeFromCart, likedFoods, toggleLikeFood, url } = useContext(StoreContext);
    const [selectedTab, setSelectedTab] = useState('overview'); // 'overview' | 'nutrition' | 'reviews'
    const [userRating, setUserRating] = useState(5);
    const [userReviewText, setUserReviewText] = useState('');
    const [reviews, setReviews] = useState([
        { id: 1, name: "Sarah M.", rating: 5, date: "2 days ago", comment: "Absolutely divine! The truffle flavor was perfectly balanced and crust was crispy." },
        { id: 2, name: "Alex K.", rating: 4, date: "1 week ago", comment: "Super fresh ingredients and delivered super hot. Highly recommend!" }
    ]);

    if (!isOpen || !item) return null;

    const itemCount = cartItems[item._id] || 0;
    const isLiked = likedFoods?.[item._id] || false;

    const handleAddReview = (e) => {
        e.preventDefault();
        if (userReviewText.trim()) {
            setReviews([
                { id: Date.now(), name: "Cravely Gourmet", rating: userRating, date: "Just now", comment: userReviewText },
                ...reviews
            ]);
            setUserReviewText('');
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative w-full max-w-2xl bg-white dark:bg-[#2b1f1d] border border-gray-100 dark:border-[#3a2b27] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Floating Header Actions */}
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                        <button
                            onClick={() => toggleLikeFood(item._id)}
                            className="p-2.5 rounded-full bg-white/90 dark:bg-[#2b1f1d]/90 backdrop-blur-md text-gray-600 dark:text-[#f4f1ea] hover:text-rose-500 transition-colors shadow-md cursor-pointer"
                            title={isLiked ? "Unlike dish" : "Like dish"}
                        >
                            <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-full bg-white/90 dark:bg-[#2b1f1d]/90 backdrop-blur-md text-gray-600 dark:text-[#f4f1ea] hover:text-primary transition-colors shadow-md cursor-pointer"
                        >
                            <X className="w-4.5 h-4.5" />
                        </button>
                    </div>

                    {/* Top Image Banner */}
                    <div className="relative h-56 sm:h-64 w-full bg-gradient-to-b from-black/40 to-transparent flex-shrink-0">
                        <img
                            src={item.image ? (item.image.startsWith('http') ? item.image : `${url}/images/${item.image}`) : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
                            }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Title & Tag Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 text-left">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-primary text-white shadow-sm">
                                    {item.category || 'Gourmet Special'}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                    🌱 Organic & Fresh
                                </span>
                            </div>

                            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                                {item.name}
                            </h2>
                        </div>
                    </div>

                    {/* Modal Body Tabs & Details */}
                    <div className="p-6 overflow-y-auto flex-1 no-scrollbar">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#3a2b27] pb-3 mb-5">
                            {['overview', 'nutrition', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-serif font-bold capitalize transition-all cursor-pointer ${
                                        selectedTab === tab
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-gray-500 dark:text-[#a09a8e] hover:bg-gray-100 dark:hover:bg-[#352723]'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Overview Tab Content */}
                        {selectedTab === 'overview' && (
                            <div className="space-y-5">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d3cfc4] leading-relaxed font-sans">
                                    {item.description || 'Crafted with artisanal passion using locally sourced organic ingredients, prepared fresh to order by executive gourmet chefs.'}
                                </p>

                                {/* Ingredients List */}
                                <div>
                                    <h4 className="text-xs font-mono font-bold uppercase text-gray-400 dark:text-[#7f796d] mb-2.5 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-primary" /> Key Ingredients
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Truffle Oil', 'Wild Mushrooms', 'Aged Mozzarella', 'Fresh Basil', 'Garlic Butter', 'Extra Virgin Olive Oil'].map((ing, idx) => (
                                            <span key={idx} className="text-xs font-medium px-3 py-1 rounded-xl bg-gray-50 dark:bg-[#352723] border border-gray-200/80 dark:border-[#4a3833] text-text-dark dark:text-[#e5e0d8]">
                                                {ing}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Nutrition Info Tab Content */}
                        {selectedTab === 'nutrition' && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-mono font-bold uppercase text-gray-400 dark:text-[#7f796d] mb-3">Nutritional Values (Per Serving)</h4>
                                <div className="grid grid-cols-4 gap-3 text-center">
                                    <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                                        <p className="text-sm font-extrabold text-orange-500 font-mono">480</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">Calories</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                        <p className="text-sm font-extrabold text-emerald-500 font-mono">18g</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">Protein</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                        <p className="text-sm font-extrabold text-blue-500 font-mono">52g</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">Carbs</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20">
                                        <p className="text-sm font-extrabold text-pink-500 font-mono">14g</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">Fats</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab Content */}
                        {selectedTab === 'reviews' && (
                            <div className="space-y-4">
                                {/* Add Review Form */}
                                <form onSubmit={handleAddReview} className="p-3 rounded-2xl bg-gray-50 dark:bg-[#352723] border border-gray-150 dark:border-[#4a3833] flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-text-dark dark:text-[#f4f1ea]">Write a Review</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} type="button" onClick={() => setUserRating(star)}>
                                                    <Star className={`w-4 h-4 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Share your thoughts on this dish..."
                                            value={userReviewText}
                                            onChange={(e) => setUserReviewText(e.target.value)}
                                            className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#3a2b27] bg-white dark:bg-[#2b1f1d] text-xs focus:outline-none"
                                        />
                                        <button type="submit" className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1">
                                            <Send className="w-3 h-3" /> Post
                                        </button>
                                    </div>
                                </form>

                                {/* Reviews List */}
                                <div className="space-y-3">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="p-3 rounded-2xl border border-gray-100 dark:border-[#3a2b27] bg-white dark:bg-[#2b1f1d]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-text-dark dark:text-[#f4f1ea]">{rev.name}</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    <span className="text-xs font-mono font-bold">{rev.rating}.0</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-[#a09a8e]">{rev.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Action Footer (Price & Add to Cart) */}
                    <div className="p-4 sm:p-5 bg-gray-50/80 dark:bg-[#352723]/80 border-t border-gray-100 dark:border-[#3a2b27] flex items-center justify-between gap-4 flex-shrink-0">
                        <div>
                            <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">PRICE</span>
                            <span className="font-serif text-2xl font-black text-primary">${item.price}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {itemCount > 0 ? (
                                <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                                    <button onClick={() => removeFromCart(item._id)} className="p-1 rounded-lg hover:bg-primary/20 cursor-pointer">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-mono font-extrabold">{itemCount}</span>
                                    <button onClick={() => addToCart(item._id)} className="p-1 rounded-lg hover:bg-primary/20 cursor-pointer">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addToCart(item._id)}
                                    className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
                                >
                                    <ShoppingBag className="w-4 h-4" /> Add to Order
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FoodDetailsModal;
