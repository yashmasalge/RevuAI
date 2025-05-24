import { connectDB } from "../../lib/mongodb";
import Feedback from "../../models/feedback";

export async function GET() {
  await connectDB();
  const data = await Feedback.find().sort({ createdAt: -1 }).limit(100);
  return Response.json(data);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await connectDB();
  await Feedback.findByIdAndDelete(id);
  return Response.json({ success: true });
}