
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePasswordStrength } from '../hooks/usePasswordStrength';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { score, color, emoji, feedback } = usePasswordStrength(password);
  const { t } = useLanguage();
  
  // Calculate width percentage (0 to 100%)
  const width = (score / 4) * 100;

  // Map score to translated labels
  const getLabel = (s: number) => {
    switch (s) {
      case 1: return t('strength.weak_v');
      case 2: return t('strength.weak');
      case 3: return t('strength.medium');
      case 4: return t('strength.strong');
      default: return t('strength.empty');
    }
  };

  // Map feedback to translated strings (simple mapping based on string content from hook)
  const getTranslatedFeedback = (fb: string | null) => {
    if (!fb) return null;
    if (fb.includes('short')) return t('strength.feedback_short');
    if (fb.includes('numbers')) return t('strength.feedback_num');
    if (fb.includes('symbol')) return t('strength.feedback_sym');
    return fb;
  };

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      {/* Bar and Emoji Row */}
      <div className="flex items-center gap-3 rtl:gap-reverse">
        <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className={`h-full absolute left-0 rtl:left-auto rtl:right-0 top-0 rounded-full ${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${width}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            
            {/* Shimmer effect for strong passwords */}
            {score === 4 && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            )}
        </div>

        {/* Animated Emoji */}
        <div className="relative w-6 h-6 flex items-center justify-center text-xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={emoji}
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {emoji}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Label and Feedback Tooltip */}
      <div className="flex justify-between items-start h-5 relative">
        <motion.span 
          key={score}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {getLabel(score)}
        </motion.span>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-0 rtl:right-auto rtl:left-0 top-0 flex items-center gap-1.5 rtl:gap-reverse text-xs font-medium text-amber-600 dark:text-amber-400"
            >
              <span>{getTranslatedFeedback(feedback)}</span>
              <AlertCircle className="w-3 h-3" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
