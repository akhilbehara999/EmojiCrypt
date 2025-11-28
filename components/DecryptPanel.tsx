
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decryptFromEmojis } from '../utils/cipher';
import { DEFAULT_MAP } from '../utils/constants';
import { KeySelector } from './KeySelector';
import { Shake } from './animations/Shake';
import { Confetti } from './animations/Confetti';
import { useClipboardCleaner } from '../hooks/useClipboardCleaner';
import { ClipboardToast } from './ClipboardToast';
import { Unlock, KeyRound, MessageSquare, Eye, EyeOff, AlertTriangle, CheckCircle2, Upload, Download, Copy, Check, QrCode } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { QRScanner } from './QRScanner';

interface DecryptPanelProps {
  clipboardSettings: { enabled: boolean; duration: number };
}

export const DecryptPanel: React.FC<DecryptPanelProps> = ({ clipboardSettings }) => {
  const { t } = useLanguage();
  const [emojiText, setEmojiText] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [currentMap, setCurrentMap] = useState<string[]>(DEFAULT_MAP);
  const [isCopied, setIsCopied] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  // Animation Triggers
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard Hook
  const { copySecurely, cancelCleaning, timeLeft, isCleaning, justCleared } = useClipboardCleaner(clipboardSettings);

  const handleDecrypt = () => {
    setError('');
    setOutput('');
    setConfettiTrigger(false);

    if (!emojiText.trim()) {
      setError(t('decrypt.error_text'));
      setShakeTrigger(prev => prev + 1);
      return;
    }
    if (!password.trim()) {
      setError(t('decrypt.error_pass'));
      setShakeTrigger(prev => prev + 1);
      return;
    }

    setIsDecrypting(true);

    setTimeout(() => {
        try {
            // Using the manually selected map (or default)
            const result = decryptFromEmojis(emojiText, password, currentMap);
            setOutput(result);
            setConfettiTrigger(true); // Success!
        } catch (err: any) {
            setError(t('decrypt.failed'));
            setShakeTrigger(prev => prev + 1);
        } finally {
            setIsDecrypting(false);
        }
    }, 500);
  };

  const handleCopy = async (content: string) => {
    try {
      await copySecurely(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) { console.error(e); }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setEmojiText(content);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decrypted-message-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleScan = (data: string) => {
    setEmojiText(data);
  };

  return (
    <div className="space-y-6 relative">
      <Confetti active={confettiTrigger} />
      
      {/* Toast */}
      <ClipboardToast 
        isVisible={isCleaning || justCleared} 
        type={isCleaning ? 'cleaning' : 'cleared'} 
        timeLeft={timeLeft} 
        totalTime={clipboardSettings.duration}
        onDismiss={cancelCleaning}
      />

      <QRScanner isOpen={showScanner} onClose={() => setShowScanner(false)} onScan={handleScan} />

      <div className="space-y-5">
        {/* Emoji Input */}
        <div className="space-y-2">
            <div className="flex justify-between items-start px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {t('decrypt.label')}
                </label>
                {emojiText && (
                   <button 
                    onClick={() => {setEmojiText(''); setOutput(''); setError(''); cancelCleaning();}}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
                   >
                     {t('decrypt.clear')}
                   </button>
                )}
            </div>
            <div className="relative group">
                <textarea
                value={emojiText}
                onChange={(e) => setEmojiText(e.target.value)}
                placeholder={t('decrypt.placeholder')}
                className="w-full h-36 p-4 rounded-2xl resize-none font-emoji text-lg tracking-widest transition-all duration-300 outline-none
                    bg-white/50 dark:bg-black/20 backdrop-blur-sm
                    border border-slate-200 dark:border-white/10
                    focus:border-emerald-500 dark:focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black/40 focus:ring-4 focus:ring-emerald-500/10
                    text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
                
                {/* Actions: Scan & Upload */}
                <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 flex flex-col gap-1">
                   <button 
                     onClick={() => setShowScanner(true)}
                     className="p-2 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-500 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30"
                     title={t('qr.scan_btn')}
                   >
                     <QrCode className="w-4 h-4" />
                   </button>
                   
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleFileUpload} 
                     accept=".txt" 
                     className="hidden" 
                   />
                   <button 
                     onClick={triggerFileUpload}
                     className="p-2 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-500 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30"
                     title={t('common.upload')}
                   >
                     <Upload className="w-4 h-4" />
                   </button>
                </div>

                <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 pointer-events-none opacity-50 group-focus-within:opacity-100 group-focus-within:text-emerald-500 transition-all">
                   <MessageSquare className="w-5 h-5" />
                </div>
            </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KeySelector onMapChange={setCurrentMap} disableGeneration={true} />

            {/* Password */}
            <Shake trigger={shakeTrigger}>
              <div className="relative group z-10">
                  <motion.input
                      animate={error ? { borderColor: ["#ef4444", "rgba(239, 68, 68, 0.2)", "rgba(255,255,255,0.1)"] } : {}}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('decrypt.password_label')}
                      className={`w-full pl-10 pr-12 rtl:pr-10 rtl:pl-12 py-3 rounded-xl text-sm font-medium transition-all duration-300 outline-none
                      bg-white/50 dark:bg-black/20 backdrop-blur-sm
                      border ${error ? 'border-red-500 text-red-500' : 'border-slate-200 dark:border-white/10'}
                      focus:border-emerald-500 dark:focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black/40 focus:ring-4 focus:ring-emerald-500/10
                      ${error ? 'text-red-900 dark:text-red-200' : 'text-slate-900 dark:text-slate-100'} placeholder-slate-400 font-mono`}
                  />
                  <KeyRound className={`absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-500'}`} />
                  <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 transition-colors"
                  >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
              </div>
            </Shake>
        </div>
      </div>

      <AnimatePresence>
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium"
            >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDecrypt}
        disabled={isDecrypting}
        className="relative w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/30 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-500 group-hover:to-teal-500 transition-colors" />
        <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
           {isDecrypting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                <span>{t('decrypt.decrypt_btn')}</span>
                <Unlock className="w-4 h-4" />
                </>
            )}
        </div>
      </motion.button>

      <AnimatePresence>
        {output && (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative mt-8"
            >
                <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                <div className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-600 dark:text-emerald-400">
                           <CheckCircle2 className="w-5 h-5" />
                           <span className="text-sm font-bold uppercase tracking-wider">{t('decrypt.success_label')}</span>
                       </div>
                       <div className="flex space-x-1 rtl:space-x-reverse">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleDownload}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors" title={t('common.download')}>
                            <Download className="w-4 h-4" />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleCopy(output)} 
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors">
                            {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </motion.button>
                       </div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-full p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20 
                        text-center text-lg font-medium text-slate-800 dark:text-slate-100 shadow-inner min-h-[100px] flex items-center justify-center whitespace-pre-wrap"
                    >
                        {output}
                    </motion.div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
