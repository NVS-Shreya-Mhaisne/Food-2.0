import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../Context/StoreContext'
import FoodDetailsModal from '../FoodDetailsModal/FoodDetailsModal'

const FoodItem = ({ id, name, price, description, image, category }) => {

  const { cartItems, addToCart, removeFromCart, url, likedFoods, toggleLikeFood } = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);

  const isLiked = likedFoods?.[id] || false;
  const imageSrc = image.startsWith('http') ? image : `${url}/images/${image}`;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
        className='w-full mx-auto bg-white/70 dark:bg-[#2b1f1d]/70 backdrop-blur-md shadow-xl shadow-black/5 dark:shadow-black/20 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 border border-gray-100/80 dark:border-[#3a2b27] overflow-hidden transition-all duration-300 animate-fadeIn flex flex-col justify-between group'
      >
        <div 
          onClick={() => setShowModal(true)}
          className="relative w-full h-48 overflow-hidden bg-[#FFFBF9] dark:bg-[#352723] cursor-pointer"
        >
          <img 
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' 
            src={imageSrc} 
            alt={name} 
          />

          {/* Heart Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeFood(id);
            }}
            className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 z-10 cursor-pointer ${
              isLiked 
                ? "bg-rose-500 text-white border-rose-500 shadow-md scale-110" 
                : "bg-white/80 dark:bg-black/40 text-gray-600 dark:text-gray-200 border-white/40 hover:bg-white dark:hover:bg-black/60 hover:text-rose-500"
            }`}
            title={isLiked ? "Unlike food item" : "Like food item"}
          >
            <Heart className={`w-4 h-4 transition-transform ${isLiked ? "fill-current scale-110" : ""}`} />
          </button>

          {
            !cartItems[id] ?
              <img 
                className="absolute bottom-3 right-3 w-9 h-9 cursor-pointer rounded-full shadow-md hover:scale-110 transition-transform z-10" 
                onClick={(e) => { e.stopPropagation(); addToCart(id); }} 
                src={assets.add_icon_white} 
                alt='Add' 
              />
              : <div 
                  onClick={(e) => e.stopPropagation()}
                  className='absolute bottom-3 right-3 flex items-center gap-2.5 bg-white dark:bg-[#2b1f1d] px-2.5 py-1.5 rounded-full shadow-md border border-gray-100 dark:border-[#3a2b27] z-10'
                >
                <img className="w-7 h-7 cursor-pointer hover:scale-110 transition-transform" onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
                <p className="text-sm font-bold text-text-dark dark:text-[#f4f1ea] min-w-[16px] text-center">{cartItems[id]}</p>
                <img className="w-7 h-7 cursor-pointer hover:scale-110 transition-transform" onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
              </div>
          }
        </div>
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div onClick={() => setShowModal(true)} className="cursor-pointer">
            <div className="flex justify-between items-center mb-2">
              <p className="font-serif text-lg font-bold text-text-dark dark:text-[#f4f1ea] truncate pr-2 group-hover:text-primary transition-colors">{name}</p>
              <img className="w-16 h-auto shrink-0" src={assets.rating_starts} alt="Rating" />
            </div>
            <p className='text-xs text-[#676767] dark:text-[#a09a8e] line-clamp-2 leading-relaxed mb-4'>{description}</p>
          </div>
          <p className='text-xl font-extrabold text-primary font-mono'>₹ {price}</p>
        </div>
      </motion.div>

      {/* Food Details Modal */}
      <FoodDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={{ _id: id, name, price, description, image: imageSrc, category }}
      />
    </>
  )
}

export default FoodItem
