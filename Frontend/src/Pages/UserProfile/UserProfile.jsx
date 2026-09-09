import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Components/Context/StoreContext'
import {
  User,
  Camera,
  Edit3,
  MapPin,
  Heart,
  Clock,
  Plus,
  X,
  Check,
  Trash2,
  ChevronRight,
  Star,
  Package,
  Utensils,
  Save,
  Mail,
  Phone,
  Shield
} from 'lucide-react'

// Import food/restaurant images for favorites demo
import pasta_hero from '../../assets/pasta_hero.png'
import dish_smash_burger from '../../assets/dish_smash_burger.png'
import dish_salmon_poke from '../../assets/dish_salmon_poke.png'
import dish_truffle_pizza from '../../assets/dish_truffle_pizza.png'
import food_2 from '../../assets/food_2.png'
import food_14 from '../../assets/food_14.png'

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

const UserProfile = () => {
  const navigate = useNavigate()
  const { token, food_list, restaurantList, likedFoods, likedRestaurants, url, userData, fetchUserProfile } = useContext(StoreContext)
  const fileInputRef = useRef(null)

  // Active section tab
  const [activeSection, setActiveSection] = useState('profile')

  // Profile state initialized with real logged-in user data or fallback
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: userData?.name || 'Cravely User',
    email: userData?.email || 'user@cravely.com',
    phone: userData?.phone || '+91 98765 43210',
    bio: userData?.bio || 'Food enthusiast who loves exploring new restaurants and cuisines. 🍕🍔🍣'
  })
  const [editData, setEditData] = useState({ ...profileData })
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Sync state whenever userData updates from backend
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || 'Cravely User',
        email: userData.email || 'user@cravely.com',
        phone: userData.phone || '',
        bio: userData.bio || 'Food enthusiast who loves exploring new restaurants and cuisines. 🍕🍔🍣'
      })
      setEditData({
        name: userData.name || 'Cravely User',
        email: userData.email || 'user@cravely.com',
        phone: userData.phone || '',
        bio: userData.bio || 'Food enthusiast who loves exploring new restaurants and cuisines. 🍕🍔🍣'
      })
      if (userData.profileImage) {
        setProfileImage(userData.profileImage)
      }
      if (userData.addresses && userData.addresses.length > 0) {
        setAddresses(userData.addresses)
      }
    }
  }, [userData])

  // Addresses state
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: 'Indiranagar, Bangalore, KA 560038', isDefault: true },
    { id: 2, label: 'Work', address: 'Koramangala, Bangalore, KA 560095', isDefault: false },
  ])
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', address: '' })

  // Dynamic Favorite Restaurants
  const favoriteRestaurants = (restaurantList || [])
    .filter(r => likedRestaurants?.[r._id] || likedRestaurants?.[r.id])
    .map((r, idx) => ({
      id: r._id || idx + 1,
      name: r.name,
      cuisine: `${r.priceRange || "Gourmet Outlet"} • ${r.location || "City"}`,
      rating: r.rating ? Math.round(Number(r.rating)) : 5,
      image: r.image ? (r.image.startsWith('http') ? r.image : `${url}/images/${r.image}`) : ""
    }))

  // Dynamic Favorite Foods
  const favoriteFoods = (food_list || [])
    .filter(f => likedFoods?.[f._id] || likedFoods?.[f.id])
    .map((f, idx) => ({
      id: f._id || idx + 1,
      name: f.name,
      price: `₹${f.price}`,
      image: f.image ? (f.image.startsWith('http') ? f.image : `${url}/images/${f.image}`) : ""
    }))

  // Dynamic Order History from Backend API
  const [userOrdersList, setUserOrdersList] = useState([])
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!token) return
      try {
        const response = await axios.post(
          `${url}/api/order/userorders`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.data.success && response.data.data) {
          const formatted = response.data.data.map(order => ({
            id: `ORD-${(order._id || '').slice(-6).toUpperCase()}`,
            date: new Date(order.date || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            items: order.items ? order.items.map(i => `${i.name} × ${i.quantity}`).join(', ') : 'Food Items',
            total: `₹${order.amount}`,
            status: order.status || 'Delivered'
          }))
          setUserOrdersList(formatted)
        }
      } catch (err) {
        console.error("Fetch profile order history error:", err)
      }
    }
    fetchUserOrders()
  }, [token, url])

  const orderHistory = userOrdersList

  const sidebarItems = [
    { id: 'profile', label: 'Edit Profile', icon: Edit3, emoji: '👤' },
    { id: 'picture', label: 'Profile Picture', icon: Camera, emoji: '📷' },
    { id: 'addresses', label: 'My Addresses', icon: MapPin, emoji: '📍' },
    { id: 'fav-restaurants', label: 'Favorite Restaurants', icon: Heart, emoji: '❤️' },
    { id: 'fav-foods', label: 'Favorite Foods', icon: Heart, emoji: '❤️' },
    { id: 'history', label: 'Order History', icon: Clock, emoji: '🕒' },
  ]

  // Handlers
  const handleSaveProfile = async () => {
    setProfileData({ ...editData })
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
    if (token) {
      try {
        await axios.post(
          `${url}/api/user/profile/update`,
          {
            name: editData.name,
            phone: editData.phone,
            bio: editData.bio
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (fetchUserProfile) fetchUserProfile(token)
      } catch (err) {
        console.error("Failed to update profile on backend:", err)
      }
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result
        setProfileImage(base64)
        if (token) {
          try {
            await axios.post(
              `${url}/api/user/profile/update`,
              { profileImage: base64 },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            if (fetchUserProfile) fetchUserProfile(token)
          } catch (err) {
            console.error("Failed to update image on backend:", err)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddAddress = async () => {
    if (newAddress.label.trim() && newAddress.address.trim()) {
      const updated = [...addresses, { id: Date.now(), ...newAddress, isDefault: false }]
      setAddresses(updated)
      setNewAddress({ label: '', address: '' })
      setShowAddAddress(false)
      if (token) {
        try {
          await axios.post(
            `${url}/api/user/profile/update`,
            { addresses: updated },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        } catch (err) {
          console.error("Failed to save addresses:", err)
        }
      }
    }
  }

  const handleDeleteAddress = async (id) => {
    const updated = addresses.filter(a => a.id !== id)
    setAddresses(updated)
    if (token) {
      try {
        await axios.post(
          `${url}/api/user/profile/update`,
          { addresses: updated },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (err) {
        console.error("Failed to update addresses after deletion:", err)
      }
    }
  }

  const handleSetDefault = async (id) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }))
    setAddresses(updated)
    if (token) {
      try {
        await axios.post(
          `${url}/api/user/profile/update`,
          { addresses: updated },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (err) {
        console.error("Failed to update default address:", err)
      }
    }
  }

  const inputClasses = "w-full border border-gray-200 dark:border-[#4a3833] bg-white dark:bg-[#352723] focus:border-primary outline-none px-4 py-3 rounded-xl text-sm transition-all text-text-dark dark:text-[#e5e0d8] dark:placeholder-[#777] font-medium"

  return (
    <div className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto py-6 sm:py-8">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-dark dark:text-[#f4f1ea]">
          User Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
          Manage your account settings, addresses, and favorites
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-stretch">

        {/* === SIDEBAR NAVIGATION === */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-[275px] flex-shrink-0 lg:self-stretch flex flex-col"
        >
          <div className="bg-white dark:bg-[#2b1f1d] rounded-3xl border border-gray-150/80 dark:border-[#3a2b27] shadow-lg shadow-black/[0.03] dark:shadow-black/20 overflow-hidden flex-1 flex flex-col">

            {/* Profile Card Header — Sleek & Compact */}
            <div className="p-3.5 border-b border-gray-100 dark:border-[#3a2b27] text-center bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/2">
              <div className="relative w-13 h-13 mx-auto mb-2">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-secondary to-[#ff806b] flex items-center justify-center overflow-hidden ring-4 ring-primary/10 shadow-md">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#2b1f1d] rounded-full shadow-sm" />
              </div>

              <h3 className="font-serif text-sm sm:text-base font-bold text-text-dark dark:text-[#f4f1ea] leading-tight">
                {profileData.name}
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-[#7f796d] font-mono mt-0.5 flex items-center justify-center gap-1">
                <span>Premium Member</span>
                <span>•</span>
                <span className="text-primary font-bold">VIP</span>
              </p>

              {/* Quick Stats Block — Compact */}
              <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2.5 border-t border-gray-100 dark:border-[#3a2b27]">
                <div className="text-center">
                  <p className="text-xs font-extrabold text-primary font-mono leading-none">4</p>
                  <p className="text-[8px] text-gray-400 dark:text-[#7f796d] font-bold uppercase tracking-wider mt-1">Orders</p>
                </div>
                <div className="w-px h-5 bg-gray-100 dark:bg-[#3a2b27] justify-self-center self-center" />
                <div className="text-center">
                  <p className="text-xs font-extrabold text-primary font-mono leading-none">{addresses.length}</p>
                  <p className="text-[8px] text-gray-400 dark:text-[#7f796d] font-bold uppercase tracking-wider mt-1">Places</p>
                </div>
                <div className="w-px h-5 bg-gray-100 dark:bg-[#3a2b27] justify-self-center self-center" />
                <div className="text-center">
                  <p className="text-xs font-extrabold text-primary font-mono leading-none">9</p>
                  <p className="text-[8px] text-gray-400 dark:text-[#7f796d] font-bold uppercase tracking-wider mt-1">Saved</p>
                </div>
              </div>
            </div>

            {/* Nav Items — Sleek & Compact */}
            <div className="p-2.5 flex flex-col justify-between flex-1 gap-0.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer border-l-4 ${isActive
                        ? 'bg-gradient-to-r from-primary/10 to-primary/2 border-primary text-primary font-bold shadow-2xs'
                        : 'border-transparent text-text-dark/80 dark:text-[#d3cfc4] hover:bg-gray-50/80 dark:hover:bg-[#352723]/60'
                      }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary/10 text-primary' : item.color
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs flex-1 font-semibold">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary opacity-80" />}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* === MAIN CONTENT AREA === */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 min-w-0 flex flex-col"
        >
          <AnimatePresence mode="wait">

            {/* ======= EDIT PROFILE SECTION ======= */}
            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white dark:bg-[#2b1f1d] rounded-3xl border border-gray-100 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20 p-5 sm:p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Edit3 className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-text-dark dark:text-[#f4f1ea]">Edit Profile</h2>
                      <p className="text-[11px] text-gray-400 dark:text-[#7f796d]">Update your personal information</p>
                    </div>
                  </div>
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setIsEditing(true); setEditData({ ...profileData }) }}
                      className="text-xs font-bold text-primary border border-primary/30 hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(false)}
                        className="text-xs font-bold text-gray-500 dark:text-[#a09a8e] border border-gray-200 dark:border-[#4a3833] px-3 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Success Toast */}
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Profile updated successfully!
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-[#a09a8e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className={inputClasses}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-text-dark dark:text-[#f4f1ea] py-3 px-4 bg-gray-50 dark:bg-[#352723] rounded-xl">{profileData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-[#a09a8e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className={inputClasses}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-text-dark dark:text-[#f4f1ea] py-3 px-4 bg-gray-50 dark:bg-[#352723] rounded-xl">{profileData.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-[#a09a8e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className={inputClasses}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-text-dark dark:text-[#f4f1ea] py-3 px-4 bg-gray-50 dark:bg-[#352723] rounded-xl">{profileData.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-[#a09a8e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        rows={3}
                        className={`${inputClasses} resize-none`}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-text-dark dark:text-[#f4f1ea] py-3 px-4 bg-gray-50 dark:bg-[#352723] rounded-xl">{profileData.bio}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======= PROFILE PICTURE SECTION ======= */}
            {activeSection === 'picture' && (
              <motion.div
                key="picture"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white dark:bg-[#2b1f1d] rounded-3xl border border-gray-100 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20 p-5 sm:p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Camera className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-text-dark dark:text-[#f4f1ea]">Profile Picture</h2>
                    <p className="text-[11px] text-gray-400 dark:text-[#7f796d]">Upload or change your avatar</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  {/* Large Avatar Preview */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative group"
                  >
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary via-secondary to-[#ff806b] flex items-center justify-center overflow-hidden ring-4 ring-primary/20 shadow-2xl shadow-primary/10">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-white/80" />
                      )}
                    </div>
                    {/* Overlay on hover */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <span className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-3 border-white dark:border-[#2b1f1d] rounded-full" />
                  </motion.div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Upload Photo
                    </motion.button>
                    {profileImage && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProfileImage(null)}
                        className="text-xs font-bold text-rose-500 border border-rose-500/30 hover:bg-rose-500/5 px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </motion.button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-[#7f796d] text-center">
                    Supported: JPG, PNG, GIF. Max size: 5MB.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ======= ADDRESSES SECTION ======= */}
            {activeSection === 'addresses' && (
              <motion.div
                key="addresses"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white dark:bg-[#2b1f1d] rounded-3xl border border-gray-100 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20 p-5 sm:p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-text-dark dark:text-[#f4f1ea]">My Addresses</h2>
                      <p className="text-[11px] text-gray-400 dark:text-[#7f796d]">Manage your delivery addresses</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddAddress(true)}
                    className="text-xs font-bold text-primary border border-primary/30 hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New
                  </motion.button>
                </div>

                <div className="flex flex-col gap-3">
                  {addresses.map((addr) => (
                    <motion.div
                      key={addr.id}
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-[#3a2b27] hover:border-primary/30 transition-all group bg-gray-50/50 dark:bg-[#352723]/50"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${addr.isDefault ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-[#3a2b27] text-gray-400 dark:text-[#7f796d]'
                        }`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-text-dark dark:text-[#f4f1ea]">{addr.label}</p>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-[#a09a8e] truncate mt-0.5">{addr.address}</p>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!addr.isDefault && (
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSetDefault(addr.id)}
                            title="Set as default"
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>
                        )}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteAddress(addr.id)}
                          title="Delete address"
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Add Address Form */}
                <AnimatePresence>
                  {showAddAddress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 dark:bg-primary/5">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-primary">Add New Address</p>
                          <button onClick={() => setShowAddAddress(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid gap-3">
                          <input
                            type="text"
                            placeholder="Label (e.g. Home, Work, Gym)"
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="text"
                            placeholder="Full address"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            className={inputClasses}
                          />
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddAddress}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Save Address
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ======= FAVORITE RESTAURANTS ======= */}
            {activeSection === 'fav-restaurants' && (
              <motion.div
                key="fav-restaurants"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white dark:bg-[#2b1f1d] rounded-3xl border border-gray-100 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20 p-5 sm:p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                    <Heart className="w-4.5 h-4.5 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-text-dark dark:text-[#f4f1ea]">Favorite Restaurants</h2>
                    <p className="text-[11px] text-gray-400 dark:text-[#7f796d]">{favoriteRestaurants.length} restaurants saved</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteRestaurants.map((rest, idx) => (
                    <motion.div
                      key={rest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      onClick={() => navigate(`/restaurant/${rest._id || rest.id}`)}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-gray-100 dark:border-[#3a2b27] hover:border-primary/30 hover:shadow-lg transition-all bg-gray-50/50 dark:bg-[#352723]/50 group cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-dark dark:text-[#f4f1ea] truncate group-hover:text-primary transition-colors">{rest.name}</p>
                        <p className="text-[11px] text-gray-500 dark:text-[#a09a8e] truncate">{rest.cuisine}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-500 font-mono font-bold">
                          {"★".repeat(rest.rating)}
                        </div>
                      </div>
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ======= FAVORITE FOODS ======= */}
            {activeSection === 'fav-foods' && (
              <motion.div
                key="fav-foods"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white dark:bg-[#2b1f1d] rounded-3xl border border-gray-100 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20 p-5 sm:p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                    <Utensils className="w-4.5 h-4.5 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-text-dark dark:text-[#f4f1ea]">Favorite Foods</h2>
                    <p className="text-[11px] text-gray-400 dark:text-[#7f796d]">{favoriteFoods.length} dishes saved</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteFoods.map((food, idx) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="rounded-2xl border border-gray-100 dark:border-[#3a2b27] hover:border-primary/30 hover:shadow-lg overflow-hidden transition-all group cursor-pointer bg-gray-50/50 dark:bg-[#352723]/50"
                    >
                      <div className="relative h-28 overflow-hidden">
                        <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-2 right-2">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 drop-shadow" />
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-bold text-text-dark dark:text-[#f4f1ea] truncate group-hover:text-primary transition-colors">{food.name}</p>
                        <p className="text-sm font-extrabold text-primary font-mono mt-1">{food.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ======= ORDER HISTORY ======= */}
            {activeSection === 'history' && (
              <motion.div
                key="history"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white dark:bg-[#2b1f1d] rounded-3xl border border-gray-100 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20 p-5 sm:p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-text-dark dark:text-[#f4f1ea]">Order History</h2>
                      <p className="text-[11px] text-gray-400 dark:text-[#7f796d]">{orderHistory.length} past orders</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/myorders')}
                    className="text-xs font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                <div className="flex flex-col gap-3">
                  {orderHistory.map((order, idx) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-[#3a2b27] hover:border-primary/30 transition-all bg-gray-50/50 dark:bg-[#352723]/50 cursor-pointer group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${order.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-rose-500/10 text-rose-500'
                        }`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-bold text-text-dark dark:text-[#f4f1ea] font-mono">{order.id}</p>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${order.status === 'Delivered'
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                            : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-[#a09a8e] truncate">{order.items}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-primary font-mono">{order.total}</p>
                        <p className="text-[10px] text-gray-400 dark:text-[#7f796d]">{order.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  )
}

export default UserProfile
