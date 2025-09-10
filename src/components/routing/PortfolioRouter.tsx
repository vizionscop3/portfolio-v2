import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CleanPortfolioHome from '../CleanPortfolioHome'; // Clean homepage without 3D
import {
  AboutSection,
  BlogSection,
  FashionSection,
  MerchSection,
  TechSection,
} from '../sections';

interface PortfolioRouterProps {
  className?: string;
}

export const PortfolioRouter: React.FC<PortfolioRouterProps> = ({
  className = '',
}) => {
  return (
    <div className={className}>
      <Routes>
        {/* Clean Homepage - Fast loading without 3D */}
        <Route path="/" element={<CleanPortfolioHome />} />

        {/* Section Routes */}
        <Route path="/about" element={<AboutSection />} />
        <Route path="/tech" element={<TechSection />} />
        <Route path="/blog" element={<BlogSection />} />
        <Route path="/fashion" element={<FashionSection />} />
        <Route path="/merch" element={<MerchSection />} />

        {/* Fallback to clean homepage */}
        <Route path="*" element={<CleanPortfolioHome />} />
      </Routes>
    </div>
  );
};

export default PortfolioRouter;
