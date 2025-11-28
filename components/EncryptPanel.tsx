
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { encryptToEmojis } from '../utils/cipher';
import { DEFAULT_MAP } from '../utils/constants';
import { saveToHistory } from '../utils/storage';
import { KeySelector } from './KeySelector';
import { EmojiFloaters } from './animations/EmojiFloaters';
import { Shimmer } from './animations/Shimmer';
import { useClipboardCleaner } from '../hooks/useClipboardCleaner';
import { ClipboardToast } from './ClipboardToast';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { Copy, Check, Sparkles, KeyRound, MessageSquare, Eye, EyeOff, Share2, AlertTriangle, Shield, Upload, Download, FileText, X, QrCode } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { QRModal } from './QRModal';

interface EncryptPanelProps {
  onHistoryUpdate: () => void;
  clipboardSettings: { enabled: boolean; duration: number };
}

export const EncryptPanel: React.FC<EncryptPanelProps> = ({ onHistoryUpdate, clipboardSettings }) => {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [output, setOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');
  const [currentMap, setCurrentMap] = useState<string[]>(DEFAULT_MAP);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Animation States
  const [triggerFloaters, setTriggerFloaters] = useState(false);
  const containerControls = useAnimation();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard Hook
  const { copySecurely, cancelCleaning, timeLeft, isCleaning, justCleared } = useClipboardCleaner(clipboardSettings);

  const handleEncrypt = async () => {
    setError('');
    setIsCopied(false);
    setOutput('');
    setTriggerFloaters(false);
    
    if (!text.trim()) {
      setError(t('encrypt.error_text'));
      return;
    }
    if (!password.trim()) {
      setError(t('encrypt.error_pass'));
      return;
    }

    setIsEncrypting(true);
    
    // Trigger animations
    setTriggerFloaters(true);
    containerControls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 }
    });

    // Simulate calculation delay for effect
    setTimeout(async () => {
      try {
        const result = encryptToEmojis(text, password, currentMap);
        setOutput(result);
        saveToHistory(result, text);
        onHistoryUpdate();
        
        await handleCopy(result);

      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setIsEncrypting(false);
        setTriggerFloaters(false);
      }
    }, 800);
  };

  const handleCopy = async (content: string) => {
    try {
      await copySecurely(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) { console.error(e); }
  };

  const handleShare = async () => {
    if (!output) return;
    if (navigator.share) {
      try { await navigator.share({ title: 'Emoji Secret', text: output }); } 
      catch (err) { console.debug(err); }
    } else {
      handleCopy(output);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setText(content);
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
    a.download = `encrypted-message-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setText('');
    setOutput('');
    setError('');
    cancelCleaning();
  };

  return (
    <motion.div animate={containerControls} className="space-y-6 relative">
      <EmojiFloaters active={triggerFloaters} />
      
      {/* Toast */}
      <ClipboardToast 
        isVisible={isCleaning || justCleared} 
        type={isCleaning ? 'cleaning' : 'cleared'} 
        timeLeft={timeLeft} 
        totalTime={clipboardSettings.duration}
        onDismiss={cancelCleaning}
      />
      
      <QRModal isOpen={showQR} onClose={() => setShowQR(false)} data={output} />

      {/* Input Section */}
      <div className="space-y-5">
        
        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t('encrypt.label')}
            </label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {text && (
                 <button 
                  onClick={handleClear}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                 >
                   <X className="w-3 h-3" /> {t('encrypt.clear')}
                 </button>
              )}
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500">
                {text.length} {t('encrypt.chars')}
              </span>
            </div>
          </div>
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('encrypt.placeholder')}
              className="w-full h-36 p-4 rounded-2xl resize-none text-base font-medium transition-all duration-300 outline-none
                bg-white/50 dark:bg-black/20 backdrop-blur-sm
                border border-slate-200 dark:border-white/10
                focus:border-brand-500 dark:focus:border-brand-500/50 focus:bg-white dark:focus:bg-black/40 focus:ring-4 focus:ring-brand-500/10
                text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
            
            {/* File Upload Button */}
            <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleFileUpload} 
                 accept=".txt" 
                 className="hidden" 
               />
               <button 
                 onClick={triggerFileUpload}
                 className="p-2 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-brand-50 dark:hover:bg-brand-500/20 text-slate-400 hover:text-brand-500 transition-all border border-transparent hover:border-brand-200 dark:hover:border-brand-500/30"
                 title={t('common.upload')}
               >
                 <Upload className="w-4 h-4" />
               </button>
            </div>

            <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 pointer-events-none opacity-50 group-focus-within:opacity-100 group-focus-within:text-brand-500 transition-all">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KeySelector onMapChange={setCurrentMap} />
          
          {/* Password Input */}
          <div className="relative z-10 flex flex-col justify-end">
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('encrypt.password_label')}
                className="w-full pl-10 pr-12 rtl:pr-10 rtl:pl-12 py-3 rounded-xl text-sm font-medium transition-all duration-300 outline-none
                  bg-white/50 dark:bg-black/20 backdrop-blur-sm
                  border border-slate-200 dark:border-white/10
                  focus:border-brand-500 dark:focus:border-brand-500/50 focus:bg-white dark:focus:bg-black/40 focus:ring-4 focus:ring-brand-500/10
                  text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono"
              />
              <KeyRound className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <PasswordStrengthMeter password={password} />
          </div>
        </div>
      </div>

      {/* Error Message */}
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

      {/* Main Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleEncrypt}
        disabled={isEncrypting}
        className="relative w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-brand-500/30 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-indigo-600 group-hover:from-brand-500 group-hover:to-indigo-500 transition-colors" />
        <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
          {isEncrypting ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             <>
               <span>{t('encrypt.encrypt_btn')}</span>
               <Sparkles className="w-4 h-4" />
             </>
          )}
        </div>
      </motion.button>

      {/* Result Card */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative mt-8 group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-brand-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white dark:bg-[#121215] border border-slate-100 dark:border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
              <Shimmer />
              
              <div className="relative z-20">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center space-x-2 rtl:space-x-reverse text-brand-600 dark:text-brand-400">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{t('encrypt.encrypted_label')}</span>
                   </div>
                   <div className="flex space-x-1 rtl:space-x-reverse">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowQR(true)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors" title={t('qr.show_btn')}>
                        <QrCode className="w-4 h-4" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleDownload}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors" title={t('common.download')}>
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleShare} 
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleCopy(output)} 
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors">
                        {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </motion.button>
                   </div>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 
                  text-center text-xl md:text-2xl leading-relaxed break-words font-emoji text-slate-800 dark:text-slate-100 shadow-inner min-h-[100px] flex items-center justify-center">
                  {output}
                </div>
                
                <div className="mt-4 flex justify-center">
                   <span className={`text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${isCopied ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-400'}`}>
                     {isCopied ? t('encrypt.copied') : t('encrypt.copy_hint')}
                   </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
