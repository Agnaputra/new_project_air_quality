import { db } from "../../lib/firebaseAdmin";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Simpan ke koleksi 'air_quality_logs'
    const docRef = await db.collection("air_quality_logs").add({
      ...body,
      // Gunakan timestamp server agar grafik di dashboard urut
      timestamp: new Date().toISOString(), 
    });

    return NextResponse.json({ message: "Berhasil ke Firebase!", id: docRef.id }, { status: 201 });
  } catch (error: any) {
    console.error("Firebase Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}