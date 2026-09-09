import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import axios from "axios";
import {
  ShoppingBag,
  Package,
  MapPin,
  Phone,
  User,
  Clock,
  Store,
  Mail,
  Calendar,
  CreditCard,
  Trash2
} from 'lucide-react';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error("Something went wrong while fetching orders!");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        toast.success(`Order status updated to "${event.target.value}"`);
        await fetchAllOrders();
      }
    } catch (error) {
      console.error("Status handler error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this customer order?")) {
      return;
    }
    try {
      const response = await axios.post(`${url}/api/order/remove`, { orderId });
      if (response.data.success) {
        toast.success("Customer order deleted successfully");
        fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Delete order error:", error);
      toast.error("Error deleting customer order");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [url]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueRestaurants = (items) => {
    if (!items || items.length === 0) return "Cravely Kitchen";
    const names = items
      .map(i => i.restaurantName)
      .filter(Boolean);
    const unique = [...new Set(names)];
    return unique.length > 0 ? unique.join(", ") : "Cravely Kitchen";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Order Ready':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Out For Delivery':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-7 md:px-9 md:py-7 w-full max-w-full animate-page-fade">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-1">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8A5B] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <ShoppingBag size={20} />
            </div>
            Customer Orders
          </h1>
          <p className="text-xs text-slate-500 font-medium pl-11">
            Track incoming food orders, customer details, restaurant info, and update delivery status.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-[#FFF0EB] border border-[#FFD4C4] text-[#FF6B35] px-4 py-2 rounded-full text-xs font-semibold shadow-xs">
          <Package size={16} />
          <span>Total Orders: <strong className="font-extrabold">{orders.length}</strong></span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs text-center py-14 px-8 my-4">
          <p className="text-xs text-slate-500 font-semibold">Loading customer orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs text-center py-14 px-8 my-4 flex flex-col items-center justify-center gap-3">
          <ShoppingBag size={48} className="text-slate-300" />
          <h3 className="text-lg font-extrabold text-slate-800">No Orders Yet</h3>
          <p className="text-xs text-slate-500 max-w-md">
            When customers place orders, they will appear here live with full details.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {orders.map((order, index) => {
            const restaurantNames = getUniqueRestaurants(order.items);
            return (
              <div
                key={order._id || index}
                className="bg-white border border-slate-200 border-l-4 border-l-[#FF6B35] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3"
              >
                {/* Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center shrink-0">
                      <Package size={18} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-black text-slate-900">
                        Order #{order._id ? order._id.slice(-6).toUpperCase() : index + 1}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          order.payment
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <CreditCard size={11} /> {order.payment ? 'Paid' : 'Payment Pending'}
                      </span>
                      {order.date && (
                        <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(order.date)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#FF6B35]" />
                      <select
                        onChange={(event) => statusHandler(event, order._id)}
                        value={order.status}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${getStatusStyle(order.status)}`}
                      >
                        <option value="Food Processing">Food Processing</option>
                        <option value="Order Ready">Order Ready</option>
                        <option value="Out For Delivery">Out For Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="w-7.5 h-7.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-200 hover:border-red-500 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Customer Order"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* 3-Column Body Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                  {/* Col 1: Ordered Items & Restaurant Info */}
                  <div className="md:col-span-5 flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Store size={12} className="text-[#FF6B35]" /> Restaurant Info
                    </span>
                    <p className="text-xs font-bold text-slate-900">{restaurantNames}</p>

                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 mt-2">
                      <UtensilsIcon size={12} className="text-[#FF6B35]" /> Ordered Food Items ({order.items?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {order.items?.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-800 inline-flex items-center gap-1"
                        >
                          {item.name} <strong className="text-[#FF6B35] font-extrabold">x{item.quantity}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Col 2: Customer Info & Address */}
                  <div className="md:col-span-4 flex flex-col gap-1 md:border-l md:border-slate-200 md:pl-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <User size={12} className="text-[#FF6B35]" /> Customer Details
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-bold text-slate-900">
                        {order.address?.firstName} {order.address?.lastName}
                      </p>
                      <p className="text-[11px] text-slate-600 inline-flex items-center gap-1">
                        <Phone size={11} className="text-slate-400 shrink-0" /> {order.address?.phone}
                      </p>
                      {order.address?.email && (
                        <p className="text-[11px] text-slate-600 inline-flex items-center gap-1">
                          <Mail size={11} className="text-slate-400 shrink-0" /> {order.address?.email}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-600 inline-flex items-start gap-1 leading-snug">
                        <MapPin size={11} className="text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipcode}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Col 3: Amount & Quick Summary */}
                  <div className="md:col-span-3 flex flex-col items-start md:items-end justify-center md:border-l md:border-slate-200 md:pl-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Total Payable
                    </span>
                    <div className="flex flex-col items-start md:items-end">
                      <span className="text-lg font-black text-[#FF6B35]">₹{order.amount}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {order.items?.length || 0} items ordered
                      </span>
                    </div>
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

// Helper icon component
const UtensilsIcon = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V2" />
    <path d="M12 10v12" />
    <path d="M18 22V12" />
  </svg>
);

export default Orders;
