import { NextRequest, NextResponse } from 'next/server';
import { generateReversePlan } from '@/lib/reverse-calc';
import { ReversePlanInput } from '@/types/planner';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const input: ReversePlanInput = body;

        // Validation
        if (!input.selectedMenu || !input.userTargetCalories) {
            return NextResponse.json(
                { success: false, error: { code: 'INVALID_INPUT', message: 'Missing required fields' } },
                { status: 400 }
            );
        }

        const plans = await generateReversePlan(input);

        return NextResponse.json({
            success: true,
            data: plans
        });

    } catch (e) {
        console.error("Recommend API Error", e);
        return NextResponse.json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Internal Server Error' } },
            { status: 500 }
        );
    }
}
