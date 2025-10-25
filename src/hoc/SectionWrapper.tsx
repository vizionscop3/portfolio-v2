import { motion } from 'framer-motion';
import React from 'react';
import { staggerContainer } from '../shared/utils/motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  idName: string;
}

const SectionWrapper = ({ children, idName }: SectionWrapperProps) => {
  return (
    <motion.section
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="sm:px-16 px-6 sm:py-16 py-10 max-w-7xl mx-auto relative z-0"
    >
      <span className="hash-span" id={idName}>
        &nbsp;
      </span>
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
