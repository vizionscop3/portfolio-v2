import React from 'react';
import { Hero, About, Experience, Tech, Works, Feedbacks, Contact } from './components';
import './index.css';

const App = () => {
  return (
    <div>
      <Hero />
      <About />
      <Experience />
      <Tech />
      <Works />
      <Feedbacks />
      <Contact />
    </div>
  );
};

export default App;