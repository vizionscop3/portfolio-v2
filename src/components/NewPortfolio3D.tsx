import React from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import About from './About';
import Hero from './Hero';

// Wrap About component with section wrapper
const AboutSection = () => (
  <SectionWrapper idName="about">
    <About />
  </SectionWrapper>
);

export const NewPortfolio3D: React.FC = () => {
  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Hero />
      </div>
      <AboutSection />
      {/* We can add more sections here later */}
    </div>
  );
};

export default NewPortfolio3D;
