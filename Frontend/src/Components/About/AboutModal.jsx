import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Sparkles, 
  Zap, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Heart, 
  Utensils, 
  Smartphone, 
  Tag, 
  CreditCard, 
  Clock, 
  Users, 
  TrendingUp, 
  Leaf, 
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const stats = [
    { label: "Orders Delivered", value: "1.2M+", icon: TrendingUp, color: "text-amber-500 bg-amber-500/10" },
    { label: "Gourmet Partners", value: "500+", icon: Utensils, color: "text-primary bg-primary/10" },
    { label: "Avg Delivery Speed", value: "18 Mins", icon: Zap, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Customer Rating", value: "4.9 ★", icon: Award, color: "text-purple-500 bg-purple-500/10" }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Food Assistant",
      description: "Smart culinary AI that understands your mood, taste cravings, and dietary goals to recommend the perfect dish in seconds.",
      tag: "AI Tech",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    },

    {
      icon: Zap,
      title: "20-Minute Express Delivery",
      description: "Hyper-local dispatch algorithms paired with thermal insulated bags guarantee your meals arrive piping hot.",
      tag: "Ultra Fast",
      color: "text-primary bg-primary/10 border-primary/20"
    },

    {
      icon: MapPin,
      title: "Live GPS Telemetry Tracking",
      description: "Watch your order in real-time on an interactive map from kitchen prep to courier arrival with direct driver chat.",
      tag: "Live Map",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },

    {
      icon: Award,
      title: "Curated 500+ Bistros",
      description: "Strictly vetted top neighborhood kitchens, artisanal bistros, and Michelin-partnered chefs with 100% hygiene compliance.",
      tag: "Verified Quality",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    },

    {
      icon: Tag,
      title: "Smart Coupons & Perks",
      description: "Automated discount engine that applies maximum promo savings, instant cashback, and Cravely reward points.",
      tag: "Best Savings",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
    },

    {
      icon: CreditCard,
      title: "Multi-Gateway Checkout",
      description: "Seamless & instant payments via Credit/Debit Cards, Stripe, UPI, Apple Pay, or Cash on Delivery with 256-bit security.",
      tag: "Safe Pay",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    }
  ];

  const values = [
    {
      title: "Uncompromising Quality",
      desc: "Every dish is prepared in 100% certified clean kitchens adhering to international food safety standards.",
      icon: ShieldCheck
    },
    {
      title: "Eco-Friendly Packaging",
      desc: "We mandate 100% biodegradable and plastic-free thermal packaging across all restaurant partners.",
      icon: Leaf
    },
    {
      title: "Empowering Local Bistros",
      desc: "Supporting independent chefs and family-owned restaurants with fair commissions and tech tools.",
      icon: Users
    }
  ];

  const handleActionClick = (action) => {
    onClose();
    if (action === 'menu') {
      navigate('/');
      setTimeout(() => {
        const menuElem = document.getElementById('explore-menu');
        if (menuElem) menuElem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (action === 'app') {
      window.dispatchEvent(new CustomEvent('open-app-download'));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 sm:py-6 overflow-y-auto bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-4xl bg-bg-warm dark:bg-[#231815] border border-gray-200 dark:border-[#3d2e2c] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="relative bg-gradient-to-r from-primary via-[#ff806b] to-secondary p-6 sm:p-8 text-white overflow-hidden shrink-0">
            
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer z-10"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                ABOUT CRAVELY PLATFORM
              </span>
              <span className="bg-amber-400 text-black text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Next-Gen Foodtech
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Redefining How You Experience Food.
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl font-medium leading-relaxed">
              Cravely combines cutting-edge AI technology, hyper-local 20-minute delivery, and hand-picked gourmet partners to satisfy your food cravings effortlessly.
            </p>

            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'overview', label: 'Company Overview' },
                { id: 'features', label: 'What Cravely Does' },
                { id: 'values', label: 'Our Mission & Values' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-primary shadow-lg font-extrabold scale-105'
                      : 'bg-black/15 text-white/90 hover:bg-black/25'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8 custom-scrollbar text-text-dark dark:text-[#e5e0d8]">
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white/60 dark:bg-[#2d211d]/80 border border-gray-200/80 dark:border-[#3a2b27] p-4 rounded-2xl flex flex-col justify-between shadow-xs">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-serif text-2xl font-black text-text-dark dark:text-[#f4f1ea]">{stat.value}</p>
                          <p className="text-[11px] font-medium text-gray-500 dark:text-[#a09a8e] mt-0.5">{stat.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white/60 dark:bg-[#2d211d]/50 border border-gray-200/80 dark:border-[#3a2b27] p-5 sm:p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-4 h-4" />
                    <span>WHO WE ARE</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-text-dark dark:text-[#f4f1ea]">
                    Crafted for Foodies, Powered by Technology
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b0aaa0] leading-relaxed font-medium">
                    Founded with a bold vision, <strong>Cravely</strong> was built to eliminate the frustration of late deliveries, cold food, and limited menu choices. We bring high-end restaurant culinary standards straight to your dining table or workspace.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b0aaa0] leading-relaxed font-medium">
                    Whether you are craving authentic stone-baked Italian pizza, spicy Asian street noodles, healthy organic bowls, or decadent gourmet desserts—Cravely connects you directly to the top kitchens in your city with unprecedented speed.
                  </p>
                </div>
              </motion.div>
            )}
            {activeTab === 'features' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center max-w-lg mx-auto mb-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-text-dark dark:text-[#f4f1ea]">
                    Everything Cravely Does For You
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
                    An end-to-end food experience platform engineered to make dining seamless, delightful, and fast.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={idx}
                        className="bg-white/60 dark:bg-[#2d211d]/70 border border-gray-200/80 dark:border-[#3a2b27] p-4 sm:p-5 rounded-2xl flex items-start gap-4 transition-all hover:border-primary/50 group"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-base font-bold text-text-dark dark:text-[#f4f1ea] group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-[#a09a8e] leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {activeTab === 'values' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center max-w-lg mx-auto mb-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-text-dark dark:text-[#f4f1ea]">
                    Our Core Pillars & Guarantees
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
                    We stand by standard-setting principles to make every food order safe, eco-friendly, and enjoyable.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {values.map((v, idx) => {
                    const Icon = v.icon;
                    return (
                      <div key={idx} className="bg-white/60 dark:bg-[#2d211d]/70 border border-gray-200/80 dark:border-[#3a2b27] p-5 rounded-2xl space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-serif text-base font-bold text-text-dark dark:text-[#f4f1ea]">
                          {v.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-[#a09a8e] leading-relaxed font-medium">
                          {v.desc}
                        </p>
                        <div className="pt-2 border-t border-gray-100 dark:border-[#3a2b27] flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Guaranteed Standard</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            <div className="pt-4 border-t border-gray-200/80 dark:border-[#3a2b27] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#a09a8e] font-medium">
                <Clock className="w-4 h-4 text-primary" />
                <span>Ready to satisfy your cravings? Explore our menu now.</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleActionClick('app')}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#4a3833] text-xs font-bold hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-primary" />
                  <span>Get App</span>
                </button>
                <button
                  onClick={() => handleActionClick('menu')}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer">

                  <span>Order Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AboutModal;