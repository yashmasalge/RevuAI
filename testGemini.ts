import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  // ✅ This is the correct model format
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = "Say hello from Gemini AI!";
  const result = await model.generateContent(prompt);
  const response = result.response;
  console.log("Gemini response:", response.text());
}

testGemini().catch(console.error);
