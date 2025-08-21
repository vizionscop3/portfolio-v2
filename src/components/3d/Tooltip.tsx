import React from 'react';
import { useInteractiveStore } from './store';

export const Tooltip: React.FC = () => {
  const tooltipData = useInteractiveStore(state => state.tooltipData);

  if (!tooltipData.visible) return null;

  return (
    <div
      className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
      style={{
        left: tooltipData.position.x,
        top: tooltipData.position.y - 10,
      }}
    >
      <div className="text-sm font-medium">{tooltipData.text}</div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  );
};
