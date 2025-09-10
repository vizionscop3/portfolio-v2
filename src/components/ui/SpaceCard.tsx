import React, { ReactNode } from 'react';

interface SpaceCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  gradient?: 'purple' | 'dark' | 'accent';
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  children,
  className = '',
  hover = true,
  onClick,
  gradient = 'purple',
}) => {
  const gradientClasses = {
    purple: 'from-purple-600 via-purple-800 to-black',
    dark: 'from-black via-purple-900 to-purple-600',
    accent: 'from-purple-800 via-black to-purple-700',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl space-section-hover transition-all duration-700 ${
        hover
          ? 'hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Diagonal background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradient]} transform skew-x-3`}
      ></div>

      {/* Diagonal overlay animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>

      {/* Content */}
      <div className="relative z-10 p-6">{children}</div>

      {/* Spark effect on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
      </div>
    </div>
  );
};

export default SpaceCard;
