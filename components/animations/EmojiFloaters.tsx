import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_MAP } from '../../utils/constants';

interface EmojiFloatersProps {
  active: boolean;
  count?: number;
}

export const EmojiFloaters: React.FC<EmojiFloatersProps> = ({ active, count = 12 }) => {
  const [floaters, setFloaters] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([]);

  useEffect(() => {
    if (active) {
      const newFloaters = Array.from({ length: count }).map((_, i) => ({
        id: Date.now() + i,
        emoji: DEFAULT_MAP[Math.floor(Math.random() * DEFAULT_MAP.length)],
        x: Math.random() * 100 - 50, // Random percentage offset from center
        delay: Math.random() * 0.5,
      }));
      setFloaters(newFloaters);
      
      // Cleanup after animation
      const timer = setTimeout(() => {
        setFloaters([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [active, count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50 flex items-center justify-center">
      <AnimatePresence>
        {floaters.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: 0, opacity: 0, scale: 0.5, x: `${item.x}%` }}
            animate={{ 
              y: -200 - Math.random() * 100, 
              opacity: [0, 1, 0], 
              scale: [0.5, 1.5, 1],
              rotate: Math.random() > 0.5 ? 360 : -360 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: item.delay, ease: "easeOut" }}
            className="absolute text-3xl"
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};