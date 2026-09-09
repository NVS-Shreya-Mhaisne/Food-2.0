import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Check if the user has already checked the "already downloaded" option
    const isDownloaded = localStorage.getItem('cravely_app_downloaded') === 'true'
    if (isDownloaded) return

    let timer

    const startTimer = () => {
      // 5 minutes = 5 * 60 * 1000 = 300,000 ms
      timer = setTimeout(() => {
        const currentDownloaded = localStorage.getItem('cravely_app_downloaded') === 'true'
        if (!currentDownloaded) {
          setShowPopup(true)
        }
      }, 5 * 60 * 1000)
    }

    if (!showPopup) {
      startTimer()
    }

    // Also listen for a custom event to open the popup immediately
    const handleOpenEvent = () => {
      setShowPopup(true)
    }
    window.addEventListener('open-app-download', handleOpenEvent)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('open-app-download', handleOpenEvent)
    }
  }, [showPopup])

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      localStorage.setItem('cravely_app_downloaded', 'true')
      setShowPopup(false)
    }
  }

  const handleClose = () => {
    setShowPopup(false)
  }

  if (!showPopup) return null

  return (
    <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-[#2b1f1d] w-full max-w-md rounded-3xl shadow-2xl p-8 flex flex-col gap-6 text-center relative animate-fadeIn border border-gray-150 dark:border-[#3a2b27]'>
        {/* Cross Icon in the right corner */}
        <img 
          className="w-4 h-4 cursor-pointer absolute right-6 top-6 hover:opacity-70 transition-opacity" 
          onClick={handleClose} 
          src={assets.cross_icon} 
          alt="Close" 
        />
        
        <p className='font-serif text-2xl sm:text-3xl font-bold text-[#2b1f1d] dark:text-[#f4f1ea] leading-tight mt-4'>
          For Better Experience Download <br className="hidden sm:inline" /> Cravely App
        </p>
        
        <div className="flex justify-center items-center gap-4 sm:gap-6 my-2">
          <img className="w-32 sm:w-40 max-w-[180px] cursor-pointer transition-transform duration-300 hover:scale-105 rounded-lg shadow-sm" src={assets.play_store} alt="Play Store" />
          <img className="w-32 sm:w-40 max-w-[180px] cursor-pointer transition-transform duration-300 hover:scale-105 rounded-lg shadow-sm" src={assets.app_store} alt="App Store" />
        </div>

        {/* Checkbox "already downloaded app" */}
        <div className="flex items-center justify-center gap-2.5 text-sm text-gray-600 dark:text-[#a09a8e] mt-2 border-t border-gray-100 dark:border-[#3a2b27] pt-4">
          <input 
            type="checkbox" 
            id="downloaded-checkbox"
            onChange={handleCheckboxChange}
            className="w-4 h-4 cursor-pointer accent-primary" 
          />
          <label htmlFor="downloaded-checkbox" className="cursor-pointer font-medium select-none text-text-dark dark:text-[#d3cfc4] hover:text-primary transition-colors">
            I have already downloaded the Cravely App
          </label>
        </div>
      </div>
    </div>
  )
}

export default AppDownload


