import { ImageData, GarmentType } from '../types'; 
 import { GoogleGenerativeAI } from "@google/generative-ai"; 
 
 const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 
 
 export const performVirtualTryOn = async ( 
   personImage: ImageData, 
   clothImage: ImageData, 
   type: GarmentType, 
   token: string | null 
 ) => { 
   
   try { 
     const response = await fetch('http://localhost:3001/api/generate', { 
       method: 'POST', 
       headers: { 
         'Content-Type': 'application/json', 
         'Authorization': `Bearer ${token}` 
       }, 
       body: JSON.stringify({ 
         // ✅ التعديل هنا: نرسل النص (base64) فقط بدلاً من الكائن كاملاً 
         personImage: personImage.base64, 
         
         // هنا نرسل الـ base64 إذا وجد، وإلا نرسل الرابط (للملابس الجاهزة) 
         clothImage: clothImage.base64 || clothImage.url, 
         
         type 
       }) 
     }); 
 
     if (!response.ok) { 
       const errorData = await response.json().catch(() => ({})); 
       throw new Error(errorData.error || `Error: ${response.status} - فشل الاتصال بالسيرفر`); 
     } 
 
     const data = await response.json(); 
     return data; 
 
   } catch (error) { 
     console.error("Virtual Try-On Error:", error); 
     throw error; 
   } 
 }; 
 
 // دالة تحليل الستايل (تبقى كما هي) 
 export const analyzeStyle = async (imageBase64: string, lang: 'ar' | 'en') => { 
  try { 
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY); 
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); 
 
     const prompt = lang === 'ar' 
       ? "قم بتحليل هذا الزي. أعطني تقييماً من 100 للمقاس وتناسق الألوان، ودرجة الستايل (رسمي، كاجوال، إلخ)، و3 نصائح قصيرة للتحسين. الرد يجب أن يكون JSON." 
       : "Analyze this outfit. Give me a score out of 100 for fit and color match, a style grade, and 3 short tips. Response must be JSON."; 
 
     const base64Data = imageBase64.split(',')[1] || imageBase64; 
 
     const result = await model.generateContent([ 
       prompt, 
       { inlineData: { data: base64Data, mimeType: "image/png" } } 
     ]); 
 
     const response = await result.response; 
     const text = response.text(); 
     const jsonString = text.replace(/```json|```/g, '').trim(); 
     return JSON.parse(jsonString); 
 
   } catch (error) { 
     console.error("Analysis Error:", error); 
     return { 
       fitScore: 85, 
       colorScore: 90, 
       styleGrade: "A", 
       tips: lang === 'ar' ? ["تأكد من الإضاءة", "الزاوية جيدة", "الألوان متناسقة"] : ["Check lighting", "Good angle", "Colors match"] 
     }; 
   } 
 };