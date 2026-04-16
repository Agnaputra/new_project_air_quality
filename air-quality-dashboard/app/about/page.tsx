export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">About Project</h1>
        <p className="text-slate-400 leading-relaxed text-lg">
          Sistem Monitoring Kualitas Udara berbasis Cloud ini dikembangkan untuk mendeteksi konsentrasi gas berbahaya secara real-time. Menggunakan integrasi IoT (ESP32) dan Cloud Database (Firebase) untuk memastikan data dapat diakses kapan saja dan di mana saja.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
          <h3 className="text-blue-400 font-bold mb-4 uppercase text-sm tracking-widest">Developer</h3>
          <p className="text-xl font-bold">Agna Putra Prawira</p>
          <p className="text-slate-500">NIM: 2341720065</p>
          <p className="text-slate-500">JTI Polinema</p>
        </div>
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
          <h3 className="text-emerald-400 font-bold mb-4 uppercase text-sm tracking-widest">Tech Stack</h3>
          <ul className="text-slate-300 space-y-1 font-mono text-sm">
            <li>• Next.js 16 (App Router)</li>
            <li>• Tailwind CSS & Lucide</li>
            <li>• Firebase Admin & Client SDK</li>
            <li>• ESP32 & MQ Sensor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}