import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, PlusCircle, Utensils, ShoppingBag } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-full md:w-56 md:min-w-[224px] bg-white border-b md:border-b-0 md:border-r border-slate-200/90 p-3 md:p-5 flex flex-col justify-between shadow-xs">
      <div>
        <div className="text-[10px] font-extrabold text-slate-400 tracking-widest pl-2.5 mb-3 uppercase hidden md:block">
          MANAGEMENT HUB
        </div>

        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <NavLink
            to='/restaurants'
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 whitespace-nowrap group ${
                isActive
                  ? 'bg-gradient-to-r from-[#FFF0EB] to-[#FFE5DC] border-[#FF6B35]/40 text-[#FF6B35] shadow-xs'
                  : 'border-transparent text-slate-600 hover:bg-[#FFF8F5] hover:text-[#FF6B35]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 shrink-0 ${
                    isActive ? 'bg-[#FF6B35] text-white' : 'bg-slate-100 group-hover:bg-[#FF6B35] group-hover:text-white'
                  }`}
                >
                  <Store size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold leading-tight">Restaurants</p>
                  <p className={`text-[10px] font-medium ${isActive ? 'text-[#E85A24]' : 'text-slate-400'}`}>
                    Manage Locations
                  </p>
                </div>
              </>
            )}
          </NavLink>

          <NavLink
            to='/add'
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 whitespace-nowrap group ${
                isActive
                  ? 'bg-gradient-to-r from-[#FFF0EB] to-[#FFE5DC] border-[#FF6B35]/40 text-[#FF6B35] shadow-xs'
                  : 'border-transparent text-slate-600 hover:bg-[#FFF8F5] hover:text-[#FF6B35]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 shrink-0 ${
                    isActive ? 'bg-[#FF6B35] text-white' : 'bg-slate-100 group-hover:bg-[#FF6B35] group-hover:text-white'
                  }`}
                >
                  <PlusCircle size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold leading-tight">Add Food Dish</p>
                  <p className={`text-[10px] font-medium ${isActive ? 'text-[#E85A24]' : 'text-slate-400'}`}>
                    New Menu Items
                  </p>
                </div>
              </>
            )}
          </NavLink>

          <NavLink
            to='/list'
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 whitespace-nowrap group ${
                isActive
                  ? 'bg-gradient-to-r from-[#FFF0EB] to-[#FFE5DC] border-[#FF6B35]/40 text-[#FF6B35] shadow-xs'
                  : 'border-transparent text-slate-600 hover:bg-[#FFF8F5] hover:text-[#FF6B35]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 shrink-0 ${
                    isActive ? 'bg-[#FF6B35] text-white' : 'bg-slate-100 group-hover:bg-[#FF6B35] group-hover:text-white'
                  }`}
                >
                  <Utensils size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold leading-tight">Food Catalog</p>
                  <p className={`text-[10px] font-medium ${isActive ? 'text-[#E85A24]' : 'text-slate-400'}`}>
                    Dishes & Discounts
                  </p>
                </div>
              </>
            )}
          </NavLink>

          <NavLink
            to='/order'
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 whitespace-nowrap group ${
                isActive
                  ? 'bg-gradient-to-r from-[#FFF0EB] to-[#FFE5DC] border-[#FF6B35]/40 text-[#FF6B35] shadow-xs'
                  : 'border-transparent text-slate-600 hover:bg-[#FFF8F5] hover:text-[#FF6B35]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 shrink-0 ${
                    isActive ? 'bg-[#FF6B35] text-white' : 'bg-slate-100 group-hover:bg-[#FF6B35] group-hover:text-white'
                  }`}
                >
                  <ShoppingBag size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold leading-tight">Orders</p>
                  <p className={`text-[10px] font-medium ${isActive ? 'text-[#E85A24]' : 'text-slate-400'}`}>
                    Track Deliveries
                  </p>
                </div>
              </>
            )}
          </NavLink>
        </div>
      </div>

      <div className="hidden md:block mt-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-3.5 rounded-xl shadow-md">
        <p className="text-xs font-bold">Need Assistance?</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Cravely Admin Support v2.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
