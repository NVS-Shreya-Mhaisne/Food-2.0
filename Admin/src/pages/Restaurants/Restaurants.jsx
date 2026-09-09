import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Plus,
  Star,
  Clock,
  MapPin,
  Utensils,
  Trash2,
  Search,
  DollarSign,
  X,
  ArrowRight,
  User,
  Calendar
} from 'lucide-react';

const Restaurants = ({ url }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    establishedYear: '2021',
    rating: '4.5',
    priceRange: 'Moderate (₹200 - ₹500)',
    deliveryTime: '20-30 mins',
    location: ''
  });

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/restaurant/list`);
      if (response.data.success) {
        setRestaurants(response.data.data);
      } else {
        toast.error("Failed to load restaurants");
      }
    } catch (error) {
      console.error("Fetch restaurants error:", error);
      toast.error("Error fetching restaurants list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      toast.error("Please fill restaurant name and location!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/restaurant/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Restaurant created! Now add food items.");
        setShowAddModal(false);
        const createdRestaurant = response.data.restaurant;
        setFormData({
          name: '',
          ownerName: '',
          establishedYear: '2021',
          rating: '4.5',
          priceRange: 'Moderate (₹200 - ₹500)',
          deliveryTime: '20-30 mins',
          location: ''
        });
        await fetchRestaurants();

        // Immediately switch to adding food items for this newly created restaurant
        navigate('/add', {
          state: {
            selectedRestaurantId: createdRestaurant._id,
            selectedRestaurantName: createdRestaurant.name
          }
        });
      } else {
        toast.error(response.data.message || "Failed to add restaurant");
      }
    } catch (error) {
      console.error("Add restaurant error:", error);
      const errMsg = error.response?.data?.message || "Something went wrong!";
      toast.error(errMsg);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.info("Please log out and sign in again to refresh your admin token.");
      }
    }
  };

  const handleDeleteRestaurant = async (restaurantId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" and all its dishes?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/restaurant/remove`,
        { restaurantId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchRestaurants();
      } else {
        toast.error("Failed to delete restaurant");
      }
    } catch (error) {
      console.error("Delete restaurant error:", error);
      toast.error(error.response?.data?.message || "Error deleting restaurant");
    }
  };

  const handleAddFoodDirect = (restaurant) => {
    navigate('/add', {
      state: {
        selectedRestaurantId: restaurant._id,
        selectedRestaurantName: restaurant.name
      }
    });
  };

  const handleViewFoodCatalog = (restaurantId) => {
    navigate('/list', { state: { filterRestaurantId: restaurantId } });
  };

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.ownerName && r.ownerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 p-4 sm:p-7 md:px-9 md:py-7 w-full max-w-full animate-page-fade">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-1">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8A5B] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Store size={20} />
            </div>
            Restaurants Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium pl-11">
            Manage restaurant outlets, view owner details, established year, delivery times, and menu dishes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] hover:from-[#E85522] hover:to-[#FF6B35] text-white text-xs font-bold px-4.5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
        >
          <Plus size={16} /> Add New Restaurant
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-7">
        <div className="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-2xl px-4 py-3 max-w-md shadow-xs focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-[#FF6B35]/15 transition-all">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by restaurant name, owner, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Add Restaurant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-page-fade">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Store size={20} className="text-[#FF6B35]" /> Create Restaurant Entry
              </h3>
              <button
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddRestaurant} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Store size={14} /> Restaurant Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Cravely Flagship Hub"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} /> Owner Name / Executive Chef
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. Chef Marco Rossi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={14} /> Established Year
                  </label>
                  <input
                    type="text"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    placeholder="e.g. 2018"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Star size={14} /> Rating Stars
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none transition-all cursor-pointer"
                  >
                    <option value="5.0">★ 5.0 Exceptional</option>
                    <option value="4.8">★ 4.8 Excellent</option>
                    <option value="4.5">★ 4.5 Very Good</option>
                    <option value="4.2">★ 4.2 Good</option>
                    <option value="4.0">★ 4.0 Standard</option>
                    <option value="3.5">★ 3.5 Average</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign size={14} /> Price Range
                  </label>
                  <select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none transition-all cursor-pointer"
                  >
                    <option value="Budget (Under ₹200)">Budget (Under ₹200)</option>
                    <option value="Moderate (₹200 - ₹500)">Moderate (₹200 - ₹500)</option>
                    <option value="Fine Dining (₹500+)">Fine Dining (₹500+)</option>
                    <option value="Luxury (₹1000+)">Luxury (₹1000+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} /> Delivery Time *
                  </label>
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none transition-all cursor-pointer"
                  >
                    <option value="15-20 mins">⚡ 15-20 mins (Express)</option>
                    <option value="20-30 mins">⚡ 20-30 mins (Fast Delivery)</option>
                    <option value="30-45 mins">🕒 30-45 mins (Standard)</option>
                    <option value="45-60 mins">🕒 45-60 mins (Extended)</option>
                    <option value="60+ mins">🚚 60+ mins (Catering)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} /> Location / Address *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Indiranagar, Bangalore"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 mt-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] hover:from-[#E85522] hover:to-[#FF6B35] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  Save & Add Food Items <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restaurant Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs text-center py-14 px-8 my-6">
          <p className="text-xs text-slate-500 font-semibold">Loading restaurant directory...</p>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs text-center py-14 px-8 my-6 flex flex-col items-center justify-center gap-3">
          <Store size={52} className="text-slate-300" />
          <h3 className="text-lg font-extrabold text-slate-800">No Restaurants Registered</h3>
          <p className="text-xs text-slate-500 max-w-md">
            Create your first restaurant entry with rating, owner details, price range, and delivery options!
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus size={18} /> Add Restaurant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-2 mb-12">
          {filteredRestaurants.map((restaurant) => {
            const hasCoverImage = restaurant.image && restaurant.image.trim() !== "";
            return (
              <div
                key={restaurant._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Header Cover Banner */}
                <div className="h-44 relative w-full overflow-hidden bg-slate-900">
                  {hasCoverImage ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FF6B35] via-[#FF8A5B] to-slate-900 flex items-center justify-center">
                      <Store size={48} className="text-white/40" />
                    </div>
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/10"></div>

                  {/* Top Badges & Actions */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black text-[#FF6B35] shadow-md">
                      <Star size={12} fill="#FF6B35" /> {restaurant.rating || "4.5"}
                    </span>

                    <button
                      className="w-8 h-8 rounded-xl bg-red-500/80 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 shadow-md cursor-pointer"
                      onClick={() => handleDeleteRestaurant(restaurant._id, restaurant.name)}
                      title="Delete Restaurant"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col">
                    <h3 className="text-lg font-black text-white drop-shadow-md truncate leading-tight">
                      {restaurant.name}
                    </h3>
                    <div className="inline-flex items-center gap-1 text-xs text-slate-200 font-medium mt-0.5">
                      <MapPin size={12} className="text-[#FF8A5B] shrink-0" />
                      <span className="truncate">{restaurant.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex flex-col gap-3.5 flex-1 justify-between">
                  {/* Owner & Established Badges */}
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 truncate" title={`Owner: ${restaurant.ownerName || 'Cravely Partner'}`}>
                      <User size={13} className="text-[#FF6B35] shrink-0" />
                      <span className="truncate">{restaurant.ownerName || 'Cravely Partner'}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-500 shrink-0 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Calendar size={12} className="text-slate-400" />
                      <span>Est. {restaurant.establishedYear || '2021'}</span>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <Clock size={12} /> {restaurant.deliveryTime || "20-30 mins"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                      {restaurant.priceRange || "Moderate (₹200 - ₹500)"}
                    </span>
                  </div>

                  {/* Added Items Counter Banner */}
                  <div className="bg-gradient-to-r from-slate-50 to-orange-50/50 border border-slate-200/80 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Utensils size={15} className="text-[#FF6B35]" />
                      <span className="text-xs font-bold text-slate-700">Added Dishes:</span>
                    </div>
                    <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] text-white text-xs font-extrabold px-3 py-0.5 rounded-full shadow-xs">
                      {restaurant.itemCount || 0} Items
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleAddFoodDirect(restaurant)}
                      className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] hover:from-[#E85522] hover:to-[#FF6B35] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      <Plus size={15} /> Add Food Item
                    </button>
                    <button
                      onClick={() => handleViewFoodCatalog(restaurant._id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-200 cursor-pointer border border-slate-200 hover:border-slate-300"
                    >
                      Dishes ({restaurant.itemCount || 0})
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
