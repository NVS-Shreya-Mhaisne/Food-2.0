import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  ArrowLeft,
  Star,
  Search,
  X,
  Heart,
  Utensils,
  Store,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  DollarSign,
  Check
} from 'lucide-react';
import { StoreContext } from '../../Components/Context/StoreContext';
import FoodItem from '../../Components/FoodItem/FoodItem';

const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { food_list, restaurantList, likedRestaurants, toggleLikeRestaurant, url } = useContext(StoreContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // all, veg, non-veg

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [restaurantId]);

  // Find target restaurant
  const currentRestaurant = (restaurantList || []).find(
    r => r._id === restaurantId || r.id?.toString() === restaurantId?.toString()
  );

  const restName = currentRestaurant?.name || "Restaurant Menu";
  const restLocation = currentRestaurant?.location || "City Center";
  const restRating = currentRestaurant?.rating ? Number(currentRestaurant.rating) : 4.5;
  const restDeliveryTime = currentRestaurant?.deliveryTime || "20-30 mins";
  const restPriceRange = currentRestaurant?.priceRange || "₹₹ Moderate";
  const restImage = currentRestaurant?.image 
    ? (currentRestaurant.image.startsWith('http') ? currentRestaurant.image : `${url}/images/${currentRestaurant.image}`)
    : "";

  const isLiked = likedRestaurants?.[restaurantId] || (currentRestaurant && likedRestaurants?.[currentRestaurant.id]) || false;

  // Filter dishes belonging to this specific restaurant
  const restaurantDishes = (food_list || []).filter(dish => {
    // 1. Restaurant ID Match or Restaurant Name Match
    const matchesId = dish.restaurantId === restaurantId || 
                      dish.restaurantId?._id === restaurantId || 
                      dish.restaurantId?.toString() === restaurantId?.toString();
    const matchesName = currentRestaurant && dish.restaurantName && 
                        dish.restaurantName.trim().toLowerCase() === currentRestaurant.name.trim().toLowerCase();
    
    // If restaurantList only has 1 restaurant or no specific ID is tagged, fallback to show items
    const matches = matchesId || matchesName || (!dish.restaurantId && (restaurantList?.length === 1));
    return matches;
  });

  // Extract all categories available in this restaurant's dishes
  const availableCategories = ['All', ...new Set(
    restaurantDishes.flatMap(dish => 
      dish.category ? dish.category.split(',').map(c => c.trim()) : []
    )
  )].filter(Boolean);

  // Apply in-restaurant search & filter
  const displayedDishes = restaurantDishes.filter(dish => {
    // Category Filter
    if (selectedCategory !== 'All') {
      const dishCats = (dish.category || '').toLowerCase();
      if (!dishCats.includes(selectedCategory.toLowerCase())) return false;
    }

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = (dish.name || '').toLowerCase().includes(q);
      const matchDesc = (dish.description || '').toLowerCase().includes(q);
      const matchCat = (dish.category || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    // Dietary Filter
    if (dietaryFilter === 'veg') {
      const isVeg = (dish.category || '').toLowerCase().includes('veg') || 
                    (dish.name || '').toLowerCase().includes('veg') || 
                    (dish.description || '').toLowerCase().includes('veg');
      if (!isVeg) return false;
    } else if (dietaryFilter === 'non-veg') {
      const isNonVeg = (dish.category || '').toLowerCase().includes('chicken') || 
                       (dish.category || '').toLowerCase().includes('non-veg') || 
                       (dish.category || '').toLowerCase().includes('meat') || 
                       (dish.category || '').toLowerCase().includes('egg') ||
                       (dish.name || '').toLowerCase().includes('chicken');
      if (!isNonVeg) return false;
    }

    return true;
  });

  return (
    <div className="relative min-h-screen bg-bg-warm/80 dark:bg-[#211714]/80 backdrop-blur-xl mesh-bg transition-all duration-300 pb-24">
      {/* Background ambient lights */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto py-8 pt-10 relative z-10">
        
        {/* Navigation Breadcrumb & Back button */}
        <button 
          onClick={() => navigate('/restaurants')}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary dark:text-[#a09a8e] dark:hover:text-primary transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to all restaurants
        </button>

        {/* Restaurant Hero Profile Card */}
        <div className="w-full bg-white/80 dark:bg-[#352723]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#e1ded7]/60 dark:border-white/10 shadow-xl mb-10">
          <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-slate-900">
            {restImage ? (
              <img 
                src={restImage} 
                alt={restName} 
                className="w-full h-full object-cover opacity-85"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/30">
                <Store className="w-20 h-20 text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Top Bar inside image */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <div className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                <Store className="w-3.5 h-3.5 text-primary" />
                <span>Verified Cravely Partner</span>
              </div>

              {/* Heart Like button */}
              <button
                onClick={() => toggleLikeRestaurant(restaurantId || currentRestaurant?.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                  isLiked 
                    ? "bg-rose-500 text-white border-rose-500 shadow-md scale-110" 
                    : "bg-white/80 dark:bg-black/40 text-gray-700 dark:text-gray-200 border-white/40 hover:bg-white hover:text-rose-500"
                }`}
                title={isLiked ? "Unlike restaurant" : "Like restaurant"}
              >
                <Heart className={`w-4 h-4 transition-transform ${isLiked ? "fill-current scale-110" : ""}`} />
              </button>
            </div>

            {/* Bottom Hero Info */}
            <div className="absolute bottom-6 left-6 right-6 text-white text-left z-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  ★ {restRating}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg">
                  {restPriceRange}
                </span>
                <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider font-mono">
                  FREE DELIVERY
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 text-white">
                {restName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-200 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{restLocation}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{restDeliveryTime}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{restaurantDishes.length} items on menu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Search and Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Filter Tabs */}
          <div className="flex overflow-x-auto gap-2 no-scrollbar py-1">
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold font-serif whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-102"
                    : "bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar inside this restaurant's menu */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#a09a8e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes in menu..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white/80 dark:bg-[#352723]/80 border border-gray-200/80 dark:border-[#4a3833] text-xs text-text-dark dark:text-[#f4f1ea] placeholder-gray-400 dark:placeholder-[#8c8477] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-bold shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Veg / Non-Veg Toggle Filter */}
            <div className="flex bg-white/80 dark:bg-[#352723]/80 p-1 rounded-2xl border border-gray-200/80 dark:border-[#4a3833]">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dietaryFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-[#a09a8e] hover:text-primary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 dark:text-[#a09a8e] hover:text-emerald-600'
                }`}
              >
                Veg
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-rose-600 text-white'
                    : 'text-gray-600 dark:text-[#a09a8e] hover:text-rose-600'
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6 flex justify-between items-center text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold text-text-dark dark:text-[#fcfbfa]">
              {selectedCategory === 'All' ? 'All Dishes' : selectedCategory}
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#a09a8e] mt-0.5 font-medium">
              Freshly prepared orders by {restName}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full">
            {displayedDishes.length} {displayedDishes.length === 1 ? 'dish' : 'dishes'}
          </span>
        </div>

        {/* Dishes Grid */}
        {displayedDishes.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
          >
            {displayedDishes.map((item) => (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image}
                category={item.category}
              />
            ))}
          </motion.div>
        ) : (
          /* Empty dishes state */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white/50 dark:bg-[#352723]/50 border border-dashed border-gray-200 dark:border-[#4a3833] rounded-3xl max-w-xl mx-auto my-8"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-sm">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-text-dark dark:text-[#fcfbfa]">
              {restaurantDishes.length === 0 ? "No dishes added yet" : "No matching dishes found"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] mt-1.5 mb-6 leading-relaxed max-w-md">
              {restaurantDishes.length === 0 
                ? `${restName} hasn't listed any menu items in the system yet. Please explore other partner restaurants.`
                : "No dishes matched your active search or dietary filters. Try clearing your filters."}
            </p>
            {restaurantDishes.length === 0 ? (
              <button
                onClick={() => navigate('/restaurants')}
                className="px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/25 hover:bg-primary-dark transition-all cursor-pointer"
              >
                Browse Other Restaurants
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setDietaryFilter('all');
                }}
                className="px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/25 hover:bg-primary-dark transition-all cursor-pointer"
              >
                Reset Menu Filters
              </button>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default RestaurantDetail;
