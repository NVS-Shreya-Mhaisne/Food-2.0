import React from 'react';
import { assets } from '../../assets/assets';
import { UtensilsCrossed, LogOut, Sparkles } from 'lucide-react';

const Navbar = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("adminSession");
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8A5B] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <UtensilsCrossed size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-800 tracking-tight leading-none">
              Cravely<span className="text-[#FF6B35]">.</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-[#FF6B35] tracking-wider mt-0.5">
              <Sparkles size={10} /> ADMIN PORTAL
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 pr-2 border-r border-slate-200">
          <div className="hidden sm:flex flex-col text-right">
            <p className="text-xs font-bold text-slate-800 leading-tight">Super Admin</p>
            <p className="text-[10px] text-slate-500 font-semibold">Restaurant Manager</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 bg-[#FFF0EB] text-[#FF6B35] border border-[#FFD4C4] hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs"
          title="Logout"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
