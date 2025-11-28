import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface ShakeProps {
  trigger: number | boolean;
  children: React.ReactNode;
  className?: string;
}

export const Shake: React.FC<ShakeProps> = ({ trigger, children, className }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (trigger) {
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
    }
  }, [trigger, controls]);

  return (
    <motion.div animate={controls} className={className}>
      {children}
    </motion.div>
  );
};