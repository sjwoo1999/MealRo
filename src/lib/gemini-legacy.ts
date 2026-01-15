import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface RecognizedFood {
    name: string;
    nameKorean: string;
    confidence: number;
    estimatedPortion: string;
    estimatedCalories: number;
    estimatedProtein: number;
    estimatedCarbs: number;
    estimatedFat: number;
}

export interface ImageAnalysisResult {
    success: boolean;
    foods: RecognizedFood[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    processingTimeMs: number;
    rawResponse?: string;
    error?: string;
}

const ANALYSIS_PROMPT = `You are a professional nutritionist analyzing a food image. 

Analyze this image and identify all visible food items. For each food item, provide:
1. Name (in English)
2. Korean name
3. Confidence score (0.0 to 1.0)
4. Estimated portion size
5. Estimated nutritional values (calories, protein, carbs, fat)

Also determine the meal type based on the foods (breakfast, lunch, dinner, or snack).

Respond ONLY in valid JSON format like this:
{
  "foods": [
    {
      "name": "Kimchi Fried Rice",
      "nameKorean": "김치볶음밥",
      "confidence": 0.95,
      "estimatedPortion": "1 serving (250g)",
      "estimatedCalories": 450,
      "estimatedProtein": 12,
      "estimatedCarbs": 65,
      "estimatedFat": 15
    }
  ],
  "mealType": "lunch",
  "analysis": "Brief description of the meal"
}

If you cannot identify any food in the image, respond with:
{
  "foods": [],
  "mealType": "snack",
  "analysis": "No food detected in image"
}

IMPORTANT: Only output valid JSON, no markdown or additional text.`;

export async function analyzeImage(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<ImageAnalysisResult> {
    const startTime = Date.now();

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: mimeType,
                    data: imageBase64,
                },
            },
            { text: ANALYSIS_PROMPT },
        ]);

        const response = await result.response;
        const text = response.text();

        // Parse JSON response
        let parsedResponse;
        try {
            // Remove potential markdown code blocks
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            parsedResponse = JSON.parse(cleanedText);
        } catch {
            console.error('Failed to parse Gemini response:', text);
            return {
                success: false,
                foods: [],
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                mealType: 'snack',
                processingTimeMs: Date.now() - startTime,
                rawResponse: text,
                error: 'Failed to parse AI response',
            };
        }

        const foods: RecognizedFood[] = (parsedResponse.foods || []).map((food: Record<string, unknown>) => ({
            name: food.name as string || 'Unknown',
            nameKorean: food.nameKorean as string || food.name as string || '알 수 없음',
            confidence: food.confidence as number || 0.5,
            estimatedPortion: food.estimatedPortion as string || '1 serving',
            estimatedCalories: food.estimatedCalories as number || 0,
            estimatedProtein: food.estimatedProtein as number || 0,
            estimatedCarbs: food.estimatedCarbs as number || 0,
            estimatedFat: food.estimatedFat as number || 0,
        }));

        // Calculate totals
        const totalCalories = foods.reduce((sum, f) => sum + f.estimatedCalories, 0);
        const totalProtein = foods.reduce((sum, f) => sum + f.estimatedProtein, 0);
        const totalCarbs = foods.reduce((sum, f) => sum + f.estimatedCarbs, 0);
        const totalFat = foods.reduce((sum, f) => sum + f.estimatedFat, 0);

        return {
            success: true,
            foods,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat,
            mealType: parsedResponse.mealType || 'snack',
            processingTimeMs: Date.now() - startTime,
            rawResponse: text,
        };
    } catch (error) {
        console.error('Gemini API error:', error);
        return {
            success: false,
            foods: [],
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            mealType: 'snack',
            processingTimeMs: Date.now() - startTime,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Helper function to convert File to base64
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
}
