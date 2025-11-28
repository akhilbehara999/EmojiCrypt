
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ClipboardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  duration: number;
  setDuration: (val: number) => void;
}

export const ClipboardSettings: React.FC<ClipboardSettingsProps> = ({
  isOpen,
  onClose,
  enabled,
  setEnabled,
  duration,
  setDuration
}) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 z-50 w-80 
              bg-white dark:bg-[#1a1a1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2 rtl:gap-reverse text-brand-600 dark:text-brand-400">
                <Shield className="w-4 h-4" />
                <h3 className="font-bold text-sm uppercase tracking-wider">{t('settings.title')}</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{t('settings.auto_clear')}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t('settings.auto_clear_desc')}</span>
                </div>
                <button 
                  onClick={() => setEnabled(!enabled)}
                  className={`transition-colors ${enabled ? 'text-brand-500' : 'text-slate-300 dark:text-slate-600'}`}
                >
                  {enabled ? <ToggleRight className="w-8 h-8 rtl:rotate-180" /> : <ToggleLeft className="w-8 h-8 rtl:rotate-180" />}
                </button>
              </div>

              {/* Duration Slider */}
              <div className={`space-y-3 transition-opacity duration-200 ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                 <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1 rtl:gap-reverse">
                      <Clock className="w-3 h-3" />
                      <span>{t('settings.clear_after')}</span>
                    </div>
                    <span className="text-brand-600 dark:text-brand-400">{duration / 1000}s</span>
                 </div>
                 <input 
                   type="range" 
                   min="10000" 
                   max="300000" 
                   step="10000"
                   value={duration}
                   onChange={(e) => setDuration(Number(e.target.value))}
                   className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-500 rtl:direction-ltr"
                 />
                 <div className="flex justify-between text-[10px] text-slate-400 uppercase font-medium">
                    <span>10s</span>
                    <span>5m</span>
                 </div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-white/5 text-[10px] text-slate-500 dark:text-slate-400 text-center">
              {t('settings.footer')}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
