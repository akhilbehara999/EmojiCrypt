import React from 'react';
import { motion } from 'framer-motion';

export const Shimmer: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-10">
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5, 
          ease: "linear",
          repeatDelay: 0.5
        }}
        className="absolute inset-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5"
      />
    </div>
  );
};