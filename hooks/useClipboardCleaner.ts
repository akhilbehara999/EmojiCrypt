import { useState, useEffect, useRef } from 'react';

interface UseClipboardCleanerProps {
  enabled: boolean;
  duration: number; // in ms
}

export const useClipboardCleaner = ({ enabled, duration }: UseClipboardCleanerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);
  const [justCleared, setJustCleared] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearNow = async () => {
    try {
      await navigator.clipboard.writeText(' '); // Overwrite with space (safer than empty string for some browsers)
      setIsCleaning(false);
      setTimeLeft(0);
      setJustCleared(true);
      
      // Clear "Just Cleared" toast after 3 seconds
      setTimeout(() => setJustCleared(false), 3000);
    } catch (e) {
      console.error("Failed to clear clipboard", e);
    }
  };

  const cancelCleaning = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsCleaning(false);
    setTimeLeft(0);
  };

  const copySecurely = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // If feature is disabled, just copy and exit
      if (!enabled) return true;

      // Reset existing timers
      cancelCleaning();

      // Start new timer
      setIsCleaning(true);
      setTimeLeft(duration);
      
      const startTime = Date.now();
      
      // Update countdown UI
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 100);

      // Set trigger to clear
      timerRef.current = setTimeout(() => {
        clearNow();
      }, duration);

      return true;
    } catch (e) {
      console.error("Failed to copy", e);
      return false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelCleaning();
  }, []);

  return {
    copySecurely,
    cancelCleaning,
    timeLeft,
    isCleaning,
    justCleared
  };
};