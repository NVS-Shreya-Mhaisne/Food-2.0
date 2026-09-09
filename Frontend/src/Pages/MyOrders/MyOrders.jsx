import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Components/Context/StoreContext';

const MyOrders = ({ onOpenTracker }) => {
  const { url, token, setActiveLiveOrder } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) {
      console.warn("No token found. User might not be logged in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Orders fetched:", response.data);
      if (response.data.success && response.data.data.length > 0) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = (order) => {
    if (setActiveLiveOrder) {
      setActiveLiveOrder(order);
    }
    if (onOpenTracker) {
      onOpenTracker();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className='w-[85%] sm:w-[80%] mx-auto py-12 min-h-[65vh]'>
      <h2 className="font-serif text-3xl font-bold text-text-dark dark:text-[#f4f1ea] mb-8">My Orders</h2>

      {loading ? (
        <p className="text-gray-500 dark:text-[#a09a8e] font-mono text-sm animate-pulse">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-[#2b1f1d] p-8 rounded-3xl border border-gray-150 dark:border-[#3a2b27] shadow-xl shadow-black/5 dark:shadow-black/20 text-center text-gray-500 dark:text-[#a09a8e]">
          <p className="text-sm font-medium">No orders found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, index) => (
            <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_1.5fr_1fr] items-center gap-4 sm:gap-6 text-xs sm:text-sm p-5 bg-white dark:bg-[#2b1f1d] border border-gray-150 dark:border-[#3a2b27] rounded-3xl shadow-sm hover:shadow-md dark:shadow-black/20 transition-shadow text-[#454545] dark:text-[#d3cfc4]'>
              <img className="w-12 h-12 object-contain" src={assets.parcel_icon} alt="Parcel Icon" />
              <p className="text-xs sm:text-sm text-text-dark dark:text-[#f4f1ea] leading-relaxed font-medium">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}{idx < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="font-mono text-sm"><b>Total:</b> ₹{order.amount}.00</p>
              <p className="font-mono text-sm"><b>Items:</b> {order.items.length}</p>
              <p className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm uppercase tracking-wider text-primary">
                <span className="text-lg">&#9679;</span> <b>{order.status}</b>
              </p>
              <button 
                onClick={() => handleTrackOrder(order)} 
                className="w-full sm:w-auto bg-primary/10 hover:bg-primary/20 text-primary font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer text-center border border-primary/20"
              >
                Track Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
