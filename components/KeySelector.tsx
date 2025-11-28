
import React, { useState, useEffect } from 'react';
import { PRESETS, DEFAULT_MAP } from '../utils/constants';
import { Settings2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface KeySelectorProps {
  onMapChange: (map: string[]) => void;
  currentMapName?: string;
  disableGeneration?: boolean;
}

export const KeySelector: React.FC<KeySelectorProps> = ({ onMapChange }) => {
  const { t } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [isOpen, setIsOpen] = useState(false);

  // Initial load
  useEffect(() => {
    onMapChange(DEFAULT_MAP);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedPreset(id);
    
    const preset = PRESETS.find(p => p.id === id);
    if (preset) onMapChange(preset.map);
    setIsOpen(false);
  };

  const currentPresetName = PRESETS.find(p => p.id === selectedPreset)?.name || "Unknown";

  return (
    <div className="relative z-20">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200
          ${isOpen 
            ? 'bg-brand-50/50 dark:bg-brand-900/10 border-brand-200 dark:border-brand-500/30 ring-2 ring-brand-500/10' 
            : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-white/20'
          } backdrop-blur-sm text-sm font-medium text-slate-700 dark:text-slate-200`}
      >
        <div className="flex items-center gap-2 rtl:gap-reverse">
          <Settings2 className="w-4 h-4 text-brand-500" />
          <span>{t('common.config')}: <span className="text-slate-900 dark:text-white font-semibold">{currentPresetName}</span></span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-2 rounded-xl bg-white/80 dark:bg-[#1a1a1e] border border-slate-100 dark:border-white/10 shadow-xl backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-1">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors text-left rtl:text-right
                      ${selectedPreset === p.id 
                        ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-medium' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                  >
                    {selectedPreset === p.id && <CheckCircle2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />}
                    <span className={selectedPreset !== p.id ? 'ml-6 rtl:ml-0 rtl:mr-6' : ''}>{p.name}</span>
                    <span className="ml-auto rtl:ml-0 rtl:mr-auto text-xs opacity-50 font-emoji">{p.map.slice(0, 3).join('')}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
