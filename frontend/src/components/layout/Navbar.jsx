import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  // Safe fallback for user data
  const name = user?.name || 'Guest User';
  const role = user?.role || 'Visitor';
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
      
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-gray-500 hover:text-agGreen-600 focus:outline-none focus:ring-2 focus:ring-agGreen-500 p-1 rounded-md"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center bg-gray-100/80 hover:bg-gray-100 rounded-full px-4 py-2 w-72 lg:w-96 border border-transparent focus-within:border-agGreen-500 focus-within:bg-white transition-all shadow-inner">
          <Search size={18} className="text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search machines, locations..." 
            className="bg-transparent border-none focus:outline-none w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <button className="relative text-gray-500 hover:text-agGreen-600 transition-colors p-2 rounded-full hover:bg-agGreen-50">
          <Bell size={22} />
          <span className="absolute top-1 right-1.5 block w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
        
        <div className="flex items-center space-x-4 cursor-pointer">
          <div className="flex items-center gap-3 hover:bg-gray-50 p-1.5 md:p-2 rounded-xl transition-colors border border-transparent hover:border-gray-200">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-agGreen-100 flex items-center justify-center text-agGreen-700 font-bold border-2 border-white shadow-sm ring-1 ring-gray-100">
              {initials}
            </div>
            <div className="hidden md:block text-left text-sm pr-2">
              <p className="font-semibold text-gray-800 leading-tight">{name}</p>
              <p className="text-gray-500 text-xs leading-tight font-medium mt-0.5">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
