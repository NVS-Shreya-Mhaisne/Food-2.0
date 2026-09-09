import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Upload,
  Utensils,
  Store,
  Tag,
  Star,
  Percent,
  PlusCircle,
  FileText,
  DollarSign,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Search,
  ChevronDown
} from 'lucide-react';

const allCategoryOptions = [
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Pasta', icon: '🍝' },
  { name: 'Biryani', icon: '🍲' },
  { name: 'Rice', icon: '🍚' },
  { name: 'Noodles', icon: '🍜' },
  { name: 'Salad', icon: '🥗' },
  { name: 'Rolls', icon: '🌯' },
  { name: 'Sandwich', icon: '🥪' },
  { name: 'Pure Veg', icon: '🥬' },
  { name: 'Cake', icon: '🍰' },
  { name: 'Dessert', icon: '🍨' },
  { name: 'Beverages', icon: '🥤' }
];

const Add = ({ url }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(
    location.state?.selectedRestaurantId || ''
  );
  const [selectedCategories, setSelectedCategories] = useState(['Pizza']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  const [data, setData] = useState({
    name: '',
    description: '',
    ingredients: '',
    price: '',
    isTopDish: false,
    discount: '0'
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${url}/api/restaurant/list`);
        if (response.data.success) {
          setRestaurants(response.data.data);
          if (!selectedRestaurantId && response.data.data.length > 0) {
            setSelectedRestaurantId(response.data.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Fetch restaurants error:", error);
      }
    };
    fetchRestaurants();
  }, [url]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        if (prev.length === 1) {
          toast.info("At least one category must be selected.");
          return prev;
        }
        return prev.filter(c => c !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const applyDiscountPreset = (val) => {
    setData(prev => ({ ...prev, discount: val.toString() }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!selectedRestaurantId) {
      toast.error("Please select a target restaurant!");
      return;
    }

    if (!image) {
      toast.error("Please upload a dish photo!");
      return;
    }

    if (!data.name || !data.price) {
      toast.error("Please enter dish name and price!");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one dish category!");
      return;
    }

    const categoryString = selectedCategories.join(', ');

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || data.ingredients);
    formData.append("ingredients", data.ingredients);
    formData.append("price", Number(data.price));
    formData.append("category", categoryString);
    formData.append("image", image);
    formData.append("restaurantId", selectedRestaurantId);
    formData.append("isTopDish", data.isTopDish);
    formData.append("discount", Number(data.discount) || 0);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success(`"${data.name}" added to menu!`);
        setData({
          name: '',
          description: '',
          ingredients: '',
          price: '',
          isTopDish: false,
          discount: '0'
        });
        setSelectedCategories(['Pizza']);
        setImage(false);
      } else {
        toast.error(response.data.message || "Failed to add food dish");
      }
    } catch (error) {
      console.error("Error adding food:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const calculateFinalPrice = () => {
    const p = Number(data.price) || 0;
    const d = Number(data.discount) || 0;
    if (d <= 0 || p <= 0) return p;
    return Math.round(p - (p * d) / 100);
  };

  const activeRestaurantObj = restaurants.find(r => r._id === selectedRestaurantId);

  return (
    <div className="flex-1 p-4 sm:p-7 md:px-9 md:py-7 w-full max-w-full animate-page-fade">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-1">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8A5B] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <PlusCircle size={20} />
            </div>
            Add Food Dish
          </h1>
          <p className="text-xs text-slate-500 font-medium pl-11">
            Configure dish details, photo, categories, top dish status, and discount offers.
          </p>
        </div>

        {selectedRestaurantId && (
          <button
            onClick={() => navigate('/list', { state: { filterRestaurantId: selectedRestaurantId } })}
            className="bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:text-[#FF6B35] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            View Restaurant Menu
          </button>
        )}
      </div>

      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
          {/* Restaurant Selector Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Store size={20} className="text-[#FF6B35]" />
              <h3 className="text-base font-extrabold text-slate-900">Select Target Restaurant</h3>
            </div>

            {restaurants.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                <select
                  value={selectedRestaurantId}
                  onChange={(e) => setSelectedRestaurantId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 outline-none transition-all cursor-pointer"
                >
                  {restaurants.map((rest) => (
                    <option key={rest._id} value={rest._id}>
                      {rest.name} ({rest.location}) - {rest.itemCount || 0} dishes
                    </option>
                  ))}
                </select>

                {activeRestaurantObj && (
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 px-4 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Adding items for <strong className="font-bold">{activeRestaurantObj.name}</strong> ({activeRestaurantObj.location})</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 p-4 px-5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-red-900">
                <div className="flex items-center gap-3">
                  <Info size={20} className="shrink-0 text-red-600" />
                  <div>
                    <strong className="text-xs font-bold block">No restaurants created yet.</strong>
                    <p className="text-[11px] text-red-700">Create a restaurant entry first before adding dishes.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/restaurants')}
                  className="bg-[#FF6B35] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                >
                  Create Restaurant
                </button>
              </div>
            )}
          </div>

          <hr className="border-slate-200" />

          {/* Dish Information */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Utensils size={20} className="text-[#FF6B35]" />
              <h3 className="text-base font-extrabold text-slate-900">Dish Information & Media</h3>
            </div>

            {/* Photo Upload Zone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Upload size={14} /> Dish Photo *
              </label>
              <div className="mt-0.5">
                <label
                  htmlFor="image"
                  className="block w-full max-w-xs sm:max-w-sm h-44 border-2 border-dashed border-slate-300 hover:border-[#FF6B35] rounded-2xl bg-slate-50 hover:bg-[#FFF8F5] cursor-pointer overflow-hidden transition-all duration-200"
                >
                  {image ? (
                    <div className="relative w-full h-full group">
                      <img src={URL.createObjectURL(image)} alt="Dish Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/65 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Click to replace photo
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center text-slate-500">
                      <Upload size={36} className="text-[#FF6B35] mb-2" />
                      <p className="text-xs font-bold text-slate-800">Drop dish image here or click to browse</p>
                      <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, WEBP</p>
                    </div>
                  )}
                </label>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id='image'
                  accept="image/*"
                  hidden
                />
              </div>
            </div>

            {/* Dish Name & Dish Category Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Dish Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils size={14} /> Dish Name *
                </label>
                <input
                  onChange={onChangeHandler}
                  value={data.name}
                  type="text"
                  name='name'
                  placeholder='e.g. Gourmet Truffle Mushroom Pizza'
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 outline-none transition-all"
                  required
                />
              </div>

              {/* Searchable Multi-Select Dropdown with Active Tag Chips */}
              <div className="flex flex-col gap-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={14} className="text-[#FF6B35]" /> Dish Category *
                  </label>
                  <span className="text-[10px] font-bold text-[#FF6B35] bg-[#FFF0EB] border border-[#FFD4C4] px-2 py-0.5 rounded-full">
                    {selectedCategories.length} Selected
                  </span>
                </div>

                {/* Active Selected Tags & Trigger Field */}
                <div
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="w-full min-h-[42px] p-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#FF6B35] transition-all cursor-pointer flex flex-wrap items-center gap-1.5 shadow-xs"
                >
                  {selectedCategories.length === 0 ? (
                    <span className="text-xs text-slate-400 font-medium">Click to select categories...</span>
                  ) : (
                    selectedCategories.map((catName) => {
                      const catObj = allCategoryOptions.find(c => c.name === catName);
                      return (
                        <span
                          key={catName}
                          className="inline-flex items-center gap-1 bg-[#FFF0EB] text-[#FF6B35] border border-[#FFD4C4] text-[11px] font-bold px-2 py-0.5 rounded-lg"
                        >
                          <span>{catObj?.icon || '🏷️'}</span>
                          <span>{catName}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryToggle(catName);
                            }}
                            className="hover:text-red-600 cursor-pointer ml-0.5"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      );
                    })
                  )}
                  <div className="ml-auto flex items-center gap-1 text-slate-400 pl-2">
                    <ChevronDown size={15} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#FF6B35]' : ''}`} />
                  </div>
                </div>

                {/* Dropdown Menu Popup */}
                {isDropdownOpen && (
                  <div className="absolute z-40 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 flex flex-col gap-2 animate-page-fade">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                      <Search size={14} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search categories (e.g. Rice, Pizza)..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full bg-transparent text-xs font-medium outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {categorySearch && (
                        <button type="button" onClick={() => setCategorySearch('')} className="text-slate-400 hover:text-slate-600">
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5 pr-1">
                      {allCategoryOptions
                        .filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))
                        .map((cat) => {
                          const isSelected = selectedCategories.includes(cat.name);
                          return (
                            <div
                              key={cat.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryToggle(cat.name);
                              }}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-[#FFF0EB] text-[#FF6B35]'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{cat.icon}</span>
                                <span>{cat.name}</span>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                  isSelected ? 'bg-[#FF6B35] border-[#FF6B35] text-white' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check size={11} strokeWidth={3} />}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold pl-1">
                        {selectedCategories.length} active
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDropdownOpen(false);
                        }}
                        className="bg-[#FF6B35] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs cursor-pointer hover:bg-[#E85522]"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} /> Ingredients Needed *
              </label>
              <textarea
                onChange={onChangeHandler}
                value={data.ingredients}
                name="ingredients"
                rows="3"
                placeholder='List key ingredients (e.g., Fresh Mozzarella, Truffle Oil, Wild Mushrooms, Basil, Extra Virgin Olive Oil)'
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 outline-none transition-all resize-y min-h-[80px]"
                required
              ></textarea>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Pricing & Offers Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-[#FF6B35]" />
              <h3 className="text-base font-extrabold text-slate-900">Pricing & Discounts</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign size={14} /> Price (₹) *
                </label>
                <input
                  onChange={onChangeHandler}
                  value={data.price}
                  type="number"
                  name='price'
                  placeholder='e.g. 299'
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:border-[#FF6B35] outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent size={14} /> Discount Percentage (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    onChange={onChangeHandler}
                    value={data.discount}
                    type="number"
                    name='discount'
                    min="0"
                    max="100"
                    placeholder='0'
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:border-[#FF6B35] outline-none transition-all"
                  />
                  {Number(data.discount) > 0 && (
                    <button
                      type="button"
                      onClick={() => applyDiscountPreset(0)}
                      className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer shrink-0"
                      title="Clear Discount"
                    >
                      <XCircle size={14} /> Remove Discount
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Quick Preset Offers:
              </span>
              {[10, 15, 20, 25, 50].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => applyDiscountPreset(val)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    Number(data.discount) === val
                      ? 'bg-[#FF6B35] text-white border-transparent'
                      : 'bg-slate-100 border border-slate-300 text-slate-600 hover:bg-[#FF6B35] hover:text-white'
                  }`}
                >
                  {val}% OFF
                </button>
              ))}
            </div>

            {/* Realtime Price Calculation Card */}
            {Number(data.price) > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 px-6 flex flex-wrap items-center justify-around gap-4 mt-1">
                <div className="flex flex-col items-center text-xs text-slate-500">
                  <span>Original Price</span>
                  <strong className="text-sm font-extrabold text-slate-900 mt-0.5">₹{data.price}</strong>
                </div>
                {Number(data.discount) > 0 && (
                  <>
                    <div className="flex flex-col items-center text-xs text-emerald-600">
                      <span>Discount ({data.discount}%)</span>
                      <strong className="text-sm font-extrabold text-emerald-600 mt-0.5">
                        - ₹{Math.round((Number(data.price) * Number(data.discount)) / 100)}
                      </strong>
                    </div>
                    <div className="flex flex-col items-center text-xs text-slate-500">
                      <span>Final Price</span>
                      <strong className="text-base font-black text-[#FF6B35] mt-0.5">₹{calculateFinalPrice()}</strong>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Top Dish / Bestseller Switch */}
            <div className="bg-[#FFF8F5] border border-[#FFD4C4] rounded-xl p-3.5 px-5 mt-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isTopDish"
                    checked={data.isTopDish}
                    onChange={onChangeHandler}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                </div>
                <div className="flex flex-col">
                  <strong className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Star size={16} fill={data.isTopDish ? "#FF6B35" : "none"} color="#FF6B35" />
                    Restaurant Top Dish
                  </strong>
                  <span className="text-[11px] text-slate-500">Mark dish as a Bestseller badge on menu</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type='submit'
              className="bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] hover:from-[#E85522] hover:to-[#FF6B35] text-white text-xs font-extrabold px-7 py-3 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles size={18} /> Save Dish to Restaurant Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
