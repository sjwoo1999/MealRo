import { calculateBMR, calculateTDEE, calculateMacros } from '../tdee-calculator';
import { Gender } from '@/types/user';

// Mock implementation of describe/it since we don't have Jest installed in the environment yet
// In a real project with Jest/Vitest, these would be provided by global or imported
const describe = (name: string, fn: () => void) => { console.log(`Describe: ${name}`); fn(); };
const it = (name: string, fn: () => void) => {
    try {
        fn();
        console.log(`  ✓ ${name}`);
    } catch (e) {
        console.error(`  ✗ ${name}`, e);
    }
};
const expect = (actual: any) => ({
    toBe: (expected: any) => {
        if (actual !== expected) throw new Error(`Expected ${expected}, but got ${actual}`);
    },
    toBeCloseTo: (expected: number, precision: number = 0) => {
        if (Math.abs(actual - expected) > Math.pow(10, -precision)) throw new Error(`Expected ${expected} (close to), but got ${actual}`);
    }
});

describe('TDEE Calculator', () => {
    describe('calculateBMR', () => {
        it('남성 BMR 계산이 정확해야 함', () => {
            // 30세 남성, 70kg, 175cm
            // 예상: (10 × 70) + (6.25 × 175) - (5 × 30) + 5 = 1,648.75 -> 1649
            const bmr = calculateBMR('male', 70, 175, 30);
            expect(bmr).toBe(1649);
        });

        it('여성 BMR 계산이 정확해야 함', () => {
            // 25세 여성, 55kg, 165cm
            // 예상: (10 × 55) + (6.25 × 165) - (5 × 25) - 161 = 1,326.25 -> 1326
            const bmr = calculateBMR('female', 55, 165, 25);
            expect(bmr).toBe(1326);
        });
    });

    describe('calculateTDEE', () => {
        it('활동 계수가 올바르게 적용되어야 함', () => {
            // BMR 1,650, moderate (1.55)
            // 예상: 1,650 × 1.55 = 2,557.5 -> 2558
            const tdee = calculateTDEE(1650, 'moderate');
            expect(tdee).toBe(2558);
        });
    });

    describe('calculateMacros', () => {
        it('영양소 총합이 칼로리와 맞아야 함', () => {
            // 2000kcal, 70kg, maintain (1.6g/kg protein)
            // Protein: 70 * 1.6 = 112g (448kcal)
            // Fat: 2000 * 0.25 = 500kcal (56g)
            // Carbs: (2000 - 448 - 500) / 4 = 1052 / 4 = 263g

            const macros = calculateMacros(2000, 70, 'maintain');

            expect(macros.protein).toBe(112);
            expect(macros.fat).toBe(56); // 500 / 9 = 55.55 -> 56
            expect(macros.carbs).toBe(263);
        });
    });
});
