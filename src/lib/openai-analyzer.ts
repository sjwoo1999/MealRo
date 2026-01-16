import OpenAI from 'openai';
import { FoodData, FoodAnalysisResponse, FoodAnalysisErrorCode } from '@/types/food';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Korean food specialist prompt
// Korean food specialist prompt with Chain of Thought
const KOREAN_FOOD_ANALYSIS_PROMPT = `당신은 한국 음식 전문 영양사입니다. 사용자가 제공하는 음식 사진을 분석하여 영양 정보를 제공합니다.

다음 단계를 거쳐 신중하게 분석해주세요:
1. **관찰**: 이미지의 색상, 질감, 재료, 그릇 형태 등을 자세히 스캔합니다.
2. **추론**: 관찰된 특징을 바탕으로 가장 근접한 한국 음식(또는 기타 음식)을 파악합니다. 국, 찌개, 탕 등의 미세한 차이를 구분하세요.
3. **분석**: 파악된 음식의 일반적인 영양소 정보를 계산합니다.

분석 결과는 **반드시 아래 JSON 형식**으로만 응답하세요. Markdown 포맷을 쓰지 마세요.

**단일 음식인 경우:**
{
  "reasoning": "이 음식으로 판단한 근거를 1문장으로 요약",
  "food_name": "음식명 (한글)",
  "food_name_en": "Food name (English)",
  "confidence": 0.0-1.0,
  "serving_size": "1인분 기준 그램수 (예: 1인분 (300g))",
  "ingredients": ["주요 재료 3-5개"],
  "nutrition": {
    "calories": 숫자(kcal),
    "protein": 숫자(g),
    "carbohydrates": 숫자(g),
    "fat": 숫자(g),
    "sodium": 숫자(mg),
    "fiber": 숫자(g)
  },
  "tags": ["한식", "국물요리" 등 카테고리],
  "warnings": ["알레르기 유발 성분 등"]
}

**여러 음식이 보이는 경우:**
{
  "foods": [
    { /* 위와 동일한 형식으로 각 음식을 분석 */ }
  ]
}

주의사항:
- **반드시 JSON 객체만** 반환하세요. 앞뒤에 \`\`\`json 같은 태그를 붙이지 마세요.
- 음식이 명확하지 않아도 최대한 추론하세요.
- 음식이 아닌 것이 **확실할 때만** {"error": "UNRECOGNIZED_FOOD"} 반환.`;

export async function analyzeFoodImageWithOpenAI(
    imageBase64: string,
    mimeType: string = 'image/jpeg'
): Promise<FoodAnalysisResponse> {
    const startTime = Date.now();

    try {
        // Use OpenAI Chat Completion API with Vision
        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // Upgraded to GPT-4o for best vision performance
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful nutrition assistant. Respond only in valid JSON.'
                },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: KOREAN_FOOD_ANALYSIS_PROMPT },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${imageBase64}`,
                                detail: 'high', // Force high resolution analysis
                            },
                        },
                    ],
                },
            ],
            response_format: { type: 'json_object' }, // Enforce JSON
            max_tokens: 1500,
        });

        // Extract output content
        const text = response.choices[0].message.content || '';

        // Debug logging
        console.log('OpenAI Response received:', JSON.stringify(response).substring(0, 500));
        console.log('Output text:', text.substring(0, 300));

        // If empty response, return error
        if (!text || text.trim() === '') {
            console.error('Empty response from OpenAI');
            return {
                success: false,
                error: {
                    code: FoodAnalysisErrorCode.API_ERROR,
                    message: 'AI 응답이 비어있습니다. 다시 시도해주세요.',
                },
            };
        }

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
