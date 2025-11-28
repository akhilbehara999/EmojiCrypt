import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  active: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const [particles, setParticles] = useState<number[]>([]);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    if (active) {
      setParticles(Array.from({ length: 50 }).map((_, i) => i));
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        {particles.map((i) => {
          const randomAngle = Math.random() * 360;
          const randomDistance = 100 + Math.random() * 200;
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{ 
                x: Math.cos(randomAngle * (Math.PI / 180)) * randomDistance,
                y: Math.sin(randomAngle * (Math.PI / 180)) * randomDistance,
                opacity: 0,
                scale: Math.random() * 1 + 0.5,
                rotate: Math.random() * 360
              }}
              transition={{ duration: 0.8 + Math.random() * 0.5, ease: "easeOut" }}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: randomColor }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};