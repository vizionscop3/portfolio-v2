import { Code, Database, Palette, Terminal, Zap } from 'lucide-react';
import React from 'react';
import { useSectionAccessibility } from '../../hooks/useAccessibility';
import { SpacePageLayout } from '../layout/SpacePageLayout';
import { CollapsibleSection } from '../ui/CollapsibleSection';
import { MinimalProjectCard, MinimalSkillGrid } from '../ui/MinimalComponents';

export const TechSection: React.FC = () => {
  const { announceEntry } = useSectionAccessibility(
    'Tech Skills',
    'Technical skills showcase including programming languages, frameworks, and development projects'
  );

  // Announce section entry when component mounts
  React.useEffect(() => {
    announceEntry();
  }, [announceEntry]);

  const skills = {
    frontend: [
      { name: 'React 18', level: 95, icon: '⚛️' },
      { name: 'TypeScript', level: 92, icon: '🔷' },
      { name: 'React Three Fiber', level: 88, icon: '🌐' },
      { name: 'Three.js', level: 85, icon: '🎮' },
      { name: 'Vite', level: 90, icon: '⚡' },
      { name: 'Tailwind CSS', level: 93, icon: '🎨' },
      { name: 'WebGL Shaders', level: 80, icon: '✨' },
      { name: 'Framer Motion', level: 87, icon: '🎬' },
      { name: 'Zustand', level: 85, icon: '🏪' },
      { name: 'Lucide React', level: 88, icon: '🎯' },
    ],
    backend: [
      { name: 'Node.js', level: 88, icon: '�' },
      { name: 'Express.js', level: 85, icon: '🚀' },
      { name: 'RESTful APIs', level: 90, icon: '�' },
      { name: 'WebSocket', level: 82, icon: '�' },
      { name: 'Performance APIs', level: 85, icon: '�' },
      { name: 'Service Workers', level: 78, icon: '⚙️' },
    ],
    tools: [
      { name: 'Git & GitHub', level: 95, icon: '📝' },
      { name: 'VS Code', level: 95, icon: '�' },
      { name: 'Azure Static Web Apps', level: 88, icon: '☁️' },
      { name: 'GitHub Actions', level: 85, icon: '🔄' },
      { name: 'ESLint & Prettier', level: 90, icon: '🔍' },
      { name: 'Vitest', level: 85, icon: '🧪' },
      { name: 'PowerShell', level: 80, icon: '�️' },
      { name: 'Husky Git Hooks', level: 82, icon: '🪝' },
    ],
    optimization: [
      { name: 'Performance Monitoring', level: 88, icon: '📈' },
      { name: 'Asset Optimization', level: 85, icon: '�' },
      { name: 'LOD System', level: 82, icon: '�' },
      { name: 'Caching Strategies', level: 87, icon: '💾' },
      { name: 'Bundle Analysis', level: 83, icon: '📊' },
      { name: 'Accessibility (WCAG)', level: 90, icon: '♿' },
      { name: 'SEO Optimization', level: 85, icon: '�' },
      { name: 'Progressive Loading', level: 80, icon: '⚡' },
    ],
  };

  const projects = [
    {
      title: 'Portfolio v2 - 3D Interactive Experience',
      description:
        'Immersive 3D portfolio featuring React Three Fiber, WebGL shaders, cyberpunk aesthetics, and comprehensive accessibility. Built with phase-based development methodology and performance optimization.',
      tech: [
        'React 18',
        'TypeScript',
        'Three.js',
        'React Three Fiber',
        'Zustand',
        'Framer Motion',
        'Tailwind CSS',
        'Vite',
      ],
      status: 'Live',
      github: 'https://github.com/vizionscop3/portfolio-v2',
      demo: 'https://happy-flower-01a9d340f.azurestaticapps.net',
      category: 'web',
      year: '2024',
      phase: 'Phase 8 - Accessibility & Mobile Support',
      highlights: [
        'React Three Fiber 3D Engine',
        'WebGL Performance Optimization',
        'Comprehensive WCAG Accessibility',
        'Azure Static Web Apps Deployment',
        'Phase-Based Development Workflow',
        'Advanced Performance Monitoring',
        'Professional CI/CD Pipeline',
        'Mobile-Responsive 3D Experience',
      ],
    },
    {
      title: 'Audio-Visual Synthesis Platform',
      description:
        'Real-time audio processing and visual synthesis platform with interactive waveform manipulation, cyberpunk-inspired UI, and professional audio engineering capabilities.',
      tech: [
        'React',
        'Web Audio API',
        'Canvas API',
        'TypeScript',
        'Real-time Processing',
      ],
      status: 'Development',
      github: 'https://github.com/vizionscop3/portfolio-v2',
      category: 'audio',
      year: '2024',
      highlights: [
        'Real-time Audio Processing',
        'Interactive Waveform Visualization',
        'Professional Audio Tools Integration',
        'Cyberpunk Visual Design',
      ],
    },
    {
      title: 'Phase-Based Development System',
      description:
        'Innovative development workflow with Azure Static Web Apps multi-environment deployment, automated CI/CD, and phase-specific feature rollouts. Professional software engineering workflow.',
      tech: [
        'GitHub Actions',
        'Azure Static Web Apps',
        'PowerShell',
        'CI/CD',
        'Multi-Environment',
      ],
      status: 'Production',
      github: 'https://github.com/vizionscop3/portfolio-v2',
      demo: 'https://portfolio-phase-foundation.azurestaticapps.net',
      category: 'devops',
      year: '2024',
      highlights: [
        'Multi-Environment Deployment',
        'Automated CI/CD Pipeline',
        'Phase-Based Feature Rollout',
        'Professional Development Standards',
        'Azure Cloud Integration',
        'Comprehensive Testing Framework',
      ],
    },
    {
      title: 'Professional Logging & Monitoring System',
      description:
        'Advanced logging framework with performance monitoring, user analytics, error tracking, and comprehensive debugging tools for production applications.',
      tech: [
        'TypeScript',
        'Performance API',
        'Analytics',
        'Error Tracking',
        'Monitoring',
      ],
      status: 'Production',
      github: 'https://github.com/vizionscop3/portfolio-v2',
      category: 'tools',
      year: '2024',
      highlights: [
        'Real-time Performance Monitoring',
        'Advanced Error Tracking',
        'User Interaction Analytics',
        'Production-Ready Logging',
        'Comprehensive Debug Tools',
      ],
    },
  ];

  return (
    <SpacePageLayout
      title="Tech Arsenal"
      subtitle="Mastering the Tools That Build Tomorrow"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Collapsible Skills Sections */}
        <CollapsibleSection
          title="Technical Skills"
          subtitle="Core competencies and expertise levels"
          icon={<Code className="w-5 h-5" />}
          defaultOpen={true}
          variant="card"
        >
          <div className="space-y-6">
            {Object.entries(skills).map(([categoryKey, categorySkills]) => (
              <CollapsibleSection
                key={categoryKey}
                title={
                  categoryKey === 'tools'
                    ? 'DevOps & Tools'
                    : `${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)} Stack`
                }
                subtitle={`${categorySkills.length} skills`}
                icon={
                  categoryKey === 'frontend' ? (
                    <Code className="w-4 h-4" />
                  ) : categoryKey === 'backend' ? (
                    <Database className="w-4 h-4" />
                  ) : categoryKey === 'tools' ? (
                    <Terminal className="w-4 h-4" />
                  ) : (
                    <Palette className="w-4 h-4" />
                  )
                }
                variant="minimal"
                className="bg-white/5 rounded-lg"
              >
                <MinimalSkillGrid
                  skills={categorySkills}
                  showLevels={true}
                  compact={false}
                />
              </CollapsibleSection>
            ))}
          </div>
        </CollapsibleSection>

        {/* Featured Projects Section */}
        <CollapsibleSection
          title="Featured Applications"
          subtitle="Real projects from GitHub repository"
          icon={<Zap className="w-5 h-5" />}
          variant="card"
        >
          <div className="grid lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <MinimalProjectCard
                key={index}
                title={project.title}
                description={project.description}
                tech={project.tech}
                status={project.status}
                github={project.github}
                demo={project.demo}
                year={project.year}
              />
            ))}
          </div>
        </CollapsibleSection>

        {/* Development Philosophy Section */}
        <CollapsibleSection
          title="Development Philosophy"
          subtitle="Professional standards and methodology"
          icon={<span className="text-xl">🚀</span>}
          variant="card"
        >
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              Building professional-grade applications with meticulous attention
              to performance, accessibility, and user experience. Every project
              follows industry best practices.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <h4 className="text-white font-medium">
                    Phase-Based Development
                  </h4>
                </div>
                <p className="text-secondary text-sm">
                  11-phase workflow with automated testing
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">♿</span>
                  <h4 className="text-white font-medium">
                    Accessibility-First
                  </h4>
                </div>
                <p className="text-secondary text-sm">
                  WCAG compliance and inclusive design
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⚡</span>
                  <h4 className="text-white font-medium">Performance Focus</h4>
                </div>
                <p className="text-secondary text-sm">
                  Advanced monitoring and optimization
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🔧</span>
                  <h4 className="text-white font-medium">Quality Standards</h4>
                </div>
                <p className="text-secondary text-sm">
                  CI/CD pipelines and automated checks
                </p>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </SpacePageLayout>
  );
};

export default TechSection;
