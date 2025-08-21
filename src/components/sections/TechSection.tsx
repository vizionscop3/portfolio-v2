import React from 'react';

export const TechSection: React.FC = () => {
  const skills = {
    frontend: ['React', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Vite'],
    backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis'],
    tools: ['Git', 'Docker', 'AWS', 'Figma', 'VS Code'],
  };

  const projects = [
    {
      title: '3D Interactive Portfolio',
      description:
        'Immersive 3D portfolio experience built with React Three Fiber',
      tech: ['React', 'Three.js', 'TypeScript', 'Zustand'],
      status: 'In Development',
    },
    {
      title: 'Audio Visualization Engine',
      description: 'Real-time audio analysis and 3D visualization system',
      tech: ['Web Audio API', 'Three.js', 'WebGL'],
      status: 'Completed',
    },
    {
      title: 'Cyberpunk UI Library',
      description: 'Reusable component library with futuristic design system',
      tech: ['React', 'Tailwind CSS', 'Storybook'],
      status: 'In Progress',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-mono text-cyan-400 mb-8">Tech Skills</h1>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.entries(skills).map(([category, skillList]) => (
            <div
              key={category}
              className="border border-cyan-400 p-6 bg-black bg-opacity-50"
            >
              <h2 className="text-xl font-mono text-magenta-400 mb-4 capitalize">
                {category}
              </h2>
              <div className="space-y-2">
                {skillList.map(skill => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-gray-300">{skill}</span>
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
        <div className="space-y-6">
          {projects.map((project, index) => (
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

              <div className="flex flex-wrap gap-2">
                {project.tech.map(tech => (
                  <span
                    key={tech}
                    className="text-xs font-mono bg-cyan-900 text-cyan-300 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
