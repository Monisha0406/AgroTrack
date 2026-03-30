import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Tractor, Activity, Wrench, MapPin, BarChart3, Bell, Settings, FileText, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Machines', icon: <Tractor size={20} />, path: '/machines' },
    { name: 'Monitoring', icon: <Activity size={20} />, path: '/monitoring' },
    { name: 'Maintenance', icon: <Wrench size={20} />, path: '/maintenance' },
    { name: 'Tracking', icon: <MapPin size={20} />, path: '/tracking' },
    { name: 'Reports', icon: <FileText size={20} />, path: '/reports' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'Alerts', icon: <Bell size={20} />, path: '/alerts' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-agDark text-agLight shadow-2xl
      transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      flex flex-col h-full
    `}>
      <div className="flex items-center justify-between lg:justify-center py-6 px-6 lg:px-0 border-b border-gray-700">
        <div className="flex items-center">
          <Tractor className="text-agGreen-500 mr-2" size={28} />
          <h1 className="text-xl font-bold tracking-wider">AgriTrack</h1>
        </div>
        <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto mt-6 custom-scrollbar">
        <nav className="flex-1 px-4 space-y-2 pb-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close on mobile navigation
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-agGreen-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center bg-gray-900/50">
        © 2026 Agri Systems Co.
      </div>
    </div>
  );
};

export default Sidebar;