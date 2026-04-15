'use client'; // Wajib ada untuk App Router agar bisa pakai useEffect
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, "air_quality_logs"), limit(1));
    const unsub = onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map(doc => doc.data());
      setData(result[0]);
    });
    return () => unsub();
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Koneksi Firebase: {data ? "✅ Terhubung" : "⏳ Menghubungkan..."}</h1>
      <pre className="mt-5 bg-black text-green-400 p-5 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}