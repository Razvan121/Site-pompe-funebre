import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

// Prevent multiple connections
if (!global.mongoose) {
  global.mongoose = mongoose.connect(uri, { dbName: "site_dynamic" });
}

const RecenzieSchema = new mongoose.Schema({
  nume: String,
  email: String,
  text_recenzie: String,
  data: { type: Date, default: Date.now }
});

const Recenzie =
  mongoose.models.Recenzie || mongoose.model("Recenzie", RecenzieSchema);

export async function GET() {
  await global.mongoose;
  const recenzii = await Recenzie.find().sort({ data: -1 }).limit(20);
  return Response.json(recenzii);
}

export async function POST(req) {
  await global.mongoose;
  const body = await req.json();
  const { nume, email, text_recenzie } = body;

  if (!nume || !email || !text_recenzie) {
    return new Response(
      JSON.stringify({ error: "Completează toate câmpurile!" }),
      { status: 400 }
    );
  }

  const recenzie = new Recenzie({ nume, email, text_recenzie });
  await recenzie.save();

  return Response.json(recenzie, { status: 201 });
}
