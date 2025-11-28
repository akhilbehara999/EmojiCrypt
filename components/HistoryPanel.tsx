
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem, getHistory, clearHistory } from '../utils/storage';
import { History, Trash2, Copy, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryPanelProps {
  refreshTrigger: number;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ refreshTrigger }) => {
  const { t, dir } = useLanguage();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(getHistory());
  }, [refreshTrigger]);

  const handleClear = () => {
    clearHistory();
    setItems([]);
  };

  const copyToClip = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mt-8 mb-12">
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-500 transition-colors mx-auto mb-4"
      >
        <History className="w-4 h-4" />
        <span>{t('history.title')}</span>
        <motion.div animate={{ rotate: isOpen ? 90 : (dir === 'rtl' ? 180 : 0) }}>
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-1">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-brand-500/30 backdrop-blur-sm transition-all"
                >
                   <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200 text-left rtl:text-right">{item.preview}</div>
                        <div className="text-xs text-slate-400 font-mono text-left rtl:text-right">{new Date(item.timestamp).toLocaleString()}</div>
                     </div>
                     <button 
                       onClick={() => copyToClip(item.emoji)}
                       className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-brand-50 dark:hover:bg-brand-500/20 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors ml-2 rtl:mr-2 rtl:ml-0"
                       title="Copy Encrypted Emoji"
                     >
                        <Copy className="w-4 h-4" />
                     </button>
                   </div>
                   <div className="mt-2 text-xs font-emoji opacity-50 truncate text-left rtl:text-right">{item.emoji}</div>
                </motion.div>
              ))}
              
              <div className="flex justify-center pt-2">
                 <button onClick={handleClear} className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-red-500 hover:text-red-600 opacity-60 hover:opacity-100 transition-all">
                    <Trash2 className="w-3 h-3" />
                    <span>{t('history.clear')}</span>
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
