import React from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, Check } from 'lucide-react';

const alertData = [
  { id: 1, type: 'critical', title: 'Low Fuel Warning', machine: 'Claas Lexion 8000', time: '10 mins ago', msg: 'Fuel level is below 10%. Immediate refuel required.' },
  { id: 2, type: 'warning', title: 'Maintenance Overdue', machine: 'John Deere 8RX', time: '2 hours ago', msg: 'Scheduled hydraulic system check is 48 hours overdue.' },
  { id: 3, type: 'info', title: 'Route Deviation', machine: 'Fendt 1000 Vario', time: 'Yesterday', msg: 'Vehicle left the assigned geo-fence boundary (Sector 4-B).' },
  { id: 4, type: 'critical', title: 'Engine Temperature High', machine: 'Case IH Axial-Flow', time: 'Yesterday', msg: 'Coolant temperature exceeded 105°C during operation.' },
];

const Alerts = () => {

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical': return <AlertCircle className="text-red-600" size={24} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  const getAlertStyle = (type) => {
    switch(type) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center">
            <Bell className="mr-3 text-red-500 hidden sm:block animate-pulse" /> 
            Command Alerts
          </h2>
          <p className="text-gray-500 mt-1 sm:ml-10">Critical notifications and system warnings</p>
        </div>
        <button className="text-sm font-semibold text-agGreen-600 bg-agGreen-50 hover:bg-agGreen-100 px-4 py-2 rounded-lg transition-colors flex items-center">
          <Check size={16} className="mr-2" /> Mark All Read
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {alertData.map((alert) => (
          <div key={alert.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors flex items-start gap-4 md:gap-6 group cursor-pointer relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              alert.type === 'critical' ? 'bg-red-500' : 
              alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-500'
            }`}></div>
            
            <div className={`p-3 rounded-full flex-shrink-0 ${getAlertStyle(alert.type)}`}>
              {getAlertIcon(alert.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1 gap-1">
                <h3 className="font-bold text-gray-800 text-base">{alert.title}</h3>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{alert.time}</span>
              </div>
              <p className="text-sm font-bold text-gray-600 mb-1">{alert.machine}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{alert.msg}</p>
            </div>
            
            <button className="hidden sm:block opacity-0 group-hover:opacity-100 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-all absolute right-6 top-1/2 -translate-y-1/2">
               Acknowledge
            </button>
          </div>
        ))}
      </div>
      
      <div className="text-center">
         <button className="text-sm font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 bg-white px-6 py-2 rounded-lg hover:shadow-sm transition-all">
            Load Historical Alerts
         </button>
      </div>
    </div>
  );
};

export default Alerts;
