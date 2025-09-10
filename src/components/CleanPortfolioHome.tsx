import {
  ArrowRight,
  Code,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  Palette,
  ShoppingBag,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CleanPortfolioHome: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sparks, setSparks] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  const sections = [
    {
      id: 'about',
      title: 'About Me',
      description: 'Discover my journey through the digital cosmos',
      icon: User,
      route: '/about',
      gradient: 'from-purple-600 via-purple-800 to-black',
      accent: 'purple-400',
    },
    {
      id: 'tech',
      title: 'Tech Portfolio',
      description: 'Explore cutting-edge projects from the void',
      icon: Code,
      route: '/tech',
      gradient: 'from-black via-purple-900 to-purple-600',
      accent: 'purple-300',
    },
    {
      id: 'blog',
      title: 'Blog',
      description: 'Thoughts transmitted from deep space',
      icon: FileText,
      route: '/blog',
      gradient: 'from-purple-800 via-black to-purple-700',
      accent: 'purple-500',
    },
    {
      id: 'fashion',
      title: 'Fashion',
      description: 'Style that transcends dimensions',
      icon: Palette,
      route: '/fashion',
      gradient: 'from-black via-purple-600 to-purple-900',
      accent: 'purple-200',
    },
    {
      id: 'merch',
      title: 'Merchandise',
      description: 'Artifacts from the digital realm',
      icon: ShoppingBag,
      route: '/merch',
      gradient: 'from-purple-900 via-purple-800 to-black',
      accent: 'purple-400',
    },
  ];

  // Generate sparks effect
  const generateSparks = () => {
    const newSparks = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.1,
    }));
    setSparks(newSparks);

    setTimeout(() => setSparks([]), 1000);
  };

  // Handle section navigation with space travel effect
  const handleSectionClick = (route: string) => {
    setIsTransitioning(true);
    generateSparks();

    setTimeout(() => {
      navigate(route);
    }, 800);
  };

  // Auto-scroll sections horizontally
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection(prev => (prev + 1) % sections.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sections.length]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background with Diagonal Patterns */}
      <div className="absolute inset-0">
        {/* Base diagonal pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-purple-600/10"></div>

        {/* Animated diagonal stripes */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent transform -skew-x-12 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/5 to-transparent transform skew-x-12 translate-x-20 animate-pulse delay-1000"></div>
        </div>

        {/* Space particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
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

      {/* Sparks Effect */}
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="spark-effect spark-positioned"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            animationDelay: `${spark.delay}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section with Greeting */}
        <section className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Greeting */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-4">
                <span className="block text-white font-light">Hi I'm</span>
                <span className="block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent font-black tracking-wider glow-text">
                  Lee Aulder
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-3xl text-purple-200 mb-8 font-light tracking-wide">
              Navigating the Digital Cosmos
            </p>

            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto opacity-90">
              Full-Stack Developer, Creative Visionary & Digital Pioneer
              <br />
              <span className="text-purple-300">
                Exploring the infinite possibilities of technology and
                creativity
              </span>
            </p>

            {/* Social Links with Diagonal Hover Effect */}
            <div className="flex justify-center space-x-8 mb-16">
              <a
                href="https://github.com/vizionscop3"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Lee's GitHub Profile"
                aria-label="GitHub Profile"
                className="group relative p-4 bg-black border border-purple-500/30 hover:border-purple-400 rounded-lg transition-all duration-500 hover:scale-110 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                <Github
                  size={28}
                  className="text-purple-300 group-hover:text-white relative z-10"
                />
              </a>
              <a
                href="https://linkedin.com/in/vizionscope"
                target="_blank"
                rel="noopener noreferrer"
                title="Connect with Lee on LinkedIn"
                aria-label="LinkedIn Profile"
                className="group relative p-4 bg-black border border-purple-500/30 hover:border-purple-400 rounded-lg transition-all duration-500 hover:scale-110 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                <Linkedin
                  size={28}
                  className="text-purple-300 group-hover:text-white relative z-10"
                />
              </a>
              <a
                href="mailto:contact@vizionscope.com"
                title="Send an email to Lee"
                aria-label="Email Contact"
                className="group relative p-4 bg-black border border-purple-500/30 hover:border-purple-400 rounded-lg transition-all duration-500 hover:scale-110 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                <Mail
                  size={28}
                  className="text-purple-300 group-hover:text-white relative z-10"
                />
              </a>
            </div>
          </div>
        </section>

        {/* Horizontal Scrolling Sections */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                Explore the Digital Universe
              </span>
            </h2>

            {/* Horizontal scrolling container */}
            <div className="relative overflow-hidden horizontal-scroll-container">
              <div
                className="horizontal-scroll-transform"
                style={{ transform: `translateX(-${currentSection * 25}%)` }}
              >
                {sections.map((section, index) => {
                  const IconComponent = section.icon;
                  const isActive = index === currentSection;

                  return (
                    <div
                      key={section.id}
                      onClick={() => handleSectionClick(section.route)}
                      className={`group cursor-pointer min-w-80 relative overflow-hidden rounded-2xl space-section-hover interactive-hover transition-all duration-700 ${
                        isActive
                          ? 'scale-105 shadow-2xl shadow-purple-500/30'
                          : 'scale-95 hover:scale-100'
                      }`}
                    >
                      {/* Diagonal background gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${section.gradient} transform skew-x-3`}
                      ></div>

                      {/* Diagonal overlay animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>

                      {/* Content */}
                      <div className="relative z-10 p-8 h-80 flex flex-col justify-between">
                        {/* Icon */}
                        <div
                          className={`w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}
                        >
                          <IconComponent size={32} className="text-white" />
                        </div>

                        {/* Text Content */}
                        <div>
                          <h3
                            className={`text-2xl font-bold text-white mb-4 group-hover:text-${section.accent} transition-colors duration-500`}
                          >
                            {section.title}
                          </h3>

                          <p className="text-gray-300 mb-6 group-hover:text-gray-100 transition-colors duration-500">
                            {section.description}
                          </p>

                          {/* Action Button */}
                          <div
                            className={`flex items-center text-${section.accent} group-hover:text-white transition-colors duration-500`}
                          >
                            <span className="text-sm font-medium">
                              Enter Portal
                            </span>
                            <ArrowRight
                              size={16}
                              className="ml-2 group-hover:translate-x-2 transition-transform duration-500"
                            />
                          </div>
                        </div>

                        {/* Spark effect on hover */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section indicators */}
            <div className="flex justify-center mt-12 space-x-3">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSection(index)}
                  title={`Go to section ${index + 1}`}
                  aria-label={`Navigate to section ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSection
                      ? 'bg-purple-400 scale-125'
                      : 'bg-purple-800 hover:bg-purple-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section with Space Theme */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-900/20 to-black"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-16 text-purple-200">
              Journey Through the Cosmos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-500">
                  50+
                </div>
                <div className="text-gray-300 group-hover:text-purple-200 transition-colors duration-500">
                  Stellar Projects
                </div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold text-purple-300 mb-2 group-hover:scale-110 transition-transform duration-500">
                  5+
                </div>
                <div className="text-gray-300 group-hover:text-purple-200 transition-colors duration-500">
                  Light Years
                </div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2 group-hover:scale-110 transition-transform duration-500">
                  ∞
                </div>
                <div className="text-gray-300 group-hover:text-purple-200 transition-colors duration-500">
                  Possibilities
                </div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold text-purple-200 mb-2 group-hover:scale-110 transition-transform duration-500">
                  24/7
                </div>
                <div className="text-gray-300 group-hover:text-purple-200 transition-colors duration-500">
                  Hyperspace
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action with Warp Speed Effect */}
        <section className="py-20 px-4 text-center relative">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Travel at{' '}
              <span className="bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                Light Speed?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join me on an intergalactic journey where innovation meets
              imagination.
            </p>
            <button
              onClick={() => handleSectionClick('/about')}
              className={`group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 ${
                isTransitioning ? 'animate-pulse' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              <span className="relative z-10">Initiate Contact</span>
              <ExternalLink
                size={20}
                className="ml-2 relative z-10 group-hover:rotate-12 transition-transform duration-500"
              />
            </button>
          </div>
        </section>
      </div>

      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="light-speed-effect">
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="space-travel-loader w-16 h-16 mb-4 mx-auto"></div>
              <p className="text-purple-300 text-lg glow-text">
                Traveling through space...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleanPortfolioHome;
