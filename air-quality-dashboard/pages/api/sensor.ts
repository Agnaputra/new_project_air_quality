import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = req.body;
      await db.collection("air_quality_logs").add({
        ...data,
        timestamp: new Date().toISOString(),
      });
      return res.status(200).json({ message: "Data Saved!" });
    } catch (error) {
      return res.status(500).json({ error: "Cloud Error" });
    }
  }
  res.status(405).end();
}