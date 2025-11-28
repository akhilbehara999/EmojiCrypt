
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
// @ts-ignore
import jsQR from 'jsqr';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScan }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const requestRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready before starting scan loop
        videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            requestRef.current = requestAnimationFrame(scan);
        };
      }
    } catch (err) {
      console.error(err);
      setError(t('qr.error_camera'));
    }
  };

  const stopCamera = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const scan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        if (code.data) {
           onScan(code.data);
           onClose();
           return; 
        }
      }
    }
    requestRef.current = requestAnimationFrame(scan);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
             <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white font-medium flex items-center gap-2">
                <Camera className="w-4 h-4 animate-pulse text-red-500" />
                <span className="text-sm">{t('qr.scanning')}</span>
             </div>
             <button 
               onClick={onClose} 
               className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
             >
               <X className="w-6 h-6" />
             </button>
          </div>

          {/* Camera View */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
             {error ? (
               <div className="text-center p-6 max-w-xs mx-auto">
                 <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                 </div>
                 <h3 className="text-white font-bold text-lg mb-2">{t('qr.permission_denied')}</h3>
                 <p className="text-slate-400 text-sm">{error}</p>
               </div>
             ) : (
                <>
                  <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 z-10">
                    {/* Cutout */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-white/30 rounded-3xl overflow-hidden shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]">
                       
                       {/* Corner Markers */}
                       <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-500 rounded-tl-xl" />
                       <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-500 rounded-tr-xl" />
                       <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-500 rounded-bl-xl" />
                       <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-500 rounded-br-xl" />

                       {/* Laser Scan Animation */}
                       <motion.div 
                         initial={{ top: 0 }}
                         animate={{ top: "100%" }}
                         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                         className="absolute left-0 right-0 h-1 bg-brand-400 shadow-[0_0_20px_rgba(96,165,250,0.8)]"
                       />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-20 left-0 right-0 text-center z-20">
                    <p className="text-white/80 text-sm font-medium px-4 py-2 bg-black/40 inline-block rounded-lg backdrop-blur-sm">
                      {t('qr.instruction')}
                    </p>
                  </div>
                </>
             )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
