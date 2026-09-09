import React, { useContext, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StoreContext } from '../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import SkeletonFoodItem from '../FoodItem/SkeletonFoodItem'
import { UtensilsCrossed, RefreshCw } from 'lucide-react'

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

const FoodDisplay = ({ category, filters = {}, onTotalCountChange, onResetFilters }) => {
  const { food_list } = useContext(StoreContext)

  const {
    search = '',
    dietary = 'all',
    priceRange = 'all',
    minRating = 'all',
    sortBy = 'popular'
  } = filters;

  // Multi-criteria filtering logic
  const filteredList = food_list.filter((item) => {
    // 1. Category Filter (from ExploreMenu)
    if (category && category !== "All") {
      const catLower = category.toLowerCase();
      const isDessertCategory = catLower.includes("dessert") || catLower.includes("desert") || catLower.includes("sweet");

      if (isDessertCategory) {
        if (!isSweetDish(item)) return false;
      } else {
        const itemCatLower = (item.category || "").toLowerCase();
        const itemNameLower = (item.name || "").toLowerCase();

        const isDirectMatch = itemCatLower.includes(catLower) || itemNameLower.includes(catLower);
        const isCuratedCategory = ['best sellers', "today's specials", 'popular items', 'combos', 'breakfast', 'lunch', 'dinner', 'snacks'].some(c => catLower.includes(c));

        if (!isDirectMatch && !isCuratedCategory) {
          return false;
        }
      }
    }

    // 2. Search Keyword Filter
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description ? item.description.toLowerCase().includes(query) : false;
      const catMatch = item.category ? item.category.toLowerCase().includes(query) : false;
      if (!nameMatch && !descMatch && !catMatch) return false;
    }

    // 3. Dietary Filter
    if (dietary === 'veg') {
      const nameLower = item.name.toLowerCase();
      const catLower = (item.category || "").toLowerCase();
      const isNonVeg = nameLower.includes('chicken') || catLower.includes('chicken') || nameLower.includes('mutton') || nameLower.includes('fish');
      if (isNonVeg) return false;
    } else if (dietary === 'non-veg') {
      const nameLower = item.name.toLowerCase();
      const isNonVeg = nameLower.includes('chicken') || nameLower.includes('mutton') || nameLower.includes('fish');
      if (!isNonVeg) return false;
    } else if (dietary === 'vegan') {
      const nameLower = item.name.toLowerCase();
      const descLower = (item.description || "").toLowerCase();
      const isNonVegan = ['chicken', 'mutton', 'fish', 'egg', 'paneer', 'cheese', 'butter', 'cream', 'milk'].some(k => nameLower.includes(k) || descLower.includes(k));
      if (isNonVegan) return false;
    } else if (dietary === 'jain') {
      const nameLower = item.name.toLowerCase();
      const descLower = (item.description || "").toLowerCase();
      const isNonJain = ['chicken', 'mutton', 'fish', 'egg', 'onion', 'garlic', 'potato'].some(k => nameLower.includes(k) || descLower.includes(k));
      if (isNonJain) return false;
    }

    // 4. Price Range Filter
    if (priceRange === 'under200' && item.price > 200) return false;
    if (priceRange === '200to400' && (item.price <= 200 || item.price > 400)) return false;
    if (priceRange === 'above400' && item.price <= 400) return false;

    // 5. Rating Filter
    if (minRating === '4.5') {
      if (item.price < 300) return false;
    } else if (minRating === '4.0') {
      if (item.price < 150) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedList = [...filteredList].sort((a, b) => {
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'rating') return b.price - a.price; // rating/popularity weight fallback
    return 0; // 'popular' maintains default sequence
  });

  // Notify parent of count update
  useEffect(() => {
    if (onTotalCountChange) {
      onTotalCountChange(sortedList.length);
    }
  }, [sortedList.length, onTotalCountChange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='mt-2 py-4'
      id='food-display'
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-dark dark:text-[#fcfbfa]">
            {category === "All" ? "Trending Foods & Dishes" : `${category} Menu`}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
            Explore curated items lovingly prepared by top local chefs
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-gray-400 dark:text-[#8c8477] bg-gray-100 dark:bg-[#352723] px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-[#4a3833] self-start sm:self-auto">
          {sortedList.length} {sortedList.length === 1 ? 'dish available' : 'dishes available'}
        </span>
      </div>

      {!food_list || food_list.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 row-gap-8 mt-4">
          {[...Array(8)].map((_, i) => (
            <SkeletonFoodItem key={i} />
          ))}
        </div>
      ) : sortedList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 row-gap-8 mt-4">
          <AnimatePresence>
            {sortedList.map((item) => (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                category={item.category}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white/50 dark:bg-[#2b1f1d]/50 border border-dashed border-gray-200 dark:border-[#4a3833] rounded-3xl my-6"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-sm">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-text-dark dark:text-[#fcfbfa]">No dishes matched your criteria</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a09a8e] max-w-md mt-1.5 mb-6">
            Try adjusting your search keyword, dietary preferences, or price filter to find available dishes.
          </p>
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/25 hover:bg-primary-dark transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset All Filters
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default FoodDisplay

