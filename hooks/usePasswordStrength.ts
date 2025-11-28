import { useMemo } from 'react';

export type StrengthScore = 0 | 1 | 2 | 3 | 4;

interface StrengthResult {
  score: StrengthScore;
  label: string;
  color: string;
  emoji: string;
  feedback: string | null;
}

export const usePasswordStrength = (password: string): StrengthResult => {
  return useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: 'Empty',
        color: 'bg-slate-200 dark:bg-white/10',
        emoji: '😴',
        feedback: null
      };
    }

    let score: number = 0;
    let feedback: string = '';

    const length = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    // Basic Length Points
    if (length > 4) score += 1;
    if (length > 7) score += 1;
    if (length > 10) score += 1;
    if (length > 12) score += 1;

    // Complexity Bonus/Penalty
    const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
    
    if (varietyCount < 2 && length > 6) score = Math.min(score, 2); // Cap score if low variety
    if (varietyCount >= 3 && length > 6) score = Math.min(score + 1, 4);

    // Clamp score 0-4
    const finalScore = Math.min(Math.max(score, 1), 4) as StrengthScore;

    // Determine properties based on score
    switch (finalScore) {
      case 1: // Very Weak
        return {
          score: 1,
          label: 'Very Weak',
          color: 'bg-red-500',
          emoji: '😬',
          feedback: 'Too short! Add more characters.'
        };
      case 2: // Weak
        return {
          score: 2,
          label: 'Weak',
          color: 'bg-orange-500',
          emoji: '😐',
          feedback: 'Add numbers or uppercase letters.'
        };
      case 3: // Medium
        return {
          score: 3,
          label: 'Medium',
          color: 'bg-yellow-400',
          emoji: '🙂',
          feedback: 'Better! Add a symbol for extra security.'
        };
      case 4: // Strong
        return {
          score: 4,
          label: 'Strong',
          color: 'bg-emerald-500',
          emoji: '😎',
          feedback: null
        };
      default:
        return {
          score: 0,
          label: 'Empty',
          color: 'bg-slate-200 dark:bg-white/10',
          emoji: '😴',
          feedback: null
        };
    }
  }, [password]);
};