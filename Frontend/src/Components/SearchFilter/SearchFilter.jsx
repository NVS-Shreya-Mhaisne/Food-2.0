import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronDown, 
  X, 
  Star, 
  Leaf, 
  Flame, 
  Zap, 
  Tag, 
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

const SearchFilter = ({ filters = {}, onFilterChange, totalResults }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    search = '',
    dietary = 'all', // 'all', 'veg', 'non-veg'
    priceRange = 'all', // 'all', 'under200', '200to400', 'above400'
    minRating = 'all', // 'all', '4.0', '4.5'
    sortBy = 'popular' // 'popular', 'rating', 'priceLow', 'priceHigh'
  } = filters;

  const updateFilters = (key, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [key]: value
      });
    }
  };

  const handleReset = () => {
    if (onFilterChange) {
      onFilterChange({
        search: '',
        dietary: 'all',
        priceRange: 'all',
        minRating: 'all',
        sortBy: 'popular'
      });
    }
  };

  const activeCount = [
    search !== '',
    dietary !== 'all',
    priceRange !== 'all',
    minRating !== 'all',
    sortBy !== 'popular'
  ].filter(Boolean).length;

  const quickChips = [
    { id: 'all-chip', label: 'All Items', icon: Sparkles, active: dietary === 'all' && priceRange === 'all' && minRating === 'all', onClick: () => onFilterChange && onFilterChange({ ...filters, dietary: 'all', priceRange: 'all', minRating: 'all' }) },
    { id: 'veg', label: 'Pure Veg', active: dietary === 'veg', onClick: () => updateFilters('dietary', dietary === 'veg' ? 'all' : 'veg') },
    { id: 'non-veg', label: 'Non-Veg', active: dietary === 'non-veg', onClick: () => updateFilters('dietary', dietary === 'non-veg' ? 'all' : 'non-veg') },
    { id: 'vegan', label: 'Vegan', active: dietary === 'vegan', onClick: () => updateFilters('dietary', dietary === 'vegan' ? 'all' : 'vegan') },
    { id: 'jain', label: 'Jain', active: dietary === 'jain', onClick: () => updateFilters('dietary', dietary === 'jain' ? 'all' : 'jain') },
    { id: 'under300', label: 'Under ₹300', active: priceRange === 'under200' || priceRange === '200to400', onClick: () => updateFilters('priceRange', priceRange === 'under200' ? 'all' : 'under200') },
    { id: 'rating4', label: '4.0+ Star ⭐', active: minRating === '4.0', onClick: () => updateFilters('minRating', minRating === '4.0' ? 'all' : '4.0') },
    { id: 'popular', label: 'Top Rated 🔥', active: sortBy === 'rating', onClick: () => updateFilters('sortBy', sortBy === 'rating' ? 'popular' : 'rating') }
  ];

  return (
    <div className="w-full bg-white/60 dark:bg-[#2b1f1d]/60 backdrop-blur-xl border border-gray-150/60 dark:border-[#3a2b27]/60 rounded-3xl p-4 sm:p-6 shadow-xl shadow-black/[0.04] dark:shadow-black/20 my-6 transition-all">
      
      {/* Top Strip: Search Input & Action Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#a09a8e]" />
          <input
            type="text"
            value={search}
            onChange={(e) => updateFilters('search', e.target.value)}
            placeholder="Search delicious dishes, ingredients, or snacks..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-gray-50 dark:bg-[#352723] border border-gray-200/80 dark:border-[#4a3833] text-sm text-text-dark dark:text-[#f4f1ea] placeholder-gray-400 dark:placeholder-[#8c8477] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium"
          />
          {search && (
            <button
              onClick={() => updateFilters('search', '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls & Sort Dropdown */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Toggle Filter Drawer Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer border shadow-sm ${
              isOpen || activeCount > 0
                ? 'bg-primary text-white border-primary shadow-primary/25 shadow-md'
                : 'bg-gray-50 dark:bg-[#352723] text-gray-700 dark:text-[#f4f1ea] border-gray-200 dark:border-[#4a3833] hover:border-primary/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-primary text-[10px] font-black flex items-center justify-center shadow-xs">
                {activeCount}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => updateFilters('sortBy', e.target.value)}
              className="bg-gray-50 dark:bg-[#352723] border border-gray-200 dark:border-[#4a3833] text-xs font-bold text-text-dark dark:text-[#f4f1ea] pl-3 pr-8 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none"
            >
              <option value="popular">🔥 Most Popular</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="priceLow">💲 Price: Low to High</option>
              <option value="priceHigh">💲 Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quick Filter Badges Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 pb-1">
        {quickChips.map((chip) => (
          <button
            key={chip.id}
            onClick={chip.onClick}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
              chip.active
                ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20 dark:text-primary-light shadow-xs scale-[1.02]'
                : 'bg-gray-50 dark:bg-[#352723] text-gray-600 dark:text-[#d3cfc4] border-gray-200/60 dark:border-[#4a3833] hover:border-gray-300'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Expandable Advanced Filters Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-gray-100 dark:border-[#3a2b27] mt-4 pt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Dietary Filter */}
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-[#7f796d] block mb-2.5 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-500" /> Preference
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'veg', label: 'Pure Veg' },
                    { id: 'non-veg', label: 'Non-Veg' },
                    { id: 'vegan', label: 'Vegan' },
                    { id: 'jain', label: 'Jain' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateFilters('dietary', option.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        dietary === option.id
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm font-bold'
                          : 'bg-gray-50 dark:bg-[#352723] text-gray-600 dark:text-[#d3cfc4] border-gray-200/60 dark:border-[#4a3833] hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Tier Filter */}
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-[#7f796d] block mb-2.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" /> Max Price
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'Any Price' },
                    { id: 'under200', label: 'Under ₹200' },
                    { id: '200to400', label: '₹200 - ₹400' },
                    { id: 'above400', label: '₹400+' }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => updateFilters('priceRange', tier.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        priceRange === tier.id
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm font-bold'
                          : 'bg-gray-50 dark:bg-[#352723] text-gray-600 dark:text-[#d3cfc4] border-gray-200/60 dark:border-[#4a3833] hover:bg-gray-100'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-[#7f796d] block mb-2.5 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-primary" /> Minimum Rating
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Ratings' },
                    { id: '4.0', label: '4.0+ ★' },
                    { id: '4.5', label: '4.5+ ★' }
                  ].map((rat) => (
                    <button
                      key={rat.id}
                      onClick={() => updateFilters('minRating', rat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        minRating === rat.id
                          ? 'bg-primary text-white border-primary shadow-sm font-bold'
                          : 'bg-gray-50 dark:bg-[#352723] text-gray-600 dark:text-[#d3cfc4] border-gray-200/60 dark:border-[#4a3833] hover:bg-gray-100'
                      }`}
                    >
                      {rat.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Tags & Reset Strip */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-[#3a2b27] mt-4 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-gray-400 font-bold uppercase">Active:</span>
            
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                "{search}"
                <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => updateFilters('search', '')} />
              </span>
            )}
            
            {dietary !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                {dietary === 'veg' ? 'Pure Veg' : dietary === 'non-veg' ? 'Non-Veg' : dietary === 'vegan' ? 'Vegan' : 'Jain'}
                <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => updateFilters('dietary', 'all')} />
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                {priceRange === 'under200' ? 'Under ₹200' : priceRange === '200to400' ? '₹200-₹400' : '₹400+'}
                <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => updateFilters('priceRange', 'all')} />
              </span>
            )}

            {minRating !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                {minRating}+ ★
                <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => updateFilters('minRating', 'all')} />
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {typeof totalResults === 'number' && (
              <span className="text-xs font-semibold text-gray-500 dark:text-[#a09a8e]">
                Found <strong className="text-primary">{totalResults}</strong> dishes
              </span>
            )}
            <button
              onClick={handleReset}
              className="text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchFilter;

