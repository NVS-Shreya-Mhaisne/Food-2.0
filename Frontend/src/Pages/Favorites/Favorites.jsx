import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Plus, Minus, MapPin, Clock, Star, Utensils, Store } from 'lucide-react';
import { StoreContext } from '../../Components/Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
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

  const [activeTab, setActiveTab] = useState('dishes'); 
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const favoriteFoods = (food_list || []).filter(item => likedFoods?.[item._id] || likedFoods?.[item.id]);
  const favoriteRestaurants = (restaurants_list || []).filter(rest => likedRestaurants?.[rest._id] || likedRestaurants?.[rest.id]);

  const totalCount = favoriteFoods.length + favoriteRestaurants.length;

  return (
    <div className="min-h-screen bg-bg-warm/80 dark:bg-[#211714]/80 backdrop-blur-xl mesh-bg transition-all duration-300 pb-20">
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto py-8 pt-10 relative z-10">
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary dark:text-[#a09a8e] dark:hover:text-primary transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </button>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-dark dark:text-[#f4f1ea] capitalize">
              Your Favorites
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mb-8 border-b border-gray-200/80 dark:border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('dishes')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-serif transition-all cursor-pointer ${
              activeTab === 'dishes'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-102'
                : 'bg-white/80 dark:bg-[#352723]/80 text-gray-600 dark:text-[#a09a8e] hover:bg-gray-100 dark:hover:bg-[#43322d] border border-gray-200/60 dark:border-white/10'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Liked Dishes</span>
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-serif transition-all cursor-pointer ${
              activeTab === 'restaurants'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-102'
                : 'bg-white/80 dark:bg-[#352723]/80 text-gray-600 dark:text-[#a09a8e] hover:bg-gray-100 dark:hover:bg-[#43322d] border border-gray-200/60 dark:border-white/10'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Liked Restaurants</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dishes' ? (
            favoriteFoods.length > 0 ? (
              <motion.div 
                key="dishes-grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {favoriteFoods.map((item) => {
                  const count = cartItems[item._id] || 0;
                  const imageSrc = item.image.startsWith('http') ? item.image : `${url}/images/${item.image}`;

                  return (
                    <div
                      key={item._id}
                      className="bg-white/80 dark:bg-[#352723]/80 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-150 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-[#FFFBF9] dark:bg-[#2b1f1d]">
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={() => toggleLikeFood(item._id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 text-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                          title="Remove from favorites"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-serif text-base font-bold text-[#2b1f1d] dark:text-[#f4f1ea] truncate group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-[#a09a8e] line-clamp-2 leading-relaxed mb-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                          <span className="font-mono font-extrabold text-lg text-primary">
                            ₹ {item.price}
                          </span>

                          {count === 0 ? (
                            <button
                              onClick={() => addToCart(item._id)}
                              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-primary text-white rounded-xl px-2.5 py-1.5 shadow-sm">
                              <button onClick={() => removeFromCart(item._id)} className="cursor-pointer hover:opacity-80">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-mono font-bold">{count}</span>
                              <button onClick={() => addToCart(item._id)} className="cursor-pointer hover:opacity-80">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="dishes-empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white/50 dark:bg-[#352723]/50 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl max-w-lg mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 shadow-sm">
                  <Utensils className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-text-dark dark:text-[#fcfbfa]">No Liked Dishes Yet</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] mt-1.5 mb-6 leading-relaxed">
                  Browse our menu and click the heart icon on any meal to save it to your personal favorites collection.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-103 transition-all cursor-pointer"
                >
                  Explore Menu
                </button>
              </motion.div>
            )
          ) : (
            favoriteRestaurants.length > 0 ? (
              <motion.div 
                key="restaurants-grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {favoriteRestaurants.map((rest) => {
                  const restId = rest._id || rest.id;
                  const restImage = rest.image 
                    ? (rest.image.startsWith('http') ? rest.image : `${url}/images/${rest.image}`)
                    : "";

                  return (
                    <div
                      key={restId}
                      className="bg-white/80 dark:bg-[#352723]/80 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-150 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-[#FFFBF9] dark:bg-[#2b1f1d]">
                        <img
                          src={restImage}
                          alt={rest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={() => toggleLikeRestaurant(restId)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 text-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                          title="Remove from favorites"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-[#2b1f1d] dark:text-[#f4f1ea] group-hover:text-primary transition-colors line-clamp-1 mb-1">
                            {rest.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 font-mono mb-2">
                            <span className="flex items-center gap-0.5"><Star className="w-3.5 h-3.5 fill-current" /> {rest.rating || 4.5}</span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="flex items-center gap-1 text-gray-500 dark:text-[#a09a8e]"><Clock className="w-3.5 h-3.5" /> {rest.deliveryTime || "20-30 mins"}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-[#a09a8e] line-clamp-1 font-sans">
                            {rest.priceRange || rest.cuisine || "Gourmet Outlet"} • {rest.location || "City"}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/restaurant/${restId}`)}
                          className="w-full py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
                        >
                          View Restaurant Menu
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="restaurants-empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white/50 dark:bg-[#352723]/50 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl max-w-lg mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 shadow-sm">
                  <Store className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-text-dark dark:text-[#fcfbfa]">No Liked Restaurants Yet</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] mt-1.5 mb-6 leading-relaxed">
                  Discover top eateries near you and click the heart icon on any restaurant card to bookmark it here.
                </p>
                <button
                  onClick={() => navigate('/restaurants')}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-103 transition-all cursor-pointer"
                >
                  Discover Restaurants
                </button>
              </motion.div>
            )
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Favorites;
