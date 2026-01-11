
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("API Key not found");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel() {
  const modelName = "gemini-2.5-flash";
  console.log(`Testing ${modelName}...`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello, are you working?");
    console.log("Success:", result.response.text());
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

testModel();
