import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../Components/Context/StoreContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Home, Briefcase, Plus, CheckCircle2, Navigation, Check, Sparkles } from 'lucide-react';

const PlaceOrder = () => {

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    appliedCoupon,
    getDeliveryFee,
    getPlatformFee,
    getRestaurantFee,
    getGstAndTax,
    getDiscountAmount,
    getFinalTotal,
    userData,
    fetchUserProfile,
    openAuthModal
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const defaultSaved = [
    {
      id: 'addr_home',
      label: 'Home',
      tag: 'HOME',
      icon: Home,
      street: 'Flat 402, Sunshine Heights, 12th Main',
      city: 'Bangalore',
      state: 'Karnataka',
      zipcode: '560038',
      country: 'India',
      phone: '+91 98765 43210'
    },
    {
      id: 'addr_work',
      label: 'Office / Work',
      tag: 'WORK',
      icon: Briefcase,
      street: '4th Floor, Tech Hub Tower, Outer Ring Rd',
      city: 'Bangalore',
      state: 'Karnataka',
      zipcode: '560103',
      country: 'India',
      phone: '+91 98765 43210'
    }
  ];

  const userSavedAddresses = (userData?.addresses && userData.addresses.length > 0)
    ? userData.addresses.map((a, idx) => ({
        id: a.id || `addr_${idx}`,
        label: a.label || 'Saved Location',
        tag: (a.label || 'OTHER').toUpperCase(),
        icon: a.label?.toLowerCase() === 'work' ? Briefcase : (a.label?.toLowerCase() === 'home' ? Home : MapPin),
        street: a.street || a.address || '',
        city: a.city || 'Bangalore',
        state: a.state || 'Karnataka',
        zipcode: a.zipcode || '560038',
        country: a.country || 'India',
        phone: a.phone || userData?.phone || ''
      }))
    : defaultSaved;

  const [selectedAddressId, setSelectedAddressId] = useState(userSavedAddresses[0]?.id || 'addr_home');
  const [isManualAddress, setIsManualAddress] = useState(false);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (userData) {
      const names = (userData.name || '').trim().split(' ');
      const fName = names[0] || 'Cravely';
      const lName = names.slice(1).join(' ') || 'Customer';
      const initialAddr = userSavedAddresses.find(a => a.id === selectedAddressId) || userSavedAddresses[0];

      setData({
        firstName: fName,
        lastName: lName,
        email: userData.email || '',
        street: initialAddr?.street || '',
        city: initialAddr?.city || '',
        state: initialAddr?.state || '',
        zipcode: initialAddr?.zipcode || '',
        country: initialAddr?.country || 'India',
        phone: initialAddr?.phone || userData.phone || ''
      });
    }
  }, [userData]);

  useEffect(() => {
    if (!token) {
      if (openAuthModal) {
        openAuthModal({
          mode: 'login',
          title: 'Sign In to Proceed to Payment',
          subtitle: 'Please sign in to configure your delivery location and payment. Your cart items are preserved!',
          onSuccess: () => navigate('/Order')
        });
      }
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setIsManualAddress(false);

    const names = (userData?.name || '').trim().split(' ');
    const fName = names[0] || data.firstName || 'Cravely';
    const lName = names.slice(1).join(' ') || data.lastName || 'Customer';

    setData(prev => ({
      ...prev,
      firstName: fName,
      lastName: lName,
      email: userData?.email || prev.email,
      street: addr.street || addr.address || '',
      city: addr.city || 'Bangalore',
      state: addr.state || 'Karnataka',
      zipcode: addr.zipcode || '560038',
      country: addr.country || 'India',
      phone: addr.phone || userData?.phone || prev.phone
    }));
  };

  const onChnageHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    if (!token) {
      if (openAuthModal) {
        openAuthModal({
          mode: 'login',
          title: 'Sign In to Complete Payment',
          subtitle: 'Sign in to complete payment and place your order safely.',
          onSuccess: () => {}
        });
      }
      return;
    }

    const orderItems = [];
    food_list.forEach((item) => {
      const qty = Number(cartItems[item._id] || 0);
      if (qty > 0) {
        orderItems.push({ ...item, quantity: qty });
      }
    });

    if (orderItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (isManualAddress && saveAddressToProfile && token && data.street) {
      try {
        const newAddrObj = {
          id: `addr_${Date.now()}`,
          label: 'Saved Address',
          address: `${data.street}, ${data.city}, ${data.state} - ${data.zipcode}`,
          street: data.street,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          country: data.country,
          phone: data.phone
        };
        const currentList = userData?.addresses || [];
        await axios.post(
          `${url}/api/user/profile/update`,
          { addresses: [newAddrObj, ...currentList] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (fetchUserProfile) fetchUserProfile(token);
      } catch (err) {
        console.error("Auto-save address error:", err);
      }
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: getFinalTotal(),
      discount: getDiscountAmount(),
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      userId: localStorage.getItem("userId"),
    };

    try {
      setProcessing(true);
      console.log("Sending orderData:", orderData);
      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Order response:", response.data);

      if (response.data.success && response.data.session_url) {
        window.location.replace(response.data.session_url);
      } else {
        alert(response.data.message || "Error placing order. Check console.");
      }
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      alert("Something went wrong. Check console.");
    } finally {
      setProcessing(false);
    }
  };

  const inputClasses = "w-full border border-gray-200 dark:border-[#4a3833] bg-white dark:bg-[#352723] focus:border-primary outline-none px-4 py-2.5 rounded-lg text-sm transition-colors text-text-dark dark:text-[#e5e0d8] dark:placeholder-[#777]";

  return (
    <form onSubmit={placeOrder} className='w-[94%] sm:w-[90%] max-w-6xl mx-auto py-10 flex flex-col md:flex-row justify-center items-start gap-6 lg:gap-8 min-h-[65vh]'>
      <div className="flex-1 w-full flex flex-col gap-5 bg-white dark:bg-[#2b1f1d] p-6 sm:p-8 rounded-3xl border border-gray-150 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-[#3a2b27] pb-3.5">
          <div>
            <p className="font-serif text-2xl font-bold text-text-dark dark:text-[#f4f1ea]">Delivery Address</p>
            <p className="text-xs text-gray-500 dark:text-[#a09a8e] mt-0.5">Select a saved address or enter a new one</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" /> Fast Delivery
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-gray-400 dark:text-[#7f796d]">
              Saved Delivery Locations ({userSavedAddresses.length})
            </span>
            <button
              type="button"
              onClick={() => {
                setIsManualAddress(true);
                setSelectedAddressId(null);
                setData(prev => ({
                  ...prev,
                  street: '',
                  city: '',
                  state: '',
                  zipcode: ''
                }));
              }}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {userSavedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id && !isManualAddress;
              const AddrIcon = addr.icon || MapPin;

              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelectSavedAddress(addr)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/10 ring-1 ring-primary'
                      : 'border-gray-200 dark:border-[#4a3833] bg-gray-50/50 dark:bg-[#352723]/40 hover:border-gray-300 dark:hover:border-[#5a4843]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-[#4a3833] text-gray-600 dark:text-gray-300'
                      }`}>
                        <AddrIcon className="w-4 h-4" />
                      </div>
                      <span className="font-serif text-sm font-bold text-text-dark dark:text-[#f4f1ea]">
                        {addr.label}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-gray-300 dark:border-[#665a57]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-[#a09a8e] mt-2.5 leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} - {addr.zipcode}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-gray-150 dark:border-[#4a3833]/50 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400">
                      {addr.phone || "Standard Delivery"}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isSelected ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {isSelected ? 'DELIVER HERE ✓' : 'SELECT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. MANUAL ADDRESS / EDIT DETAILS FORM */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-gray-400 dark:text-[#7f796d]">
              {isManualAddress ? "Enter New Address Details" : "Contact & Specific Delivery Notes"}
            </span>
            {!isManualAddress && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Address details auto-filled
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <input required name='firstName' onChange={onChnageHandler} value={data.firstName} type="text" placeholder='First Name' className={inputClasses} />
              <input required name='lastName' onChange={onChnageHandler} value={data.lastName} type="text" placeholder='Last Name' className={inputClasses} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <input required name='email' onChange={onChnageHandler} value={data.email} type="email" placeholder='Email address' className={inputClasses} />
              <input required name='phone' onChange={onChnageHandler} value={data.phone} type="text" placeholder='Contact Phone number' className={inputClasses} />
            </div>

            <input required name='street' onChange={onChnageHandler} value={data.street} type="text" placeholder='Flat / House No. / Street name' className={inputClasses} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <input required name='city' onChange={onChnageHandler} value={data.city} type="text" placeholder='City' className={inputClasses} />
              <input required name='state' onChange={onChnageHandler} value={data.state} type="text" placeholder='State' className={inputClasses} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <input required name='zipcode' onChange={onChnageHandler} value={data.zipcode} type="text" placeholder='Zip / Pincode' className={inputClasses} />
              <input required name='country' onChange={onChnageHandler} value={data.country} type="text" placeholder='Country' className={inputClasses} />
            </div>

            {/* Checkbox to save new address to profile */}
            {isManualAddress && (
              <label className="flex items-center gap-2 text-xs font-semibold text-text-dark dark:text-[#d3cfc4] cursor-pointer mt-1 select-none">
                <input
                  type="checkbox"
                  checked={saveAddressToProfile}
                  onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <span>Save this address to my profile for future 1-click orders</span>
              </label>
            )}
          </div>
        </div>

      </div>

      {/* ORDER SUMMARY COLUMN */}
      <div className="w-full md:w-[420px] lg:w-[440px] shrink-0">
        <div className="w-full flex flex-col gap-5 bg-white dark:bg-[#2b1f1d] p-6 sm:p-8 rounded-3xl border border-gray-150 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20">
          <h2 className="font-serif text-2xl font-bold text-text-dark dark:text-[#f4f1ea] border-b border-gray-100 dark:border-[#3a2b27] pb-3 mb-2">Order Summary</h2>
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-[#555] dark:text-[#a09a8e]">
            <div className="flex justify-between items-center">
              <p>Item Total</p>
              <p className="font-mono font-bold text-text-dark dark:text-[#f4f1ea]">₹{getTotalCartAmount()}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <p>Delivery Fee</p>
                {getTotalCartAmount() > 500 && (
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                    Free above ₹500
                  </span>
                )}
              </div>
              <p className="font-mono font-bold">
                {getDeliveryFee() === 0 ? (
                  <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                    <span className="line-through text-gray-400 text-xs font-normal">₹40</span> FREE
                  </span>
                ) : (
                  `₹${getDeliveryFee()}`
                )}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p>Platform Fee</p>
              <p className="font-mono font-bold text-text-dark dark:text-[#f4f1ea]">₹{getPlatformFee ? getPlatformFee() : (getTotalCartAmount() > 0 ? 30 : 0)}</p>
            </div>

            <div className="flex justify-between items-center">
              <p>Restaurant Packaging Fee</p>
              <p className="font-mono font-bold text-text-dark dark:text-[#f4f1ea]">₹{getRestaurantFee ? getRestaurantFee() : (getTotalCartAmount() > 0 ? 20 : 0)}</p>
            </div>

            <div className="flex justify-between items-center">
              <p>GST & Restaurant Taxes</p>
              <p className="font-mono font-bold text-text-dark dark:text-[#f4f1ea]">₹{getGstAndTax ? getGstAndTax() : (getTotalCartAmount() > 0 ? 20 : 0)}</p>
            </div>

            {getDiscountAmount() > 0 && (
              <div className="flex justify-between text-emerald-500 font-bold p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p>Coupon Discount ({appliedCoupon?.code})</p>
                <p className="font-mono">-₹{getDiscountAmount()}</p>
              </div>
            )}

            <hr className="border-t border-gray-200/60 dark:border-[#3a2b27] my-1" />

            <div className="flex justify-between text-base font-bold text-text-dark dark:text-[#f4f1ea]">
              <span>To Pay</span>
              <span className="font-serif font-black text-primary text-xl">₹{getFinalTotal()}</span>
            </div>
          </div>
          <button type="submit" disabled={processing || getTotalCartAmount() === 0} className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-primary/20 cursor-pointer mt-4">
            {processing ? "Processing..." : "PROCEED TO PAYMENT"}</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
