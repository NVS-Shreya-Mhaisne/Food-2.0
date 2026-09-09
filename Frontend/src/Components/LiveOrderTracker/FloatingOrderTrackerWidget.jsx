import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, ChefHat, Navigation, ChevronRight, X, MapPin, Package, CheckCircle2 } from 'lucide-react';
import { StoreContext } from '../Context/StoreContext';

const FloatingOrderTrackerWidget = ({ onOpenTracker }) => {
  const { activeLiveOrder } = useContext(StoreContext);
  // Is the widget collapsed into a circular button state
  const [isCircle, setIsCircle] = useState(false);

  // ONLY show when user has an active paid order
  if (!activeLiveOrder || !activeLiveOrder.payment) {
    return null;
  }

  const status = activeLiveOrder.status || "Food Processing";

  // Derive stage metadata dynamically based on admin status
  const getStageDetails = () => {
    switch (status) {
      case "Order Ready":
        return {
          stepNum: "Step 2 of 4 • Ready for Pickup",
          stepText: "Order packed fresh & ready for delivery driver",
          eta: "18m ETA",
          etaMin: "18 min",
          progress: "50%",
          Icon: Package,
          colorGradient: "from-purple-500 to-indigo-600",
          badgeColor: "text-purple-400 border-purple-500/20 bg-purple-500/10"
        };
      case "Out For Delivery":
        return {
          stepNum: "Step 3 of 4 • Rider On The Way",
          stepText: "Driver picked up food & heading to your address",
          eta: "8m ETA",
          etaMin: "8 min",
          progress: "75%",
          Icon: Bike,
          colorGradient: "from-blue-500 to-primary",
          badgeColor: "text-blue-400 border-blue-500/20 bg-blue-500/10"
        };
      case "Delivered":
        return {
          stepNum: "Step 4 of 4 • Delivered",
          stepText: "Order delivered! Enjoy your meal",
          eta: "Delivered",
          etaMin: "Delivered",
          progress: "100%",
          Icon: CheckCircle2,
          colorGradient: "from-emerald-500 to-teal-600",
          badgeColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        };
      case "Food Processing":
      default:
        return {
          stepNum: "Step 1 of 4 • Preparing Food",
          stepText: "Chef is crafting your gourmet meal with care",
          eta: "25m ETA",
          etaMin: "25 min",
          progress: "25%",
          Icon: ChefHat,
          colorGradient: "from-amber-500 to-primary",
          badgeColor: "text-amber-400 border-amber-500/20 bg-amber-500/10"
        };
    }
  };

  const stage = getStageDetails();
  const StageIcon = stage.Icon;
  const shortOrderId = activeLiveOrder._id ? activeLiveOrder._id.slice(-6).toUpperCase() : "LIVE";
  const itemsSummary = activeLiveOrder.items?.map(i => `${i.name} x${i.quantity}`).join(", ") || "Gourmet meal";

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      <AnimatePresence mode="wait">
        {isCircle ? (
          /* CIRCULAR FLOATING TRACKING BADGE */
          <motion.button
            key="circle-badge"
            initial={{ scale: 0.4, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.4, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.12, rotate: 6 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsCircle(false)}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1e1513]/95 dark:bg-[#251b18]/95 border-2 border-primary/60 shadow-[0_10px_35px_rgba(255,107,53,0.45)] backdrop-blur-xl text-white flex items-center justify-center cursor-pointer group"
            title="Click to view live order tracking"
          >
            {/* Outer Pulsing Beacon Ring */}
            <span className="absolute -inset-1 rounded-full border-2 border-emerald-500/60 animate-ping pointer-events-none opacity-60" />
            
            {/* Center Animated Icon */}
            <div className="flex flex-col items-center justify-center">
              <StageIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            </div>

            {/* Live Green Status Indicator Dot */}
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1e1513] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>

            {/* Floating Live ETA Mini Badge */}
            <span className="absolute -bottom-2 bg-gradient-to-r from-primary to-amber-600 text-white text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full shadow-lg border border-white/20 whitespace-nowrap">
              {stage.eta}
            </span>
          </motion.button>
        ) : (
          /* EXPANDED FLOATING TELEMETRY CARD */
          <motion.div
            key="expanded-card"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="w-80 sm:w-88 bg-[#1e1513]/95 dark:bg-[#251b18]/96 border border-white/15 dark:border-white/10 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] shadow-primary/10 backdrop-blur-2xl text-white relative overflow-hidden"
          >
            {/* Ambient Lighting FX */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header (Title & Cross Button) */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
                </div>
                <h4 className="font-serif text-sm font-bold tracking-wide text-white flex items-center gap-1.5">
                  Live Order #{shortOrderId}
                </h4>
              </div>

              {/* Cross X Button -> Shrinks Card into Floating Circle */}
              <button
                onClick={() => setIsCircle(true)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize into Circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Progress Info Box */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 mb-3.5">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stage.colorGradient} flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0`}>
                <StageIcon className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    {stage.stepNum}
                  </span>
                  <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${stage.badgeColor}`}>
                    {stage.etaMin}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-100 truncate mt-0.5">
                  {stage.stepText}
                </p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: stage.progress }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${stage.colorGradient} rounded-full`}
                  />
                </div>
              </div>
            </div>

            {/* Rider / Order Details Teaser */}
            <div className="flex items-center justify-between px-1 mb-3.5 text-xs text-gray-300">
              <div className="flex items-center gap-2 max-w-[65%]">
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                  CR
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">{itemsSummary}</p>
                  <p className="text-[9px] text-gray-400 font-mono">₹{activeLiveOrder.amount} • Paid Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[80px]">{activeLiveOrder.address?.city || "Your Location"}</span>
              </div>
            </div>

            {/* Action Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenTracker}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-500 text-white font-serif text-xs font-bold tracking-wide shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Track Live Delivery Map & Chat</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingOrderTrackerWidget;
