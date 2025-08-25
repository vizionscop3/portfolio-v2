import React from 'react';
import { technologies } from '../constants';

const Tech = () => {
  return (
    <div className="tech-section">
      <h2 className="section-title">Technologies & Tools</h2>
      <ul className="tech-list">
        {technologies.map((tech, index) => (
          <li key={index} className="tech-item">
            <img src={tech.icon} alt={tech.name} className="tech-icon" />
            <span className="tech-name">{tech.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tech;