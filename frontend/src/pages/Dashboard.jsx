import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tractor, AlertTriangle, Settings, Activity } from 'lucide-react';

const Dashboard = () => {
  const chartData = [
    { name: 'Mon', Active: 14, Idle: 6, Maintenance: 2 },
    { name: 'Tue', Active: 15, Idle: 5, Maintenance: 2 },
    { name: 'Wed', Active: 18, Idle: 2, Maintenance: 2 },
    { name: 'Thu', Active: 16, Idle: 4, Maintenance: 2 },
    { name: 'Fri', Active: 19, Idle: 1, Maintenance: 2 },
    { name: 'Sat', Active: 10, Idle: 10, Maintenance: 2 },
    { name: 'Sun', Active: 8, Idle: 12, Maintenance: 2 },
  ];

  const pieData = [
    { name: 'Active (Harvesting/Seeding)', value: 18 },
    { name: 'Idle (Standby)', value: 10 },
    { name: 'In Maintenance', value: 4 }
  ];

  const COLORS = ['#22c55e', '#facc15', '#ef4444'];

  const stats = [
    { title: "Total Fleet", value: "32", icon: <Tractor size={28} className="text-blue-500" />, borderColor: "border-blue-500", trend: "+2 this month" },
    { title: "Active operations", value: "18", icon: <Activity size={28} className="text-agGreen-500" />, borderColor: "border-agGreen-500", trend: "Optimal" },
    { title: "Idle Equipment", value: "10", icon: <AlertTriangle size={28} className="text-yellow-400" />, borderColor: "border-yellow-400", trend: "Needs Assignment" },
    { title: "In Maintenance", value: "4", icon: <Settings size={28} className="text-red-500" />, borderColor: "border-red-500", trend: "2 finishing today" }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Farm Overview</h2>
          <p className="text-gray-500 mt-1">Real-time agricultural telemetry and status</p>
        </div>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-6 border-t-4 ${stat.borderColor} hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 group`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{stat.trend}</span>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-6 lg:col-span-2 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="mr-2 text-gray-400" size={20} /> Weekly Fleet Operations
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                <Bar dataKey="Active" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Idle" stackId="a" fill="#facc15" />
                <Bar dataKey="Maintenance" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Tractor className="mr-2 text-gray-400" size={20} /> Current Status
          </h3>
          <div className="h-64 cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-600 font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-gray-800">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;