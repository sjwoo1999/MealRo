import OpenAI from 'openai';
import { FoodData, FoodAnalysisResponse, FoodAnalysisErrorCode } from '@/types/food';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Korean food specialist prompt
const KOREAN_FOOD_ANALYSIS_PROMPT = `당신은 한국 음식 전문 영양사입니다. 사용자가 제공하는 음식 사진을 분석하여 정확한 영양 정보를 제공합니다.

이 음식 사진을 분석해주세요. 반드시 아래 JSON 형식으로만 응답하세요.

**단일 음식인 경우:**
{
  "food_name": "음식명 (한글)",
  "food_name_en": "Food name (English)",
  "confidence": 0.0-1.0,
  "serving_size": "1인분 기준 그램수 (예: 1인분 (300g))",
  "nutrition": {
    "calories": 숫자(kcal),
    "protein": 숫자(g),
    "carbohydrates": 숫자(g),
    "fat": 숫자(g),
    "sodium": 숫자(mg),
    "fiber": 숫자(g)
  },
  "ingredients": ["주요 재료 목록"],
  "tags": ["한식", "양식" 등 카테고리],
  "warnings": ["알레르기 유발 성분 등"]
}

**여러 음식이 보이는 경우:**
{
  "foods": [
    { /* 위와 동일한 형식으로 각 음식을 분석 */ },
    { /* 두 번째 음식 */ }
  ]
}

주의사항:
- 반드시 JSON만 출력하세요. 마크다운 코드블록이나 다른 텍스트 없이 순수 JSON만.
- 한국 음식 기준으로 분석하세요.
- 영양정보는 1인분 기준입니다.
- 확신이 낮으면 confidence를 낮게 설정하세요 (0.5 이하).
- 음식이 아니거나 인식할 수 없으면 {"error": "UNRECOGNIZED_FOOD"} 반환.
- 여러 음식이 있으면 반드시 foods 배열로 각각 분석하세요.`;

export async function analyzeFoodImageWithOpenAI(
    imageBase64: string,
    mimeType: string = 'image/jpeg'
): Promise<FoodAnalysisResponse> {
    const startTime = Date.now();

    try {
        // Use OpenAI Responses API with vision
        const response = await openai.responses.create({
            model: 'gpt-4.1-nano', // Most cost-effective vision model
            input: [
                {
                    role: 'user',
                    content: [
                        { type: 'input_text', text: KOREAN_FOOD_ANALYSIS_PROMPT },
                        {
                            type: 'input_image',
                            image_url: `data:${mimeType};base64,${imageBase64}`,
                            detail: 'auto',
                        },
                    ],
                },
            ],
        });

        // Extract output text from response
        const text = (response as { output_text?: string }).output_text || '';

        // Parse JSON response
        let parsedResponse;
        try {
            // Remove potential markdown code blocks
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            parsedResponse = JSON.parse(cleanedText);
        } catch {
            console.error('Failed to parse OpenAI response:', text);
            return {
                success: false,
                error: {
                    code: FoodAnalysisErrorCode.API_ERROR,
                    message: 'AI 응답을 파싱할 수 없습니다',
                },
            };
        }

        // Check for error response
        if (parsedResponse.error === 'UNRECOGNIZED_FOOD') {
            return {
                success: false,
                error: {
                    code: FoodAnalysisErrorCode.UNRECOGNIZED_FOOD,
                    message: '음식을 인식할 수 없습니다. 다시 촬영해주세요.',
                },
            };
        }

        // Handle multiple foods
        if (parsedResponse.foods && Array.isArray(parsedResponse.foods)) {
            const foods: FoodData[] = parsedResponse.foods.map(normalizeFoodData);
            return {
                success: true,
                data: { foods },
                processing_time_ms: Date.now() - startTime,
            };
        }

        // Handle single food
        const food = normalizeFoodData(parsedResponse);
        return {
            success: true,
            data: food,
            processing_time_ms: Date.now() - startTime,
        };

    } catch (error) {
        console.error('OpenAI API error:', error);
        return {
            success: false,
            error: {
                code: FoodAnalysisErrorCode.API_ERROR,
                message: error instanceof Error ? error.message : '서버 오류가 발생했습니다',
            },
        };
    }
}

// Normalize and validate food data
function normalizeFoodData(raw: Record<string, unknown>): FoodData {
    const nutrition = raw.nutrition as Record<string, unknown> || {};

    return {
        food_name: (raw.food_name as string) || (raw.nameKorean as string) || '알 수 없음',
        food_name_en: (raw.food_name_en as string) || (raw.name as string) || 'Unknown',
        confidence: typeof raw.confidence === 'number' ? raw.confidence : 0.5,
        serving_size: (raw.serving_size as string) || (raw.estimatedPortion as string) || '1인분',
        nutrition: {
            calories: Number(nutrition.calories) || Number(raw.estimatedCalories) || 0,
            protein: Number(nutrition.protein) || Number(raw.estimatedProtein) || 0,
            carbohydrates: Number(nutrition.carbohydrates) || Number(raw.estimatedCarbs) || 0,
            fat: Number(nutrition.fat) || Number(raw.estimatedFat) || 0,
            sodium: Number(nutrition.sodium) || 0,
            fiber: Number(nutrition.fiber) || 0,
        },
        ingredients: Array.isArray(raw.ingredients) ? raw.ingredients as string[] : [],
        tags: Array.isArray(raw.tags) ? raw.tags as string[] : [],
        warnings: Array.isArray(raw.warnings) ? raw.warnings as string[] : [],
    };
}
