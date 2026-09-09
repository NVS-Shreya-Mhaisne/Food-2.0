import React, { useState } from 'react'
import Header from '../../Components/Header/Header'
import ExploreMenu from '../../Components/ExploreMenu/ExplloreMenu'
import PopularRestaurants from '../../Components/PopularRestaurants/PopularRestaurants'
import WhyChooseUs from '../../Components/WhyChooseUs/WhyChooseUs'

const Home = () => {
  const [category, setcategory] = useState("All");

  return (
    <div className="relative min-h-screen bg-bg-warm/80 dark:bg-[#211714]/80 backdrop-blur-xl mesh-bg overflow-hidden transition-all duration-300">
      {/* Ambient background light glows */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* 2. Hero Section */}
      <Header />

      {/* Main Content Container for grid sections */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mx-auto flex flex-col gap-10 py-6 relative z-10 max-w-[1600px]">

        {/* 4. Categories Section */}
        <ExploreMenu category={category} setcategory={setcategory} />

        {/* 5. Popular Restaurants Section */}
        <PopularRestaurants />
      </div>

      {/* 7. Why Choose Us Section */}
      <WhyChooseUs />
    </div>
  )
}

export default Home

