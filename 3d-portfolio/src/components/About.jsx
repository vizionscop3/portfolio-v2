import React from 'react';
import { SectionWrapper } from '../hoc';
import { skills } from '../constants';

const About = () => {
  return (
    <SectionWrapper>
      <div className="about-container">
        <h2 className="about-title">About Me</h2>
        <p className="about-description">
          I am a passionate web developer with a strong background in building interactive and responsive web applications. My journey in web development has equipped me with a diverse set of skills and a keen eye for detail.
        </p>
        <h3 className="skills-title">Skills</h3>
        <ul className="skills-list">
          {skills.map((skill, index) => (
            <li key={index} className="skill-item">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
};

export default About;