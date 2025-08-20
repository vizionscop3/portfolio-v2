import {
  Box,
  Code,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  Monitor,
  Music,
  Palette,
  ShoppingBag,
  Twitter,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Project, SectionId } from '../types';
import { cache } from '../utils/cache';
import { useErrorHandler } from '../utils/errorHandling';
import {
  PerformanceMonitor,
  logger,
  trackUserInteraction,
} from '../utils/logger';
import { WebGLDetector } from '../utils/webgl-detection';
import Portfolio3D from './Portfolio3D';

const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleError = useErrorHandler();

  // Check WebGL support on component mount
  useEffect(() => {
    const checkWebGL = async () => {
      try {
        const webglDetector = WebGLDetector.getInstance();
        const supported = webglDetector.isWebGLSupported();
        setWebGLSupported(supported);

        // Auto-enable 3D mode if WebGL is supported and user hasn't explicitly chosen 2D
        if (supported && !localStorage.getItem('portfolio_mode_preference')) {
          setIs3DMode(true);
        }

        setIsLoading(false);
        logger.info(`WebGL support: ${supported}`);
      } catch (error) {
        handleError(error as Error, 'WebGL detection');
        setWebGLSupported(false);
        setIsLoading(false);
      }
    };

    checkWebGL();
  }, [handleError]);

  // Navigation items with icons
  const navigation = [
    { id: 'about' as SectionId, label: 'About Me', icon: User },
    { id: 'tech' as SectionId, label: 'Tech', icon: Code },
    { id: 'blog' as SectionId, label: 'Blog', icon: FileText },
    { id: 'fashion' as SectionId, label: 'Fashion', icon: Palette },
    { id: 'merch' as SectionId, label: 'Merch', icon: ShoppingBag },
  ];

  // Project data with caching
  const getProjects = (): Project[] => {
    const cacheKey = 'portfolio_projects';
    let projects = cache.get<Project[]>(cacheKey);

    if (!projects) {
      projects = [
        {
          title: 'E-Commerce Platform',
          description:
            'Full-stack React/Node.js application with payment integration',
          tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          github: 'https://github.com/username/ecommerce',
          demo: 'https://demo-ecommerce.com',
        },
        {
          title: 'Task Management App',
          description: 'Real-time collaborative task management with WebSocket',
          tech: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'],
          github: 'https://github.com/username/taskapp',
          demo: 'https://demo-tasks.com',
        },
        {
          title: 'Weather Dashboard',
          description: 'Interactive weather dashboard with data visualization',
          tech: ['React', 'D3.js', 'OpenWeather API', 'Tailwind'],
          github: 'https://github.com/username/weather',
          demo: 'https://demo-weather.com',
        },
      ];

      // Cache for 1 hour
      cache.set(cacheKey, projects, { ttl: 60 * 60 * 1000 });
    }

    return projects;
  };

  const blogCategories = ['Poetry', 'Music', 'Art'];

  const handleSectionChange = (sectionId: SectionId) => {
    try {
      PerformanceMonitor.mark(`section_${sectionId}_start`);

      trackUserInteraction('section_change', {
        from: activeSection,
        to: sectionId,
        mode: is3DMode ? '3D' : '2D',
      });

      setActiveSection(sectionId);
      setMobileMenuOpen(false);

      logger.info(`Section changed to: ${sectionId}`);

      PerformanceMonitor.mark(`section_${sectionId}_end`);
      PerformanceMonitor.measure(
        `section_${sectionId}_render`,
        `section_${sectionId}_start`,
        `section_${sectionId}_end`
      );
    } catch (error) {
      handleError(error as Error, 'handleSectionChange');
    }
  };

  const toggleMode = () => {
    const newMode = !is3DMode;
    setIs3DMode(newMode);
    localStorage.setItem('portfolio_mode_preference', newMode ? '3D' : '2D');

    trackUserInteraction('mode_toggle', {
      from: is3DMode ? '3D' : '2D',
      to: newMode ? '3D' : '2D',
    });

    logger.info(`Mode changed to: ${newMode ? '3D' : '2D'}`);
  };

  const renderSection = () => {
    try {
      const projects = getProjects();

      switch (activeSection) {
        case 'about':
          return (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
                  JD
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  John Developer
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Full Stack Developer & Creative
                </p>
              </div>

              <div className="prose prose-lg mx-auto">
                <p className="text-gray-700 leading-relaxed mb-6">
                  I'm a passionate full stack developer with 5+ years of
                  experience building scalable web applications. I love
                  combining technical expertise with creative vision to create
                  digital experiences that matter.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'JavaScript',
                        'React',
                        'Node.js',
                        'Python',
                        'PostgreSQL',
                        'MongoDB',
                        'AWS',
                        'Docker',
                      ].map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Creative Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Photography',
                        'Music Production',
                        'Fashion Design',
                        'Digital Art',
                      ].map(interest => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'tech':
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Technical Projects
                </h2>
                <p className="text-gray-600 mb-8">
                  A selection of my recent development work
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: Project, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-3">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <a
                        href={project.github}
                        className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
                        onClick={() =>
                          trackUserInteraction('project_github_click', {
                            project: project.title,
                          })
                        }
                      >
                        <Github size={16} />
                        Code
                      </a>
                      <a
                        href={project.demo}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() =>
                          trackUserInteraction('project_demo_click', {
                            project: project.title,
                          })
                        }
                      >
                        <ExternalLink size={16} />
                        Demo
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <a
                  href="https://github.com/username"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={() => trackUserInteraction('github_profile_click')}
                >
                  <Github size={20} />
                  View More on GitHub
                </a>
              </div>
            </div>
          );

        case 'blog':
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Creative Blog
                </h2>
                <p className="text-gray-600 mb-8">
                  Exploring the intersection of technology and creativity
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {blogCategories.map(category => (
                  <div
                    key={category}
                    className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {category === 'Poetry' && (
                        <FileText className="text-white" size={24} />
                      )}
                      {category === 'Music' && (
                        <Music className="text-white" size={24} />
                      )}
                      {category === 'Art' && (
                        <Palette className="text-white" size={24} />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{category}</h3>
                    <p className="text-gray-600">Coming Soon</p>
                  </div>
                ))}
              </div>

              <div className="text-center bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-4">Blog Coming Soon</h3>
                <p className="text-gray-600">
                  I'm currently working on creating meaningful content across
                  poetry, music, and art. Subscribe to be notified when new
                  posts are available!
                </p>
                <button
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => trackUserInteraction('blog_subscribe_click')}
                >
                  Subscribe for Updates
                </button>
              </div>
            </div>
          );

        case 'fashion':
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Fashion & Style
                </h2>
                <p className="text-gray-600 mb-8">
                  Where technology meets personal expression
                </p>
              </div>

              <div className="text-center bg-gray-50 rounded-lg p-12">
                <Palette size={64} className="mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-4">
                  Fashion Portfolio Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  I'm curating a collection that showcases my personal style and
                  fashion projects. This section will feature lookbooks, design
                  process insights, and style inspiration.
                </p>
                <button
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => trackUserInteraction('fashion_notify_click')}
                >
                  Get Notified
                </button>
              </div>
            </div>
          );

        case 'merch':
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Merch Shop
                </h2>
                <p className="text-gray-600 mb-8">
                  Unique designs at the intersection of tech and creativity
                </p>
              </div>

              <div className="text-center bg-gray-50 rounded-lg p-12">
                <ShoppingBag size={64} className="mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-4">
                  Shop Opening Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  I'm working on a collection of merchandise that reflects my
                  passion for both technology and art. Stay tuned for unique
                  designs, limited editions, and more!
                </p>
                <button
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => trackUserInteraction('merch_waitlist_click')}
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          );

        default:
          return null;
      }
    } catch (error) {
      handleError(error as Error, 'renderSection');
      return (
        <div className="text-center py-8">
          <p className="text-red-600">
            An error occurred while loading this section.
          </p>
        </div>
      );
    }
  };

  // Show loading state while checking WebGL support
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl text-gray-900">Portfolio</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}

              {/* 3D/2D Mode Toggle */}
              {webGLSupported && (
                <button
                  onClick={toggleMode}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                  title={`Switch to ${is3DMode ? '2D' : '3D'} mode`}
                >
                  {is3DMode ? <Monitor size={18} /> : <Box size={18} />}
                  {is3DMode ? '2D' : '3D'}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-md transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      {is3DMode && webGLSupported ? (
        <main className="h-screen">
          <Portfolio3D
            onSectionChange={handleSectionChange}
            activeSection={activeSection}
          />
        </main>
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-8">
          {!webGLSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <Monitor size={20} className="text-yellow-600" />
                <p className="text-yellow-800">
                  WebGL is not supported on your device. Showing 2D version.
                </p>
              </div>
            </div>
          )}
          {renderSection()}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600">
              © 2025 John Developer. All rights reserved.
            </p>

            <div className="flex gap-6">
              <a
                href="mailto:john@example.com"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => trackUserInteraction('email_click')}
              >
                <Mail size={20} />
              </a>
              <a
                href="https://linkedin.com/in/johndeveloper"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => trackUserInteraction('linkedin_click')}
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com/johndeveloper"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => trackUserInteraction('twitter_click')}
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://github.com/johndeveloper"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => trackUserInteraction('github_click')}
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
