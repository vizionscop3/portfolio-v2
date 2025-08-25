Here are the contents for the file /3d-portfolio/3d-portfolio/src/utils/motion.js:

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export const fadeIn = (direction = 'up', type = 'tween', duration = 0.5, delay = 0) => {
  return {
    initial: {
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type,
        duration,
        delay,
      },
    },
  };
};

export const slideIn = (direction = 'left', type = 'tween', duration = 0.5, delay = 0) => {
  return {
    initial: {
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type,
        duration,
        delay,
      },
    },
  };
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0.1) => {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};