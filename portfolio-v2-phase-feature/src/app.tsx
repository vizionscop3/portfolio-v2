import React from 'react';
import { PhaseIndicator } from './components/phase';
import { usePhase } from './hooks/usePhase';
import { SEOHead } from './components/seo/SEOHead';

const App: React.FC = () => {
  const { currentPhase } = usePhase();

  return (
    <div>
      <SEOHead title="Phase Feature" description="Manage phases in the application." />
      <h1>Current Phase</h1>
      <PhaseIndicator phase={currentPhase} />
      {/* Additional components and logic can be added here */}
    </div>
  );
};

export default App;