import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Add from './pages/Add/Add';
import Orders from './pages/Orders/Orders';
import List from './pages/List/List';
import Restaurants from './pages/Restaurants/Restaurants';
import Login from './pages/Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = (import.meta.env.VITE_BACKEND_URL || "https://cravely-backend.vercel.app").replace(/\/+$/, "");

  // Always require login when opening admin in a new browser session
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!sessionStorage.getItem("adminSession") && !!localStorage.getItem("token")
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      {/* If not logged in → show Login page */}
      {!isLoggedIn ? (
        <Login url={url} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <>
          <Navbar setIsLoggedIn={setIsLoggedIn} />
          <div className="flex flex-col md:flex-row flex-1 w-full">
            <Sidebar />
            <Routes>
              <Route path='/' element={<Navigate to='/restaurants' replace />} />
              <Route path='/restaurants' element={<Restaurants url={url} />} />
              <Route path='/add' element={<Add url={url} />} />
              <Route path='/list' element={<List url={url} />} />
              <Route path='/order' element={<Orders url={url} />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
