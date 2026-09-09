import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  ChevronDown, 
  SlidersHorizontal, 
  ArrowLeft,
  Star,
  DollarSign,
  Utensils,
  Check,
  Search,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Heart
} from 'lucide-react';
import { StoreContext } from '../../Components/Context/StoreContext';
import { menu_list } from '../../assets/assets';
import FoodItem from '../../Components/FoodItem/FoodItem';

// Curated high-fidelity descriptions for each category
const categoryDescriptions = {
  "Chinese": "Savor the authentic taste of Chinese street-style noodles, dim sums, and delicious appetizers!",
  "Pizza": "Cheesy, wood-fired artisanal pizzas loaded with fresh toppings and premium sauces.",
  "Biryani": "Rich, aromatic basmati rice layered with delicate spices and succulent meats or fresh veggies.",
  "Chicken Biryani": "A classic delicacy featuring fragrant rice and tender, perfectly spiced chicken.",
  "South Indian": "Light and wholesome idlis, crispy dosas, and comforting sambar from southern India.",
  "North Indian": "Flavorful curries, freshly baked naans, and rich gravies cooked with traditional spices.",
  "Sandwiches": "Toasted, fresh, and layered sandwiches packed with crisp vegetables, cheese, and gourmet spreads.",
  "Rolls & Wraps": "Warm flatbreads wrapped around delicious fillings, grilled veggies, and tangy sauces.",
  "Burgers": "Juicy, flame-grilled patties inside toasted brioche buns with signature house sauces.",
  "Desserts": "Delectable sweet treats, cakes, and pastries to satisfy your sweet tooth.",
  "Ice Cream": "Creamy, chilled ice creams in a variety of delightful gourmet flavors.",
  "Beverages": "Refreshing mocktails, coolers, hot coffees, and milkshakes to quench your thirst.",
  "Best Sellers": "The highest-rated and most loved dishes ordered by thousands of customers daily.",
  "Today's Specials": "Handcrafted curated dishes put together by our executive chef for today only.",
  "Popular Items": "Top trending items that are currently taking the city by storm.",
  "Combos": "Value-packed meals pairing main courses with beverages or sides.",
  "Breakfast": "Wholesome and energizing breakfast platters to kickstart your morning right.",
  "Lunch": "Hearty, satisfying meals and bowls designed to power you through the afternoon.",
  "Dinner": "Gourmet, comforting dinners to unwind and enjoy with family and friends.",
  "Snacks": "Quick, delicious bites and street food perfect for tea-time cravings.",
  "Khichdi": "Comforting, warm, and highly nutritious rice and lentil bowls tempered with pure ghee.",
  "Manchurian": "Crispy fried vegetable or chicken balls tossed in a tangy, spicy Indo-Chinese sauce.",
  "Maggie": "Everyone's favorite instant noodles elevated with fresh veggies and special spice mixes.",
  "Fried Rice": "Wok-tossed basmati rice with crunchy vegetables, soy sauce, and aromatic garlic.",
  "Pasta": "Delectable pasta plates tossed in creamy alfredo, robust marinara, or fresh pesto.",
  "Kids Menu": "Gentle, kid-friendly portions and flavors that little ones are guaranteed to love."
};

const savoryExclusions = [
  "pizza", "burger", "pasta", "noodles", "chow mein", "biryani", "fried rice", 
  "paneer", "dal", "naan", "roti", "paratha", "thali", "khichdi", "vada", 
  "idli", "dosa", "uttapam", "sambar", "poha", "pav bhaji", "manchurian", 
  "sandwich", "wrap", "roll", "shawarma", "soup", "salad", "curry", "gravy", 
  "chaat", "bhel", "momos", "french fries", "fries", "garlic bread", "sub", 
  "tikka", "masala"
];

const sweetCategoryNames = [
  "dessert", "desserts", "desert", "deserts", "cake", "cakes", 
  "ice cream", "icecream", "ice-cream", "pastry", "pastries", 
  "waffle", "waffles", "sweet", "sweets", "mithai", "bakery", "confectionery"
];

const sweetDishNameKeywords = [
  "ice cream", "icecream", "ice-cream", "sundae", "kulfi", "gelato", 
  "cake", "pastry", "pastries", "cupcake", "muffin", "brownie", "waffle", 
  "pancake", "cheesecake", "tart", "donut", "doughnut", "gulab jamun", 
  "rasgulla", "rasmalai", "halwa", "jalebi", "ladoo", "laddu", "barfi", 
  "burfi", "kheer", "rabdi", "pedha", "peda", "modak", "mithai", "shrikhand", 
  "pudding", "mousse", "pie", "custard", "fudge", "tiramisu", "chocofudge"
];

const isSweetDish = (dish) => {
  const dCat = (dish.category || "").toLowerCase();
  const dName = (dish.name || "").toLowerCase();

  const isExplicitSweetName = sweetDishNameKeywords.some(kw => dName.includes(kw));
  const isSweetCategory = sweetCategoryNames.some(c => dCat.includes(c));

  if (!isExplicitSweetName && !isSweetCategory) {
    return false;
  }

  const hasSavoryKeyword = savoryExclusions.some(kw => dName.includes(kw) || dCat.includes(kw));
  if (hasSavoryKeyword && !isExplicitSweetName) {
    return false;
  }

  return true;
};

// Rich, high-fidelity mock restaurant database matching local regions (Pune area)
const allRestaurants = [];

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const activeCategory = categoryName ? decodeURIComponent(categoryName) : "All Restaurants";

  // Store Context & Selection States
  const { food_list: globalFoodList, restaurantList, cartItems, addToCart, removeFromCart, likedRestaurants, toggleLikeRestaurant, likedFoods, toggleLikeFood, url } = useContext(StoreContext);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeRestaurants = (restaurantList && restaurantList.length > 0)
    ? restaurantList.map((r, index) => {
        const cuisines = r.priceRange ? [r.priceRange, "Gourmet Outlet"] : ["Multi-Cuisine", "Gourmet Outlet"];
        const categories = ["North Indian", "South Indian", "Biryani", "Burgers", "Pizza", "Chinese", "Desserts", "Beverages", "Rolls", "Pasta", "Noodles", "Pure Veg", "Salad", "Sandwich", "Cake"];
        return {
          id: r._id || index + 1,
          _id: r._id,
          name: r.name,
          rating: r.rating ? Number(r.rating) : 4.5,
          deliveryTime: r.deliveryTime || "20-30 mins",
          avgTime: parseInt(r.deliveryTime) || 25,
          freeDelivery: true,
          distance: r.location || "Nearby",
          location: r.location || "City Center",
          costForTwo: 350,
          isVeg: false,
          isVegan: false,
          isJain: false,
          categories: categories,
          cuisines: cuisines,
          featuredDish: r.name + " Special",
          image: r.image ? (r.image.startsWith('http') ? r.image : `${url}/images/${r.image}`) : "",
          offer: "FREE DELIVERY ON ORDERS ABOVE ₹199"
        };
      })
    : [];

  // Scroll to top when category changes and redirect if All Restaurants
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (!categoryName || decodeURIComponent(categoryName) === 'All Restaurants') {
      navigate('/restaurants', { replace: true });
    }
  }, [categoryName, navigate]);

  // Filter States
  const [activeSort, setActiveSort] = useState('relevance'); // relevance, rating, time, costLow, costHigh
  const [fastDelivery, setFastDelivery] = useState(false);
  const [dietary, setDietary] = useState('all'); // all, veg, non-veg
  const [minRating, setMinRating] = useState('all'); // all, 4.0, 4.5
  const [costRange, setCostRange] = useState('all'); // all, budget (<250), mid (200-500), high (>500)
  
  // Dropdown UI States
  const [activeDropdown, setActiveDropdown] = useState(null); // 'sort', 'dietary', 'rating', 'cost'
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

  // Filter & Sort Logic
  const filteredRestaurants = activeRestaurants.filter(rest => {
    // 0. Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesSearch = rest.name.toLowerCase().includes(q) || 
                            rest.cuisines.some(c => c.toLowerCase().includes(q)) ||
                            rest.location.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // 1. Matches Category (only check if not in "All Restaurants" mode)
    if (activeCategory !== "All Restaurants") {
      const catLower = activeCategory.toLowerCase();
      const isDessertCategory = catLower.includes("dessert") || catLower.includes("desert") || catLower.includes("sweet");

      if (isDessertCategory) {
        const matchesDessertRest = 
          rest.categories.some(c => sweetCategoryNames.some(kw => c.toLowerCase().includes(kw))) ||
          rest.cuisines.some(c => sweetCategoryNames.some(kw => c.toLowerCase().includes(kw))) ||
          sweetCategoryNames.some(kw => rest.name.toLowerCase().includes(kw)) ||
          sweetDishNameKeywords.some(kw => rest.name.toLowerCase().includes(kw));
        if (!matchesDessertRest) return false;
      } else {
        // Normalize to handle case mismatch, synonyms, and singular/plural variations (e.g. burger vs burgers)
        let catSingular = catLower;
        if (catLower.endsWith('es')) {
          catSingular = catLower.slice(0, -2);
        } else if (catLower.endsWith('s')) {
          catSingular = catLower.slice(0, -1);
        }

        const matchesCategory = rest.categories.some(cat => {
          const c = cat.toLowerCase();
          let cSingular = c;
          if (c.endsWith('es')) cSingular = c.slice(0, -2);
          else if (c.endsWith('s')) cSingular = c.slice(0, -1);

          return c.includes(catLower) || c.includes(catSingular) || 
                 cSingular.includes(catLower) || cSingular.includes(catSingular) ||
                 catLower.includes(c) || catSingular.includes(c) ||
                 catLower.includes(cSingular) || catSingular.includes(cSingular);
        }) || rest.cuisines.some(cuisine => {
          const c = cuisine.toLowerCase();
          let cSingular = c;
          if (c.endsWith('es')) cSingular = c.slice(0, -2);
          else if (c.endsWith('s')) cSingular = c.slice(0, -1);

          return c.includes(catLower) || c.includes(catSingular) || 
                 cSingular.includes(catLower) || cSingular.includes(catSingular) ||
                 catLower.includes(c) || catSingular.includes(c) ||
                 catLower.includes(cSingular) || catSingular.includes(cSingular);
        });

        if (!matchesCategory) return false;
      }
    }

    // 2. Fast Delivery Filter
    if (fastDelivery && rest.avgTime > 20) return false;

    // 3. Dietary Filter
    if (dietary === 'veg' && !rest.isVeg) return false;
    if (dietary === 'non-veg' && rest.isVeg && !rest.cuisines.some(c => c.toLowerCase().includes('chicken') || c.toLowerCase().includes('mutton') || c.toLowerCase().includes('fish') || c.toLowerCase().includes('meat'))) {
      if (rest.isVeg) return false;
    }
    if (dietary === 'vegan' && (!rest.isVeg || !rest.isVegan)) return false;
    if (dietary === 'jain' && (!rest.isVeg || !rest.isJain)) return false;

    // 4. Rating Filter
    if (minRating === '4.0' && rest.rating < 4.0) return false;
    if (minRating === '4.5' && rest.rating < 4.5) return false;

    // 5. Cost Filter
    if (costRange === 'budget' && rest.costForTwo > 250) return false;
    if (costRange === 'mid' && (rest.costForTwo < 200 || rest.costForTwo > 500)) return false;
    if (costRange === 'high' && rest.costForTwo < 500) return false;

    return true;
  }).sort((a, b) => {
    if (activeSort === 'rating') return b.rating - a.rating;
    if (activeSort === 'time') return a.avgTime - b.avgTime;
    if (activeSort === 'costLow') return a.costForTwo - b.costForTwo;
    if (activeSort === 'costHigh') return b.costForTwo - a.costForTwo;
    return 0; // relevance
  });

  const resetFilters = () => {
    setActiveSort('relevance');
    setFastDelivery(false);
    setDietary('all');
    setMinRating('all');
    setCostRange('all');
    setActiveDropdown(null);
  };

  const activeFiltersCount = 
    (activeSort !== 'relevance' ? 1 : 0) + 
    (fastDelivery ? 1 : 0) + 
    (dietary !== 'all' ? 1 : 0) + 
    (minRating !== 'all' ? 1 : 0) + 
    (costRange !== 'all' ? 1 : 0);

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

        {/* Dynamic Category Hero Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl font-black text-text-dark dark:text-[#f4f1ea] capitalize mb-3">
              {activeCategory}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-[#a09a8e] max-w-xl leading-relaxed">
              {activeCategory === "All Restaurants"
                ? "Explore the finest gourmet restaurants and popular eateries near you, offering quick deliveries and premium menus."
                : (categoryDescriptions[activeCategory] || `Discover the finest local restaurants and popular spots offering delicious ${activeCategory} specialties near you.`)}
            </p>
          </div>

          {/* Search Bar for Restaurants */}
          <div className="relative w-full max-w-xs md:max-w-sm self-start md:self-auto flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#a09a8e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeCategory === "All Restaurants" ? "Search dishes or restaurants..." : `Search ${activeCategory.toLowerCase()} dishes...`}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/80 dark:bg-[#352723]/80 border border-gray-200/80 dark:border-[#4a3833] text-xs text-text-dark dark:text-[#f4f1ea] placeholder-gray-400 dark:placeholder-[#8c8477] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-bold"
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

        {/* High-Fidelity Filters Row */}
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

          {/* Sort By Dropdown Button */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d] transition-all cursor-pointer ${
                activeSort !== 'relevance' ? "ring-2 ring-primary border-primary/50 text-primary" : ""
              }`}
            >
              <span>Sort By: {
                activeSort === 'relevance' ? 'Relevance' :
                activeSort === 'rating' ? 'Ratings' :
                activeSort === 'time' ? 'Delivery Time' :
                activeSort === 'costLow' ? 'Cost: Low to High' : 'Cost: High to Low'
              }</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'sort' ? 'rotate-185' : ''}`} />
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
                    { value: 'time', label: 'Delivery Time' },
                    { value: 'costLow', label: 'Cost: Low to High' },
                    { value: 'costHigh', label: 'Cost: High to Low' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setActiveSort(option.value);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 dark:text-[#d3cfc4] hover:bg-primary/5 hover:text-primary dark:hover:bg-[#3d2f2b] transition-colors flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {activeSort === option.value && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 10 Mins Delivery Toggle (Fast Delivery) */}
          <button 
            onClick={() => setFastDelivery(!fastDelivery)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              fastDelivery 
                ? "bg-primary text-white border-primary shadow-sm" 
                : "bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d]"
            }`}
          >
            <span className="bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-md uppercase font-mono mr-0.5">NEW</span>
            <span>10 Mins Delivery</span>
          </button>

          {/* Veg / Non-Veg / Vegan / Jain Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'dietary' ? null : 'dietary')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d] transition-all cursor-pointer ${
                dietary !== 'all' ? "ring-2 ring-primary border-primary/50 text-primary" : ""
              }`}
            >
              <span>{
                dietary === 'all' ? 'Veg/Non-Veg' :
                dietary === 'veg' ? 'Veg Only' :
                dietary === 'non-veg' ? 'Non-Veg Only' :
                dietary === 'vegan' ? 'Vegan Only' : 'Jain Only'
              }</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'dietary' ? 'rotate-185' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'dietary' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-44 bg-white dark:bg-[#2b1f1d] border border-gray-150 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-20"
                >
                  {[
                    { value: 'all', label: 'All Diets' },
                    { value: 'veg', label: 'Veg Only' },
                    { value: 'non-veg', label: 'Non-Veg Only' },
                    { value: 'vegan', label: 'Vegan Only' },
                    { value: 'jain', label: 'Jain Only' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setDietary(option.value);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 dark:text-[#d3cfc4] hover:bg-primary/5 hover:text-primary dark:hover:bg-[#3d2f2b] transition-colors flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {dietary === option.value && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ratings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'rating' ? null : 'rating')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d] transition-all cursor-pointer ${
                minRating !== 'all' ? "ring-2 ring-primary border-primary/50 text-primary" : ""
              }`}
            >
              <span>{
                minRating === 'all' ? 'Ratings' :
                minRating === '4.0' ? '★ 4.0+' : '★ 4.5+'
              }</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'rating' ? 'rotate-185' : ''}`} />
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
                      className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 dark:text-[#d3cfc4] hover:bg-primary/5 hover:text-primary dark:hover:bg-[#3d2f2b] transition-colors flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {minRating === option.value && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cost For Two Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'cost' ? null : 'cost')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border bg-white/80 dark:bg-[#352723]/80 text-[#2b1f1d] dark:text-[#f4f1ea] border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#43322d] transition-all cursor-pointer ${
                costRange !== 'all' ? "ring-2 ring-primary border-primary/50 text-primary" : ""
              }`}
            >
              <span>{
                costRange === 'all' ? 'Cost For Two' :
                costRange === 'budget' ? 'Under ₹250' :
                costRange === 'mid' ? '₹200 - ₹500' : 'Above ₹500'
              }</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'cost' ? 'rotate-185' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'cost' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 sm:left-0 mt-2 w-48 bg-white dark:bg-[#2b1f1d] border border-gray-150 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-20"
                >
                  {[
                    { value: 'all', label: 'All Budgets' },
                    { value: 'budget', label: 'Under ₹250' },
                    { value: 'mid', label: '₹200 - ₹500' },
                    { value: 'high', label: 'Above ₹500' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCostRange(option.value);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 dark:text-[#d3cfc4] hover:bg-primary/5 hover:text-primary dark:hover:bg-[#3d2f2b] transition-colors flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {costRange === option.value && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Category Dishes Section */}
        {(() => {
          const categoryDishes = (globalFoodList || []).filter(item => {
            if (activeCategory !== "All Restaurants" && activeCategory !== "All") {
              const catLower = activeCategory.toLowerCase();
              const isDessertCategory = catLower.includes("dessert") || catLower.includes("desert") || catLower.includes("sweet");

              if (isDessertCategory) {
                if (!isSweetDish(item)) return false;
              } else {
                const itemCatLower = (item.category || "").toLowerCase();
                const itemNameLower = (item.name || "").toLowerCase();
                const itemDescLower = (item.description || "").toLowerCase();
                let catSingular = catLower;
                if (catLower.endsWith('es')) catSingular = catLower.slice(0, -2);
                else if (catLower.endsWith('s')) catSingular = catLower.slice(0, -1);

                const matchesCategory = 
                  itemCatLower.includes(catLower) || 
                  itemNameLower.includes(catLower) || 
                  catLower.includes(itemCatLower) ||
                  itemCatLower.includes(catSingular) ||
                  itemNameLower.includes(catSingular) ||
                  itemDescLower.includes(catLower);
                if (!matchesCategory) return false;
              }
            }

            // Search query filter
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              const matchName = (item.name || "").toLowerCase().includes(q);
              const matchDesc = (item.description || "").toLowerCase().includes(q);
              const matchCat = (item.category || "").toLowerCase().includes(q);
              if (!matchName && !matchDesc && !matchCat) return false;
            }

            // Dietary filter
            if (dietary === "veg") {
              const isVeg = (item.category || "").toLowerCase().includes("veg") || (item.name || "").toLowerCase().includes("veg") || (item.description || "").toLowerCase().includes("veg");
              if (!isVeg) return false;
            } else if (dietary === "non-veg") {
              const isNonVeg = (item.category || "").toLowerCase().includes("chicken") || (item.category || "").toLowerCase().includes("non-veg") || (item.category || "").toLowerCase().includes("meat") || (item.category || "").toLowerCase().includes("egg");
              if (!isNonVeg) return false;
            }

            return true;
          }).sort((a, b) => {
            if (activeSort === "costLow") return a.price - b.price;
            if (activeSort === "costHigh") return b.price - a.price;
            return 0;
          });

          return (
            <div className="mb-12">
              <div className="mb-6 flex justify-between items-center text-left">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-dark dark:text-[#fcfbfa]">
                    {activeCategory === "All Restaurants" ? "All Dishes" : `All ${activeCategory}`}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
                    {activeCategory === "All Restaurants"
                      ? "Explore delicious culinary selections prepared fresh from top local kitchens"
                      : `Explore all ${activeCategory.toLowerCase()} options prepared fresh from top local kitchens`}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full">
                  {categoryDishes.length} {categoryDishes.length === 1 ? 'dish' : 'dishes'} found
                </span>
              </div>

              {categoryDishes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                  {categoryDishes.map((item) => (
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
                </div>
              ) : (
                <div className="text-center py-16 bg-white/40 dark:bg-[#2b1f1d]/40 rounded-3xl border border-dashed border-gray-200 dark:border-[#4a3833]">
                  <Utensils className="w-10 h-10 text-primary/40 mx-auto mb-3" />
                  <h3 className="font-serif text-lg font-bold text-text-dark dark:text-[#fcfbfa] mb-1">No dishes found</h3>
                  <p className="text-xs text-gray-500 dark:text-[#a09a8e]">
                    No dishes match your current filter criteria for {activeCategory}. Try resetting your search or filters.
                  </p>
                  {(searchQuery || dietary !== 'all' || activeSort !== 'relevance') && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary-dark transition-all cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Show Restaurants section ONLY on All Restaurants page */}
        {activeCategory === "All Restaurants" && (
          <>
            {/* Section Title */}
            <div className="mb-6 flex justify-between items-center text-left">
              <div>
                <h2 className="font-serif text-2xl font-bold text-text-dark dark:text-[#fcfbfa]">
                  Restaurants to explore
                </h2>
                <p className="text-xs text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
                  Explore outlets and order directly from local restaurants
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-gray-400 dark:text-[#8c8477] bg-white/40 dark:bg-[#352723]/40 border border-gray-200/50 dark:border-[#4a3833] px-3 py-1 rounded-full">
                {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'} found
              </span>
            </div>

            {/* Restaurants Grid / List View */}
            {filteredRestaurants.length > 0 ? (
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
                      className="w-full max-w-[300px] sm:max-w-none bg-white/70 dark:bg-[#352723]/70 backdrop-blur-md rounded-3xl overflow-hidden border border-[#e1ded7]/60 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between h-[310px] cursor-pointer"
                    >
                      {/* Image Card on top */}
                      <div className="h-44 w-full relative overflow-hidden bg-[#FFFBF9] flex-shrink-0">
                        <img 
                          src={restaurant.image} 
                          alt={restaurant.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Shadow overlay at bottom of image for the promo text */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        
                        {/* Ad Tag on top-left */}
                        {restaurant.ad && (
                          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            Ad
                          </div>
                        )}

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
                          <div className="absolute bottom-3 left-4 text-white text-sm font-black tracking-wide uppercase drop-shadow-md">
                            {restaurant.offer}
                          </div>
                        )}
                      </div>

                      {/* Body Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between text-left">
                        <div className="flex flex-col gap-0.5">
                          {/* Name */}
                          <h3 className="font-serif text-base sm:text-lg font-bold text-[#2b1f1d] dark:text-[#f4f1ea] group-hover:text-primary transition-colors line-clamp-1">
                            {restaurant.name}
                          </h3>

                          {/* Ratings and Delivery Time swiggy-style inline */}
                          <div className="flex items-center gap-1.5 text-xs text-[#2b1f1d] dark:text-[#d3cfc4] font-bold">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] pb-0.5">★</span>
                            <span>{restaurant.rating}</span>
                            <span className="text-gray-300 dark:text-white/10">•</span>
                            <span>{restaurant.deliveryTime}</span>
                          </div>

                          {/* Cuisines */}
                          <p className="text-[11px] text-gray-500 dark:text-[#a09a8e] font-sans font-medium line-clamp-1 mt-1">
                            {restaurant.cuisines.join(', ')}
                          </p>

                          {/* Location Area name */}
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-[#7f796d] mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span>{restaurant.location}</span>
                            <span className="text-gray-300 dark:text-white/10">•</span>
                            <span>{restaurant.distance}</span>
                          </div>
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
                  <Utensils className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-text-dark dark:text-[#fcfbfa]">No restaurants found</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] mt-1.5 mb-6 leading-relaxed">
                  We couldn't find any restaurants that match your current filter selections. Try relaxing some filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/25 hover:bg-primary-dark transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </>
        )}

      </div>

      {/* Restaurant Menu Modal */}
      <AnimatePresence>
        {selectedRestaurant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-xl bg-[#FFF8F5] dark:bg-[#2b1f1d] border border-gray-150 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-start">
                <div className="text-left">
                  <h3 className="font-serif text-2xl font-bold text-[#2b1f1d] dark:text-[#fcfbfa] mb-1">
                    {selectedRestaurant.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-[#a09a8e] font-sans font-medium">
                    {selectedRestaurant.cuisines.join(', ')} • {selectedRestaurant.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs font-bold text-[#2b1f1d] dark:text-[#d3cfc4]">
                    <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px]">★ {selectedRestaurant.rating}</span>
                    <span>{selectedRestaurant.deliveryTime}</span>
                    <span>•</span>
                    <span>₹{selectedRestaurant.costForTwo} for two</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#352723] text-gray-500 dark:text-[#a09a8e] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dishes List */}
              <div className="p-6 overflow-y-auto no-scrollbar flex-1 flex flex-col gap-6">
                <h4 className="font-serif text-lg font-bold text-text-dark dark:text-[#fcfbfa] text-left">
                  Recommended Menu
                </h4>
                {(() => {
                  const restaurantDishes = globalFoodList.filter(dish => {
                    const dishCat = (dish.category || "").toLowerCase();
                    const dishName = (dish.name || "").toLowerCase();
                    return selectedRestaurant.categories.some(cat => {
                      const c = cat.toLowerCase();
                      return dishCat.includes(c) || c.includes(dishCat) || dishName.includes(c);
                    }) || selectedRestaurant.cuisines.some(cuisine => {
                      const c = cuisine.toLowerCase();
                      return dishCat.includes(c) || c.includes(dishCat) || dishName.includes(c);
                    });
                  });

                  if (restaurantDishes.length === 0) {
                    return (
                      <div className="text-center py-8 text-gray-500 dark:text-[#a09a8e] text-xs font-semibold">
                        No dishes loaded from backend for this restaurant yet.
                      </div>
                    );
                  }

                  return restaurantDishes.map(dish => {
                    const count = cartItems[dish._id] || 0;
                    const isDishLiked = likedFoods?.[dish._id] || false;
                    return (
                      <div key={dish._id} className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-white/5 last:border-b-0 last:pb-0">
                        <div className="flex gap-4 items-start text-left max-w-[70%]">
                          <div className="relative shrink-0">
                            <img 
                              src={dish.image} 
                              alt={dish.name} 
                              className="w-16 h-16 rounded-2xl object-cover bg-gray-100 border border-gray-200/50 dark:border-white/5" 
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikeFood(dish._id);
                              }}
                              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                                isDishLiked
                                  ? "bg-rose-500 text-white border-rose-500"
                                  : "bg-white dark:bg-black/60 text-gray-400 border-gray-200 dark:border-white/20 hover:text-rose-500"
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${isDishLiked ? "fill-current" : ""}`} />
                            </button>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-serif text-sm font-bold text-[#2b1f1d] dark:text-[#f4f1ea]">{dish.name}</span>
                            <span className="text-xs font-mono font-bold text-primary">₹{dish.price}</span>
                            <span className="text-[10px] text-gray-500 dark:text-[#a09a8e] line-clamp-2 mt-0.5">{dish.description}</span>
                          </div>
                        </div>

                        {/* Add / Qty controls */}
                        <div className="flex-shrink-0">
                          {count === 0 ? (
                            <button
                              onClick={() => addToCart(dish._id)}
                              className="px-5 py-1.5 rounded-xl border border-primary/40 text-primary text-xs font-bold hover:bg-primary/5 transition-all shadow-xs cursor-pointer"
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="flex items-center gap-2.5 bg-primary text-white rounded-xl px-2.5 py-1.5 shadow-sm">
                              <button onClick={() => removeFromCart(dish._id)} className="cursor-pointer hover:opacity-80">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-mono font-bold select-none">{count}</span>
                              <button onClick={() => addToCart(dish._id)} className="cursor-pointer hover:opacity-80">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;
