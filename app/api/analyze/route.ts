import { reviewCode } from "../../lib/ai";
import { connectDB } from "../../lib/mongodb";
import Feedback from "../../models/feedback";

export async function POST(req: Request) {
  const { code } = await req.json();
  const response = await reviewCode(code);
  await connectDB();
  await Feedback.create({ code, response, createdAt: new Date() });
  return Response.json({ response });
}