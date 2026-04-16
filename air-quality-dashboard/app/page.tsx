"use client";
import React, { useEffect, useState } from 'react';
import { Wind, AlertTriangle, CheckCircle, Activity, Thermometer, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// Pastikan path import ke firebaseClient sudah benar
import { clientDb } from './lib/firebaseClient';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Query Real-time ke koleksi "air_quality_logs" di Firestore
    const q = query(
      collection(clientDb, "air_quality_logs"), 
      orderBy("timestamp", "desc"), 
      limit(20)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          // Format waktu untuk sumbu X grafik dari ISO string ke jam:menit:detik
          time: d.timestamp ? new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''
        };
      });

      if (allDocs.length > 0) {
        setData(allDocs[0]); // Ambil data terbaru untuk Card utama
        setHistory([...allDocs].reverse()); // Urutkan dari lama ke baru untuk grafik
      }
    });

    return () => unsubscribe();
  }, []);

  // Mencegah error Recharts saat proses SSR
  if (!isMounted || !data) return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center font-mono">
      <Activity size={48} className="mb-4 text-blue-500 animate-spin" />
      <p className="text-xl animate-pulse">Menghubungkan ke Cloud Firebase...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Smart AirSense Monitoring
            </h1>
            <p className="text-slate-400 font-medium tracking-tight">Real-time Cloud Database | NIM: 2341720065</p>
          </div>
          <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border-2 transition-all duration-500 ${data.isUnhealthy ? 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
            {data.isUnhealthy ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
            <span className="font-black tracking-widest uppercase">{data.isUnhealthy ? "KONDISI BURUK" : "UDARA BERSIH"}</span>
          </div>
        </div>

        {/* Row 1: Gas Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="CO2 Level" value={data.co2} unit="ppm" color="#60a5fa" threshold={1000} />
          <MetricCard title="NH3 (Amonia)" value={data.nh3} unit="ppm" color="#fbbf24" threshold={50} />
          <MetricCard title="VOCs Level" value={data.voc} unit="ppm" color="#f87171" threshold={200} />
        </div>

        {/* Row 2: Climate Metrics (DHT22) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-6 shadow-xl hover:border-orange-500/30 transition-all group">
            <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-400 group-hover:scale-110 transition-transform"><Thermometer size={32} /></div>
            <div>
              <p className="text-slate-400 text-sm uppercase font-bold tracking-tighter">Temperatur</p>
              <h2 className="text-4xl font-bold text-white tracking-tighter">{data.temp ? data.temp.toFixed(1) : "0.0"}°C</h2>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-6 shadow-xl hover:border-blue-500/30 transition-all group">
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform"><Droplets size={32} /></div>
            <div>
              <p className="text-slate-400 text-sm uppercase font-bold tracking-tighter">Kelembapan</p>
              <h2 className="text-4xl font-bold text-white tracking-tighter">{data.hum ? data.hum.toFixed(1) : "0.0"}%</h2>
            </div>
          </div>
        </div>

        {/* Row 3: Graph & Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-[2.5rem] min-h-[450px]">
            <h3 className="flex items-center gap-2 mb-6 font-semibold text-slate-300">
              <Activity size={20} className="text-blue-400" /> Tren Kualitas Udara (Real-time)
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }} 
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Line name="CO2" type="monotone" dataKey="co2" stroke="#60a5fa" strokeWidth={3} dot={false} />
                  <Line name="Suhu" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={false} />
                  <Line name="Kelembapan" type="monotone" dataKey="hum" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-inner">
            <div className="space-y-6">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b border-slate-800 pb-2 text-center">Rekomendasi Sistem</h3>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Polutan Dominan</p>
                <p className="text-2xl font-bold text-white tracking-tight">{data.dominant || "Normal"}</p>
              </div>
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 italic text-slate-300 text-sm leading-relaxed shadow-lg">
                {data.isUnhealthy 
                  ? "Peringatan! Udara terdeteksi buruk karena tingginya " + data.dominant + ". Harap segera nyalakan ventilasi udara." 
                  : "Kondisi ruangan optimal. Parameter gas dan iklim saat ini berada dalam ambang batas aman."}
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex flex-col gap-1">
               <span>ID DOKUMEN: {data.id.substring(0,10)}...</span>
               <span>SYNC: {data.time}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Komponen Card untuk Gas
function MetricCard({ title, value, unit, color, threshold }: any) {
  const percentage = Math.min((value / threshold) * 100, 100);
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all group shadow-lg">
      <p className="text-slate-500 font-bold mb-1 text-[10px] uppercase tracking-widest group-hover:text-blue-400 transition-colors">{title}</p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold tracking-tight text-white">{value ? parseFloat(value).toFixed(1) : "0.0"}</span>
        <span className="text-slate-600 text-sm font-medium">{unit}</span>
      </div>
      <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden shadow-inner">
        <div 
            className="h-full transition-all duration-1000 ease-in-out" 
            style={{ width: `${percentage}%`, backgroundColor: color }} 
        />
      </div>
    </div>
  );
}