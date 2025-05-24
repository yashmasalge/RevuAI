import mongoose from "mongoose";

let cached = (global as any).mongoose || { conn: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  cached.conn = await mongoose.connect(process.env.MONGODB_URI);
  (global as any).mongoose = cached;
  return cached.conn;
}