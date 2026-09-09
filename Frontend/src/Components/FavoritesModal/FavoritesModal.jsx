import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Plus, Minus, MapPin, Clock, Star, Utensils, Store } from 'lucide-react';
import { StoreContext } from '../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const FavoritesModal = ({ isOpen, onClose }) => {
    const { 
        likedFoods, 
        likedRestaurants, 
        toggleLikeFood, 
        toggleLikeRestaurant, 
        food_list, 
        restaurants_list, 
        addToCart, 
        removeFromCart, 
        cartItems, 
        url 
    } = useContext(StoreContext);

    const [activeTab, setActiveTab] = useState('dishes'); // 'dishes' | 'restaurants'
    const navigate = useNavigate();

    if (!isOpen) return null;

    // Filter liked foods and liked restaurants
    const favoriteFoods = (food_list || []).filter(item => likedFoods?.[item._id] || likedFoods?.[item.id]);
    
    // Also include any restaurant entries matching likedRestaurants IDs
    const favoriteRestaurants = (restaurants_list || []).filter(rest => likedRestaurants?.[rest._id] || likedRestaurants?.[rest.id]);

    const totalCount = favoriteFoods.length + favoriteRestaurants.length;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.93, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 20 }}
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    className="relative w-full max-w-2xl bg-[#FFFBF9] dark:bg-[#2b1f1d] border border-gray-200/80 dark:border-[#3a2b27] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-150 dark:border-[#3a2b27] flex items-center justify-between bg-white/60 dark:bg-[#352723]/60">
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-text-dark dark:text-[#f4f1ea]">
                                Your Favorites
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-[#a09a8e]">
                                All your saved dishes & bookmarked restaurants in one place
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#43322d] text-gray-500 dark:text-[#a09a8e] transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center gap-2 px-6 pt-4 border-b border-gray-150 dark:border-[#3a2b27]">
                        <button
                            onClick={() => setActiveTab('dishes')}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-serif transition-all cursor-pointer ${
                                activeTab === 'dishes'
                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                    : 'text-gray-600 dark:text-[#a09a8e] hover:bg-gray-100 dark:hover:bg-[#352723]'
                            }`}
                        >
                            <Utensils className="w-3.5 h-3.5" />
                            <span>Liked Dishes</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('restaurants')}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-serif transition-all cursor-pointer ${
                                activeTab === 'restaurants'
                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                    : 'text-gray-600 dark:text-[#a09a8e] hover:bg-gray-100 dark:hover:bg-[#352723]'
                            }`}
                        >
                            <Store className="w-3.5 h-3.5" />
                            <span>Liked Restaurants</span>
                        </button>
                    </div>

                    {/* Content List */}
                    <div className="p-6 overflow-y-auto flex-1 no-scrollbar space-y-4">
                        {activeTab === 'dishes' ? (
                            favoriteFoods.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {favoriteFoods.map((item) => {
                                        const count = cartItems[item._id] || 0;
                                        const imageSrc = item.image.startsWith('http') ? item.image : `${url}/images/${item.image}`;

                                        return (
                                            <div
                                                key={item._id}
                                                className="bg-white dark:bg-[#352723] p-3.5 rounded-2xl border border-gray-100 dark:border-[#4a3833] flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-shadow group relative"
                                            >
                                                {/* Dish Image */}
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                                    <img
                                                        src={imageSrc}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                </div>

                                                {/* Dish Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-serif text-sm font-bold text-text-dark dark:text-[#f4f1ea] truncate">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[11px] font-mono font-bold text-primary">
                                                        ₹ {item.price}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 dark:text-[#8c8477] truncate mt-0.5">
                                                        {item.category}
                                                    </p>
                                                </div>

                                                {/* Actions: Unlike & Cart */}
                                                <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                                                    <button
                                                        onClick={() => toggleLikeFood(item._id)}
                                                        className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                                                        title="Remove from favorites"
                                                    >
                                                        <Heart className="w-4 h-4 fill-current" />
                                                    </button>

                                                    {count === 0 ? (
                                                        <button
                                                            onClick={() => addToCart(item._id)}
                                                            className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-bold shadow-xs cursor-pointer"
                                                        >
                                                            Add
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 bg-primary text-white rounded-lg px-2 py-0.5 text-xs font-mono font-bold">
                                                            <button onClick={() => removeFromCart(item._id)} className="cursor-pointer">
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span>{count}</span>
                                                            <button onClick={() => addToCart(item._id)} className="cursor-pointer">
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 space-y-3">
                                    <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                                        <Heart className="w-7 h-7" />
                                    </div>
                                    <h4 className="font-serif text-lg font-bold text-text-dark dark:text-[#f4f1ea]">
                                        No Liked Dishes Yet
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-[#a09a8e] max-w-sm mx-auto">
                                        Tap the heart icon on any dish across the menu to save your favorite meals here!
                                    </p>
                                </div>
                            )
                        ) : (
                            favoriteRestaurants.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {favoriteRestaurants.map((rest) => {
                                        const restId = rest._id || rest.id;
                                        const restImage = rest.image 
                                            ? (rest.image.startsWith('http') ? rest.image : `${url}/images/${rest.image}`)
                                            : "";

                                        return (
                                            <div
                                                key={restId}
                                                className="bg-white dark:bg-[#352723] p-3.5 rounded-2xl border border-gray-100 dark:border-[#4a3833] flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition-shadow group relative"
                                            >
                                                <div className="flex gap-3 items-center">
                                                    <img
                                                        src={restImage}
                                                        alt={rest.name}
                                                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-serif text-sm font-bold text-text-dark dark:text-[#f4f1ea] truncate">
                                                                {rest.name}
                                                            </h4>
                                                            <button
                                                                onClick={() => toggleLikeRestaurant(restId)}
                                                                className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer shrink-0"
                                                                title="Remove from favorites"
                                                            >
                                                                <Heart className="w-4 h-4 fill-current" />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5 font-mono">
                                                            <Star className="w-3.5 h-3.5 fill-current" />
                                                            <span>{rest.rating || 4.5}</span>
                                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="text-gray-500 dark:text-[#a09a8e]">{rest.deliveryTime || "20-30 mins"}</span>
                                                        </div>

                                                        <p className="text-[10px] text-gray-400 dark:text-[#8c8477] truncate mt-1">
                                                            {rest.priceRange || rest.cuisine || "Gourmet Outlet"} • {rest.location || "City"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        onClose();
                                                        navigate(`/restaurant/${restId}`);
                                                    }}
                                                    className="w-full py-1.5 rounded-xl bg-gray-50 dark:bg-[#2b1f1d] hover:bg-primary hover:text-white border border-gray-200/60 dark:border-[#4a3833] text-[11px] font-bold text-text-dark dark:text-[#f4f1ea] transition-colors cursor-pointer"
                                                >
                                                    View Restaurant Menu
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 space-y-3">
                                    <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                                        <Store className="w-7 h-7" />
                                    </div>
                                    <h4 className="font-serif text-lg font-bold text-text-dark dark:text-[#f4f1ea]">
                                        No Liked Restaurants Yet
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-[#a09a8e] max-w-sm mx-auto">
                                        Tap the heart icon on any restaurant card to bookmark your top spots!
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FavoritesModal;
