
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '../.env.local' });

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY!);

// Try the model we are using in index.ts
// const MODEL_NAME = "gemini-2.0-flash-exp-image-generation"; 
const MODEL_NAME = "gemini-flash-latest"; 

async function testGemini() {
    console.log(`🚀 Testing Gemini with model: ${MODEL_NAME}`);
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Load dummy images
        const personUrl = "https://img.freepik.com/free-photo/handsome-man-smiling-happy-face-portrait-close-up_53876-146189.jpg";
        const garmentUrl = "https://img.freepik.com/free-photo/black-t-shirt-front-view_1101-38.jpg";

        const personBuffer = await (await fetch(personUrl)).arrayBuffer();
        const garmentBuffer = await (await fetch(garmentUrl)).arrayBuffer();

        const prompt = "Generate a photorealistic image of this person wearing this garment. " +
                       "Replace the person's current clothing with the new garment. " +
                       "Keep the face, pose, and background exactly the same. " +
                       "Output ONLY the generated image.";

        console.log("📤 Sending request...");
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: Buffer.from(personBuffer).toString('base64'), mimeType: "image/jpeg" } },
            { inlineData: { data: Buffer.from(garmentBuffer).toString('base64'), mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        console.log("✅ Response received!");
        console.log(JSON.stringify(response, null, 2));
        
        // Check candidates
        if (response.candidates && response.candidates[0].content.parts) {
            console.log("📦 Parts found:", response.candidates[0].content.parts.length);
            response.candidates[0].content.parts.forEach((part, i) => {
                if (part.text) console.log(`[Part ${i}] Text:`, part.text.substring(0, 100));
                if (part.inlineData) console.log(`[Part ${i}] Image Data Found! Mime: ${part.inlineData.mimeType}`);
            });
        }

    } catch (error: any) {
        console.error("❌ Gemini failed:", error.message);
    }
}

testGemini();
