import { ImageData, GarmentType } from '../types';

export const performVirtualTryOn = async (person: ImageData, cloth: ImageData, type: GarmentType, token: string, garmentDescription?: string) => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        personImage: person.url || person.base64, // Ensure we send the base64 string
        clothImage: cloth.url || cloth.base64,
        type: type,
        garmentDescription: garmentDescription
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'فشل التوليد');
    }

    // Server returns { front, side, full, analysis, remaining }
    // We map it to our ResultImages interface
    return {
      front: data.front,
      side: data.side || data.front,
      full: data.full || data.front
    };
  } catch (error: any) {
    console.error("Virtual Try-On Error:", error);
    throw new Error(error.message || 'حدث خطأ أثناء الاتصال بالخادم');
  }
};

export const analyzeStyle = async (image: string, lang: 'ar' | 'en') => {
  // محاكاة للتحليل (Mock) لسرعة الاستجابة
  return {
    fitScore: 94,
    colorScore: 88,
    styleGrade: 'A+',
    tips: lang === 'ar'
      ? ['الألوان متناسقة جداً مع البشرة', 'المقاس يبدو مثالياً عند الأكتاف', 'تنسيق رائع للمناسبة الرسمية']
      : ['Colors match skin tone perfectly', 'Fit looks perfect at the shoulders', 'Great coordination for formal events']
  };
};
