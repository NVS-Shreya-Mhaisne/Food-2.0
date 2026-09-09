import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { motion } from 'framer-motion'
import { 
  Send, 
  ArrowUp, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight,
  Heart,
  Utensils,
  Star
} from 'lucide-react'
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
}

const linkHoverVariants = {
  rest: { x: 0 },
  hover: { x: 6, transition: { type: "spring", stiffness: 300, damping: 20 } }
}

const Footer = ({ onOpenAbout }) => {
  const [emailFocused, setEmailFocused] = useState(false)
  const [subscribeSuccess, setSubscribeSuccess] = useState(false)

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    setSubscribeSuccess(true)
    setTimeout(() => setSubscribeSuccess(false), 3000)
  }

  const floatingEmojis = [
    { emoji: '🍕', top: '8%', left: '5%', delay: 0 },
    { emoji: '🍔', top: '22%', right: '8%', delay: 1.2 },
    { emoji: '🌮', top: '55%', left: '3%', delay: 2.4 },
    { emoji: '🍣', top: '70%', right: '4%', delay: 0.8 },
    { emoji: '🧁', top: '38%', right: '12%', delay: 1.8 },
    { emoji: '🍜', top: '82%', left: '10%', delay: 3 },
  ]

  return (
    <footer className='relative overflow-hidden font-sans mt-4 sm:mt-6' id='footer'>
      
      {/* ANIMATED WAVE DIVIDER */}
      <div className="relative w-full h-12 sm:h-16 overflow-hidden">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-[200%] h-full animate-wave"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,50 C300,120 480,-15 720,50 C960,115 1140,-15 1440,50 C1740,115 1920,-15 2160,50 C2400,115 2580,-15 2880,50 L2880,120 L0,120 Z" 
            className="fill-[#1a110e] dark:fill-[#120c0a]"
          />
          <path 
            d="M0,75 C240,10 480,115 720,65 C960,10 1200,115 1440,65 C1680,10 1920,115 2160,65 C2400,10 2640,115 2880,65 L2880,120 L0,120 Z" 
            className="fill-[#231815] dark:fill-[#160f0c]"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* MAIN FOOTER BODY */}
      <div className="relative bg-gradient-to-b from-[#231815] to-[#120c0a] text-[#d3cfc4] pt-4 pb-4 border-t border-[#3d2e2c]/30">

        {/* Floating Food Emoji Decorations */}
        {floatingEmojis.map((item, i) => (
          <div
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-[0.1] pointer-events-none select-none animate-float"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: `${item.delay}s`,
              animationDuration: `${6 + i * 0.8}s`
            }}
          >
            {item.emoji}
          </div>
        ))}

        <div className="w-[85%] sm:w-[80%] mx-auto flex flex-col gap-6 relative z-10">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5"
          >
            <motion.div variants={itemVariants} className="max-w-md text-center lg:text-left">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2 justify-center lg:justify-start">
                <Heart className="w-5 h-5 text-primary animate-pulse" />
                Join the Cravely Club
              </h3>
              <p className="text-xs text-[#a39e93] mt-1.5 leading-relaxed font-medium">
                Subscribe to get latest menu updates, special offers, and ₹100 off your first order.
              </p>
            </motion.div>

            <motion.form 
              variants={itemVariants}
              onSubmit={handleSubscribe} 
              className={`w-full max-w-md flex items-center bg-white/5 border rounded-2xl p-1.5 transition-all duration-500 ${
                emailFocused 
                  ? 'border-primary shadow-[0_0_25px_rgba(255,107,53,0.15)]' 
                  : 'border-white/10'
              } ${!emailFocused && !subscribeSuccess ? 'animate-glow-pulse' : ''}`}
            >
              <div className="pl-3 text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="w-full bg-transparent border-none outline-none px-3 text-xs text-white placeholder-gray-500 font-medium"
              />
              <motion.button 
                type="submit" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer ${
                  subscribeSuccess 
                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                    : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                <span>{subscribeSuccess ? '✓ Subscribed!' : 'Subscribe'}</span>
                {!subscribeSuccess && <Send className="w-3.5 h-3.5 text-white" />}
              </motion.button>
            </motion.form>
          </motion.div>

          {/* === LINKS GRID === */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-6 md:gap-8"
          >
            {/* Brand Info Column */}
            <motion.div variants={itemVariants} className="flex flex-col items-start gap-3">
              <Link to="/" className="relative group">
                <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-shimmer text-transparent bg-clip-text">
                  Cravely.
                </span>
              </Link>
              <p className="text-xs text-[#a39e93] leading-relaxed max-w-sm font-medium">
                Thoughtful dishes, moving quickly from neighborhood kitchens to your table. Satisfying your cravings one delicious meal at a time.
              </p>
              <div className="flex items-center gap-2.5 mt-1">
                {[
                  { icon: assets.facebook_icon, alt: 'Facebook' },
                  { icon: assets.twitter_icon, alt: 'Twitter' },
                  { icon: assets.linkedin_icon, alt: 'LinkedIn' }
                ].map((social, idx) => (
                  <motion.a 
                    key={idx}
                    href="#" 
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group/social"
                  >
                    <img src={social.icon} className="w-4 h-4 filter brightness-0 invert group-hover/social:brightness-100 group-hover/social:invert-0 transition-all duration-300" alt={social.alt} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Discover Column */}
            <motion.div variants={itemVariants} className="flex flex-col items-start gap-2.5">
              <h4 className="text-white font-serif text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Utensils className="w-3.5 h-3.5 text-primary" />
                Discover
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-[#a39e93]">
                {[
                  { label: 'Home', to: '/', isLink: true },
                  { label: 'Our Menu', href: '#explore-menu' },
                  { label: 'Restaurants', href: '#popular-restaurants' },
                  { label: 'My Cart', to: '/cart', isLink: true },
                  { label: '🛡️ Admin Portal', href: 'http://localhost:5174', targetBlank: true }
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    variants={linkHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    className="flex items-center gap-1 cursor-pointer hover:text-primary transition-all font-medium group/link"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-primary/50 group-hover/link:text-primary transition-colors" />
                    {item.isLink ? (
                      <Link to={item.to}>{item.label}</Link>
                    ) : (
                      <a href={item.href} target={item.targetBlank ? "_blank" : undefined} rel={item.targetBlank ? "noopener noreferrer" : undefined}>{item.label}</a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Company Column */}
            <motion.div variants={itemVariants} className="flex flex-col items-start gap-2.5">
              <h4 className="text-white font-serif text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-primary" />
                Company
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-[#a39e93]">
                {[
                  { label: 'About Us', to: '/about' },
                  { label: 'Delivery Info', to: '/about' },
                  { label: 'Privacy Policy', to: '/about' },
                  { label: 'Terms of Service', to: '/about' }
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    variants={linkHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    className="flex items-center gap-1 cursor-pointer hover:text-primary transition-all font-medium group/link"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-primary/50 group-hover/link:text-primary transition-colors" />
                    <Link to={item.to}>{item.label}</Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Column */}
            <motion.div variants={itemVariants} className="flex flex-col items-start gap-2.5">
              <h4 className="text-white font-serif text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary" />
                Contact
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-[#a39e93] font-medium">
                <li className="flex items-start gap-2 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span>450 5th Ave, New York, NY 10018</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>+1 (234) 244-2330</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>contact@cravely.com</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Mon - Sun: 10:00 AM - 11:00 PM</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* === FOOTER BOTTOM === */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5 mt-1"
          >
            <p className="text-[11px] text-[#8c867a] font-mono order-2 sm:order-1 text-center sm:text-left">
              Copyright 2024 @ Cravely.com - All Right Reserved.
            </p>
            <motion.button 
              onClick={handleScrollToTop}
              whileHover={{ scale: 1.15, y: -3, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="order-1 sm:order-2 bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 text-gray-400 hover:text-white p-2.5 rounded-full transition-all duration-300 cursor-pointer shadow-sm hover:shadow-primary/20 hover:shadow-lg flex items-center justify-center group"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
