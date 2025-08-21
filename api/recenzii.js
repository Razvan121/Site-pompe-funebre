// api/recenzii.js
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI; // variabila de mediu din Vercel

// Evită reconectări multiple
if (!global.mongoose) {
  global.mongoose = mongoose.connect(uri, { dbName: "site_dynamic" });
}

const RecenzieSchema = new mongoose.Schema({
  nume: String,
  email: String,
  text_recenzie: String,
  data: { type: Date, default: Date.now }
});

const Recenzie = mongoose.models.Recenzie || mongoose.model("Recenzie", RecenzieSchema);

export default async function handler(req, res) {
  await global.mongoose;

  if (req.method === "POST") {
    const { nume, email, text_recenzie } = req.body;

    if (!nume || !email || !text_recenzie) {
      return res.status(400).json({ error: "Completează toate câmpurile!" });
    }

    const recenzie = new Recenzie({ nume, email, text_recenzie });
    await recenzie.save();

    return res.status(201).json({ ok: true, recenzie });
  }

  if (req.method === "GET") {
    const recenzii = await Recenzie.find().sort({ data: -1 }).limit(20);
    return res.status(200).json(recenzii);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
