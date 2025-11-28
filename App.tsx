
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EncryptPanel } from './components/EncryptPanel';
import { DecryptPanel } from './components/DecryptPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { AboutModal } from './components/AboutModal';
import { ClipboardSettings } from './components/ClipboardSettings';
import { LanguageToggle } from './components/LanguageToggle';
import { useLanguage } from './contexts/LanguageContext';
import { Lock, Unlock, Moon, Sun, Sparkles, Info, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [isDark, setIsDark] = useState(true);
  const [historyTrigger, setHistoryTrigger] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Clipboard Settings State
  const [clipboardEnabled, setClipboardEnabled] = useState(() => {
    const saved = localStorage.getItem('emojicrypt_cb_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [clipboardDuration, setClipboardDuration] = useState(() => {
    const saved = localStorage.getItem('emojicrypt_cb_duration');
    return saved !== null ? Number(saved) : 120000; // 2 minutes default
  });

  useEffect(() => {
    localStorage.setItem('emojicrypt_cb_enabled', JSON.stringify(clipboardEnabled));
  }, [clipboardEnabled]);

  useEffect(() => {
    localStorage.setItem('emojicrypt_cb_duration', String(clipboardDuration));
  }, [clipboardDuration]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen relative flex flex-col items-center py-6 px-4 overflow-hidden
      ${isDark ? 'bg-[#0a0a0c]' : 'bg-[#f8fafc]'}`} dir={dir}>
      
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 animate-blob mix-blend-multiply filter
           ${isDark ? 'bg-indigo-900/40' : 'bg-brand-200'}`}></div>
         <div className={`absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-30 animate-blob animation-delay-2000 mix-blend-multiply filter
           ${isDark ? 'bg-violet-900/40' : 'bg-purple-200'}`}></div>
         <div className={`absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-30 animate-blob animation-delay-4000 mix-blend-multiply filter
           ${isDark ? 'bg-blue-900/40' : 'bg-cyan-200'}`}></div>
      </div>

      <div className="w-full max-w-2xl z-10 flex flex-col items-center relative">
        
        {/* Header */}
        <header className="w-full flex justify-between items-center mb-8 px-2">
           <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/20">
                 <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  {t('app.title')}<span className="text-brand-500">Crypt</span>
                </h1>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">{t('app.subtitle')}</p>
              </div>
           </div>
           
           <div className="flex items-center space-x-2 rtl:space-x-reverse">
             <LanguageToggle />

             <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all backdrop-blur-md group"
              title={t('settings.title')}
             >
               <ShieldCheck className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors" />
             </button>

             <button
              onClick={() => setIsDark(!isDark)}
              className="group relative p-2.5 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all backdrop-blur-md"
             >
               <AnimatePresence mode="wait">
                 {isDark ? (
                   <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Moon className="w-5 h-5 text-indigo-300" />
                   </motion.div>
                 ) : (
                   <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <Sun className="w-5 h-5 text-orange-400" />
                   </motion.div>
                 )}
               </AnimatePresence>
             </button>
           </div>
        </header>

        {/* Tab Switcher */}
        <div className="relative p-1.5 rounded-2xl bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 backdrop-blur-md flex w-full max-w-sm mx-auto mb-8 shadow-inner">
           <motion.div 
             className="absolute top-1.5 bottom-1.5 rounded-xl bg-white dark:bg-[#1a1a1e] shadow-sm z-0"
             initial={false}
             animate={{ 
               // RTL Support for slider logic
               left: dir === 'rtl' 
                 ? (activeTab === 'encrypt' ? 'calc(50% + 0px)' : '6px')
                 : (activeTab === 'encrypt' ? '6px' : '50%'),
               width: 'calc(50% - 6px)',
             }}
             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
           />

           <button onClick={() => setActiveTab('encrypt')} className="relative z-10 flex-1 flex items-center justify-center py-2.5 text-sm font-bold text-center transition-colors">
              <span className={`flex items-center space-x-2 rtl:space-x-reverse ${activeTab === 'encrypt' ? 'text-brand-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                <Lock className="w-3.5 h-3.5" />
                <span>{t('tabs.encrypt')}</span>
              </span>
           </button>
           <button onClick={() => setActiveTab('decrypt')} className="relative z-10 flex-1 flex items-center justify-center py-2.5 text-sm font-bold text-center transition-colors">
              <span className={`flex items-center space-x-2 rtl:space-x-reverse ${activeTab === 'decrypt' ? 'text-emerald-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                <Unlock className="w-3.5 h-3.5" />
                <span>{t('tabs.decrypt')}</span>
              </span>
           </button>
        </div>

        {/* Main Card */}
        <motion.div 
          layout
          className="w-full relative overflow-hidden bg-white/70 dark:bg-[#0f0f12]/60 border border-white/40 dark:border-white/5 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-900/5"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none dark:opacity-5"></div>
          
          <div className="relative p-6 sm:p-8">
            <AnimatePresence mode="wait">
               {activeTab === 'encrypt' ? (
                 <motion.div key="encrypt" initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }} transition={{ duration: 0.2 }}>
                    <EncryptPanel 
                      onHistoryUpdate={() => setHistoryTrigger(prev => prev + 1)} 
                      clipboardSettings={{ enabled: clipboardEnabled, duration: clipboardDuration }}
                    />
                 </motion.div>
               ) : (
                 <motion.div key="decrypt" initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }} transition={{ duration: 0.2 }}>
                    <DecryptPanel 
                      clipboardSettings={{ enabled: clipboardEnabled, duration: clipboardDuration }}
                    />
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        </motion.div>

        <HistoryPanel refreshTrigger={historyTrigger} />
        
        {/* Footer */}
        <footer className="mt-auto mb-6 text-center">
           <p className="text-[10px] font-medium text-slate-400 dark:text-slate-600 uppercase tracking-widest">
             {t('app.footer')}
           </p>
        </footer>

      </div>

      {/* Floating Info Button - Position flips in RTL handled by fixed positioning if needed, usually fixed-right is preferred regardless of RTL for floating actions, but let's check */}
      <button
        onClick={() => setShowAbout(true)}
        className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 p-3.5 rounded-full bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-white/10 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 transition-all hover:scale-110 active:scale-95 group"
        aria-label="About App"
      >
        <div className="absolute inset-0 rounded-full bg-brand-500/5 scale-0 group-hover:scale-100 transition-transform duration-300" />
        <Info className="w-6 h-6 relative z-10" />
      </button>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      
      <ClipboardSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        enabled={clipboardEnabled}
        setEnabled={setClipboardEnabled}
        duration={clipboardDuration}
        setDuration={setClipboardDuration}
      />
    </div>
  );
};

export default App;
