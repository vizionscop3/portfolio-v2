import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary">
      <Header />

      {/* Main content area */}
      <main className="pt-16 min-h-screen">{children}</main>
    </div>
  );
};

export default Layout;
