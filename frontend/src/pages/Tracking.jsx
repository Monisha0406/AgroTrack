import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import axios from 'axios';
import { format } from 'date-fns';
import { Tractor, Clock, Activity, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix typical Leaflet icon issue by overriding default marker (not strictly needed since we use divIcon, but good practice)
delete L.Icon.Default.prototype._getIconUrl;

const SOCKET_SERVER_URL = 'http://localhost:5000';

const createCustomMarker = (status) => {
  let colorClass, outerColorClass, glowClass;
  
  switch(status) {
    case 'Active':
      colorClass = 'bg-agGreen-500';
      outerColorClass = 'bg-agGreen-100 border-agGreen-400';
      glowClass = 'animate-ping opacity-75';
      break;
    case 'Idle':
      colorClass = 'bg-yellow-400';
      outerColorClass = 'bg-yellow-100 border-yellow-400';
      glowClass = '';
      break;
    case 'Maintenance':
      colorClass = 'bg-red-500';
      outerColorClass = 'bg-red-100 border-red-500';
      glowClass = '';
      break;
    case 'Offline':
      colorClass = 'bg-gray-400';
      outerColorClass = 'bg-gray-100 border-gray-400';
      glowClass = '';
      break;
    default:
      colorClass = 'bg-gray-500';
      outerColorClass = 'bg-gray-100 border-gray-400';
      glowClass = '';
  }

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${outerColorClass} border-2 shadow-md ${status === 'Offline' ? 'opacity-50' : ''}">
      ${status === 'Active' ? `<span class="absolute inline-flex w-full h-full rounded-full ${colorClass} ${glowClass}"></span>` : ''}
      <span class="relative inline-flex rounded-full w-3 h-3 ${colorClass}"></span>
    </div>
  `;

  return L.divIcon({
    className: 'custom-icon',
    html: html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const Tracking = () => {
  const [machines, setMachines] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  
  // Tamil Nadu center coordinates
  const centerPosition = [11.1271, 78.6569];

  useEffect(() => {
    // Fetch initial
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/machines');
        // Filter out machines without valid locations
        const validMachines = response.data.filter(m => m.location && typeof m.location.lat === 'number');
        if (validMachines.length > 0) {
          setMachines(validMachines);
          setLastSync(new Date());
        }
      } catch (err) {
        console.error("Failed to load map data:", err);
      }
    };
    fetchMachines();

    // Socket
    const socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    const updateMachineState = (updatedMachine) => {
      if (!updatedMachine.location || typeof updatedMachine.location.lat !== 'number') return;
      
      setMachines(current => {
        // If it doesn't exist, we add it, otherwise update
        const exists = current.find(m => m._id === updatedMachine._id);
        if (exists) {
          return current.map(m => m._id === updatedMachine._id ? updatedMachine : m);
        }
        return [...current, updatedMachine];
      });
      setLastSync(new Date());
    };

    socket.on('machine-status-changed', updateMachineState);
    socket.on('machine-location-changed', updateMachineState);

    return () => {
      socket.disconnect();
    };
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-800"><Activity size={10} className="mr-1" /> Active</span>;
      case 'Idle':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-yellow-100 text-yellow-800"><Clock size={10} className="mr-1" /> Idle</span>;
      case 'Maintenance':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-800"><AlertTriangle size={10} className="mr-1" /> Maintenance</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center">
            Location Tracking
            <span className="ml-4 flex items-center text-sm font-medium px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
              <span className={`w-2.5 h-2.5 rounded-full mr-2 ${isConnected ? 'bg-agGreen-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isConnected ? 'Telemetry Linked' : 'Offline'}
            </span>
          </h2>
          <p className="text-gray-500 mt-1">Real-time GPS fleet tracking powered by OpenStreetMap</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          Last Marker Sync: <span className="font-semibold text-gray-800 ml-1">{lastSync ? format(lastSync, 'HH:mm:ss') : '--:--:--'}</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative z-0">
        <MapContainer 
          center={centerPosition} 
          zoom={7} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Premium looking basemap
          />
          
          {machines.map(machine => (
            <Marker 
              key={machine._id} 
              position={[machine.location.lat, machine.location.lng]}
              icon={createCustomMarker(machine.status)}
            >
              <Popup className="premium-popup">
                <div className="min-w-[200px] pb-1">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2 mb-3">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-1.5 rounded-lg text-gray-600 mr-2">
                        <Tractor size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 leading-tight m-0 text-[14px]">{machine.name}</h3>
                        <p className="text-[11px] font-medium text-gray-500 m-0 leading-tight">{machine.type}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Status</span>
                      {getStatusBadge(machine.status)}
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 px-2 py-1.5 rounded-lg">
                      <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Runtime</span>
                      <span className="text-[12px] font-bold text-gray-800">{machine.runtimeHours} hrs</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[11px] text-gray-400">Coords</span>
                      <span className="text-[11px] font-mono text-gray-600">
                        {machine.location.lat.toFixed(4)}, {machine.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Farm Legend overlay */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 z-[1000] text-sm">
          <h4 className="font-bold text-gray-800 text-xs mb-2 tracking-wider uppercase">Live Activity</h4>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <span className="w-3 h-3 rounded-full bg-agGreen-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span> Active Moving
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span> Idle Parked
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Maintenance
            </div>
            <div className="flex items-center text-gray-600 opacity-60">
              <span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span> Offline (Last Known)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
