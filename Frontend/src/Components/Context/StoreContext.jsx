import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

export const AVAILABLE_COUPONS = [
  {
    id: "cravely50",
    code: "CRAVELY50",
    title: "50% OFF up to ₹150",
    subtitle: "Valid on orders above ₹199 across all restaurants",
    badge: "POPULAR",
    discountType: "percent",
    discountValue: 50,
    maxDiscount: 150,
    minAmount: 199,
    expiry: "Ends in 2 days",
    terms: ["Max discount ₹150", "Minimum order value ₹199", "Applicable on all food items"]
  },
  {
    id: "welcome100",
    code: "WELCOME100",
    title: "Flat ₹100 OFF",
    subtitle: "Special welcome deal on orders above ₹299",
    badge: "WELCOME DEAL",
    discountType: "flat",
    discountValue: 100,
    maxDiscount: 100,
    minAmount: 299,
    expiry: "Valid for new users",
    terms: ["Flat ₹100 off", "Minimum cart value ₹299"]
  },
  {
    id: "freedel",
    code: "FREEDEL",
    title: "FREE Express Delivery",
    subtitle: "Save ₹40 delivery fee on orders above ₹149",
    badge: "VIP PERK",
    discountType: "freedelivery",
    discountValue: 40,
    maxDiscount: 40,
    minAmount: 149,
    expiry: "Always active",
    terms: ["Waives full delivery fee of ₹40", "Min order value ₹149"]
  },
  {
    id: "sweet20",
    code: "SWEET20",
    title: "20% OFF Gourmet Items",
    subtitle: "Get up to ₹120 OFF on orders above ₹399",
    badge: "CHEF SPECIAL",
    discountType: "percent",
    discountValue: 20,
    maxDiscount: 120,
    minAmount: 399,
    expiry: "Valid today",
    terms: ["20% off up to ₹120", "Min order value ₹399"]
  },
  {
    id: "cravepay",
    code: "CRAVEPAY",
    title: "15% Instant Discount",
    subtitle: "Save up to ₹100 on orders above ₹499",
    badge: "BANK OFFER",
    discountType: "percent",
    discountValue: 15,
    maxDiscount: 100,
    minAmount: 499,
    expiry: "Ends midnight",
    terms: ["15% discount up to ₹100", "Min order value ₹499"]
  },
  {
    id: "savemore",
    code: "SAVEMORE",
    title: "Flat ₹150 OFF Big Saver",
    subtitle: "Extra savings on large orders above ₹699",
    badge: "MEGA SAVER",
    discountType: "flat",
    discountValue: 150,
    maxDiscount: 150,
    minAmount: 699,
    expiry: "Valid this week",
    terms: ["Flat ₹150 discount", "Min order value ₹699"]
  }
];

const StoreContextProvider = (props) => {
  const [cartItems, setcartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cravely_cartItems");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [likedFoods, setLikedFoods] = useState({});
  const [likedRestaurants, setLikedRestaurants] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    mode: 'login',
    title: '',
    subtitle: '',
    onSuccess: null,
  });

  const openAuthModal = (options = {}) => {
    setAuthModalState({
      isOpen: true,
      mode: options.mode || 'login',
      title: options.title || '',
      subtitle: options.subtitle || '',
      onSuccess: options.onSuccess || null,
    });
  };

  const closeAuthModal = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Sync cartItems changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cravely_cartItems", JSON.stringify(cartItems || {}));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const url = import.meta.env.VITE_BACKEND_URL;

  const toggleLikeFood = async (foodId) => {
    setLikedFoods((prev) => {
      const updated = { ...prev };
      if (updated[foodId]) {
        delete updated[foodId];
      } else {
        updated[foodId] = true;
      }
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/user/toggle-like-food`,
          { foodId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.error("Toggle Like Food Error:", err.response?.data || err.message);
      }
    }
  };

  const toggleLikeRestaurant = async (restaurantId) => {
    setLikedRestaurants((prev) => {
      const updated = { ...prev };
      if (updated[restaurantId]) {
        delete updated[restaurantId];
      } else {
        updated[restaurantId] = true;
      }
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/user/toggle-like-restaurant`,
          { restaurantId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.error("Toggle Like Restaurant Error:", err.response?.data || err.message);
      }
    }
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setcartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      try {
        const res = await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Cart Add Response:", res.data);
      } catch (err) {
        console.error("Cart Add Error:", err.response?.data || err.message);
      }
    }
  };

  const addMultipleToCart = async (itemIds) => {
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) return;

    setcartItems((prev) => {
      const updated = { ...prev };
      itemIds.forEach((id) => {
        updated[id] = (updated[id] || 0) + 1;
      });
      return updated;
    });

    if (token) {
      try {
        for (const itemId of itemIds) {
          await axios.post(
            `${url}/api/cart/add`,
            { itemId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (err) {
        console.error("Batch Cart Add Error:", err.response?.data || err.message);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setcartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        const res = await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Cart Remove Response:", res.data);
      } catch (err) {
        console.error("Cart Remove Error:", err.response?.data || err.message);
      }
    }
  };

  const deleteFromCart = async (itemId) => {
    setcartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });

    if (token) {
      try {
        const res = await axios.post(
          `${url}/api/cart/delete`,
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Cart Delete Response:", res.data);
      } catch (err) {
        console.error("Cart Delete Error:", err.response?.data || err.message);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const applyCoupon = (couponOrCode) => {
    let coupon = typeof couponOrCode === 'string'
      ? AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === couponOrCode.trim().toUpperCase())
      : couponOrCode;

    if (!coupon) {
      return { success: false, message: "Invalid Coupon Code. Please check & try again." };
    }

    const subtotal = getTotalCartAmount();
    if (subtotal < coupon.minAmount) {
      return {
        success: false,
        message: `Minimum order amount of ₹${coupon.minAmount} required. Add ₹${coupon.minAmount - subtotal} more to apply.`
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon '${coupon.code}' applied successfully! 🎉` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getDeliveryFee = () => {
    const subtotal = getTotalCartAmount();
    if (subtotal === 0) return 0;
    if (appliedCoupon && appliedCoupon.discountType === 'freedelivery') {
      return 0;
    }
    if (subtotal > 500) {
      return 0;
    }
    return 40;
  };

  const getPlatformFee = () => {
    const subtotal = getTotalCartAmount();
    return subtotal > 0 ? 30 : 0;
  };

  const getRestaurantFee = () => {
    const subtotal = getTotalCartAmount();
    return subtotal > 0 ? 20 : 0;
  };

  const getGstAndTax = () => {
    const subtotal = getTotalCartAmount();
    return subtotal > 0 ? 20 : 0;
  };

  const getDiscountAmount = () => {
    const subtotal = getTotalCartAmount();
    if (!appliedCoupon || subtotal === 0) return 0;
    if (subtotal < appliedCoupon.minAmount) {
      return 0;
    }

    if (appliedCoupon.discountType === 'flat') {
      return Math.min(subtotal, appliedCoupon.discountValue);
    } else if (appliedCoupon.discountType === 'percent') {
      const calculated = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      return Math.min(calculated, appliedCoupon.maxDiscount || calculated);
    } else if (appliedCoupon.discountType === 'freedelivery') {
      return 40;
    }
    return 0;
  };

  const getFinalTotal = () => {
    const subtotal = getTotalCartAmount();
    if (subtotal === 0) return 0;
    const deliveryFee = getDeliveryFee();
    const platformFee = getPlatformFee();
    const restaurantFee = getRestaurantFee();
    const gstAndTax = getGstAndTax();
    const discount = appliedCoupon && appliedCoupon.discountType !== 'freedelivery' ? getDiscountAmount() : 0;
    return Math.max(0, subtotal + deliveryFee + platformFee + restaurantFee + gstAndTax - discount);
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("Fetch food list error:", error);
    }
  };

  const fetchRestaurantList = async () => {
    try {
      const response = await axios.get(url + "/api/restaurant/list");
      if (response.data.success) {
        setRestaurantList(response.data.data);
      }
    } catch (error) {
      console.error("Fetch restaurant list error:", error);
    }
  };

  const syncAndLoadCartData = async (userToken) => {
    if (!userToken) return;
    try {
      // Check current local cart
      let currentLocalCart = {};
      try {
        const saved = localStorage.getItem("cravely_cartItems");
        if (saved) currentLocalCart = JSON.parse(saved);
      } catch (e) {
        currentLocalCart = cartItems || {};
      }

      const hasLocalItems = Object.values(currentLocalCart || {}).some(qty => Number(qty) > 0);

      if (hasLocalItems) {
        // Sync local guest items into the user's server cart
        const syncRes = await axios.post(
          url + "/api/cart/sync",
          { cartData: currentLocalCart },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (syncRes.data.success && syncRes.data.cartData) {
          setcartItems(syncRes.data.cartData);
          localStorage.setItem("cravely_cartItems", JSON.stringify(syncRes.data.cartData));
          return;
        }
      }

      // If no local items or fallback, fetch user's existing DB cart
      const res = await axios.post(
        url + "/api/cart/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setcartItems(res.data.cartData || {});
        localStorage.setItem("cravely_cartItems", JSON.stringify(res.data.cartData || {}));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        console.error("Load/Sync Cart Error:", err.response?.data || err.message);
      }
    }
  };

  const loadFavoritesData = async (userToken) => {
    if (!userToken) return;
    try {
      const res = await axios.get(url + "/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res.data.success) {
        setLikedFoods(res.data.likedFoods || {});
        setLikedRestaurants(res.data.likedRestaurants || {});
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        console.error("Load Favorites Error:", err.response?.data || err.message);
      }
    }
  };

  const [userData, setUserData] = useState(null);

  const fetchUserProfile = async (userToken) => {
    const t = userToken || token;
    if (!t) {
      setUserData(null);
      return;
    }
    try {
      const res = await axios.get(url + "/api/user/profile", {
        headers: { Authorization: `Bearer ${t}` }
      });
      if (res.data.success) {
        setUserData(res.data.user);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        console.error("Fetch User Profile Error:", err.response?.data || err.message);
      }
    }
  };

  const [activeLiveOrder, setActiveLiveOrder] = useState(null);

  const fetchUserActiveOrder = async (userToken) => {
    const t = userToken || token;
    if (!t) {
      setActiveLiveOrder(null);
      return;
    }
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${t}` } }
      );
      if (response.data.success && response.data.data.length > 0) {
        // Filter for paid orders
        const paidOrders = response.data.data.filter(o => o.payment);
        if (paidOrders.length > 0) {
          const sorted = [...paidOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
          const latest = sorted[0];
          if (latest.status !== "Delivered") {
            setActiveLiveOrder(latest);
          } else {
            const timeDiff = Date.now() - new Date(latest.date).getTime();
            if (timeDiff < 10 * 60 * 1000) {
              setActiveLiveOrder(latest);
            } else {
              setActiveLiveOrder(null);
            }
          }
        } else {
          setActiveLiveOrder(null);
        }
      } else {
        setActiveLiveOrder(null);
      }
    } catch (err) {
      // Quietly ignore transient network switches / aborts
      if (err.message !== "Network Error" && err.code !== "ERR_NETWORK_CHANGED") {
        console.warn("Fetch Active Order info:", err.message);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cravely_cartItems");
    setToken("");
    setUserData(null);
    setcartItems({});
    setLikedFoods({});
    setLikedRestaurants({});
    setAppliedCoupon(null);
    setActiveLiveOrder(null);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchRestaurantList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      syncAndLoadCartData(token);
      loadFavoritesData(token);
      fetchUserProfile(token);
      fetchUserActiveOrder(token);
      
      // Real-time polling every 4 seconds for live admin status updates
      const interval = setInterval(() => {
        fetchUserActiveOrder(token);
      }, 4000);
      return () => clearInterval(interval);
    } else {
      setUserData(null);
      setActiveLiveOrder(null);
    }
  }, [token]);

  const contextValue = {
    food_list,
    restaurantList,
    restaurants_list: restaurantList,
    cartItems,
    setcartItems,
    addToCart,
    addMultipleToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    logout,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDeliveryFee,
    getPlatformFee,
    getRestaurantFee,
    getGstAndTax,
    getDiscountAmount,
    getFinalTotal,
    AVAILABLE_COUPONS,
    likedFoods,
    likedRestaurants,
    toggleLikeFood,
    toggleLikeRestaurant,
    activeLiveOrder,
    setActiveLiveOrder,
    fetchUserActiveOrder,
    userData,
    setUserData,
    fetchUserProfile,
    authModalState,
    openAuthModal,
    closeAuthModal,
    syncAndLoadCartData
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;