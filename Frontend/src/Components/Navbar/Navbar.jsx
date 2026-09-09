import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from '../Context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Heart, 
    ShoppingBag, 
    User, 
    UserCircle,
    Sun, 
    Moon, 
    Package, 
    LogOut, 
    MapPin,
    Menu as MenuIcon,
    X
} from 'lucide-react';

const Navbar = ({ setshowLogin, onOpenTracker, onOpenAbout }) => {
    const [activeTab, setActiveTab] = useState("Home");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isSearchHovered, setIsSearchHovered] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : false;
    });

    const { token, cartItems, logout: contextLogout, userData } = useContext(StoreContext);
    const cartItemCount = Object.values(cartItems || {}).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (location.pathname === '/about') {
            setActiveTab('About');
        } else if (location.pathname === '/restaurants') {
            setActiveTab('Restaurants');
        } else if (location.pathname === '/ai-assistant') {
            setActiveTab('AI Assistant');
        } else if (location.pathname === '/') {
            setActiveTab('Home');
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logout = () => {
        contextLogout();
        navigate("/");
    }

    const navLinks = [
        { name: 'Home', path: '/', id: 'Home' },
        { name: 'Restaurants', path: '/restaurants', id: 'Restaurants' },
        { name: 'About', path: '/about', id: 'About' },
        { name: 'AI Assistant', path: '/ai-assistant', id: 'AI Assistant' }
    ];

    return (
        <header 
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled 
                    ? "bg-bg-warm/90 dark:bg-[#2d211d]/90 backdrop-blur-md shadow-md py-2 border-b border-gray-200/80 dark:border-white/10" 
                    : "bg-bg-warm dark:bg-[#2d211d] py-3.5 border-b border-gray-200/50 dark:border-white/10"
            }`}
        >
            <div className="w-full pl-4 sm:pl-6 lg:pl-8 pr-2 sm:pr-4 lg:pr-5 flex justify-between items-center">
                
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ rotate: 3, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Link 
                            to='/' 
                            className="font-serif text-3xl sm:text-4xl font-black text-primary tracking-tight hover:opacity-90 transition-opacity block"
                        >
                            Cravely.
                        </Link>
                    </motion.div>

                    <div className="hidden sm:flex items-center gap-1.5 text-text-dark dark:text-[#a09a8e] border-l border-gray-200 dark:border-[#4a3833] pl-4">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold tracking-widest font-mono uppercase">NEW YORK - 1101</span>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navLinks.map((item) => (
                        <div key={item.id} className="relative py-1">
                            <Link
                                to={item.path}
                                onClick={() => setActiveTab(item.id)}
                                className={`text-[13px] font-serif font-bold tracking-wide transition-colors duration-200 flex items-center gap-1.5 ${
                                    activeTab === item.id 
                                        ? "text-primary" 
                                        : "text-text-dark/80 dark:text-[#d3cfc4] hover:text-primary dark:hover:text-primary"
                                }`}
                            >
                                <span>{item.name}</span>
                            </Link>

                            {activeTab === item.id && (
                                <motion.div 
                                    layoutId="navbar-underline"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </div>
                    ))}
                </nav>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchQuery.trim()) {
                                navigate(`/menu/${encodeURIComponent(searchQuery.trim())}`);
                                setSearchQuery("");
                                setIsSearchExpanded(false);
                            }
                        }}
                    >
                        <motion.div 
                            onMouseEnter={() => setIsSearchHovered(true)}
                            onMouseLeave={() => setIsSearchHovered(false)}
                            animate={{ width: isSearchExpanded || isSearchHovered || searchQuery ? 200 : 36 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative flex items-center bg-white dark:bg-[#3a2b27] rounded-full border border-gray-200 dark:border-[#4a3833] focus-within:border-primary p-1 overflow-hidden cursor-pointer"
                        >
                            <button 
                                type="submit"
                                onClick={() => {
                                    if (!isSearchExpanded) {
                                        setIsSearchExpanded(true);
                                    }
                                }}
                                className="p-1 text-text-dark/70 dark:text-[#a09a8e] hover:text-primary focus:outline-none flex-shrink-0 cursor-pointer"
                                title="Search"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                            
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchExpanded(true)}
                                onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                                placeholder="Search dishes (e.g. Pizza)..." 
                                className="bg-transparent text-xs text-text-dark dark:text-[#e5e0d8] placeholder-gray-400 dark:placeholder-[#777] focus:outline-none w-full pr-2 font-sans font-medium"
                            />
                        </motion.div>
                    </form>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Link 
                            to='/favorites' 
                            className={`relative p-1.5 transition-colors block ${
                                location.pathname === '/favorites' 
                                    ? "text-rose-500" 
                                    : "text-text-dark/75 dark:text-[#d3cfc4] hover:text-primary dark:hover:text-primary"
                            }`}
                            title="Favorites"
                        >
                            <Heart className={`w-5 h-5 ${location.pathname === '/favorites' ? "fill-current" : ""}`} />
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Link 
                            to='/cart' 
                            className={`relative p-1.5 transition-colors block ${
                                location.pathname === '/cart' 
                                    ? "text-primary" 
                                    : "text-text-dark/75 dark:text-[#d3cfc4] hover:text-primary dark:hover:text-primary"
                            }`}
                            title="Cart"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <AnimatePresence>
                                {cartItemCount > 0 && (
                                    <motion.span
                                        key="cart-badge"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-mono font-black rounded-full flex items-center justify-center shadow-md shadow-primary/30 border border-white dark:border-[#2d211d] pointer-events-none leading-none"
                                    >
                                        {cartItemCount > 99 ? '99+' : cartItemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </motion.div>
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-1.5 text-text-dark/75 dark:text-[#d3cfc4] hover:text-primary dark:hover:text-primary transition-colors rounded-full cursor-pointer"
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                    </motion.button>
                    <div className="h-4 w-[1px] bg-gray-200 dark:bg-[#4a3833] mx-0.5"></div>
                    {!token ? (
                        <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setshowLogin(true)} 
                            className="text-[11px] font-bold tracking-widest text-text-dark/80 dark:text-[#d3cfc4] hover:text-primary border border-gray-200 dark:border-[#4a3833] hover:bg-primary/5 dark:hover:bg-[#3a2b27] px-3 py-1 rounded uppercase transition-all cursor-pointer"
                        >
                            Sign in
                        </motion.button>
                    ) : (
                        <div className="relative" ref={profileDropdownRef}>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className={`p-1.5 rounded-full focus:outline-none cursor-pointer transition-colors ${
                                    profileDropdownOpen 
                                        ? 'text-primary bg-primary/10' 
                                        : 'text-text-dark/85 dark:text-[#d3cfc4] hover:text-primary'
                                }`}
                            >
                                <User className="w-5 h-5" />
                            </motion.button>
                            
                            <AnimatePresence>
                                {profileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: -8 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -8 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className="absolute right-0 top-full mt-2.5 bg-white/98 dark:bg-[#2b1f1d]/98 backdrop-blur-xl border border-gray-200/60 dark:border-[#3a2b27] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 p-1.5 min-w-[200px] z-50 overflow-hidden"
                                    >
                                        <div className="px-3 py-2.5 mb-1 border-b border-gray-100 dark:border-[#3a2b27]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                                                    {userData?.name ? userData.name.slice(0, 1) : <User className="w-4 h-4 text-white" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-text-dark dark:text-[#f4f1ea] truncate">{userData?.name || "Cravely User"}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-[#7f796d] font-mono truncate max-w-[140px]">{userData?.email || "Premium Member"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <ul className="flex flex-col gap-0.5">
                                            <motion.li 
                                                whileHover={{ x: 4, backgroundColor: 'rgba(255,107,53,0.08)' }}
                                                onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }} 
                                                className="flex items-center gap-2.5 cursor-pointer py-2 px-3 rounded-xl transition-colors text-xs font-semibold text-text-dark dark:text-[#d3cfc4]"
                                            >
                                                <UserCircle className="w-4 h-4 text-primary" />
                                                <span>View Profile</span>
                                            </motion.li>
                                            <motion.li 
                                                whileHover={{ x: 4, backgroundColor: 'rgba(255,107,53,0.08)' }}
                                                onClick={() => { navigate('/myorders'); setProfileDropdownOpen(false); }} 
                                                className="flex items-center gap-2.5 cursor-pointer py-2 px-3 rounded-xl transition-colors text-xs font-semibold text-text-dark dark:text-[#d3cfc4]"
                                            >
                                                <Package className="w-4 h-4 text-primary" />
                                                <span>My Orders</span>
                                            </motion.li>
                                            <motion.li 
                                                whileHover={{ x: 4, backgroundColor: 'rgba(255,107,53,0.08)' }}
                                                onClick={() => { window.open('http://localhost:5174', '_blank'); setProfileDropdownOpen(false); }} 
                                                className="flex items-center gap-2.5 cursor-pointer py-2 px-3 rounded-xl transition-colors text-xs font-semibold text-text-dark dark:text-[#d3cfc4]"
                                            >
                                                <span className="text-sm">🛡️</span>
                                                <span>Admin Portal</span>
                                            </motion.li>
                                        </ul>

                                        <hr className="my-1 border-gray-100 dark:border-[#3a2b27]" />
                                        <motion.button 
                                            whileHover={{ x: 4 }}
                                            onClick={() => { logout(); setProfileDropdownOpen(false); }}
                                            className="flex items-center gap-2.5 cursor-pointer py-2 px-3 rounded-xl hover:bg-rose-500/8 transition-colors text-xs font-semibold text-text-dark dark:text-[#d3cfc4] w-full"
                                        >
                                            <LogOut className="w-4 h-4 text-rose-500" />
                                            <span className="text-rose-500">Log out</span>
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-text-dark dark:text-[#d3cfc4] focus:outline-none cursor-pointer"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-bg-warm/95 dark:bg-[#2d211d]/95 backdrop-blur-xl border-b border-gray-200 dark:border-[#42332e] px-4 py-4"
                    >
                        <div className="flex flex-col gap-3">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`py-2 px-3 rounded-lg font-serif text-base font-bold flex items-center gap-2 ${
                                        activeTab === item.id 
                                            ? "bg-primary text-white" 
                                            : "text-text-dark dark:text-[#d3cfc4] hover:bg-gray-100 dark:hover:bg-[#222]"
                                    }`}
                                >
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar;