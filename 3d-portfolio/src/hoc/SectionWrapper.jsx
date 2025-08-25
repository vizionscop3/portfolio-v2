import React from 'react';

const SectionWrapper = (Component, idName) => () => (
  <section id={idName} className="section-wrapper">
    <Component />
  </section>
);

export default SectionWrapper;