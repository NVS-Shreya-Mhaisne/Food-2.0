import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Truck, ArrowRight, X, Heart, Utensils, Sparkles } from 'lucide-react'
import { StoreContext } from '../Context/StoreContext'
import pasta_hero from '../../assets/pasta_hero.png'

const PopularRestaurants = () => {
  const navigate = useNavigate()
  const { likedRestaurants, toggleLikeRestaurant, url } = useContext(StoreContext)
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    const fetchPopular = async () => {
      if (!url) return;
      try {
        const res = await axios.get(`${url}/api/restaurant/list`);
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const fetched = res.data.data.map((r, idx) => ({
            id: r._id || idx + 1,
            _id: r._id,
            name: r.name,
            rating: r.rating ? Number(r.rating) : 4.5,
            deliveryTime: r.deliveryTime || "20-30 mins",
            freeDelivery: true,
            openNow: true,
            image: r.image ? (r.image.startsWith('http') ? r.image : `${url}/images/${r.image}`) : pasta_hero,
            cuisine: `${r.priceRange || "Gourmet Outlet"} • ${r.itemCount || 0} dishes`,
            address: r.location || "City Center",
            itemCount: r.itemCount || 0,
            ownerName: r.ownerName,
            establishedYear: r.establishedYear
          }));
          setRestaurants(fetched);
        }
      } catch (err) {
        console.error("Fetch popular restaurants error:", err);
      }
    };
    fetchPopular();
  }, [url]);

  const renderRestaurantCard = (restaurant) => {
    const isLiked = likedRestaurants?.[restaurant.id] || false;
    return (
      <div 
        key={restaurant.id}
        onClick={() => navigate(`/restaurant/${restaurant._id || restaurant.id}`)}
        className="w-72 flex-shrink-0 bg-white/70 dark:bg-[#352723]/70 backdrop-blur-md rounded-3xl overflow-hidden border border-[#e1ded7]/60 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
      >
        {/* Top: Restaurant Image with Hover Zoom */}
        <div className="h-48 w-full relative overflow-hidden flex-shrink-0 bg-[#FFFBF9]">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#2b1f1d]/95 backdrop-blur-xs text-[10px] font-bold px-2.5 py-1 rounded-full text-primary shadow-xs uppercase tracking-wider font-mono">
            Popular
          </div>
          {restaurant.openNow && (
            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Open Now
            </div>
          )}

          {/* Heart Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeRestaurant(restaurant.id);
            }}
            className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 z-10 cursor-pointer ${
              isLiked 
                ? "bg-rose-500 text-white border-rose-500 shadow-md scale-110" 
                : "bg-white/80 dark:bg-black/40 text-gray-600 dark:text-gray-200 border-white/40 hover:bg-white dark:hover:bg-black/60 hover:text-rose-500"
            }`}
            title={isLiked ? "Unlike restaurant" : "Like restaurant"}
          >
            <Heart className={`w-4 h-4 transition-transform ${isLiked ? "fill-current scale-110" : ""}`} />
          </button>
        </div>

        {/* Bottom: Restaurant Details */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-3.5 text-left">
          <div className="flex flex-col gap-1.5">
            {/* Name */}
            <h3 className="font-serif text-lg font-bold text-[#2b1f1d] dark:text-[#f4f1ea] group-hover:text-primary transition-colors line-clamp-1">
              {restaurant.name}
            </h3>

            {/* Rating (5 Stars) */}
            <div className="flex items-center text-[#FF6B35] text-xs tracking-widest font-mono">
              {"★".repeat(Math.round(restaurant.rating) || 5)}
            </div>

            {/* Cuisine Info & Address */}
            <p className="text-[11px] text-gray-500 dark:text-[#a09a8e] font-sans font-medium line-clamp-1">
              {restaurant.cuisine}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-[#7f796d]">
              <MapPin className="w-3 h-3 flex-shrink-0 text-primary" />
              <span className="line-clamp-1">{restaurant.address}</span>
            </div>
          </div>

          {/* Delivery stats & View Menu action */}
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3.5 mt-0.5">
            <div className="flex flex-col gap-1 text-[10px] font-semibold text-gray-600 dark:text-[#d3cfc4]">
              {/* Delivery Time */}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400 dark:text-[#a09a8e]" />
                <span>{restaurant.deliveryTime}</span>
              </div>

              {/* Free Delivery */}
              {restaurant.freeDelivery && (
                <div className="flex items-center gap-1 text-primary">
                  <Truck className="w-3 h-3" />
                  <span>Free Delivery</span>
                </div>
              )}
            </div>

            {/* View Menu Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/restaurant/${restaurant._id || restaurant.id}`);
              }}
              className="bg-primary hover:bg-primary-hover text-white text-[11px] font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer hover:scale-103 active:scale-97 flex items-center gap-1"
            >
              <span>View Menu</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='mt-2 mb-6 py-2 scroll-mt-32' id='popular-restaurants'>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className='font-serif text-2xl sm:text-3xl font-bold text-text-dark dark:text-[#fcfbfa]'>
            Popular Restaurants
          </h2>
          <p className="text-xs text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
            Explore curated spots and click to view their full menu of dishes
          </p>
        </div>
        <button 
          onClick={() => navigate('/restaurants')}
          className="text-xs sm:text-sm font-bold text-primary hover:text-primary-hover hover:underline flex items-center gap-1 transition-colors cursor-pointer"
        >
          See All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scroll Container */}
      <div className="flex overflow-x-auto gap-6 no-scrollbar pb-6 scroll-smooth px-1">
        {restaurants.map(renderRestaurantCard)}

        {/* "Explore More" Card at the end of the scroll list */}
        <div 
          onClick={() => navigate('/restaurants')}
          className="w-72 flex-shrink-0 bg-[#fffdfb] dark:bg-[#352723]/30 rounded-3xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group min-h-[360px]"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowRight className="w-6 h-6 text-primary" />
          </div>
          <p className="font-serif text-lg font-bold text-primary">Explore All Restaurants</p>
          <p className="text-xs text-gray-500 dark:text-[#a09a8e] font-medium leading-relaxed">
            Discover all {restaurants.length}+ restaurants in your local area
          </p>
        </div>
      </div>
    </div>
  )
}

export default PopularRestaurants
