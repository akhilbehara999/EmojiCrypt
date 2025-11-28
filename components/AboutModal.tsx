
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="relative p-6 border-b border-slate-100 dark:border-white/5">
                <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2 rtl:gap-reverse">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 shadow-md">
                     <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span>{t('about.title')}<span className="text-brand-500">Crypt</span></span>
                </h2>
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 rtl:right-auto rtl:left-6 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* How it works */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {t('about.how_title')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                    {t('about.how_desc')}
                  </p>
                </div>

                <div className="h-px bg-slate-100 dark:bg-white/5" />

                {/* Creator */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-2 rtl:gap-reverse">
                    <User className="w-4 h-4" />
                    {t('about.creator')}
                  </h3>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/5 relative overflow-hidden">
                    {/* Decorative gradient blob */}
                    <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -mr-16 -mt-16 rtl:-ml-16 pointer-events-none"></div>

                    <p className="text-slate-900 dark:text-white font-bold text-lg mb-1 relative z-10">
                      Pondara Akhil Behara
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed relative z-10 max-w-[90%]">
                      A passionate BTech student specializing in Artificial Intelligence and Data Science at Chaitanya Engineering College.
                    </p>
                    
                    <a 
                      href="https://akhilbehara999.github.io/my-portfolio/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rtl:gap-reverse text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-brand-600 dark:hover:bg-brand-400 hover:text-white dark:hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-slate-900/10 dark:shadow-none"
                    >
                      {t('about.portfolio')}
                      <ExternalLink className="w-3 h-3 rtl:rotate-180" />
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
