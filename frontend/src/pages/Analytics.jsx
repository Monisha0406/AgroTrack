import React from 'react';
import { BarChart3, LineChart as LucideLineChart, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', utilization: 85, ideal: 90 },
  { name: 'Tue', utilization: 92, ideal: 90 },
  { name: 'Wed', utilization: 78, ideal: 90 },
  { name: 'Thu', utilization: 94, ideal: 90 },
  { name: 'Fri', utilization: 88, ideal: 90 },
  { name: 'Sat', utilization: 65, ideal: 90 },
  { name: 'Sun', utilization: 40, ideal: 90 },
];

const fuelData = [
  { name: 'Week 1', consumption: 4000, efficiency: 8.5 },
  { name: 'Week 2', consumption: 3800, efficiency: 8.7 },
  { name: 'Week 3', consumption: 4200, efficiency: 8.3 },
  { name: 'Week 4', consumption: 3900, efficiency: 8.8 },
];

const Analytics = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center">
            <BarChart3 className="mr-3 text-agGreen-500 hidden sm:block" /> 
            Data Analytics
          </h2>
          <p className="text-gray-500 mt-1 sm:ml-10">Deep dive into fleet utilization and operational metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Chart */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg flex items-center">
                <LucideLineChart size={18} className="mr-2 text-blue-500" />
                Weekly Fleet Utilization
              </h3>
              <p className="text-sm text-gray-500">Percentage of active operational hours</p>
            </div>
            <span className="bg-agGreen-50 text-agGreen-600 font-bold px-3 py-1 rounded text-sm flex items-center">
              <TrendingUp size={16} className="mr-1" /> +4.2%
            </span>
          </div>
          
          <div className="h-72 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="utilization" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorUtil)" />
                <Area type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Chart */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg flex items-center">
                <TrendingUp size={18} className="mr-2 text-yellow-500" />
                Fuel Economy Trends
              </h3>
              <p className="text-sm text-gray-500">Gallons used vs Efficiency Output</p>
            </div>
          </div>
          
          <div className="h-72 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="consumption" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorFuel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
