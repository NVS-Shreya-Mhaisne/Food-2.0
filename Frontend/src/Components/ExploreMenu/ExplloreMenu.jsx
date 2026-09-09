import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { menu_list } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../Context/StoreContext'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15
    }
  }
}

const circleVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
}

const ExplloreMenu = ({ category, setcategory }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className='flex flex-col gap-4 py-8'
      id='explore-menu'
    >
      <h1 className='font-serif text-3xl sm:text-4xl font-bold text-text-dark dark:text-[#f4f1ea]'>Explore our menu</h1>
      <p className='max-w-xl text-sm text-[#676767] dark:text-[#a09a8e] leading-relaxed'>Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your craving and elevate your dining experience, one delicious meal at a time.</p>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="grid grid-rows-2 grid-flow-col auto-cols-max md:auto-cols-fr justify-between gap-y-6 gap-x-3 sm:gap-x-4 text-center my-6 overflow-x-auto no-scrollbar py-4 w-full"
      >
        {menu_list.map((item, index) => {
          const isActive = category === item.menu_name;
          return (
            <motion.div
              variants={circleVariants}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate(`/menu/${encodeURIComponent(item.menu_name)}`);
              }}
              className="flex flex-col items-center cursor-pointer min-w-[80px] sm:min-w-[96px] group"
              key={index}
            >
              {/* 3D Cutout PNG Dish Item Container */}
              <div className="relative w-22 h-22 sm:w-26 sm:h-26 flex items-center justify-center transition-all duration-300 transform-gpu group-hover:-translate-y-1.5">
                {/* Soft Round Floor Shadow (No rectangular box shadow tint) */}
                <div className={`absolute bottom-1 w-14 sm:w-16 h-3 rounded-full blur-md pointer-events-none transition-all duration-300 ${isActive ? "bg-primary/40 scale-110" : "bg-black/25 dark:bg-black/50 group-hover:scale-120 group-hover:bg-black/35"
                  }`} />

                {/* Clean PNG Dish Image */}
                <img
                  className={`w-full h-full object-contain relative z-10 transition-transform duration-300 transform-gpu ${isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  src={item.menu_image}
                  alt={item.menu_name}
                />
              </div>

              {/* Text Label */}
              <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors ${isActive ? "text-primary font-extrabold scale-105" : "text-[#2b1f1d] dark:text-[#f4f1ea] group-hover:text-primary"
                }`}>
                {item.menu_name}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default ExplloreMenu
