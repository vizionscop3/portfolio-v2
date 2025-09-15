import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PipWindow {
  id: string;
  title: string;
  content: React.ReactNode;
}

const CleanPortfolioHome: React.FC = () => {
  const navigate = useNavigate();
  const [activePipWindows, setActivePipWindows] = useState<PipWindow[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Handle section navigation
  const handleSectionClick = (route: string) => {
    navigate(route);
  };

  // Handle tab clicks to open pip windows
  const handleTabClick = (
    tabId: string,
    title: string,
    content: React.ReactNode
  ) => {
    setActiveTab(tabId);

    // Check if window is already open
    const existingWindow = activePipWindows.find(window => window.id === tabId);
    if (!existingWindow) {
      const newWindow: PipWindow = { id: tabId, title, content };
      setActivePipWindows(prev => [...prev, newWindow]);
    }
  };

  // Handle pip window close
  const handleClosePipWindow = (windowId: string) => {
    setActivePipWindows(prev => prev.filter(window => window.id !== windowId));
    if (activeTab === windowId) {
      setActiveTab(null);
    }
  };

  // Content for each section
  const getAboutContent = () => (
    <div>
      <h3 className="text-2xl mb-4 tt-frantz-menu">About VIZIONSCOPE</h3>
      <p className="mb-4">
        Welcome to VIZIONSCOPE - where innovation meets creativity. I'm Lee
        Aulder, a passionate fullstack developer dedicated to crafting
        exceptional digital experiences.
      </p>
      <p className="mb-4">
        With expertise in modern web technologies, I bring visions to life
        through clean code, stunning design, and user-centered solutions.
      </p>
      <p>Let's build something amazing together.</p>
    </div>
  );

  const getTechContent = () => (
    <div>
      <h3 className="text-2xl mb-4 tt-frantz-menu">Tech Stack</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg mb-2 text-cyan-400">Frontend</h4>
          <ul className="text-sm space-y-1">
            <li>• React / TypeScript</li>
            <li>• Next.js</li>
            <li>• Tailwind CSS</li>
            <li>• Three.js</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg mb-2 text-cyan-400">Backend</h4>
          <ul className="text-sm space-y-1">
            <li>• Node.js</li>
            <li>• PostgreSQL</li>
            <li>• AWS</li>
            <li>• Docker</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const getBlogContent = () => (
    <div>
      <h3 className="text-2xl mb-4 tt-frantz-menu">Latest Posts</h3>
      <div className="space-y-4">
        <div className="border-l-3 border-cyan-400 pl-4">
          <h4 className="text-lg mb-1">Building Modern Web Apps</h4>
          <p className="text-sm text-gray-300">
            Exploring the latest in React and TypeScript development...
          </p>
        </div>
        <div className="border-l-3 border-cyan-400 pl-4">
          <h4 className="text-lg mb-1">The Future of UI/UX</h4>
          <p className="text-sm text-gray-300">
            How design trends are shaping user experiences...
          </p>
        </div>
        <div className="border-l-3 border-cyan-400 pl-4">
          <h4 className="text-lg mb-1">Performance Optimization</h4>
          <p className="text-sm text-gray-300">
            Best practices for lightning-fast web applications...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen matte-dark-bg relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section with New Content */}
        <section className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="text-center max-w-6xl mx-auto">
            {/* Welcome Message */}
            <div className="mb-16">
              <h1 className="text-6xl md:text-8xl lg:text-9xl mb-8 leading-tight">
                <span className="block tt-frantz-welcome tracking-wider">
                  WELCOME TO VIZIONSCOPE
                </span>
              </h1>

              <div className="my-16"></div>

              <h2 className="text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight">
                <span className="block tt-frantz-menu tracking-wider">
                  Hi I'm Lee Aulder
                </span>
              </h2>
            </div>
          </div>
        </section>

        {/* Tab Navigation Section */}
        <section className="py-20 px-4 pb-60">
          <div className="max-w-4xl mx-auto">
            {/* Tab-like navigation */}
            <div className="flex justify-center gap-4 mb-8">
              {/* About Tab */}
              <div
                className={`tab-card ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() =>
                  handleTabClick(
                    'about',
                    'About VIZIONSCOPE',
                    getAboutContent()
                  )
                }
              >
                <h3 className="tt-frantz-menu">ABOUT</h3>
              </div>

              {/* Tech Tab */}
              <div
                className={`tab-card ${activeTab === 'tech' ? 'active' : ''}`}
                onClick={() =>
                  handleTabClick('tech', 'Tech Stack', getTechContent())
                }
              >
                <h3 className="tt-frantz-menu">TECH</h3>
              </div>

              {/* Blog Tab */}
              <div
                className={`tab-card ${activeTab === 'blog' ? 'active' : ''}`}
                onClick={() =>
                  handleTabClick('blog', 'Blog Posts', getBlogContent())
                }
              >
                <h3 className="tt-frantz-menu">BLOG</h3>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PIP Windows */}
      {activePipWindows.map(window => (
        <React.Fragment key={window.id}>
          {/* Overlay */}
          <div
            className="pip-overlay"
            onClick={() => handleClosePipWindow(window.id)}
          />

          {/* PIP Window */}
          <div className="pip-window">
            <div className="pip-header">
              <h2 className="pip-title">{window.title}</h2>
              <button
                className="pip-close"
                onClick={() => handleClosePipWindow(window.id)}
              >
                ✕
              </button>
            </div>
            <div className="pip-content">{window.content}</div>
          </div>
        </React.Fragment>
      ))}

      {/* Merch Store Door */}
      <div className="merch-door" onClick={() => handleSectionClick('/merch')}>
        <div className="merch-door-icon">🚪</div>
        <div className="merch-door-text">MERCH</div>
        <div className="merch-door-text">STORE</div>
      </div>
    </div>
  );
};

export default CleanPortfolioHome;
