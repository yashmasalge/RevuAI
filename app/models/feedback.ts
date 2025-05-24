import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  code: String,
  response: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);