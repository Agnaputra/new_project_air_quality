"use client";
import { useEffect, useState } from 'react';
import { clientDb } from '../lib/firebaseClient';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FileDown, TrendingUp, Zap, BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgCo2: 0, maxCo2: 0, totalAlerts: 0 });

  useEffect(() => {
    const q = query(collection(clientDb, "air_quality_logs"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setLogs(data);

      if (data.length > 0) {
        const totalCo2 = data.reduce((acc, curr) => acc + (curr.co2 || 0), 0);
        const max = Math.max(...data.map(d => d.co2 || 0));
        const alerts = data.filter(d => d.isUnhealthy).length;

        setStats({
          avgCo2: Math.round(totalCo2 / data.length),
          maxCo2: max,
          totalAlerts: alerts
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleExport = () => {
    alert("Fitur Ekspor CSV Sedang Disiapkan untuk Laporan Akhir!");
    // Logika download CSV bisa ditambahkan di sini nanti
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold italic flex items-center gap-2">
            <BarChart3 className="text-emerald-400" /> ANALYTICS REPORT
          </h1>
          <p className="text-slate-400 text-sm">Analisis data historis dari Cloud Firestore</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-sm"
        >
          <FileDown size={18} /> EXPORT DATA
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
          <TrendingUp className="text-blue-400 mb-4" size={24} />
          <p className="text-slate-500 text-xs font-bold uppercase">Rata-rata CO2</p>
          <h3 className="text-3xl font-bold">{stats.avgCo2} <span className="text-sm font-normal text-slate-600">PPM</span></h3>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
          <Zap className="text-yellow-400 mb-4" size={24} />
          <p className="text-slate-500 text-xs font-bold uppercase">Nilai Tertinggi</p>
          <h3 className="text-3xl font-bold">{stats.maxCo2} <span className="text-sm font-normal text-slate-600">PPM</span></h3>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
          <BarChart3 className="text-red-400 mb-4" size={24} />
          <p className="text-slate-500 text-xs font-bold uppercase">Total Peringatan</p>
          <h3 className="text-3xl font-bold">{stats.totalAlerts} <span className="text-sm font-normal text-slate-600">Log</span></h3>
        </div>
      </div>

      {/* Historical Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-800/20">
          <h3 className="font-bold">Log Riwayat Sensor</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="p-4 font-medium">Waktu</th>
                <th className="p-4 font-medium">CO2 (PPM)</th>
                <th className="p-4 font-medium">NH3 (PPM)</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.slice(0, 10).map((log, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-slate-300 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-blue-400">{log.co2}</td>
                  <td className="p-4 font-bold text-yellow-400">{log.nh3}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${log.isUnhealthy ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                      {log.isUnhealthy ? 'Danger' : 'Safe'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}