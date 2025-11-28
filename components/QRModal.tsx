
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, QrCode } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
// @ts-ignore
import QRCode from 'qrcode';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: string;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, data }) => {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && data) {
      QRCode.toDataURL(data, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      .then((url: string) => setQrDataUrl(url))
      .catch((err: any) => console.error(err));
    }
  }, [isOpen, data]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `emojicrypt-qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!qrDataUrl) return;
    
    // Convert base64 to blob for sharing
    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      const file = new File([blob], 'emojicrypt-qr.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: t('app.title'),
          text: t('app.subtitle'),
          files: [file]
        });
      } else {
        // Fallback or just ignore if not supported
        handleDownload();
      }
    } catch (error) {
      console.log('Error sharing:', error);
      handleDownload(); // Fallback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="relative p-6 flex flex-col items-center">
                 <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="flex items-center gap-2 mb-6">
                   <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                      <QrCode className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                   </div>
                   <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                     {t('qr.title')}
                   </h2>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 mb-6">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 object-contain rounded-lg" />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center text-slate-300">
                      <div className="w-8 h-8 border-2 border-slate-200 border-t-brand-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">{t('qr.download')}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">{t('qr.share')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
