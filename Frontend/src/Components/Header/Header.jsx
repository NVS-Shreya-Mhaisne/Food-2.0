import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../Context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Mic,
    Sparkles,
    Star,
    ShoppingBag,
    Utensils,
    Flame,
    Pizza,
    Salad,
    Cake,
    Check,
    ChevronLeft,
    ChevronRight,
    MapPin
} from 'lucide-react';

import hero_gourmet_bg from '../../assets/hero_gourmet_bg.png';
import floating_gourmet_dish from '../../assets/floating_gourmet_dish.png';
import dish_truffle_pizza from '../../assets/dish_truffle_pizza.png';
import dish_salmon_poke from '../../assets/dish_salmon_poke.png';
import dish_smash_burger from '../../assets/dish_smash_burger.png';
const defaultFamousDishes = [];

const AnimatedCounter = ({ target, duration = 2200, prefix = "", suffix = "", decimals = 0 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrameId;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOutProgress * target;

            setCount(currentVal);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [target, duration]);

    const formattedNumber = decimals > 0
        ? count.toFixed(decimals)
        : Math.floor(count).toLocaleString();

    return <span>{prefix}{formattedNumber}{suffix}</span>;
};

const Header = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalCartAmount, food_list, url } = useContext(StoreContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChip, setSelectedChip] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [voiceFeedback, setVoiceFeedback] = useState("");

    // 3D Carousel active dish index state
    const [activeDishIndex, setActiveDishIndex] = useState(0);
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [famousDishes, setFamousDishes] = useState([]);

    // Dynamic Stats Counter State & Live Ticker
    const [ordersCount, setOrdersCount] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [restaurantsCount, setRestaurantsCount] = useState(0);
    const [ratingValue, setRatingValue] = useState(0);
    const [isOrderPulsing, setIsOrderPulsing] = useState(false);

    // Fetch top dishes from API or fallback to StoreContext food_list
    useEffect(() => {
        const fetchTopDishes = async () => {
            if (!url) return;
            try {
                const res = await axios.get(`${url}/api/food/top-dishes`);
                if (res.data.success && res.data.data && res.data.data.length > 0) {
                    const fetched = res.data.data.map((item, idx) => ({
                        id: item._id || idx + 1,
                        name: item.name,
                        restaurant: item.restaurantName || "Cravely Kitchen",
                        rating: 4.9,
                        reviews: "1.2k",
                        price: `₹${item.price}`,
                        tag: item.isTopDish ? "🔥 BEST SELLER" : "✨ CHEF'S SPECIAL",
                        distance: item.restaurantLocation || "Nearby",
                        image: item.image ? (item.image.startsWith('http') ? item.image : `${url}/images/${item.image}`) : floating_gourmet_dish
                    }));
                    setFamousDishes(fetched);
                    return;
                }
            } catch (err) {
                console.error("Fetch top dishes error:", err);
            }

            if (food_list && food_list.length > 0) {
                const fetched = food_list.slice(0, 5).map((item, idx) => ({
                    id: item._id || idx + 1,
                    name: item.name,
                    restaurant: "Cravely Partner",
                    rating: 4.8,
                    reviews: "950",
                    price: `₹${item.price}`,
                    tag: "✨ POPULAR ITEM",
                    distance: "Nearby",
                    image: item.image ? (item.image.startsWith('http') ? item.image : `${url}/images/${item.image}`) : floating_gourmet_dish
                }));
                setFamousDishes(fetched);
            }
        };
        fetchTopDishes();
    }, [url, food_list]);

    // Initial Animated Count-Up on Mount
    useEffect(() => {
        const duration = 1600; // 1.6s total count-up
        const steps = 50;
        const stepTime = duration / steps;

        const targetOrders = 25480;
        const targetReviews = 18450;
        const targetRestaurants = 520;
        const targetRating = 4.9;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

            setOrdersCount(Math.floor(targetOrders * easeProgress));
            setReviewsCount(Math.floor(targetReviews * easeProgress));
            setRestaurantsCount(Math.floor(targetRestaurants * easeProgress));
            setRatingValue(Number((targetRating * easeProgress).toFixed(1)));

            if (step >= steps) {
                clearInterval(timer);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, []);

    // Continuous Live Order Increment Ticker (every 3.5s)
    useEffect(() => {
        const liveInterval = setInterval(() => {
            const increment = Math.floor(Math.random() * 2) + 1; // +1 or +2 orders
            setOrdersCount((prev) => prev + increment);
            setIsOrderPulsing(true);
            setTimeout(() => setIsOrderPulsing(false), 800);
        }, 3500);

        return () => clearInterval(liveInterval);
    }, []);

    // AI Suggestion Chips list
    const aiChips = [
        { id: 'pizza', name: 'Pizza', icon: Pizza, color: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
        { id: 'healthy', name: 'Healthy', icon: Salad, color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
        { id: 'dessert', name: 'Dessert', icon: Cake, color: 'hover:border-pink-500/50 hover:bg-pink-500/10' },
        { id: 'trending', name: 'Trending', icon: Flame, color: 'hover:border-orange-500/50 hover:bg-orange-500/10' }
    ];

    // Continuous automatic 3D carousel rotation every 2.8 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveDishIndex((prev) => (prev + 1) % famousDishes.length);
        }, 2800);
        return () => clearInterval(timer);
    }, [famousDishes.length]);

    const handleNextDish = () => {
        setActiveDishIndex((prev) => (prev + 1) % famousDishes.length);
    };

    const handlePrevDish = () => {
        setActiveDishIndex((prev) => (prev - 1 + famousDishes.length) % famousDishes.length);
    };

    // Handle Search Submission & Navigation to Category/Dish Page
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        navigate(`/menu/${encodeURIComponent(trimmed)}`);
    };

    // Handle Voice Search
    const toggleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            if (isListening) {
                setIsListening(false);
                setVoiceFeedback("");
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
                setVoiceFeedback("Listening... Say 'Pizza' or 'Burger'...");
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript) {
                    setSearchQuery(transcript);
                    setVoiceFeedback(`Recognized: "${transcript}"`);
                    setTimeout(() => {
                        setIsListening(false);
                        setVoiceFeedback("");
                        navigate(`/menu/${encodeURIComponent(transcript.trim())}`);
                    }, 800);
                }
            };

            recognition.onerror = () => {
                setIsListening(false);
                setVoiceFeedback("");
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            try {
                recognition.start();
            } catch (err) {
                console.warn("Speech start error:", err);
            }
        } else {
            // Fallback for browsers without speech API
            setIsListening(true);
            setVoiceFeedback("Listening... Recognizing 'Pizza'...");
            setTimeout(() => {
                setSearchQuery("Pizza");
                setSelectedChip("pizza");
                setVoiceFeedback("Recognized: 'Pizza'");
                setTimeout(() => {
                    setIsListening(false);
                    setVoiceFeedback("");
                    navigate('/menu/Pizza');
                }, 900);
            }, 1800);
        }
    };

    const handleChipClick = (chip) => {
        setSelectedChip(chip.id);
        setSearchQuery(chip.name);
        navigate(`/menu/${encodeURIComponent(chip.name)}`);
    };

    return (
        <section className="relative w-full overflow-hidden bg-bg-warm/40 dark:bg-[#211714]/40 backdrop-blur-xl font-sans text-text-dark dark:text-[#f4f1ea]">

            {/* 1. HERO MAIN CONTAINER */}
            <div className="relative min-h-[620px] lg:min-h-[680px] flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

                {/* Slow Moving Background Image */}
                <motion.div
                    initial={{ scale: 1, x: 0, y: 0 }}
                    animate={{
                        scale: [1, 1.08, 1],
                        x: [0, -15, 0],
                        y: [0, -10, 0]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 z-0 pointer-events-none opacity-45 dark:opacity-40"
                >
                    <img
                        src={hero_gourmet_bg}
                        alt="Gourmet Food Background"
                        className="w-full h-full object-cover object-center scale-105"
                    />
                </motion.div>

                {/* Soft Warm Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-warm via-bg-warm/60 to-transparent dark:from-[#211714] dark:via-[#211714]/50 dark:to-transparent" />

                {/* Ambient Decorative Lighting Glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[140px] z-10 pointer-events-none" />

                {/* 2. HERO CONTENT GRID */}
                <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

                    {/* LEFT COLUMN: Main Copy & Search Bar & AI Chips */}
                    <div className="lg:col-span-6 flex flex-col items-start text-left z-30">



                        {/* Title: "What are you craving today?" */}
                        <motion.h1
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-text-dark dark:text-[#f4f1ea] leading-[1.08] tracking-tight mb-5"
                        >
                            What are you <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-[#ff806b]">
                                craving today?
                            </span>
                        </motion.h1>

                        {/* Subtitle Paragraph */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="text-sm text-gray-500 dark:text-[#a09a8e] max-w-lg mb-7 leading-relaxed font-sans"
                        >
                            Browse iconic signature dishes from top-rated kitchens in your neighborhood. Delivered fresh in 25–35 minutes.
                        </motion.p>

                        {/* 3. SEARCH BAR CONTAINER */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="w-full max-w-xl mb-6"
                        >
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white/70 dark:bg-[#2b1f1d]/70 backdrop-blur-md border border-gray-200/80 dark:border-[#3a2b27] focus-within:border-primary rounded-3xl shadow-xl shadow-primary/5 p-2 transition-all duration-300">

                                {/* 🎤 Voice Search Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleVoiceSearch}
                                    type="button"
                                    className={`relative p-3 rounded-xl transition-all duration-300 cursor-pointer flex-shrink-0 ${isListening
                                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                                            : "bg-gray-100 dark:bg-[#352723] text-gray-500 dark:text-[#a09a8e] hover:text-primary hover:bg-primary/5"
                                        }`}
                                    title={isListening ? "Listening..." : "Click to use Voice Search"}
                                >
                                    {isListening ? (
                                        <>
                                            <Mic className="w-5 h-5 animate-pulse" />
                                            <span className="absolute inset-0 rounded-xl bg-rose-500 animate-ping opacity-30" />
                                        </>
                                    ) : (
                                        <Mic className="w-5 h-5" />
                                    )}
                                </motion.button>

                                {/* Search Input */}
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search dishes, cuisines, or restaurants (e.g. Pizza)..."
                                    className="bg-transparent text-sm sm:text-base text-text-dark dark:text-[#f4f1ea] placeholder-gray-400 dark:placeholder-[#777] focus:outline-none w-full px-3.5 font-sans font-medium"
                                />

                                {/* 🔍 Search Action Button */}
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    type="submit"
                                    className="bg-primary hover:bg-primary-hover text-white px-5 sm:px-6 py-3 rounded-2xl font-extrabold uppercase text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer flex-shrink-0"
                                >
                                    <Search className="w-4 h-4" />
                                    <span className="hidden sm:inline">Search</span>
                                </motion.button>
                            </form>

                            {/* Voice Search Feedback Banner */}
                            <AnimatePresence>
                                {voiceFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="mt-2.5 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-mono flex items-center gap-2"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                        <span>{voiceFeedback}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* 4. ✨ AI SUGGESTION CHIPS */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="w-full max-w-xl"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-gray-400 dark:text-[#7f796d]">
                                    AI SUGGESTION CHIPS
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                {aiChips.map((chip) => {
                                    const ChipIcon = chip.icon;
                                    const isActive = selectedChip === chip.id;

                                    return (
                                        <motion.button
                                            key={chip.id}
                                            whileHover={{ scale: 1.07, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleChipClick(chip)}
                                            type="button"
                                            className={`px-3.5 py-2 rounded-xl text-xs font-serif font-bold tracking-wide flex items-center gap-2 border transition-all duration-200 cursor-pointer ${isActive
                                                    ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                                                    : `bg-white dark:bg-[#2b1f1d] text-gray-600 dark:text-[#d3cfc4] border-gray-200/80 dark:border-[#3a2b27] hover:border-primary/50 hover:bg-primary/5`
                                                }`}
                                        >
                                            <ChipIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-primary'}`} />
                                            <span>{chip.name}</span>
                                            {isActive && <Check className="w-3 h-3 ml-0.5" />}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                    </div>

                    {/* RIGHT COLUMN: 3D ROTATING FAMOUS DISH CAROUSEL */}
                    <div
                        className="lg:col-span-6 relative flex flex-col items-center justify-center mt-4 lg:mt-0 min-h-[380px] sm:min-h-[440px]"
                    >


                        {/* 3D CAROUSEL STACK CONTAINER */}
                        <div className="relative w-full max-w-md h-[320px] sm:h-[360px] flex items-center justify-center">
                            {famousDishes.map((dish, i) => {
                                const total = famousDishes.length;
                                // Calculate offset position relative to active index
                                let offset = (i - activeDishIndex + total) % total;
                                if (offset > total / 2) {
                                    offset -= total;
                                }

                                const isFront = offset === 0;

                                // 3D Card Animation parameters based on offset position
                                let xOffset = 0;
                                let scale = 0.72;
                                let zIndex = 10;
                                let opacity = 0.4;
                                let rotateY = 0;

                                if (offset === 0) {
                                    // FRONT CENTER CARD (Bigger, Highlighted)
                                    xOffset = 0;
                                    scale = 1.12;
                                    zIndex = 40;
                                    opacity = 1;
                                    rotateY = 0;
                                } else if (offset === 1) {
                                    // RIGHT CARD (Smaller)
                                    xOffset = 135;
                                    scale = 0.82;
                                    zIndex = 25;
                                    opacity = 0.7;
                                    rotateY = -12;
                                } else if (offset === -1) {
                                    // LEFT CARD (Smaller)
                                    xOffset = -135;
                                    scale = 0.82;
                                    zIndex = 25;
                                    opacity = 0.7;
                                    rotateY = 12;
                                } else if (offset === 2 || offset === -3) {
                                    // FAR RIGHT
                                    xOffset = 210;
                                    scale = 0.65;
                                    zIndex = 10;
                                    opacity = 0.3;
                                } else if (offset === -2 || offset === 3) {
                                    // FAR LEFT
                                    xOffset = -210;
                                    scale = 0.65;
                                    zIndex = 10;
                                    opacity = 0.3;
                                }

                                return (
                                    <motion.div
                                        key={dish.id}
                                        onClick={() => {
                                            if (isFront) {
                                                navigate(`/menu/${encodeURIComponent(dish.name)}`);
                                            } else {
                                                setActiveDishIndex(i);
                                            }
                                        }}
                                        initial={false}
                                        animate={{
                                            x: xOffset,
                                            scale: scale,
                                            zIndex: zIndex,
                                            opacity: opacity,
                                            rotateY: rotateY
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 24
                                        }}
                                        className={`absolute w-[220px] sm:w-[250px] aspect-square rounded-3xl overflow-hidden cursor-pointer select-none border transition-shadow duration-300 ${isFront
                                                ? "border-primary shadow-[0_20px_50px_rgba(255,107,53,0.2)] bg-white dark:bg-[#2b1f1d]"
                                                : "border-gray-200/60 dark:border-[#3a2b27] shadow-lg bg-white/95 dark:bg-[#2b1f1d]/95"
                                            }`}
                                        style={{ transformStyle: "preserve-3d" }}
                                    >
                                        {/* Dish Image */}
                                        <div className="relative w-full h-full">
                                            <img
                                                src={dish.image}
                                                alt={dish.name}
                                                className="w-full h-full object-cover object-center"
                                            />

                                            {/* Gradient overlay on image */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                            {/* Tag Badge */}
                                            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md border border-gray-100 text-[9px] font-mono font-bold text-primary">
                                                {dish.tag}
                                            </div>

                                            {/* FRONT CARD DETAILED OVERLAY */}
                                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-left">
                                                <div className="flex items-center justify-between gap-1 mb-1">
                                                    <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-tight truncate">
                                                        {dish.name}
                                                    </h3>
                                                    <span className="text-xs font-mono font-black text-primary bg-white/90 px-2 py-0.5 rounded border border-primary/20 flex-shrink-0">
                                                        {dish.price}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-xs text-gray-200 font-medium truncate mb-1">
                                                    <Utensils className="w-3 h-3 text-primary flex-shrink-0" />
                                                    <span className="truncate">{dish.restaurant}</span>
                                                </div>

                                                <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                        <span className="text-white font-bold">{dish.rating}</span>
                                                        <span>({dish.reviews})</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[#ff8a5b]">
                                                        <MapPin className="w-2.5 h-2.5" />
                                                        <span>{dish.distance}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* ROTATING CAROUSEL INDICATOR DOTS */}
                        <div className="flex items-center gap-2 mt-4 z-30">
                            {famousDishes.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveDishIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeDishIndex === idx
                                            ? "w-6 bg-primary"
                                            : "w-1.5 bg-gray-300 dark:bg-[#4a3833] hover:bg-gray-400 dark:hover:bg-[#5a4843]"
                                        }`}
                                    title={`Go to dish ${idx + 1}`}
                                />
                            ))}
                        </div>

                    </div>

                </div>
            </div>

            {/* 5. BELOW HERO: LIVE STATS COUNTER BANNER */}
            <div className="relative z-30 w-full bg-white/60 dark:bg-[#2b1f1d]/60 backdrop-blur-md border-t border-b border-gray-100/50 dark:border-[#3a2b27]/50 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-[#3a2b27]">

                    {/* Stat 1: Orders Today */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="flex flex-col items-center justify-center pt-3 sm:pt-0"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-text-dark dark:text-[#f4f1ea] tracking-tight">
                                <AnimatedCounter target={25000} suffix="+" />
                            </span>
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-[#7f796d] font-bold">
                            Orders Today
                        </span>
                    </motion.div>

                    {/* Stat 2: Rating */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="flex flex-col items-center justify-center pt-3 sm:pt-0"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-text-dark dark:text-[#f4f1ea] tracking-tight">
                                <AnimatedCounter target={4.9} decimals={1} suffix=" Rating" />
                            </span>
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-[#7f796d] font-bold">
                            From <AnimatedCounter target={18000} suffix="+" /> Reviews
                        </span>
                    </motion.div>

                    {/* Stat 3: Restaurants */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="flex flex-col items-center justify-center pt-3 sm:pt-0"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Utensils className="w-5 h-5 text-primary" />
                            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-text-dark dark:text-[#f4f1ea] tracking-tight">
                                <AnimatedCounter target={500} suffix="+" />
                            </span>
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-[#7f796d] font-bold">
                            Partner Restaurants
                        </span>
                    </motion.div>

                </div>
            </div>

        </section>
    );
};

export default Header;
