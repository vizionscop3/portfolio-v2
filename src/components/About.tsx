import { motion } from 'framer-motion';
import React from 'react';
import { services } from '../shared/constants';
import { fadeIn, textVariant } from '../shared/utils/motion';

interface ServiceCardProps {
  index: number;
  title: string;
  icon: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ index, title, icon }) => (
  <motion.div
    variants={fadeIn('right', 'spring', index * 0.1, 0.75)}
    className="flex-1 green-pink-gradient p-[1px] rounded-[20px] shadow-card min-w-[200px]"
  >
    <div className="bg-tertiary rounded-[20px] py-4 px-6 min-h-[180px] flex justify-evenly items-center flex-col">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-white text-[16px] font-bold text-center">{title}</h3>
    </div>
  </motion.div>
);

export const About: React.FC = () => {
  return (
    <>
      <motion.div variants={textVariant(0.1)}>
        <p className="sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider">
          Introduction
        </p>
        <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
          Overview.
        </h2>
      </motion.div>

      <motion.p
        variants={fadeIn('', '', 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I'm a skilled software developer with experience in TypeScript and
        JavaScript, and expertise in frameworks like React, Node.js, and
        Three.js. I'm a quick learner and collaborate closely with clients to
        create efficient, scalable, and user-friendly solutions that solve
        real-world problems. Let's work together to bring your ideas to life!
      </motion.p>

      <div className="mt-20 flex flex-nowrap gap-4 justify-center items-stretch">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default About;
