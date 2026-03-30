import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, AlertCircle, WifiOff, PlusCircle, X, MapPin, Cpu } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const API = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/machines` : 'http://localhost:5000/api/machines';

const STATUS_BADGE = {
  Active:      'bg-green-100  text-green-800  border-green-200',
  Idle:        'bg-yellow-100 text-yellow-800 border-yellow-200',
  Maintenance: 'bg-red-100    text-red-800    border-red-200',
  Offline:     'bg-gray-100   text-gray-600   border-gray-200',
};

const STATUS_ICON = {
  Active:      <CheckCircle2 size={11} className="mr-1" />,
  Idle:        <Clock        size={11} className="mr-1" />,
  Maintenance: <AlertCircle  size={11} className="mr-1" />,
  Offline:     <WifiOff      size={11} className="mr-1" />,
};

const TYPE_COLORS = {
  Tractor:    'bg-blue-50 text-blue-700',
  Harvester:  'bg-purple-50 text-purple-700',
  Sprayer:    'bg-cyan-50 text-cyan-700',
  Planter:    'bg-lime-50 text-lime-700',
  Tillage:    'bg-orange-50 text-orange-700',
  Combine:    'bg-pink-50 text-pink-700',
  Irrigation: 'bg-teal-50 text-teal-700',
  Loader:     'bg-amber-50 text-amber-700',
};

const Machines = () => {
  const [machines, setMachines]     = useState([]);
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(true);
  const [loadError, setLoadError]   = useState('');
  const [form, setForm]             = useState({ name: '', type: 'Tractor', lat: '', lng: '' });
  const [error, setError]           = useState('');

  const types = ['Tractor', 'Harvester', 'Sprayer', 'Planter', 'Tillage', 'Combine', 'Irrigation', 'Loader', 'Other'];

  useEffect(() => { fetchMachines(); }, []);

  const fetchMachines = async () => {
    setFetching(true);
    setLoadError('');
    try {
      const { data } = await axios.get(API);
      setMachines(data);
    } catch (err) {
      setLoadError('Cannot connect to backend. Make sure node server.js is running on port 5000.');
    } finally {
      setFetching(false);
    }
  };

  const handleAddMachine = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.type) return setError('Name and Type are required.');
    setLoading(true);
    try {
      await axios.post(API, {
        name: form.name,
        type: form.type,
        status: 'Idle',
        runtimeHours: 0,
        location: {
          lat: parseFloat(form.lat) || 11.1271,
          lng: parseFloat(form.lng) || 78.6569,
        }
      });
      setShowModal(false);
      setForm({ name: '', type: 'Tractor', lat: '', lng: '' });
      fetchMachines();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add machine.');
    } finally {
      setLoading(false);
    }
  };

  // Apply all filters
  const filtered = machines.filter(m => {
    const matchSearch = 
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.type?.toLowerCase().includes(search.toLowerCase()) ||
      m.city?.toLowerCase().includes(search.toLowerCase()) ||
      m.status?.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter   === 'All' || m.type   === typeFilter;
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  // Summary counts
  const counts = {
    Active:      machines.filter(m => m.status === 'Active').length,
    Idle:        machines.filter(m => m.status === 'Idle').length,
    Maintenance: machines.filter(m => m.status === 'Maintenance').length,
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <Cpu className="text-agGreen-500 hidden sm:block" size={28} />
            Fleet Management
          </h2>
          <p className="text-gray-500 mt-1 sm:ml-10">Tamil Nadu Agriculture — All {machines.length} Registered Machines</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-agGreen-600 hover:bg-agGreen-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <PlusCircle size={18} /> Add New Machine
        </button>
      </div>

      {/* Backend error banner */}
      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <div className="text-red-500 shrink-0 mt-0.5">⚠️</div>
          <div>
            <p className="font-bold text-red-700 text-sm">Backend Offline</p>
            <p className="text-red-600 text-sm mt-0.5">{loadError}</p>
            <button onClick={fetchMachines} className="mt-2 text-sm font-bold text-red-600 underline hover:text-red-800">
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Loading spinner */}
      {fetching && !loadError && (
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-sm">
          <div className="w-8 h-8 border-4 border-agGreen-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm font-medium">Loading fleet data from database...</p>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Fleet',  val: machines.length,   color: 'text-gray-800',     bg: 'bg-white border-gray-200' },
          { label: 'Active',       val: counts.Active,      color: 'text-green-700',    bg: 'bg-green-50 border-green-200' },
          { label: 'Idle',         val: counts.Idle,        color: 'text-yellow-700',   bg: 'bg-yellow-50 border-yellow-200' },
          { label: 'Maintenance',  val: counts.Maintenance, color: 'text-red-700',      bg: 'bg-red-50 border-red-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 md:p-4 shadow-sm ${s.bg}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 flex-1 min-w-0 border border-gray-200 focus-within:ring-2 focus-within:ring-agGreen-500">
          <Search size={16} className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, type, city, or status..."
            className="bg-transparent border-none focus:outline-none w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 cursor-pointer"
        >
          <option value="All">All Types</option>
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option>Active</option>
          <option>Idle</option>
          <option>Maintenance</option>
          <option>Offline</option>
        </select>

        <span className="text-sm font-medium text-gray-500 shrink-0">
          {filtered.length} / {machines.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-10">#</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Machine Name</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Runtime</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Location / City</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Service</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No machines found matching your filters.
                  </td>
                </tr>
              ) : filtered.map((machine, idx) => (
                <tr key={machine._id} className="hover:bg-gray-50/70 transition-colors group">

                  {/* # */}
                  <td className="px-4 py-3.5 text-sm text-gray-400 font-mono">{idx + 1}</td>

                  {/* Name */}
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-gray-800 text-sm">{machine.name}</p>
                    <p className="text-[11px] font-mono text-gray-400">{machine._id?.slice(-6).toUpperCase()}</p>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${TYPE_COLORS[machine.type] || 'bg-gray-50 text-gray-600'}`}>
                      {machine.type}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_BADGE[machine.status] || STATUS_BADGE.Offline}`}>
                      {STATUS_ICON[machine.status]}
                      {machine.status}
                    </span>
                  </td>

                  {/* Runtime */}
                  <td className="px-4 py-3.5 text-sm font-semibold text-gray-700">
                    {machine.runtimeHours?.toLocaleString()} hrs
                  </td>

                  {/* Location / City */}
                  <td className="px-4 py-3.5">
                    {machine.city && (
                      <span className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-0.5">
                        <MapPin size={12} className="text-agGreen-500" />
                        {machine.city}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-gray-400">
                      {machine.location
                        ? `${machine.location.lat?.toFixed(4)}, ${machine.location.lng?.toFixed(4)}`
                        : 'N/A'}
                    </span>
                  </td>

                  {/* Last Service */}
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {machine.lastServiceDate
                      ? format(new Date(machine.lastServiceDate), 'dd MMM yyyy')
                      : '—'}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-sm text-gray-500">
          <span>Showing <span className="font-bold text-gray-800">{filtered.length}</span> of <span className="font-bold text-gray-800">{machines.length}</span> machines</span>
          <span className="text-xs text-gray-400">Tamil Nadu Agricultural Fleet</span>
        </div>
      </div>

      {/* Add Machine Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-agGreen-400 to-agGreen-600" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add New Machine</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
                  <X size={22} />
                </button>
              </div>

              {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</div>}

              <form onSubmit={handleAddMachine} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Machine Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tractor TN-33"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Machine Type *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 text-sm"
                  >
                    {types.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Latitude</label>
                    <input
                      type="number" step="any" placeholder="11.1271"
                      value={form.lat}
                      onChange={e => setForm({ ...form, lat: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Longitude</label>
                    <input
                      type="number" step="any" placeholder="78.6569"
                      value={form.lng}
                      onChange={e => setForm({ ...form, lng: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">Leave blank to place at Tamil Nadu center. Coordinates for TN cities: Chennai (13.08, 80.27), Coimbatore (11.02, 76.96), Madurai (9.93, 78.12)</p>
                <button
                  type="submit" disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-agGreen-600 hover:bg-agGreen-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60"
                >
                  {loading ? 'Adding...' : '+ Add to Fleet'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Machines;