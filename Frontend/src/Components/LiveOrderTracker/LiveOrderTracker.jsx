import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Phone, MessageSquare, MapPin, Navigation, Bike, ChefHat, Package, X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import { StoreContext } from '../Context/StoreContext';
import LeafletDeliveryMap from './LeafletDeliveryMap';

const steps = [
    { id: 1, title: 'Order Accepted', desc: 'Restaurant confirmed your order', icon: CheckCircle2 },
    { id: 2, title: 'Preparing Food', desc: 'Chef is crafting your gourmet meal', icon: ChefHat },
    { id: 3, title: 'Order Ready', desc: 'Packed fresh in smart thermal bag', icon: Package },
    { id: 4, title: 'Rider Picked Up', desc: 'Driver is on the way to your location', icon: Bike },
    { id: 5, title: 'Delivered', desc: 'Enjoy your delicious meal!', icon: MapPin }
];

const LiveOrderTracker = ({ isOpen, onClose }) => {
    const { activeLiveOrder } = useContext(StoreContext);
    const [activeChatTab, setActiveChatTab] = useState('driver');
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState({
        driver: [
            { id: 1, sender: 'driver', text: "Hi! I'm ready to deliver your food once it's packed.", time: 'Live' }
        ],
        restaurant: [
            { id: 1, sender: 'restaurant', text: "Hello! Your dish is being prepared with extra care.", time: 'Live' }
        ]
    });
    const [inputMsg, setInputMsg] = useState('');

    if (!isOpen) return null;

    const status = activeLiveOrder?.status || "Food Processing";

    // Map database order status to step number
    const getStepFromStatus = (st) => {
        switch (st) {
            case "Order Ready": return 3;
            case "Out For Delivery": return 4;
            case "Delivered": return 5;
            case "Food Processing":
            default:
                return 2;
        }
    };

    const currentStep = getStepFromStatus(status);

    const getStatusInfo = (st) => {
        switch (st) {
            case "Order Ready":
                return {
                    eta: "18 mins",
                    bannerText: "Order packed fresh in thermal bag & ready for pickup!",
                    driverStatus: "Waiting at restaurant"
                };
            case "Out For Delivery":
                return {
                    eta: "8 mins",
                    bannerText: "Driver Alex picked up your order and is heading your way!",
                    driverStatus: "On the way • 0.8 miles away"
                };
            case "Delivered":
                return {
                    eta: "Delivered",
                    bannerText: "Your order has been delivered! Enjoy your meal 🎉",
                    driverStatus: "Delivered to doorstep"
                };
            case "Food Processing":
            default:
                return {
                    eta: "25 mins",
                    bannerText: "Chef is crafting your gourmet meal with utmost care!",
                    driverStatus: "Assigned • Preparing food"
                };
        }
    };

    const statusInfo = getStatusInfo(status);
    const shortOrderId = activeLiveOrder?._id ? activeLiveOrder._id.slice(-6).toUpperCase() : "LIVE";

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMsg.trim()) {
            const newMsg = { id: Date.now(), sender: 'user', text: inputMsg, time: 'Just now' };
            setMessages({
                ...messages,
                [activeChatTab]: [...messages[activeChatTab], newMsg]
            });
            setInputMsg('');

            // Contextual Auto reply simulation
            setTimeout(() => {
                const reply = activeChatTab === 'driver' 
                    ? (status === "Out For Delivery" ? "Got it! Heading to your address right now." : "I'm ready at the pickup point.") 
                    : "Thanks for checking! Chef is putting the finishing touches.";
                setMessages((prev) => ({
                    ...prev,
                    [activeChatTab]: [...prev[activeChatTab], { id: Date.now() + 1, sender: activeChatTab, text: reply, time: 'Just now' }]
                }));
            }, 1000);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative w-full max-w-4xl bg-white dark:bg-[#2b1f1d] border border-gray-150 dark:border-[#3a2b27] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header Bar */}
                    <div className="p-5 border-b border-gray-150 dark:border-[#3a2b27] flex items-center justify-between bg-gradient-to-r from-primary/5 via-transparent to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Navigation className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-serif text-lg font-bold text-text-dark dark:text-[#f4f1ea]">
                                        Live Order Tracking
                                    </h3>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        🟢 Live Telemetry
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 font-mono">
                                    Order #{shortOrderId} • Est. Arrival in <span className="text-primary font-bold">{statusInfo.eta}</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-100 dark:hover:bg-[#352723] transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Main Tracker Body (Map + Timeline Grid) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto no-scrollbar">

                        {/* LEFT COLUMN: Interactive Leaflet Live Delivery Map (7 cols) */}
                        <div className="lg:col-span-7 relative bg-gray-950 min-h-[340px] lg:min-h-[440px] flex flex-col overflow-hidden">
                            <LeafletDeliveryMap 
                                currentStep={currentStep} 
                                status={status} 
                                address={activeLiveOrder?.address} 
                            />

                            {/* Map Info Overlay Banner */}
                            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 dark:bg-[#2b1f1d]/95 backdrop-blur-md border border-gray-150 dark:border-[#3a2b27] flex items-center justify-between shadow-xl z-[400]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        AK
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-dark dark:text-[#f4f1ea]">Alex Knight</p>
                                        <p className="text-[10px] text-gray-400 font-mono">{statusInfo.driverStatus}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setChatOpen(!chatOpen)}
                                        className="p-2 rounded-xl bg-gray-100 dark:bg-[#352723] text-gray-700 dark:text-[#f4f1ea] hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                                    >
                                        <MessageSquare className="w-4 h-4 text-primary" /> Chat
                                    </button>
                                    <a
                                        href="tel:+123456789"
                                        className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm"
                                    >
                                        <Phone className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Step Timeline Progress & Order Summary (5 cols) */}
                        <div className="lg:col-span-5 p-5 bg-white dark:bg-[#2b1f1d] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xs font-mono font-bold uppercase text-gray-400 dark:text-[#7f796d]">
                                        Live Status: <span className="text-primary font-bold">{status}</span>
                                    </h4>
                                    <span className="text-xs font-mono font-bold text-emerald-500">
                                        ₹{activeLiveOrder?.amount || 0} Paid
                                    </span>
                                </div>

                                <div className="space-y-3.5 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-[#3a2b27]">
                                    {steps.map((step) => {
                                        const Icon = step.icon;
                                        const isDone = step.id <= currentStep;
                                        const isCurrent = step.id === currentStep;

                                        return (
                                            <div key={step.id} className="relative flex items-start gap-3 pl-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                                                    isDone
                                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                        : 'bg-gray-100 dark:bg-[#352723] text-gray-400'
                                                }`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-xs font-bold ${isCurrent ? 'text-primary' : isDone ? 'text-text-dark dark:text-[#f4f1ea]' : 'text-gray-400'}`}>
                                                            {step.title}
                                                        </p>
                                                        {isCurrent && (
                                                            <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.2 rounded bg-primary/10 text-primary animate-pulse">
                                                                In Progress
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-snug">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Items Summary */}
                                {activeLiveOrder?.items?.length > 0 && (
                                    <div className="mt-4 p-3 rounded-2xl bg-gray-50 dark:bg-[#352723]/60 border border-gray-100 dark:border-[#4a3833]/40">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-dark dark:text-[#f4f1ea] mb-1.5">
                                            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                                            <span>Items in this Order ({activeLiveOrder.items.length})</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {activeLiveOrder.items.map((item, idx) => (
                                                <span key={idx} className="text-[10px] font-mono bg-white dark:bg-[#251b18] border border-gray-200/60 dark:border-[#4a3833] px-2 py-0.5 rounded-md text-text-dark dark:text-[#e5e0d8]">
                                                    {item.name} <b className="text-primary">x{item.quantity}</b>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Live Notification Popup Banner */}
                            <div className="mt-4 p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-mono flex items-center gap-2.5">
                                <Sparkles className="w-4 h-4 animate-bounce flex-shrink-0" />
                                <span>{statusInfo.bannerText}</span>
                            </div>
                        </div>

                    </div>

                    {/* Expandable Live Chat Drawer */}
                    <AnimatePresence>
                        {chatOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 260, opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-gray-150 dark:border-[#3a2b27] bg-gray-50 dark:bg-[#352723] flex flex-col"
                            >
                                {/* Chat Tab Selector */}
                                <div className="flex items-center gap-2 p-2.5 border-b border-gray-200 dark:border-[#4a3833]">
                                    <button
                                        onClick={() => setActiveChatTab('driver')}
                                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            activeChatTab === 'driver' ? 'bg-primary text-white' : 'text-gray-500'
                                        }`}
                                    >
                                        Driver (Alex)
                                    </button>
                                    <button
                                        onClick={() => setActiveChatTab('restaurant')}
                                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            activeChatTab === 'restaurant' ? 'bg-primary text-white' : 'text-gray-500'
                                        }`}
                                    >
                                        Restaurant
                                    </button>
                                </div>

                                {/* Messages History */}
                                <div className="flex-1 p-3 overflow-y-auto space-y-2 no-scrollbar">
                                    {messages[activeChatTab].map((m) => (
                                        <div
                                            key={m.id}
                                            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs ${
                                                m.sender === 'user'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white dark:bg-[#2b1f1d] border border-gray-150 text-text-dark dark:text-[#f4f1ea]'
                                            }`}>
                                                <p>{m.text}</p>
                                                <span className="text-[9px] opacity-70 block text-right mt-0.5">{m.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input Form */}
                                <form onSubmit={handleSendMessage} className="p-2.5 border-t border-gray-200 dark:border-[#4a3833] flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={`Message ${activeChatTab}...`}
                                        value={inputMsg}
                                        onChange={(e) => setInputMsg(e.target.value)}
                                        className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#4a3833] bg-white dark:bg-[#2b1f1d] text-xs focus:outline-none"
                                    />
                                    <button type="submit" className="p-2 rounded-xl bg-primary text-white cursor-pointer">
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LiveOrderTracker;
