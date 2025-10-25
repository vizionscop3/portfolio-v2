import { Code, Database, Globe, Palette, Terminal, Zap } from 'lucide-react';
import React from 'react';
import { useSectionAccessibility } from '../../shared/hooks/useAccessibility';

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
      { name: 'React', level: 95, icon: '⚛️', color: 'cyber-primary' },
      { name: 'TypeScript', level: 90, icon: '🔷', color: 'cyber-secondary' },
      { name: 'Three.js', level: 85, icon: '🌐', color: 'cyber-accent' },
      { name: 'Next.js', level: 88, icon: '▲', color: 'neon-cyan' },
      { name: 'Tailwind CSS', level: 92, icon: '🎨', color: 'neon-pink' },
      { name: 'Vite', level: 85, icon: '⚡', color: 'neon-green' },
      { name: 'WebGL', level: 80, icon: '🎮', color: 'neon-gold' },
      { name: 'Framer Motion', level: 85, icon: '🎬', color: 'cyber-primary' },
    ],
    backend: [
      { name: 'Node.js', level: 90, icon: '🟢', color: 'neon-green' },
      { name: 'Express', level: 88, icon: '🚀', color: 'cyber-secondary' },
      { name: 'PostgreSQL', level: 85, icon: '🐘', color: 'cyber-accent' },
      { name: 'MongoDB', level: 82, icon: '🍃', color: 'neon-cyan' },
      { name: 'Redis', level: 75, icon: '💎', color: 'neon-pink' },
      { name: 'GraphQL', level: 80, icon: '📊', color: 'cyber-primary' },
      { name: 'REST APIs', level: 92, icon: '🔗', color: 'neon-gold' },
      {
        name: 'Microservices',
        level: 78,
        icon: '🏗️',
        color: 'cyber-secondary',
      },
    ],
    tools: [
      { name: 'Git', level: 95, icon: '📝', color: 'neon-green' },
      { name: 'Docker', level: 80, icon: '🐳', color: 'cyber-secondary' },
      { name: 'AWS', level: 75, icon: '☁️', color: 'cyber-accent' },
      { name: 'Vercel', level: 90, icon: '▲', color: 'cyber-primary' },
      { name: 'Figma', level: 85, icon: '🎨', color: 'neon-pink' },
      { name: 'VS Code', level: 95, icon: '💻', color: 'neon-cyan' },
      { name: 'Webpack', level: 82, icon: '📦', color: 'neon-gold' },
      { name: 'ESLint', level: 88, icon: '🔍', color: 'cyber-secondary' },
    ],
    creative: [
      {
        name: 'Adobe Creative Suite',
        level: 85,
        icon: '🎨',
        color: 'neon-pink',
      },
      { name: 'Blender', level: 75, icon: '🔶', color: 'cyber-accent' },
      { name: 'Pro Tools', level: 90, icon: '🎵', color: 'neon-green' },
      { name: 'Logic Pro', level: 88, icon: '🎶', color: 'cyber-primary' },
      { name: 'After Effects', level: 80, icon: '🎬', color: 'neon-cyan' },
      { name: 'Premiere Pro', level: 85, icon: '🎥', color: 'cyber-secondary' },
      { name: 'Photoshop', level: 88, icon: '🖼️', color: 'neon-gold' },
      { name: 'Illustrator', level: 82, icon: '✨', color: 'cyber-accent' },
    ],
  };

  const categories = [
    { id: 'all', label: 'ALL.TECH', icon: <Zap className="w-5 h-5" /> },
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

  const getSkillWidthClass = (level: number): string => {
    if (level >= 95) return 'w-[95%]';
    if (level >= 90) return 'w-[90%]';
    if (level >= 85) return 'w-[85%]';
    if (level >= 80) return 'w-[80%]';
    if (level >= 75) return 'w-[75%]';
    return 'w-[70%]';
  };

  return (
    <div className="page-revolutionary revolutionary-gpu-accelerated">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Revolutionary Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary via-cyber-secondary to-cyber-accent rounded-full blur-xl opacity-75 animate-revolutionary"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-cyber-primary via-cyber-secondary to-cyber-accent rounded-full flex items-center justify-center shadow-revolutionary">
                <Terminal className="w-16 h-16 text-black" />
              </div>
            </div>

            <h1 className="text-6xl font-cyber font-bold text-revolutionary mb-4 tracking-wider animate-cyber-pulse">
              TECH.ARSENAL
            </h1>
            <div className="text-xl font-mono text-cyber-glow mb-6 tracking-wide">
              &lt;Technologies | Frameworks | Creative Tools /&gt;
            </div>

            <div className="flex justify-center items-center gap-6 text-secondary text-sm font-mono flex-wrap">
              <div className="flex items-center gap-2 animate-micro-bounce">
                <Globe className="w-4 h-4 text-cyber-primary" />
                <span>Full-Stack Mastery</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-100">
                <Zap className="w-4 h-4 text-cyber-secondary" />
                <span>50+ Technologies</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-200">
                <Code className="w-4 h-4 text-cyber-accent" />
                <span>10+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revolutionary Filter Navigation */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          <div className="card-revolutionary p-2 inline-flex rounded-2xl min-w-max">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedFilter(category.id)}
                className={`relative px-6 py-4 font-mono font-bold tracking-wider transition-all duration-300 rounded-xl mx-1 ${
                  selectedFilter === category.id
                    ? 'text-cyber-primary bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 shadow-cyber-glow animate-cyber-pulse'
                    : 'text-secondary hover:text-white hover:bg-cyber-primary/10 interactive-revolutionary'
                }`}
              >
                {selectedFilter === category.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 rounded-xl animate-energy-wave"></div>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {category.icon}
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Revolutionary Skills Display */}
        {selectedFilter === 'all' ? (
          /* All Skills - Organized by Category */
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {Object.entries(skills).map(([categoryKey, categorySkills]) => (
              <div key={categoryKey} className="card-revolutionary hover-glow">
                <div className="p-8">
                  <h3 className="text-2xl font-cyber text-revolutionary mb-6 flex items-center gap-3 capitalize">
                    {categoryKey === 'frontend' && (
                      <Code className="w-6 h-6 text-cyber-primary" />
                    )}
                    {categoryKey === 'backend' && (
                      <Database className="w-6 h-6 text-cyber-secondary" />
                    )}
                    {categoryKey === 'tools' && (
                      <Terminal className="w-6 h-6 text-cyber-accent" />
                    )}
                    {categoryKey === 'creative' && (
                      <Palette className="w-6 h-6 text-neon-pink" />
                    )}
                    {categoryKey.toUpperCase()}.STACK
                  </h3>

                  <div className="space-y-4">
                    {categorySkills.slice(0, 6).map(skill => (
                      <div
                        key={skill.name}
                        className="card-revolutionary hover-glow group p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-white flex items-center gap-2">
                            <span className="text-lg group-hover:animate-micro-bounce">
                              {skill.icon}
                            </span>
                            {skill.name}
                          </span>
                          <span className="text-cyber-glow font-cyber text-sm">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-${skill.color} to-cyber-secondary rounded-full animate-data-stream ${getSkillWidthClass(skill.level)}`}
                          ></div>
                        </div>
                      </div>
                    ))}

                    {categorySkills.length > 6 && (
                      <button
                        onClick={() => setSelectedFilter(categoryKey)}
                        className="w-full button-revolutionary button-secondary text-sm py-2"
                      >
                        VIEW ALL {categorySkills.length} SKILLS
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Filtered Skills - Full Detail View */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-cyber text-revolutionary mb-2">
                {selectedFilter.toUpperCase()}.MASTERY
              </h2>
              <p className="text-secondary font-mono">
                {filteredSkills.length} skills in this category
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map(skill => (
                <div
                  key={skill.name}
                  className="card-revolutionary hover-glow group animate-fade-up"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div
                          className={`absolute inset-0 bg-${skill.color} rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}
                        ></div>
                        <div
                          className={`relative w-12 h-12 bg-gradient-to-br from-${skill.color} to-cyber-primary rounded-full flex items-center justify-center shadow-revolutionary`}
                        >
                          <span className="text-2xl">{skill.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-cyber text-white mb-1">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-${skill.color} font-cyber text-lg`}
                          >
                            {skill.level}%
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full mx-0.5 animate-micro-bounce ${
                                  i < Math.floor(skill.level / 20)
                                    ? `bg-${skill.color}`
                                    : 'bg-tertiary'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-tertiary rounded-full h-3 overflow-hidden mb-4">
                      <div
                        className={`h-full bg-gradient-to-r from-${skill.color} to-cyber-secondary rounded-full animate-data-stream ${getSkillWidthClass(skill.level)}`}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary font-mono">
                        {skill.level >= 90
                          ? 'Expert'
                          : skill.level >= 80
                            ? 'Advanced'
                            : skill.level >= 70
                              ? 'Intermediate'
                              : 'Proficient'}
                      </span>
                      <span className={`text-${skill.color} font-cyber`}>
                        {skill.level >= 90
                          ? '🚀'
                          : skill.level >= 80
                            ? '⭐'
                            : skill.level >= 70
                              ? '💫'
                              : '✨'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revolutionary Tech Philosophy Section */}
        <div className="mt-16 card-revolutionary text-center revolutionary-shimmer">
          <div className="p-8">
            <h3 className="text-3xl font-cyber text-revolutionary mb-4 flex items-center justify-center gap-3">
              <span className="text-4xl animate-revolutionary">⚡</span>
              TECH.PHILOSOPHY
            </h3>
            <p className="text-white mb-6 text-lg max-w-4xl mx-auto leading-relaxed">
              Technology is not just about code—it's about crafting digital
              experiences that inspire, connect, and transform ideas into
              reality. Every framework learned, every tool mastered, and every
              project built contributes to a larger vision of creating
              meaningful digital art.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="pill-revolutionary">Continuous Learning</div>
              <div className="pill-revolutionary">Innovation-Driven</div>
              <div className="pill-revolutionary">User-Focused</div>
              <div className="pill-revolutionary">Performance-Optimized</div>
              <div className="pill-revolutionary">Accessibility-First</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechSection;
