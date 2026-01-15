import { Grade } from '@/lib/supabase/types';
import { getGradeInfo } from '@/lib/grade';

interface GradeBadgeProps {
    grade: Grade;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

/**
 * GradeBadge Component
 * 
 * Implements dual-coding principle for accessibility:
 * - Color (visual)
 * - Letter (text)
 * - Icon (symbol)
 * 
 * This ensures users who cannot perceive color can still understand the grade.
 */
export default function GradeBadge({
    grade,
    size = 'md',
    showLabel = false
}: GradeBadgeProps) {
    const { letter, icon, label, description } = getGradeInfo(grade);

    const sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5 gap-0.5',
        md: 'text-sm px-2 py-1 gap-1',
        lg: 'text-base px-3 py-1.5 gap-1.5',
    };

    const gradeColorClasses: Record<Grade, string> = {
        A: 'grade-a',
        B: 'grade-b',
        C: 'grade-c',
        D: 'grade-d',
    };

    return (
        <span
            className={`
        inline-flex items-center rounded-full font-semibold
        ${sizeClasses[size]}
        ${gradeColorClasses[grade]}
      `}
            title={description}
            aria-label={`등급 ${letter}: ${label} - ${description}`}
        >
            <span aria-hidden="true">{icon}</span>
            <span>{letter}</span>
            {showLabel && (
                <span className="ml-1 font-normal">{label}</span>
            )}
        </span>
    );
}
