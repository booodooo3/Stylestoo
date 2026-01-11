
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("API Key not found in ../.env.local");
  process.exit(1);
}

// Access the API directly to list models since SDK wrapper might hide some details
async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.error) {
        console.error("API Error:", data.error);
        return;
    }
    
    console.log("Available Models:");
    if (data.models) {
        data.models.forEach((m: any) => {
            if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                 console.log(`- ${m.name} (${m.displayName})`);
            }
        });
    } else {
        console.log("No models found or structure unexpected:", data);
    }

  } catch (error: any) {
    console.error("Fetch error:", error);
  }
}

listModels();
