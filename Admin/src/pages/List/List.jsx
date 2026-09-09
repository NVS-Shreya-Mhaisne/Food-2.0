import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Utensils,
  Search,
  Store,
  Star,
  Percent,
  Trash2,
  Tag,
  Plus,
  Check,
  X,
  MapPin,
  Pencil,
  Upload,
  Copy,
  Info
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

const List = ({ url }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantFilter, setSelectedRestaurantFilter] = useState(
    location.state?.filterRestaurantId || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDiscountId, setEditingDiscountId] = useState(null);
  const [tempDiscount, setTempDiscount] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingFood, setEditingFood] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    price: '',
    category: '',
    restaurantId: '',
    isTopDish: false,
    discount: '0'
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurant/list`);
      if (response.data.success) {
        setRestaurants(response.data.data);
      }
    } catch (error) {
      console.error("Fetch restaurants error:", error);
    }
  };

  const fetchList = async () => {
    setLoading(true);
    try {
      let endpoint = `${url}/api/food/list`;
      if (selectedRestaurantFilter) {
        endpoint += `?restaurantId=${selectedRestaurantFilter}`;
      }
      const response = await axios.get(endpoint);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch food catalog");
      }
    } catch (error) {
      console.error("Fetch list error:", error);
      toast.error("Error fetching food list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [url]);

  useEffect(() => {
    fetchList();
  }, [url, selectedRestaurantFilter]);

  const removeFood = async (foodId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from menu?`)) {
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { foodId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Food item deleted");
        fetchList();
      } else {
        toast.error(response.data.message || "Failed to delete food");
      }
    } catch (error) {
      console.error("Remove food error:", error);
      toast.error("Error deleting food item");
    }
  };

  const handleApplyDiscount = async (foodId, discountVal) => {
    const val = discountVal !== undefined ? discountVal : Number(tempDiscount);
    try {
      const response = await axios.post(
        `${url}/api/food/update-discount`,
        { foodId, discount: val || 0 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingDiscountId(null);
        fetchList();
      } else {
        toast.error(response.data.message || "Failed to update discount");
      }
    } catch (error) {
      console.error("Update discount error:", error);
      toast.error("Error updating discount");
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingFood(item);
    setEditFormData({
      name: item.name || '',
      description: item.description || '',
      ingredients: item.ingredients || '',
      price: item.price || '',
      category: item.category || 'Pizza',
      restaurantId: item.restaurantId?._id || item.restaurantId || '',
      isTopDish: !!item.isTopDish,
      discount: item.discount || '0'
    });
    setEditImageFile(null);
    setEditImagePreview(getImageUrl(item.image));
  };

  // Handle Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.price || !editFormData.category) {
      toast.error("Name, price, and category are required");
      return;
    }

    setSavingEdit(true);
    try {
      const formData = new FormData();
      formData.append('foodId', editingFood._id);
      formData.append('name', editFormData.name);
      formData.append('description', editFormData.description || editFormData.ingredients);
      formData.append('ingredients', editFormData.ingredients || editFormData.description);
      formData.append('price', editFormData.price);
      formData.append('category', editFormData.category);
      if (editFormData.restaurantId) {
        formData.append('restaurantId', editFormData.restaurantId);
      }
      formData.append('isTopDish', editFormData.isTopDish);
      formData.append('discount', editFormData.discount);

      if (editImageFile) {
        formData.append('image', editImageFile);
      }

      const response = await axios.post(
        `${url}/api/food/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Food item updated successfully");
        setEditingFood(null);
        fetchList();
      } else {
        toast.error(response.data.message || "Failed to update food item");
      }
    } catch (error) {
      console.error("Save Edit Error:", error);
      toast.error(error.response?.data?.message || "Error updating food item");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredList = list.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.restaurantName && item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.ingredients && item.ingredients.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDiscountedPrice = (item) => {
    if (!item.discount || item.discount <= 0) return item.price;
    return Math.round(item.price - (item.price * item.discount) / 100);
  };

  const getImageUrl = (imageStr) => {
    if (!imageStr) return '';
    if (imageStr.startsWith('http://') || imageStr.startsWith('https://')) {
      return imageStr;
    }
    return `${url}/images/${imageStr}`;
  };

  return (
    <div className="flex-1 p-4 sm:p-7 md:px-9 md:py-7 w-full max-w-full animate-page-fade">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-1">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8A5B] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Utensils size={20} />
            </div>
            Food Menu Catalog
          </h1>
          <p className="text-xs text-slate-500 font-medium pl-11">
            Browse all food dishes, filter by restaurant, edit dish details, add new items, and manage discounts.
          </p>
        </div>

        <button
          onClick={() => navigate('/add')}
          className="bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] hover:from-[#E85522] hover:to-[#FF6B35] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
        >
          <Plus size={16} /> Add New Dish
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-[260px] flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-[#FF6B35]/10 transition-all">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search dish by name, restaurant, category, or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="min-w-[240px] flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-xs">
          <Store size={18} className="text-[#FF6B35] shrink-0" />
          <select
            value={selectedRestaurantFilter}
            onChange={(e) => setSelectedRestaurantFilter(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-800 cursor-pointer"
          >
            <option value="">All Restaurants ({list.length} dishes)</option>
            {restaurants.map((rest) => (
              <option key={rest._id} value={rest._id}>
                {rest.name} ({rest.itemCount || 0} dishes)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog List Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs text-center py-14 px-8 my-4">
          <p className="text-xs text-slate-500 font-semibold">Loading food menu catalog...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs text-center py-14 px-8 my-4 flex flex-col items-center justify-center gap-3">
          <Utensils size={52} className="text-slate-300" />
          <h3 className="text-lg font-extrabold text-slate-800">No Food Items Found</h3>
          <p className="text-xs text-slate-500 max-w-md">
            {selectedRestaurantFilter
              ? "No food dishes added for this restaurant yet."
              : "No food items in the database catalog."}
          </p>
          <button
            onClick={() => navigate('/add')}
            className="mt-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus size={18} /> Add Dish
          </button>
        </div>
      ) : (
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3.5 bg-[#FFF8F5] border-b border-slate-200 text-[11px] font-extrabold text-[#FF6B35] uppercase tracking-wider">
            <span className="col-span-3">Dish</span>
            <span className="col-span-2">Restaurant Details</span>
            <span className="col-span-2">Category & Details</span>
            <span className="col-span-1">Price</span>
            <span className="col-span-1">Discount</span>
            <span className="col-span-1">Final Price</span>
            <span className="col-span-2 text-right pr-2">Actions</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {filteredList.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors duration-150"
              >
                {/* Dish Info */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                    {item.isTopDish && (
                      <span
                        className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-xs"
                        title="Restaurant Top Dish (Bestseller)"
                      >
                        <Star size={12} fill="#FF6B35" color="#FF6B35" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{item.name}</p>
                    {item.isTopDish && (
                      <span className="text-[10px] font-extrabold text-[#FF6B35] flex items-center gap-0.5 mt-0.5">
                        <Star size={10} fill="#FF6B35" /> Bestseller
                      </span>
                    )}
                  </div>
                </div>

                {/* Restaurant Details Column */}
                <div className="md:col-span-2 flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-900 inline-flex items-center gap-1.5">
                    <Store size={14} className="text-[#FF6B35] shrink-0" />
                    <span className="truncate">{item.restaurantName || "Cravely Kitchen"}</span>
                  </span>
                  {item.restaurantLocation && (
                    <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" />
                      <span className="truncate">{item.restaurantLocation}</span>
                    </span>
                  )}
                </div>

                {/* Category & Details Column */}
                <div className="md:col-span-2 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1">
                    <Tag size={12} className="text-slate-400" /> {item.category}
                  </span>
                  {item.ingredients && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight" title={item.ingredients}>
                      {item.ingredients}
                    </p>
                  )}
                </div>

                {/* Original Price */}
                <div className="md:col-span-1">
                  <span className="text-xs font-extrabold text-slate-900">₹{item.price}</span>
                </div>

                {/* Manage Discount Column */}
                <div className="md:col-span-1 flex items-center">
                  {editingDiscountId === item._id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="%"
                        value={tempDiscount}
                        onChange={(e) => setTempDiscount(e.target.value)}
                        className="w-12 px-1.5 py-1 rounded-lg border border-[#FF6B35] text-xs font-bold outline-none"
                      />
                      <button
                        onClick={() => handleApplyDiscount(item._id)}
                        className="bg-emerald-500 text-white w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer hover:bg-emerald-600"
                        title="Save Discount"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={() => setEditingDiscountId(null)}
                        className="bg-slate-200 text-slate-600 w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-300"
                        title="Cancel"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingDiscountId(item._id);
                        setTempDiscount(item.discount || '');
                      }}
                      className="bg-[#FFF0EB] text-[#FF6B35] border border-[#FFD4C4] hover:bg-[#FF6B35] hover:text-white px-2 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-0.5 transition-all cursor-pointer"
                      title="Quick edit discount"
                    >
                      <Percent size={10} /> {item.discount > 0 ? `${item.discount}%` : 'Add'}
                    </button>
                  )}
                </div>

                {/* After Discount Price */}
                <div className="md:col-span-1 flex items-center">
                  {item.discount > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-[#FF6B35]">₹{getDiscountedPrice(item)}</span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {item.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500">₹{item.price}</span>
                  )}
                </div>

                {/* ACTION COLUMN: Edit, Add Similar, and Delete Buttons */}
                <div className="md:col-span-2 flex items-center justify-end gap-1.5 pr-1">
                  {/* 1. Edit Food Button */}
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
                    title="Edit Food Details"
                  >
                    <Pencil size={14} />
                  </button>

                  {/* 2. Add / Duplicate Dish for this Restaurant */}
                  <button
                    onClick={() => navigate('/add', {
                      state: {
                        selectedRestaurantId: item.restaurantId?._id || item.restaurantId,
                        selectedRestaurantName: item.restaurantName
                      }
                    })}
                    className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
                    title={`Add New Dish for "${item.restaurantName || 'this restaurant'}"`}
                  >
                    <Plus size={15} />
                  </button>

                  {/* 3. Delete Food Button */}
                  <button
                    onClick={() => removeFood(item._id, item.name)}
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
                    title="Delete Food Item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT FOOD MODAL */}
      {editingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/65 backdrop-blur-xs animate-page-fade">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl lg:max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header (Compact) */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-[#FFF8F5] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Pencil size={15} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">Edit Dish: {editingFood.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setEditingFood(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors shadow-xs"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-6 sm:p-7 overflow-y-auto flex flex-col flex-1 gap-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7">
                
                {/* LEFT COLUMN: Core Details */}
                <div className="md:col-span-7 flex flex-col gap-4.5">
                  {/* Dish Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Dish Name *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Schezwan Hakka Noodles"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 bg-slate-50/40 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Restaurant Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Restaurant Outlet</label>
                    <select
                      value={editFormData.restaurantId}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, restaurantId: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 cursor-pointer bg-slate-50/40 focus:bg-white transition-all"
                    >
                      <option value="">Select Restaurant Outlet</option>
                      {restaurants.map((rest) => (
                        <option key={rest._id} value={rest._id}>
                          {rest.name} {rest.location ? `(${rest.location})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/40">
                      {allCategoryOptions.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setEditFormData(prev => ({ ...prev, category: cat.name }))}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            editFormData.category.includes(cat.name)
                              ? "bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs scale-105"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ingredients / Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Ingredients & Recipe Description</label>
                    <textarea
                      rows="4"
                      value={editFormData.ingredients}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                      placeholder="e.g. Wok-tossed noodles, bell peppers, fresh vegetables, schezwan chili sauce..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 resize-none bg-slate-50/40 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Cancel & Save Changes Action Buttons (Left Side) */}
                  <div className="flex items-center gap-3 pt-3 mt-1">
                    <button
                      type="submit"
                      disabled={savingEdit}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] hover:from-[#E85522] hover:to-[#FF6B35] text-white text-xs font-bold shadow-md shadow-orange-500/25 cursor-pointer transition-all disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {savingEdit ? (
                        <>Saving Changes...</>
                      ) : (
                        <>
                          <Check size={18} /> Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFood(null)}
                      className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: Pricing, Status & Image Replacement */}
                <div className="md:col-span-5 flex flex-col gap-4.5">
                  {/* Price & Discount Grid */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Base Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={editFormData.price}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="299"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 bg-slate-50/40 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editFormData.discount}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, discount: e.target.value }))}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 bg-slate-50/40 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Bestseller / Top Dish Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100">
                    <div className="flex items-center gap-2.5">
                      <Star size={18} className="text-[#FF6B35] fill-[#FF6B35]" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Mark as Bestseller</p>
                        <p className="text-[10px] text-slate-500">Highlight in popular banners & top dishes</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={editFormData.isTopDish}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, isTopDish: e.target.checked }))}
                      className="w-4 h-4 accent-[#FF6B35] cursor-pointer"
                    />
                  </div>

                  {/* IMAGE REPLACEMENT BOX */}
                  <div className="flex flex-col gap-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Dish Image {editImageFile && <span className="text-emerald-600 font-extrabold">(Ready to replace)</span>}
                    </label>

                    <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col gap-3">
                      {/* Image Preview Area */}
                      <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border border-slate-200 bg-white group shadow-xs">
                        {editImagePreview ? (
                          <img
                            src={editImagePreview}
                            alt="Dish Preview"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                            <Utensils size={32} />
                            <span className="text-xs font-bold mt-1.5">No image available</span>
                          </div>
                        )}

                        {/* Overlay Tag */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-extrabold">
                          {editImageFile ? "✨ New Photo Selected" : "Current Photo"}
                        </div>

                        {/* Revert button if new file selected */}
                        {editImageFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditImageFile(null);
                              setEditImagePreview(getImageUrl(editingFood.image));
                            }}
                            className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-extrabold cursor-pointer hover:bg-red-700 shadow-sm"
                            title="Revert to original photo"
                          >
                            Revert Photo
                          </button>
                        )}
                      </div>

                      {/* File Upload Input / Replace Button */}
                      <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#FF6B35]/40 hover:border-[#FF6B35] bg-[#FFF8F5] hover:bg-orange-100/50 rounded-xl transition-all cursor-pointer text-center shadow-xs">
                        <Upload size={18} className="text-[#FF6B35]" />
                        <span className="text-xs font-extrabold text-[#FF6B35]">
                          {editImageFile ? "Change Selected Image" : "Replace Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setEditImageFile(file);
                              setEditImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 text-center font-medium">
                        Supports JPG, PNG, WEBP. Uploading a new photo replaces the previous dish image.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
