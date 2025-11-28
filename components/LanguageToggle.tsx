
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../utils/translations';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all backdrop-blur-md group flex items-center justify-center"
        aria-label="Change Language"
      >
        <Globe className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-brand-500 transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
             <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
             <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#1a1a1e] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 py-1"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors
                    ${language === lang.code ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>{lang.label}</span>
                  {language === lang.code && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
