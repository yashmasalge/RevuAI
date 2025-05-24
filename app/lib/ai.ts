// lib/ai.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function reviewCode(code: string) {
  const model = genAI.getGenerativeModel({model: "gemini-1.5-pro-latest"});

  const result = await model.generateContent([
    "Review this code and provide line-by-line suggestions:\n\n" + code,
  ]);
  const response = await result.response;
  return response.text();
}
