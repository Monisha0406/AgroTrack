import React, { useState, useEffect } from 'react';
import { FileText, Download, FileSpreadsheet, Calendar } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const Reports = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/machines')
      .then(({ data }) => setMachines(data))
      .catch(err => console.error(err));
  }, []);

  // ── Real CSV Export ──────────────────────────────────────
  const exportCSV = () => {
    if (machines.length === 0) return setMessage('No data to export. Wait for machines to load.');
    setLoading(true);

    const headers = ['Name', 'Type', 'Status', 'Runtime (hrs)', 'Latitude', 'Longitude'];
    const rows = machines.map(m => [
      `"${m.name}"`,
      `"${m.type}"`,
      `"${m.status}"`,
      m.runtimeHours,
      m.location?.lat?.toFixed(5) || 'N/A',
      m.location?.lng?.toFixed(5) || 'N/A'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AgriTrack_Fleet_Export_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('✅ CSV exported successfully!');
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  // ── Real PDF Export ───────────────────────────────────────
  const exportPDF = async () => {
    if (machines.length === 0) return setMessage('No data to export. Wait for machines to load.');
    setLoading(true);
    try {
      // Dynamically import jsPDF to avoid bundle bloat
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();

      // Header
      doc.setFillColor(34, 197, 94);
      doc.rect(0, 0, 210, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('AgriTrack CRM — Fleet Report', 14, 12);

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 24);

      // Table
      autoTable(doc, {
        startY: 30,
        head: [['Machine Name', 'Type', 'Status', 'Runtime (hrs)', 'Lat', 'Lng']],
        body: machines.map(m => [
          m.name,
          m.type,
          m.status,
          `${m.runtimeHours} h`,
          m.location?.lat?.toFixed(4) || 'N/A',
          m.location?.lng?.toFixed(4) || 'N/A'
        ]),
        headStyles: { fillColor: [34, 197, 94], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 250, 245] },
        styles: { fontSize: 9, cellPadding: 4 },
      });

      doc.save(`AgriTrack_FleetReport_${format(new Date(), 'yyyyMMdd')}.pdf`);
      setMessage('✅ PDF generated successfully!');
    } catch (err) {
      setMessage('⚠️ PDF library not installed. Run: npm install jspdf jspdf-autotable');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center">
            <FileText className="mr-3 text-gray-400 hidden sm:block" />
            Reports Hub
          </h2>
          <p className="text-gray-500 mt-1 sm:ml-10">Export real-time fleet data as PDF or CSV</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <span className="w-2 h-2 bg-agGreen-500 rounded-full animate-pulse"></span>
          {machines.length} machines loaded
        </div>
      </div>

      {/* Flash message */}
      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-semibold border ${
          message.startsWith('✅')
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
        }`}>
          {message}
        </div>
      )}

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
        <div
          onClick={exportPDF}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex items-start gap-4 hover:border-red-400 transition-colors cursor-pointer group"
        >
          <div className="bg-red-50 p-4 rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <Download size={32} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Export PDF Report</h3>
            <p className="text-sm text-gray-500 mb-3">Download a formatted PDF table with all fleet machine data.</p>
            <span className="text-sm font-bold text-red-500 hover:underline">
              {loading ? 'Generating...' : 'Generate & Download →'}
            </span>
          </div>
        </div>

        <div
          onClick={exportCSV}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex items-start gap-4 hover:border-agGreen-400 transition-colors cursor-pointer group"
        >
          <div className="bg-green-50 p-4 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <FileSpreadsheet size={32} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Export CSV Data</h3>
            <p className="text-sm text-gray-500 mb-3">Download raw fleet data for Excel or custom processing.</p>
            <span className="text-sm font-bold text-green-600 hover:underline">
              {loading ? 'Exporting...' : 'Generate & Download →'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Data Preview */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          <h3 className="font-bold text-gray-800 text-lg">Live Data Preview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Machine Name</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Runtime (hrs)</th>
                <th className="p-4 font-semibold">Coordinates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {machines.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading data from database...</td></tr>
              ) : machines.map(m => (
                <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{m.name}</td>
                  <td className="p-4 text-sm text-gray-500">{m.type}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      m.status === 'Active' ? 'bg-green-100 text-green-700' :
                      m.status === 'Idle' ? 'bg-yellow-100 text-yellow-700' :
                      m.status === 'Offline' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-700'
                    }`}>{m.status}</span>
                  </td>
                  <td className="p-4 text-sm font-mono text-gray-700">{m.runtimeHours} h</td>
                  <td className="p-4 text-xs font-mono text-gray-400">
                    {m.location ? `${m.location.lat?.toFixed(4)}, ${m.location.lng?.toFixed(4)}` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
