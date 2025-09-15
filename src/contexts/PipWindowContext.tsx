import React, { createContext, ReactNode, useState } from 'react';

export interface PipWindow {
  id: string;
  title: string;
  content: ReactNode;
}

export interface PipWindowContextType {
  activePipWindows: PipWindow[];
  activeTab: string | null;
  openPipWindow: (id: string, title: string, content: ReactNode) => void;
  closePipWindow: (id: string) => void;
  setActiveTab: (tabId: string | null) => void;
}

const PipWindowContext = createContext<PipWindowContextType | undefined>(
  undefined
);

export { PipWindowContext };

interface PipWindowProviderProps {
  children: ReactNode;
}

export const PipWindowProvider: React.FC<PipWindowProviderProps> = ({
  children,
}) => {
  const [activePipWindows, setActivePipWindows] = useState<PipWindow[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const openPipWindow = (id: string, title: string, content: ReactNode) => {
    setActiveTab(id);

    // Close all existing PIP windows before opening new one
    setActivePipWindows([]);

    // Add the new window
    const newWindow: PipWindow = { id, title, content };
    setActivePipWindows([newWindow]);
  };

  const closePipWindow = (windowId: string) => {
    setActivePipWindows(prev => prev.filter(window => window.id !== windowId));
    if (activeTab === windowId) {
      setActiveTab(null);
    }
  };

  return (
    <PipWindowContext.Provider
      value={{
        activePipWindows,
        activeTab,
        openPipWindow,
        closePipWindow,
        setActiveTab,
      }}
    >
      {children}
    </PipWindowContext.Provider>
  );
};
