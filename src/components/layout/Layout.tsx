import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-black">
      <Header />

      {/* Main content area */}
      <main className="pt-16 min-h-screen bg-brand-black">{children}</main>
    </div>
  );
};

export default Layout;
