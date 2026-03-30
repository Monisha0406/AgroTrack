import React, { useState, useEffect } from 'react';
import { Wrench, Calendar, CheckCircle, AlertTriangle, ChevronRight, X, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const API = 'http://localhost:5000/api/maintenance';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ machine: '', scheduledDate: '', details: '', cost: '' });

  useEffect(() => {
    fetchRecords();
    fetchMachines();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get(API);
      setRecords(data);
    } catch (err) {
      console.error('Failed to load maintenance records:', err);
    }
  };

  const fetchMachines = async () => {
    try {
      const { data } = await axios.get(`${API}/machines-list`);
      setMachines(data);
    } catch (err) {
      console.error('Failed to load machine list:', err);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.machine || !form.scheduledDate) return setError('Machine and Date are required.');
    setLoading(true);
    try {
      await axios.post(API, {
        machine: form.machine,
        scheduledDate: new Date(form.scheduledDate),
        details: form.details,
        cost: parseFloat(form.cost) || 0
      });
      setShowModal(false);
      setForm({ machine: '', scheduledDate: '', details: '', cost: '' });
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule service.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="text-green-500" size={18} />;
      case 'Overdue': return <AlertTriangle className="text-red-500" size={18} />;
      default: return <Calendar className="text-blue-500" size={18} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'Overdue': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const scheduled = records.filter(r => r.status === 'Upcoming');
  const inProgress = records.filter(r => r.status === 'Overdue');
  const completed = records.filter(r => r.status === 'Completed');

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center">
            <Wrench className="mr-3 text-gray-400 hidden sm:block" />
            Maintenance Schedule
          </h2>
          <p className="text-gray-500 mt-1 sm:ml-10">Manage fleet services and repair lifetimes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-agGreen-600 hover:bg-agGreen-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all flex items-center gap-2 justify-center"
        >
          <PlusCircle size={18} /> Schedule Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        {[
          { t: 'Scheduled Services', v: scheduled.length, c: 'border-blue-500' },
          { t: 'Overdue / In Workshop', v: inProgress.length, c: 'border-yellow-400' },
          { t: 'Completed Records', v: completed.length, c: 'border-agGreen-500' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-6 border-l-4 ${stat.c}`}>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.t}</p>
            <h3 className="text-3xl font-bold text-gray-800">{stat.v}</h3>
          </div>
        ))}
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Work Orders</h3>
          <span className="text-sm text-gray-400">{records.length} total records</span>
        </div>

        {records.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Wrench size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No maintenance records yet.</p>
            <p className="text-sm mt-1">Click "Schedule Service" to create your first work order.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {records.map((item) => (
              <div key={item._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-gray-50 rounded-full border border-gray-200">
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base mb-1">{item.details || 'General Service'}</h4>
                    <p className="text-sm font-medium text-gray-600 mb-0.5">{item.machine?.name} — {item.machine?.type}</p>
                    <p className="text-xs text-gray-400">Cost: ₹{item.cost?.toLocaleString() || 0}</p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 pl-12 md:pl-0">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.scheduledDate ? format(new Date(item.scheduledDate), 'MMM d, yyyy') : 'N/A'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-600 transition-colors hidden md:block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-agGreen-400 to-agGreen-600" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Schedule Service</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 p-1"><X size={22} /></button>
              </div>

              {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</div>}

              <form onSubmit={handleSchedule} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Machine *</label>
                  <select
                    required
                    value={form.machine}
                    onChange={e => setForm({ ...form, machine: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 text-sm"
                  >
                    <option value="">-- Choose a machine --</option>
                    {machines.map(m => (
                      <option key={m._id} value={m._id}>{m.name} ({m.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Date *</label>
                  <input
                    type="date"
                    required
                    value={form.scheduledDate}
                    onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Details</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Oil & Filter Change, Hydraulic System Check..."
                    value={form.details}
                    onChange={e => setForm({ ...form, details: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={form.cost}
                    onChange={e => setForm({ ...form, cost: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agGreen-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-agGreen-600 hover:bg-agGreen-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60"
                >
                  {loading ? 'Scheduling...' : 'Confirm & Schedule'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
