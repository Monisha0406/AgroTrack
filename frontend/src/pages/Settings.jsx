import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Save } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto h-[calc(100vh-100px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center">
            <SettingsIcon className="mr-3 text-gray-400 hidden sm:block" /> 
            System Settings
          </h2>
          <p className="text-gray-500 mt-1 sm:ml-10">Manage farm profile and system preferences</p>
        </div>
        <button className="flex items-center text-sm font-semibold text-white bg-agGreen-600 hover:bg-agGreen-700 px-5 py-2.5 rounded-lg shadow-sm transition-colors">
          <Save size={18} className="mr-2" /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-4 h-fit">
          <nav className="space-y-1">
            {['profile', 'notifications', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-colors capitalize ${
                  activeTab === tab 
                    ? 'bg-agGreen-50 text-agGreen-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab === 'profile' && <User size={18} className="mr-3" />}
                {tab === 'notifications' && <Bell size={18} className="mr-3" />}
                {tab === 'security' && <Shield size={18} className="mr-3" />}
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 overflow-y-auto">
          
          {activeTab === 'profile' && (
            <div className="animate-fade-in space-y-6">
              <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-4 mb-6">Farm Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Name</label>
                  <input type="text" defaultValue="AgriTrack Central Farm" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agGreen-500 focus:border-agGreen-500 bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location Boundary (Lat/Lng)</label>
                  <input type="text" defaultValue="34.05, -118.25" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agGreen-500 focus:border-agGreen-500 bg-gray-50 focus:bg-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
                  <input type="email" defaultValue="admin@farm.com" disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500" />
                  <p className="text-xs text-gray-400 mt-2">Email address cannot be changed directly. Contact system support.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-in space-y-6">
              <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-4 mb-6">Alert Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { title: 'Critical Maintenance Alerts', desc: 'Receive immediate SMS when a machine requires critical care.' },
                  { title: 'Geofence Deviations', desc: 'Email alerts if a machine leaves its assigned sector.' },
                  { title: 'Daily Reports Summary', desc: 'Receive a digest of yesterday\'s fleet operations every morning at 8:00 AM.' }
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{pref.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{pref.desc}</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer scale-[0.85] left-0 checked:right-0 checked:border-agGreen-500 checked:translate-x-full transition-all" />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in space-y-6">
              <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-4 mb-6">Security & Access</h3>
              
              <div className="bg-red-50 text-red-600 p-4 border border-red-200 rounded-xl">
                 <h4 className="font-bold mb-1">Active Sessions</h4>
                 <p className="text-sm">You are currently logged in from 1 device (Chrome via Windows PC). The last IP address connected was 192.168.1.1.</p>
              </div>

              <div>
                <button className="text-sm font-semibold text-gray-600 border border-gray-200 bg-white px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Settings;
