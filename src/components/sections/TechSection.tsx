import { Code, Database, Palette, Terminal, Zap } from 'lucide-react';
import React from 'react';
import { useSectionAccessibility } from '../../hooks/useAccessibility';
import { SpacePageLayout } from '../layout/SpacePageLayout';
import { SpaceCard } from '../ui/SpaceCard';

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
      { name: 'React', level: 95, icon: '⚛️' },
      { name: 'TypeScript', level: 90, icon: '🔷' },
      { name: 'Three.js', level: 85, icon: '🌐' },
      { name: 'Next.js', level: 88, icon: '▲' },
      { name: 'Tailwind CSS', level: 92, icon: '🎨' },
      { name: 'Vite', level: 85, icon: '⚡' },
      { name: 'WebGL', level: 80, icon: '🎮' },
      { name: 'Framer Motion', level: 85, icon: '🎬' },
    ],
    backend: [
      { name: 'Node.js', level: 90, icon: '🟢' },
      { name: 'Express', level: 88, icon: '🚀' },
      { name: 'PostgreSQL', level: 85, icon: '🐘' },
      { name: 'MongoDB', level: 82, icon: '🍃' },
      { name: 'Redis', level: 75, icon: '💎' },
      { name: 'GraphQL', level: 80, icon: '📊' },
      { name: 'REST APIs', level: 92, icon: '🔗' },
      { name: 'Microservices', level: 78, icon: '🏗️' },
    ],
    tools: [
      { name: 'Git', level: 95, icon: '📝' },
      { name: 'Docker', level: 80, icon: '🐳' },
      { name: 'AWS', level: 75, icon: '☁️' },
      { name: 'Vercel', level: 90, icon: '▲' },
      { name: 'Figma', level: 85, icon: '🎨' },
      { name: 'VS Code', level: 95, icon: '💻' },
      { name: 'Webpack', level: 82, icon: '📦' },
      { name: 'ESLint', level: 88, icon: '🔍' },
    ],
    creative: [
      { name: 'Adobe Creative Suite', level: 85, icon: '🎨' },
      { name: 'Blender', level: 75, icon: '🔶' },
      { name: 'Pro Tools', level: 90, icon: '🎵' },
      { name: 'Logic Pro', level: 88, icon: '🎶' },
      { name: 'After Effects', level: 80, icon: '🎬' },
      { name: 'Premiere Pro', level: 85, icon: '🎥' },
      { name: 'Photoshop', level: 88, icon: '🖼️' },
      { name: 'Illustrator', level: 82, icon: '✨' },
    ],
  };

  const categories = [
    { id: 'all', label: 'ALL TECH', icon: <Zap className="w-5 h-5" /> },
    { id: 'frontend', label: 'FRONTEND', icon: <Code className="w-5 h-5" /> },
    { id: 'backend', label: 'BACKEND', icon: <Database className="w-5 h-5" /> },
    { id: 'tools', label: 'TOOLS', icon: <Terminal className="w-5 h-5" /> },
    {
      id: 'creative',
      label: 'CREATIVE',
      icon: <Palette className="w-5 h-5" />,
    },
  ];

  const filteredSkills =
    selectedFilter === 'all'
      ? Object.entries(skills).flatMap(([category, items]) =>
          items.map(item => ({ ...item, category }))
        )
      : skills[selectedFilter as keyof typeof skills] || [];

  return (
    <SpacePageLayout
      title="Tech Arsenal"
      subtitle="Mastering the Tools That Build Tomorrow"
    >
      <div className="max-w-7xl mx-auto">
        {/* Filter Navigation */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          <div className="flex bg-black/50 backdrop-blur-sm rounded-2xl p-2 border border-purple-500/30 min-w-max">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedFilter(category.id)}
                className={`relative px-6 py-4 font-semibold tracking-wider transition-all duration-300 rounded-xl mx-1 ${
                  selectedFilter === category.id
                    ? 'text-white bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg shadow-purple-500/30'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {category.icon}
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Skills Display */}
        {selectedFilter === 'all' ? (
          /* All Skills - Organized by Category */
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {Object.entries(skills).map(([categoryKey, categorySkills]) => (
              <SpaceCard key={categoryKey} gradient="dark">
                <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-3 capitalize glow-text">
                  {categoryKey === 'frontend' && <Code className="w-6 h-6" />}
                  {categoryKey === 'backend' && (
                    <Database className="w-6 h-6" />
                  )}
                  {categoryKey === 'tools' && <Terminal className="w-6 h-6" />}
                  {categoryKey === 'creative' && (
                    <Palette className="w-6 h-6" />
                  )}
                  {categoryKey} Stack
                </h3>

                <div className="space-y-4">
                  {categorySkills.slice(0, 6).map(skill => (
                    <div
                      key={skill.name}
                      className="group relative p-4 bg-black/30 border border-purple-500/20 hover:border-purple-400/50 rounded-lg transition-all duration-500 hover:scale-105 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

                      <div className="relative flex items-center justify-between mb-2">
                        <span className="text-white flex items-center gap-2">
                          <span className="text-lg group-hover:animate-bounce">
                            {skill.icon}
                          </span>
                          {skill.name}
                        </span>
                        <span className="text-purple-300 text-sm font-mono">
                          {skill.level}%
                        </span>
                      </div>

                      <div className="relative w-full bg-black/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-1000`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}

                  {categorySkills.length > 6 && (
                    <button
                      onClick={() => setSelectedFilter(categoryKey)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600/20 to-purple-800/20 text-purple-300 border border-purple-500/30 rounded-lg hover:from-purple-600/30 hover:to-purple-800/30 hover:text-white transition-all duration-300 text-sm"
                    >
                      View All {categorySkills.length} Skills
                    </button>
                  )}
                </div>
              </SpaceCard>
            ))}
          </div>
        ) : (
          /* Filtered Skills - Full Detail View */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-purple-400 mb-2 glow-text">
                {selectedFilter.charAt(0).toUpperCase() +
                  selectedFilter.slice(1)}{' '}
                Mastery
              </h2>
              <p className="text-purple-200">
                {filteredSkills.length} skills in this category
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map(skill => (
                <SpaceCard
                  key={skill.name}
                  className="group transition-all duration-500 hover:scale-105"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/30">
                        <span className="text-2xl">{skill.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {skill.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-mono text-lg">
                          {skill.level}%
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full mx-0.5 transition-all duration-300 ${
                                i < Math.floor(skill.level / 20)
                                  ? 'bg-purple-400'
                                  : 'bg-gray-600'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden mb-4">
                    <div
                      className={`h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-1000`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">
                      {skill.level >= 90
                        ? 'Expert'
                        : skill.level >= 80
                          ? 'Advanced'
                          : skill.level >= 70
                            ? 'Intermediate'
                            : 'Proficient'}
                    </span>
                    <span className="text-purple-400 text-lg">
                      {skill.level >= 90
                        ? '🚀'
                        : skill.level >= 80
                          ? '⭐'
                          : skill.level >= 70
                            ? '💫'
                            : '✨'}
                    </span>
                  </div>
                </SpaceCard>
              ))}
            </div>
          </div>
        )}

        {/* Tech Philosophy Section */}
        <SpaceCard className="mt-16 text-center" gradient="accent">
          <h3 className="text-3xl font-bold text-purple-400 mb-4 flex items-center justify-center gap-3 glow-text">
            <span className="text-4xl">⚡</span>
            Tech Philosophy
          </h3>
          <p className="text-gray-300 mb-6 text-lg max-w-4xl mx-auto leading-relaxed">
            Technology is not just about code—it's about crafting digital
            experiences that inspire, connect, and transform ideas into reality.
            Every framework learned, every tool mastered, and every project
            built contributes to a larger vision of creating meaningful digital
            art.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
              Continuous Learning
            </span>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
              Innovation-Driven
            </span>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
              User-Focused
            </span>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
              Performance-Optimized
            </span>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
              Accessibility-First
            </span>
          </div>
        </SpaceCard>
      </div>
    </SpacePageLayout>
  );
};

export default TechSection;
