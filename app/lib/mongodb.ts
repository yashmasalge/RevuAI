import mongoose from "mongoose";

const cached = (global as unknown as { mongoose?: { conn: unknown } }).mongoose || { conn: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  cached.conn = await mongoose.connect(process.env.MONGODB_URI);
  (global as unknown as { mongoose?: { conn: unknown } }).mongoose = cached;
  return cached.conn;
}