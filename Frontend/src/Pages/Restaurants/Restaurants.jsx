import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  ChevronDown, 
  SlidersHorizontal, 
  ArrowLeft,
  Star,
  Search,
  X,
  Heart,
  Utensils,
  Store,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { StoreContext } from '../../Components/Context/StoreContext';
import SkeletonRestaurantCard from '../../Components/PopularRestaurants/SkeletonRestaurantCard';

const Restaurants = () => {
  const navigate = useNavigate();
  const { restaurantList, likedRestaurants, toggleLikeRestaurant, url } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Filter States
  const [activeSort, setActiveSort] = useState('relevance'); // relevance, rating, time
  const [fastDelivery, setFastDelivery] = useState(false);
  const [minRating, setMinRating] = useState('all'); // all, 4.0, 4.5
  const [priceRangeFilter, setPriceRangeFilter] = useState('all');
  
  // Dropdown UI States
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const formattedRestaurants = (restaurantList && restaurantList.length > 0)
    ? restaurantList.map((r, index) => {
        const cuisines = r.priceRange ? [r.priceRange, "Gourmet Outlet"] : ["Multi-Cuisine", "Gourmet Outlet"];
        return {
          id: r._id || index + 1,
          _id: r._id,
          name: r.name,
          ownerName: r.ownerName,
          rating: r.rating ? Number(r.rating) : 4.5,
          deliveryTime: r.deliveryTime || "20-30 mins",
          avgTime: parseInt(r.deliveryTime) || 25,
          freeDelivery: true,
          distance: r.location || "City Center",
          location: r.location || "City Center",
          itemCount: r.itemCount || 0,
          priceRange: r.priceRange || "₹₹ Moderate",
          cuisines: cuisines,
          image: r.image ? (r.image.startsWith('http') ? r.image : `${url}/images/${r.image}`) : "",
          offer: "FREE DELIVERY ON ORDERS ABOVE ₹199"
        };
      })
    : [];

  // Filter & Sort Logic
  const filteredRestaurants = formattedRestaurants.filter(rest => {
    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesSearch = rest.name.toLowerCase().includes(q) || 
                            rest.location.toLowerCase().includes(q) ||
                            rest.cuisines.some(c => c.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // Fast Delivery Filter (< 25 mins)
    if (fastDelivery && rest.avgTime > 25) return false;

    // Rating Filter
    if (minRating === '4.0' && rest.rating < 4.0) return false;
    if (minRating === '4.5' && rest.rating < 4.5) return false;

    return true;
  }).sort((a, b) => {
    if (activeSort === 'rating') return b.rating - a.rating;
    if (activeSort === 'time') return a.avgTime - b.avgTime;
    return 0; // relevance
  });

  const resetFilters = () => {
    setActiveSort('relevance');
    setFastDelivery(false);
    setMinRating('all');
    setPriceRangeFilter('all');
    setActiveDropdown(null);
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (activeSort !== 'relevance' ? 1 : 0) + 
    (fastDelivery ? 1 : 0) + 
    (minRating !== 'all' ? 1 : 0);

  return (
    <div className="relative min-h-screen bg-bg-warm/80 dark:bg-[#211714]/80 backdrop-blur-xl mesh-bg transition-all duration-300 pb-20">
      {/* Background ambient lights */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content */}
      <div className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto py-8 pt-10 relative z-10">
        
        {/* Navigation Breadcrumb & Back button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary dark:text-[#a09a8e] dark:hover:text-primary transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </button>

        {/* Hero Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-text-dark dark:text-[#f4f1ea] capitalize">
                All Restaurants
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-[#a09a8e] max-w-xl leading-relaxed">
              Explore the finest gourmet restaurants and popular eateries near you. Click on any restaurant to explore its full menu and order delicious dishes.
            </p>
          </div>

          {/* Search Bar for Restaurants */}
          <div className="relative w-full max-w-xs md:max-w-sm self-start md:self-auto flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#a09a8e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/80 dark:bg-[#352723]/80 border border-gray-200/80 dark:border-[#4a3833] text-xs text-text-dark dark:text-[#f4f1ea] placeholder-gray-400 dark:placeholder-[#8c8477] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-bold shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter & Sort Control Row */}
        <div className="relative flex flex-wrap gap-2.5 items-center mb-8 pb-4 border-b border-gray-200/50 dark:border-white/5" ref={dropdownRef}>
          
          {/* Main Filter Pill / Reset Option */}
          <button 
            onClick={resetFilters}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              activeFiltersCount > 0 
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                : "bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d] transition-all cursor-pointer ${
                activeSort !== 'relevance' ? "ring-2 ring-primary border-primary/50 text-primary" : ""
              }`}
            >
              <span>Sort By: {
                activeSort === 'relevance' ? 'Relevance' :
                activeSort === 'rating' ? 'Ratings' : 'Fast Delivery'
              }</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'sort' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#2b1f1d] border border-gray-150 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-20"
                >
                  {[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'rating', label: 'Customer Rating' },
                    { value: 'time', label: 'Delivery Time' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setActiveSort(option.value);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 dark:text-[#d3cfc4] hover:bg-primary/5 hover:text-primary dark:hover:bg-[#3d2f2b] transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{option.label}</span>
                      {activeSort === option.value && <Star className="w-3.5 h-3.5 text-primary fill-current" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fast Delivery Filter */}
          <button 
            onClick={() => setFastDelivery(!fastDelivery)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              fastDelivery 
                ? "bg-primary text-white border-primary shadow-sm" 
                : "bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Fast Delivery</span>
          </button>

          {/* Ratings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'rating' ? null : 'rating')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d] transition-all cursor-pointer ${
                minRating !== 'all' ? "ring-2 ring-primary border-primary/50 text-primary" : ""
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{
                minRating === 'all' ? 'Ratings' :
                minRating === '4.0' ? '★ 4.0+' : '★ 4.5+'
              }</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'rating' ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'rating' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-40 bg-white dark:bg-[#2b1f1d] border border-gray-150 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-20"
                >
                  {[
                    { value: 'all', label: 'All Ratings' },
                    { value: '4.0', label: '★ 4.0 & Above' },
                    { value: '4.5', label: '★ 4.5 & Above' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setMinRating(option.value);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 dark:text-[#d3cfc4] hover:bg-primary/5 hover:text-primary dark:hover:bg-[#3d2f2b] transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{option.label}</span>
                      {minRating === option.value && <Star className="w-3.5 h-3.5 text-primary fill-current" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section Title & Counter */}
        <div className="mb-6 flex justify-between items-center text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold text-text-dark dark:text-[#fcfbfa]">
              Featured Restaurants
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
              Click any restaurant below to view its dishes and menu
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full">
            {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'} available
          </span>
        </div>

        {/* Restaurants Grid View */}
        {!restaurantList || restaurantList.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="w-full">
                <SkeletonRestaurantCard />
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
          >
            <AnimatePresence mode="popLayout">
              {filteredRestaurants.map((restaurant) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={restaurant.id}
                  onClick={() => navigate(`/restaurant/${restaurant._id || restaurant.id}`)}
                  className="w-full bg-white/70 dark:bg-[#352723]/70 backdrop-blur-md rounded-3xl overflow-hidden border border-[#e1ded7]/60 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between h-[340px] cursor-pointer"
                >
                  {/* Image Card on top */}
                  <div className="h-44 w-full relative overflow-hidden bg-[#FFFBF9] flex-shrink-0">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Shadow overlay at bottom of image */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    
                    {/* Dish Count badge top-left */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-amber-400" />
                      <span>{restaurant.itemCount || 0} Dishes</span>
                    </div>

                    {/* Heart Like Button on top-right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeRestaurant(restaurant.id);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 z-10 cursor-pointer ${
                        likedRestaurants?.[restaurant.id] 
                          ? "bg-rose-500 text-white border-rose-500 shadow-md scale-110" 
                          : "bg-white/80 dark:bg-black/40 text-gray-600 dark:text-gray-200 border-white/40 hover:bg-white dark:hover:bg-black/60 hover:text-rose-500"
                      }`}
                      title={likedRestaurants?.[restaurant.id] ? "Unlike restaurant" : "Like restaurant"}
                    >
                      <Heart className={`w-4 h-4 transition-transform ${likedRestaurants?.[restaurant.id] ? "fill-current scale-110" : ""}`} />
                    </button>

                    {/* Discount Overlay Tag at bottom of image */}
                    {restaurant.offer && (
                      <div className="absolute bottom-2.5 left-3.5 text-white text-xs font-black tracking-wide uppercase drop-shadow-md flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{restaurant.offer}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between text-left">
                    <div className="flex flex-col gap-1">
                      {/* Name */}
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#2b1f1d] dark:text-[#f4f1ea] group-hover:text-primary transition-colors line-clamp-1">
                        {restaurant.name}
                      </h3>

                      {/* Ratings and Delivery Time */}
                      <div className="flex items-center gap-1.5 text-xs text-[#2b1f1d] dark:text-[#d3cfc4] font-bold">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] pb-0.5">★</span>
                        <span>{restaurant.rating}</span>
                        <span className="text-gray-300 dark:text-white/10">•</span>
                        <span>{restaurant.deliveryTime}</span>
                        <span className="text-gray-300 dark:text-white/10">•</span>
                        <span className="text-gray-500 dark:text-[#a09a8e]">{restaurant.priceRange}</span>
                      </div>

                      {/* Location Area name */}
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-[#7f796d] mt-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                        <span className="truncate">{restaurant.location}</span>
                      </div>
                    </div>

                    {/* View Menu Button */}
                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-hover">
                      <span>Explore Menu</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty Search/Filter State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white/50 dark:bg-[#2b1f1d]/50 border border-dashed border-gray-200 dark:border-[#4a3833] rounded-3xl my-6 max-w-xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-sm">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-text-dark dark:text-[#fcfbfa]">No restaurants found</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] mt-1.5 mb-6 leading-relaxed">
              We couldn't find any restaurants matching your current search or filter criteria.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/25 hover:bg-primary-dark transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Restaurants;
