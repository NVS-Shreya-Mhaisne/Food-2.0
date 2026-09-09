import React, { useState, useEffect, useContext } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Checkout from './Pages/Checkout/Checkout'
import Footer from './Components/Footer/Footer'
import AuthModal from './Components/Auth/AuthModal'
import LiveOrderTracker from './Components/LiveOrderTracker/LiveOrderTracker'
import FloatingOrderTrackerWidget from './Components/LiveOrderTracker/FloatingOrderTrackerWidget'
import Verify from './Pages/Verify/Verify'
import MyOrders from './Pages/MyOrders/MyOrders'
import UserProfile from './Pages/UserProfile/UserProfile'
import AppDownload from './Components/AppDownload/AppDownload'
import CategoryPage from './Pages/CategoryPage/CategoryPage'
import Restaurants from './Pages/Restaurants/Restaurants'
import RestaurantDetail from './Pages/RestaurantDetail/RestaurantDetail'
import About from './Pages/About/About'
import Favorites from './Pages/Favorites/Favorites'
import AiAssistantPage from './Pages/AiAssistant/AiAssistantPage'

import { StoreContext } from './Components/Context/StoreContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const App = () => {
  const { authModalState, closeAuthModal, openAuthModal } = useContext(StoreContext);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const location = useLocation();
  const isAiPage = location.pathname === '/ai-assistant';

  return (
    <>
      <ScrollToTop />
      {/* 1. Auth & Security Modal (Login, Register, OAuth, Forgot Password) */}
      <AuthModal 
        isOpen={authModalState.isOpen} 
        onClose={closeAuthModal} 
        initialMode={authModalState.mode}
        customTitle={authModalState.title}
        customSubtitle={authModalState.subtitle}
        onAuthSuccess={authModalState.onSuccess}
      />

      {/* 2. Real-Time Order Tracker Modal */}
      <LiveOrderTracker isOpen={showTrackerModal} onClose={() => setShowTrackerModal(false)} />

      {/* Header Navigation Bar */}
      <Navbar 
        setshowLogin={() => openAuthModal({ mode: 'login' })} 
        onOpenTracker={() => setShowTrackerModal(true)} 
      />

      <div className='app'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/Order' element={<PlaceOrder />} />
          <Route path='/checkout' element={<Checkout onOrderPlaced={() => setShowTrackerModal(true)} />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders onOpenTracker={() => setShowTrackerModal(true)} />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/ai-assistant' element={<AiAssistantPage />} />
          <Route path='/menu/:categoryName' element={<CategoryPage />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path='/restaurant/:restaurantId' element={<RestaurantDetail />} />
        </Routes>
      </div>

      {/* 9. App Download Section (Hidden on AI Assistant page) */}
      {!isAiPage && <AppDownload />}

      {/* 10. Footer (Hidden on AI Assistant page) */}
      {!isAiPage && <Footer />}

      {/* 11. Distinct Floating Live Order Telemetry Dock */}
      <FloatingOrderTrackerWidget onOpenTracker={() => setShowTrackerModal(true)} />
    </>
  )
}

export default App
