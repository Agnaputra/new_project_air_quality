'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function Home() {
  const [sensorData, setSensorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengambil data terbaru berdasarkan timestamp terbaru
    const q = query(
      collection(db, "air_quality_logs"), 
      orderBy("timestamp", "desc"), 
      limit(1)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (data.length > 0) {
        setSensorData(data[0]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Menghubungkan ke Cloud Firestore...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Smart Air Quality</h1>
          <p className="text-gray-600">Monitoring Dashboard Real-time</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Temperature */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border-b-8 border-orange-500">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Temperature</h3>
            <p className="text-5xl font-black text-gray-900 mt-2">
              {sensorData?.temperature ?? '--'}<span className="text-2xl font-normal text-gray-400">°C</span>
            </p>
          </div>

          {/* Card Humidity */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border-b-8 border-blue-500">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Humidity</h3>
            <p className="text-5xl font-black text-gray-900 mt-2">
              {sensorData?.humidity ?? '--'}<span className="text-2xl font-normal text-gray-400">%</span>
            </p>
          </div>

          {/* Card Air Quality */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border-b-8 border-emerald-500">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Gas Level (MQ)</h3>
            <p className="text-5xl font-black text-gray-900 mt-2">
              {sensorData?.gas_level ?? '--'}
            </p>
          </div>
        </div>

        <footer className="mt-12 text-gray-400 text-sm flex justify-between items-center bg-white p-4 rounded-lg shadow-inner">
          <p>Status: <span className="text-emerald-500 font-bold">● Live from Cloud</span></p>
          <p>Last Update: {sensorData?.timestamp?.toDate().toLocaleString() || 'N/A'}</p>
        </footer>
      </div>
    </main>
  );
}