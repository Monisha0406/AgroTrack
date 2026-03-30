import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { format } from 'date-fns';
import { Activity, Wifi, WifiOff, Clock, AlertTriangle, CheckCircle2, RefreshCw, MapPin } from 'lucide-react';

const SOCKET_URL = 'http://localhost:5000';

const STATUS_CONFIG = {
  Active:      { dot: 'bg-agGreen-500', ring: 'ring-agGreen-200', badge: 'bg-green-100 text-green-800',  label: 'Active',      icon: <CheckCircle2 size={12} className="mr-1" /> },
  Idle:        { dot: 'bg-yellow-400',  ring: 'ring-yellow-200',   badge: 'bg-yellow-100 text-yellow-800', label: 'Idle',        icon: <Clock size={12} className="mr-1" /> },
  Maintenance: { dot: 'bg-red-500',     ring: 'ring-red-200',      badge: 'bg-red-100 text-red-800',       label: 'Maintenance', icon: <AlertTriangle size={12} className="mr-1" /> },
  Offline:     { dot: 'bg-gray-400',    ring: 'ring-gray-200',     badge: 'bg-gray-100 text-gray-600',     label: 'Offline',     icon: <WifiOff size={12} className="mr-1" /> },
};

const MachineMonitoring = () => {
  const [machines, setMachines]       = useState([]);
  const [log, setLog]                 = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync]       = useState(null);
  const [filter, setFilter]           = useState('All');
  const logRef = useRef(null);

  useEffect(() => {
    // Load initial data
    axios.get('http://localhost:5000/api/machines')
      .then(({ data }) => setMachines(data))
      .catch(console.error);

    const socket = io(SOCKET_URL);
    socket.on('connect',    () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('machine-status-changed', (updated) => {
      setMachines(prev =>
        prev.map(m => m._id === updated._id ? updated : m)
      );
      setLastSync(new Date());
      setLog(prev => [{
        id: Date.now(),
        time: new Date(),
        machine: updated.name,
        status: updated.status,
        city: updated.city || '',
        runtime: updated.runtimeHours,
      }, ...prev.slice(0, 49)]);
    });

    return () => socket.disconnect();
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [log]);

  const counts = {
    Active:      machines.filter(m => m.status === 'Active').length,
    Idle:        machines.filter(m => m.status === 'Idle').length,
    Maintenance: machines.filter(m => m.status === 'Maintenance').length,
    Offline:     machines.filter(m => m.status === 'Offline').length,
  };

  const filtered = filter === 'All' ? machines : machines.filter(m => m.status === filter);

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            Machine Monitoring
            <span className={`flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${
              isConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {isConnected ? <Wifi size={12} className="mr-1.5" /> : <WifiOff size={12} className="mr-1.5" />}
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </h2>
          <p className="text-gray-500 mt-1">Real-time fleet telemetry — Tamil Nadu Operations</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
          <RefreshCw size={14} className={isConnected ? 'animate-spin text-agGreen-500' : 'text-gray-400'} style={{ animationDuration: '3s' }} />
          Last update: <span className="font-bold text-gray-800 ml-1">{lastSync ? format(lastSync, 'HH:mm:ss') : '—'}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'Active',      color: 'border-agGreen-500 bg-agGreen-50', textColor: 'text-agGreen-700', num: counts.Active      },
          { key: 'Idle',        color: 'border-yellow-400 bg-yellow-50',   textColor: 'text-yellow-700',  num: counts.Idle        },
          { key: 'Maintenance', color: 'border-red-500    bg-red-50',      textColor: 'text-red-700',     num: counts.Maintenance },
          { key: 'Offline',     color: 'border-gray-400   bg-gray-50',     textColor: 'text-gray-600',    num: counts.Offline     },
        ].map(s => (
          <div
            key={s.key}
            onClick={() => setFilter(filter === s.key ? 'All' : s.key)}
            className={`rounded-xl border-l-4 p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${s.color} ${filter === s.key ? 'ring-2 ring-offset-1 ring-gray-300' : ''}`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{s.key}</p>
            <p className={`text-4xl font-extrabold ${s.textColor}`}>{s.num}</p>
            <p className="text-xs text-gray-400 mt-1">of {machines.length} total</p>
          </div>
        ))}
      </div>

      {/* Main content: grid + log */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Machine Grid */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Activity size={18} className="text-agGreen-500" /> Fleet Status Grid
            </h3>
            <span className="text-xs text-gray-400">{filtered.length} machines shown</span>
          </div>

          <div className="overflow-y-auto max-h-[520px] divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-gray-400">No machines match this filter.</div>
            ) : filtered.map(machine => {
              const cfg = STATUS_CONFIG[machine.status] || STATUS_CONFIG.Offline;
              return (
                <div key={machine._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Blinking status dot */}
                    <span className="relative flex-shrink-0 w-3 h-3">
                      {machine.status === 'Active' && (
                        <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75 animate-ping`}></span>
                      )}
                      <span className={`relative inline-flex rounded-full w-3 h-3 ${cfg.dot}`}></span>
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{machine.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span>{machine.type}</span>
                        {machine.city && <><span>·</span><MapPin size={10} /><span>{machine.city}</span></>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-gray-700">{machine.runtimeHours} hrs</p>
                      <p className="text-[10px] text-gray-400">Runtime</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.badge}`}>
                      {cfg.icon}{cfg.label}
                    </span>
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-mono text-gray-300">{machine.location?.lat?.toFixed(3)}, {machine.location?.lng?.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-agGreen-500 animate-pulse"></span>
              Live Activity Log
            </h3>
            <span className="text-xs text-gray-400">{log.length} events</span>
          </div>

          <div ref={logRef} className="overflow-y-auto flex-1 max-h-[520px] divide-y divide-gray-50">
            {log.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Waiting for telemetry events...</div>
            ) : log.map(entry => {
              const cfg = STATUS_CONFIG[entry.status] || STATUS_CONFIG.Offline;
              return (
                <div key={entry.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${cfg.dot}`}></span>
                      <div>
                        <p className="text-xs font-bold text-gray-800 leading-tight">{entry.machine}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          switched to <span className={`font-bold px-1 py-0.5 rounded ${cfg.badge}`}>{entry.status}</span>
                        </p>
                        {entry.city && <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1"><MapPin size={9} /> {entry.city}</p>}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono flex-shrink-0 mt-0.5">{format(entry.time, 'HH:mm:ss')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineMonitoring;
