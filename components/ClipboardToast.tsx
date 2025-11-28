import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Eraser } from 'lucide-react';

interface ClipboardToastProps {
  isVisible: boolean;
  type: 'cleaning' | 'cleared';
  timeLeft: number;
  totalTime: number;
  onDismiss: () => void;
}

export const ClipboardToast: React.FC<ClipboardToastProps> = ({ 
  isVisible, 
  type, 
  timeLeft, 
  totalTime,
  onDismiss 
}) => {
  // Circular progress calculation
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / totalTime);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 
            bg-slate-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-slate-900 
            rounded-full shadow-2xl border border-white/10 dark:border-black/10 cursor-pointer"
          onClick={onDismiss}
        >
          {type === 'cleaning' ? (
            <div className="relative w-8 h-8 flex items-center justify-center">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="opacity-20"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="16"
                  cy="16"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "linear" }}
                  className="text-brand-400 dark:text-brand-600"
                />
              </svg>
              <ShieldAlert className="w-3.5 h-3.5 absolute text-brand-400 dark:text-brand-600" />
            </div>
          ) : (
             <div className="w-8 h-8 flex items-center justify-center bg-emerald-500/20 rounded-full">
               <Eraser className="w-4 h-4 text-emerald-500 dark:text-emerald-600" />
             </div>
          )}

          <div className="flex flex-col">
            <span className="text-sm font-bold">
              {type === 'cleaning' ? 'Clipboard Auto-Clean' : 'Clipboard Cleared'}
            </span>
            <span className="text-[10px] opacity-70 font-mono">
              {type === 'cleaning' 
                ? `Clearing in ${Math.ceil(timeLeft / 1000)}s` 
                : 'Your clipboard is now empty'}
            </span>
          </div>

          {type === 'cleaning' && (
             <div className="ml-2 pl-3 border-l border-white/20 dark:border-black/10">
                <button className="text-xs font-medium hover:text-brand-300 dark:hover:text-brand-600 transition-colors">
                  Undo
                </button>
             </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};