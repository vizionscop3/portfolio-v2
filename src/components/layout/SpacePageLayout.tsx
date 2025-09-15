import React, { ReactNode } from 'react';

interface SpacePageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SpacePageLayout: React.FC<SpacePageLayoutProps> = ({
  children,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen bg-brand-black relative overflow-hidden ${className}`}
    >
      {/* Animated Background with Diagonal Patterns */}
      <div className="absolute inset-0">
        {/* Base diagonal pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-purple-900/20 to-purple-600/10"></div>

        {/* Animated diagonal stripes */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent transform -skew-x-12 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/5 to-transparent transform skew-x-12 translate-x-20 animate-pulse delay-1000"></div>
        </div>

        {/* Space particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="space-particle-random space-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent glow-text">
                {title}
              </span>
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-purple-200 mb-12 font-light">
                {subtitle}
              </p>
            )}
          </div>
        </section>

        {/* Page Content */}
        <div className="px-4 pb-20">{children}</div>
      </div>
    </div>
  );
};

export default SpacePageLayout;
