import React from 'react';
import { SectionId } from '../types/scene';
import Scene3D from './3d/Scene3D';

interface Portfolio3DProps {
  onSectionChange: (section: SectionId) => void;
  activeSection?: SectionId;
}

const Portfolio3D: React.FC<Portfolio3DProps> = ({
  onSectionChange,
  activeSection = 'about',
}) => {
  return (
    <div className="w-full h-full">
      <Scene3D
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
    </div>
  );
};

export default Portfolio3D;
