import {
  Code,
  Download,
  Github,
  Globe,
  Headphones,
  Linkedin,
  Mail,
  MapPin,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { SpacePageLayout } from '../layout/SpacePageLayout';
import { SpaceCard } from '../ui/SpaceCard';

interface Skill {
  name: string;
  level: number;
  icon: string;
}

interface Skills {
  frontend: Skill[];
  backend: Skill[];
  creative: Skill[];
}

const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'resume'>('about');

  const skills: Skills = {
    frontend: [
      { name: 'React/TypeScript', level: 95, icon: '⚛️' },
      { name: 'Next.js', level: 90, icon: '🔥' },
      { name: 'Three.js/WebGL', level: 85, icon: '🎮' },
      { name: 'Tailwind CSS', level: 90, icon: '🎨' },
      { name: 'Vue.js', level: 80, icon: '💚' },
    ],
    backend: [
      { name: 'Node.js', level: 88, icon: '🟢' },
      { name: 'Express/Fastify', level: 85, icon: '🚀' },
      { name: 'PostgreSQL', level: 82, icon: '🐘' },
      { name: 'GraphQL', level: 80, icon: '📊' },
      { name: 'MongoDB', level: 85, icon: '🍃' },
    ],
    creative: [
      { name: 'Audio Engineering', level: 95, icon: '🎵' },
      { name: 'Web Audio API', level: 88, icon: '🔊' },
      { name: 'UI/UX Design', level: 82, icon: '🎯' },
      { name: 'Motion Graphics', level: 78, icon: '✨' },
      { name: 'Brand Strategy', level: 85, icon: '🎪' },
    ],
  };

  const downloadResume = () => {
    const resumeData = `
Lee Aulder - Full-Stack Developer
================================

Contact Information:
- Email: contact@vizionscope.com
- GitHub: https://github.com/vizionscop3
- LinkedIn: https://linkedin.com/in/vizionscope
- Location: Remote / Worldwide

Professional Summary:
Passionate Full-Stack Developer with 5+ years of experience creating immersive digital experiences. 
Specialized in React, TypeScript, Three.js, and modern web technologies. Strong background in 
audio engineering and creative technology.

Technical Skills:
- Frontend: React, TypeScript, Next.js, Three.js, Tailwind CSS, Vue.js
- Backend: Node.js, Express, PostgreSQL, GraphQL, MongoDB
- Creative: Audio Engineering, Web Audio API, UI/UX Design, Motion Graphics
- Tools: AWS, Docker, Git, Figma, VS Code

Experience Highlights:
- 5+ years of full-stack development experience
- Led development of immersive 3D web experiences serving 10,000+ users
- Professional audio engineering and web audio development
- Strong focus on accessibility and user experience

Education & Certifications:
- Self-taught developer with continuous learning approach
- Various online certifications in modern web technologies
- Audio engineering background

Projects:
- Interactive 3D portfolio with Three.js
- Real-time audio visualization applications
- Full-stack web applications with modern tech stack
- Open source contributions and community involvement
    `;

    const blob = new Blob([resumeData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Lee_Aulder_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <SpacePageLayout
      title="About Lee"
      subtitle="Navigating the Digital Cosmos Through Code & Creativity"
    >
      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-black/50 backdrop-blur-sm rounded-2xl p-2 border border-purple-500/30">
            <button
              onClick={() => setActiveTab('about')}
              className={`relative px-8 py-4 font-semibold tracking-wider transition-all duration-300 rounded-xl ${
                activeTab === 'about'
                  ? 'text-white bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg shadow-purple-500/30'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-xl">👨‍💻</span>
                About Me
              </span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`relative px-8 py-4 font-semibold tracking-wider transition-all duration-300 rounded-xl ${
                activeTab === 'resume'
                  ? 'text-white bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg shadow-purple-500/30'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-xl">📄</span>
                Resume
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'about' && (
          <div className="space-y-12">
            {/* Personal Info */}
            <SpaceCard className="text-center">
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-purple-500/30">
                  LA
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 glow-text">
                  Lee Aulder
                </h2>
                <p className="text-xl text-purple-200 mb-6">
                  Full-Stack Developer & Creative Technologist
                </p>
                <div className="flex justify-center items-center gap-6 text-purple-300 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-purple-400" />
                    <span>Remote / Worldwide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-purple-400" />
                    <span>Available for Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-purple-400" />
                    <span>5+ Years Experience</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-6">
                <a
                  href="https://github.com/vizionscop3"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub Profile"
                  className="group relative p-3 bg-black border border-purple-500/30 hover:border-purple-400 rounded-lg transition-all duration-500 hover:scale-110 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  <Github
                    size={24}
                    className="text-purple-300 group-hover:text-white relative z-10"
                  />
                </a>
                <a
                  href="https://linkedin.com/in/vizionscope"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn Profile"
                  className="group relative p-3 bg-black border border-purple-500/30 hover:border-purple-400 rounded-lg transition-all duration-500 hover:scale-110 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  <Linkedin
                    size={24}
                    className="text-purple-300 group-hover:text-white relative z-10"
                  />
                </a>
                <a
                  href="mailto:contact@vizionscope.com"
                  title="Email Contact"
                  className="group relative p-3 bg-black border border-purple-500/30 hover:border-purple-400 rounded-lg transition-all duration-500 hover:scale-110 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  <Mail
                    size={24}
                    className="text-purple-300 group-hover:text-white relative z-10"
                  />
                </a>
              </div>
            </SpaceCard>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Object.entries(skills).map(([category, skillList]) => (
                <SpaceCard key={category} gradient="dark">
                  <h3 className="text-2xl font-bold text-purple-400 mb-6 capitalize glow-text">
                    {category} Skills
                  </h3>
                  <div className="space-y-4">
                    {skillList.map((skill: Skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-white">
                            <span className="text-xl">{skill.icon}</span>
                            {skill.name}
                          </span>
                          <span className="text-purple-300 text-sm font-mono">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-1000`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SpaceCard>
              ))}
            </div>

            {/* About Content */}
            <SpaceCard gradient="accent">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-4 glow-text">
                    My Journey
                  </h3>
                  <p className="text-gray-300 mb-4">
                    I'm a passionate Full-Stack Developer with a deep love for
                    creating immersive digital experiences. My journey began
                    with audio engineering, which taught me the importance of
                    precision, creativity, and attention to detail.
                  </p>
                  <p className="text-gray-300 mb-4">
                    Over the past 5+ years, I've specialized in React,
                    TypeScript, and Three.js, building everything from
                    interactive 3D experiences to enterprise applications. I
                    believe in the power of technology to create meaningful
                    connections and solve real-world problems.
                  </p>
                  <p className="text-gray-300">
                    When I'm not coding, you'll find me producing music,
                    exploring new technologies, or working on creative projects
                    that blend art and technology.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-4 glow-text">
                    What I Do
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Code
                        className="text-purple-400 mt-1 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="text-white font-semibold">
                          Full-Stack Development
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Building scalable web applications with modern
                          technologies
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe
                        className="text-purple-400 mt-1 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="text-white font-semibold">
                          3D Web Experiences
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Creating immersive interactive experiences with
                          Three.js
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Headphones
                        className="text-purple-400 mt-1 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="text-white font-semibold">
                          Audio Engineering
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Professional audio production and web audio
                          development
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SpaceCard>
          </div>
        )}

        {activeTab === 'resume' && (
          <SpaceCard className="text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-4 glow-text">
                Download Resume
              </h3>
              <p className="text-gray-300 mb-6">
                Get a comprehensive overview of my experience, skills, and
                achievements.
              </p>
              <button
                onClick={downloadResume}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl hover:from-purple-500 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <Download size={20} className="mr-2" />
                Download Resume
              </button>
            </div>

            <div className="text-left space-y-6">
              <div>
                <h4 className="text-xl font-bold text-purple-400 mb-2">
                  Experience Highlights
                </h4>
                <div className="space-y-3 text-gray-300">
                  <p>• 5+ years of full-stack development experience</p>
                  <p>
                    • Led development of immersive 3D web experiences serving
                    10,000+ users
                  </p>
                  <p>
                    • Specialized in React, TypeScript, Three.js, and modern web
                    technologies
                  </p>
                  <p>
                    • Professional audio engineering and web audio development
                  </p>
                  <p>• Strong focus on accessibility and user experience</p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-purple-400 mb-2">
                  Technical Expertise
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <p className="font-semibold text-purple-300">Frontend</p>
                    <p className="text-sm">
                      React, TypeScript, Three.js, Next.js, Tailwind CSS
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-300">Backend</p>
                    <p className="text-sm">
                      Node.js, Express, PostgreSQL, GraphQL, MongoDB
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-300">
                      Tools & Cloud
                    </p>
                    <p className="text-sm">AWS, Docker, Git, Figma, VS Code</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-300">Creative</p>
                    <p className="text-sm">
                      Audio Engineering, UI/UX Design, Motion Graphics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SpaceCard>
        )}
      </div>
    </SpacePageLayout>
  );
};

export default AboutSection;
