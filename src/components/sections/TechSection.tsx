import React from 'react';
import { useSectionAccessibility } from '../../hooks/useAccessibility';

export const TechSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = React.useState<string>('all');
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
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Three.js', level: 85 },
      { name: 'Next.js', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Vite', level: 85 },
      { name: 'WebGL', level: 80 },
      { name: 'Framer Motion', level: 85 },
    ],
    backend: [
      { name: 'Node.js', level: 90 },
      { name: 'Express', level: 88 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 82 },
      { name: 'Redis', level: 75 },
      { name: 'GraphQL', level: 80 },
      { name: 'REST APIs', level: 92 },
      { name: 'Microservices', level: 78 },
    ],
    tools: [
      { name: 'Git', level: 95 },
      { name: 'Docker', level: 80 },
      { name: 'AWS', level: 75 },
      { name: 'Vercel', level: 90 },
      { name: 'Figma', level: 85 },
      { name: 'VS Code', level: 95 },
      { name: 'Webpack', level: 82 },
      { name: 'ESLint', level: 88 },
    ],
    creative: [
      { name: 'Adobe Creative Suite', level: 85 },
      { name: 'Blender', level: 75 },
      { name: 'Pro Tools', level: 90 },
      { name: 'Logic Pro', level: 88 },
      { name: 'Ableton Live', level: 85 },
      { name: 'Cinema 4D', level: 70 },
    ],
  };

  const projects = [
    {
      title: 'Cyberpunk 3D Portfolio',
      description:
        'Immersive 3D portfolio experience featuring holographic interfaces, interactive objects, and cyberpunk aesthetics. Built with React Three Fiber and advanced WebGL techniques.',
      tech: ['React', 'Three.js', 'TypeScript', 'Zustand', 'Framer Motion'],
      status: 'Live',
      link: 'https://denward-portfolio.vercel.app',
      category: 'web',
      year: '2024',
      highlights: [
        '3D Interactions',
        'WebGL Shaders',
        'Performance Optimization',
      ],
    },
    {
      title: 'Audio-Visual Synthesis Platform',
      description:
        'Real-time audio analysis and 3D visualization system for live performances and installations. Features custom DSP algorithms and WebGL shaders.',
      tech: ['Web Audio API', 'Three.js', 'WebGL', 'GLSL', 'Node.js'],
      status: 'Completed',
      link: 'https://github.com/denward/audio-visual-engine',
      category: 'audio',
      year: '2023',
      highlights: ['Real-time Processing', 'Custom DSP', 'Live Performance'],
    },
    {
      title: 'Neon UI Component Library',
      description:
        'Comprehensive design system and component library with cyberpunk aesthetics. Features animated components, custom hooks, and TypeScript support.',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook', 'Rollup'],
      status: 'Open Source',
      link: 'https://neon-ui.dev',
      category: 'library',
      year: '2024',
      highlights: ['Design System', 'TypeScript', 'Open Source'],
    },
    {
      title: 'Creative Studio Management SaaS',
      description:
        'Full-stack application for creative agencies to manage projects, clients, and resources. Features real-time collaboration and advanced analytics.',
      tech: ['Next.js', 'PostgreSQL', 'Prisma', 'tRPC', 'Vercel'],
      status: 'In Production',
      link: 'https://studio-manager.app',
      category: 'saas',
      year: '2023',
      highlights: ['Full-stack', 'Real-time Collaboration', 'Analytics'],
    },
    {
      title: 'Immersive Fashion Showcase',
      description:
        '3D fashion presentation platform with virtual try-on capabilities and AR integration. Combines fashion with cutting-edge web technology.',
      tech: ['Three.js', 'WebXR', 'TensorFlow.js', 'React', 'WebRTC'],
      status: 'Beta',
      link: 'https://fashion-3d.app',
      category: 'fashion',
      year: '2024',
      highlights: ['AR/VR', 'Machine Learning', 'Fashion Tech'],
    },
  ];

  return (
    <section
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8"
      id="tech"
      aria-labelledby="tech-heading"
      aria-describedby="tech-description"
      role="main"
    >
      <div className="max-w-6xl mx-auto">
        <h1 id="tech-heading" className="text-4xl font-mono text-cyan-400 mb-4">
          Tech Skills
        </h1>
        <p
          id="tech-description"
          className="text-lg text-gray-300 mb-8 max-w-3xl"
        >
          Specializing in immersive web experiences, full-stack development, and
          creative technology solutions. My expertise spans modern JavaScript
          frameworks, 3D graphics, audio engineering, and scalable system
          architecture.
        </p>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(skills).map(([category, skillList]) => (
            <div
              key={category}
              className="border border-cyan-400 p-6 bg-black bg-opacity-50"
            >
              <h2 className="text-xl font-mono text-magenta-400 mb-4 capitalize">
                {category}
              </h2>
              <div className="space-y-3">
                {skillList.map(skill => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">
                        {skill.name}
                      </span>
                      <span className="text-cyan-400 text-xs font-mono">
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      className="w-full bg-gray-800 rounded-full h-1.5"
                      role="progressbar"
                      aria-label={`${skill.name} proficiency`}
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuetext={`${skill.level} percent proficiency in ${skill.name}`}
                    >
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-magenta-400 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <h2 className="text-3xl font-mono text-cyan-400 mb-6">
          Featured Projects
        </h2>

        {/* Project Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'web', label: 'Web Apps' },
            { id: 'audio', label: 'Audio Tech' },
            { id: 'library', label: 'Libraries' },
            { id: 'saas', label: 'SaaS' },
            { id: 'fashion', label: 'Fashion Tech' },
          ].map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedFilter(category.id)}
              className={`px-4 py-2 font-mono text-sm border transition-all duration-300 ${
                selectedFilter === category.id
                  ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                  : 'border-gray-600 text-gray-400 hover:border-cyan-400/50 hover:text-cyan-400'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="space-y-6">
          {projects
            .filter(
              project =>
                selectedFilter === 'all' || project.category === selectedFilter
            )
            .map((project, index) => (
              <div
                key={index}
                className="border border-magenta-500 p-6 bg-black bg-opacity-30"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-mono text-cyan-300">
                    {project.title}
                  </h3>
                  <span className="text-sm font-mono text-magenta-400 border border-magenta-400 px-2 py-1">
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-300 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map(tech => (
                    <span
                      key={tech}
                      className="text-xs font-mono bg-cyan-900 text-cyan-300 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.highlights && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.highlights.map(highlight => (
                      <span
                        key={highlight}
                        className="text-xs font-mono bg-magenta-900/50 text-magenta-300 px-2 py-1 rounded border border-magenta-500/30"
                      >
                        ✦ {highlight}
                      </span>
                    ))}
                  </div>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>View Project</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
