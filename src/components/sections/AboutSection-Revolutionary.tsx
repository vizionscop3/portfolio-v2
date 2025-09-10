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

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'resume'>('about');

  const downloadResume = () => {
    // Create a downloadable PDF version (placeholder for now)
    const resumeContent = `
DENWARD LEE AULDER
Full-Stack Developer & Creative Technologist

Contact: denward.aulder@vizionscope.com
Portfolio: https://vizionscope.com
Location: Remote / Available Worldwide

PROFESSIONAL SUMMARY
Innovative Full-Stack Developer and Creative Technologist with 5+ years of experience in building immersive web experiences. Expert in React, TypeScript, Three.js, and modern web technologies. Proven track record in audio engineering, UI/UX design, and entrepreneurial ventures. Passionate about creating accessible, cutting-edge digital solutions.

TECHNICAL SKILLS
• Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
• 3D/Graphics: Three.js, WebGL, GLSL Shaders, Framer Motion
• Backend: Node.js, Express, Python, RESTful APIs, GraphQL
• Databases: PostgreSQL, MongoDB, Redis
• Cloud: AWS, Vercel, Docker, CI/CD
• Audio: Web Audio API, Pro Tools, Logic Pro X
• Design: Figma, Adobe Creative Suite, Blender

EXPERIENCE
Senior Full-Stack Developer | VizionScope (2021 - Present)
• Developed immersive 3D web experiences serving 10,000+ users
• Implemented accessibility features improving user experience by 40%
• Led development of creative portfolio platform with 99.9% uptime

Audio Engineer & Producer | Freelance (2019 - Present) 
• Produced 50+ professional audio projects for clients worldwide
• Specialized in podcast production and interactive web audio
• Designed custom audio solutions for web applications

EDUCATION
Bachelor of Science in Computer Science
Minor in Audio Engineering
`;

    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'denward-lee-aulder-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const skills = {
    frontend: [
      { name: 'React', level: 95, icon: '⚛️' },
      { name: 'TypeScript', level: 90, icon: '🔷' },
      { name: 'Three.js', level: 85, icon: '🌐' },
      { name: 'Tailwind CSS', level: 92, icon: '🎨' },
    ],
    backend: [
      { name: 'Node.js', level: 88, icon: '🟢' },
      { name: 'Python', level: 82, icon: '🐍' },
      { name: 'PostgreSQL', level: 85, icon: '🐘' },
      { name: 'GraphQL', level: 80, icon: '📊' },
    ],
    creative: [
      { name: 'Audio Engineering', level: 95, icon: '🎵' },
      { name: 'UI/UX Design', level: 88, icon: '🎨' },
      { name: 'Motion Graphics', level: 82, icon: '🎬' },
      { name: 'Digital Art', level: 78, icon: '🖼️' },
    ],
  };

  return (
    <div className="page-revolutionary revolutionary-gpu-accelerated">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Revolutionary Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary via-cyber-secondary to-cyber-accent rounded-full blur-xl opacity-75 animate-revolutionary"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-cyber-primary via-cyber-secondary to-cyber-accent rounded-full flex items-center justify-center shadow-revolutionary">
                <span className="text-6xl font-cyber font-bold text-black">
                  DL
                </span>
              </div>
            </div>

            <h1 className="text-6xl font-cyber font-bold text-revolutionary mb-4 tracking-wider animate-cyber-pulse">
              DENWARD LEE AULDER
            </h1>
            <div className="text-xl font-mono text-cyber-glow mb-6 tracking-wide">
              &lt;FullStack Developer | Audio Engineer | Creative Technologist
              /&gt;
            </div>

            <div className="flex justify-center items-center gap-6 text-secondary text-sm font-mono">
              <div className="flex items-center gap-2 animate-micro-bounce">
                <MapPin size={16} className="text-cyber-primary" />
                <span>Remote / Worldwide</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-100">
                <Zap size={16} className="text-cyber-secondary" />
                <span>Available for Projects</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-200">
                <Code size={16} className="text-cyber-accent" />
                <span>5+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revolutionary Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="card-revolutionary p-2 inline-flex rounded-2xl">
            <button
              onClick={() => setActiveTab('about')}
              className={`relative px-8 py-4 font-mono font-bold tracking-wider transition-all duration-300 rounded-xl ${
                activeTab === 'about'
                  ? 'text-cyber-primary bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 shadow-cyber-glow animate-cyber-pulse'
                  : 'text-secondary hover:text-white hover:bg-cyber-primary/10 interactive-revolutionary'
              }`}
            >
              {activeTab === 'about' && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 rounded-xl animate-energy-wave"></div>
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-xl">👨‍💻</span>
                ABOUT.ME
              </span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`relative px-8 py-4 font-mono font-bold tracking-wider transition-all duration-300 rounded-xl ${
                activeTab === 'resume'
                  ? 'text-cyber-primary bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 shadow-cyber-glow animate-cyber-pulse'
                  : 'text-secondary hover:text-white hover:bg-cyber-primary/10 interactive-revolutionary'
              }`}
            >
              {activeTab === 'resume' && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 rounded-xl animate-energy-wave"></div>
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-xl">📄</span>
                RESUME.PDF
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'about' && (
          <div className="space-y-12">
            {/* Revolutionary Bio Section */}
            <div className="card-revolutionary">
              <div className="p-8">
                <h2 className="text-3xl font-cyber text-revolutionary mb-6 flex items-center gap-3">
                  <span className="text-4xl animate-micro-scale">🚀</span>
                  DIGITAL.ARCHITECT
                </h2>
                <p className="text-lg text-white leading-relaxed mb-6">
                  Welcome to my digital realm. I'm{' '}
                  <span className="text-cyber-glow font-cyber">
                    Denward Lee Aulder
                  </span>
                  , a multifaceted creative professional operating at the
                  intersection of{' '}
                  <span className="text-cyber-primary">technology</span>,
                  <span className="text-cyber-secondary">
                    {' '}
                    audio engineering
                  </span>
                  , and{' '}
                  <span className="text-cyber-accent">entrepreneurship</span>.
                  With over{' '}
                  <span className="font-cyber text-revolutionary">5 years</span>{' '}
                  of experience in full-stack development and a passion for
                  immersive digital experiences, I transform ideas into reality
                  through code, sound, and creative vision.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="card-revolutionary hover-glow group">
                    <div className="p-6 text-center">
                      <div className="text-4xl mb-4 group-hover:animate-micro-scale transition-transform">
                        💻
                      </div>
                      <h3 className="text-xl font-cyber text-cyber-primary mb-2">
                        TECH.EXPERT
                      </h3>
                      <p className="text-sm text-secondary">
                        Full-Stack Development & 3D Web Experiences
                      </p>
                    </div>
                  </div>

                  <div className="card-revolutionary hover-glow group">
                    <div className="p-6 text-center">
                      <div className="text-4xl mb-4 group-hover:animate-micro-scale transition-transform">
                        🎵
                      </div>
                      <h3 className="text-xl font-cyber text-cyber-secondary mb-2">
                        AUDIO.ENGINEER
                      </h3>
                      <p className="text-sm text-secondary">
                        Professional Audio Production & Web Audio API
                      </p>
                    </div>
                  </div>

                  <div className="card-revolutionary hover-glow group">
                    <div className="p-6 text-center">
                      <div className="text-4xl mb-4 group-hover:animate-micro-scale transition-transform">
                        🚀
                      </div>
                      <h3 className="text-xl font-cyber text-cyber-accent mb-2">
                        ENTREPRENEUR
                      </h3>
                      <p className="text-sm text-secondary">
                        Creative Ventures & Strategic Innovation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revolutionary Skills Matrix */}
            <div className="card-revolutionary">
              <div className="p-8">
                <h2 className="text-3xl font-cyber text-revolutionary mb-8 flex items-center gap-3">
                  <span className="text-4xl animate-revolutionary">⚡</span>
                  SKILLS.MATRIX
                </h2>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Frontend Skills */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-cyber text-cyber-primary mb-4 flex items-center gap-2">
                      <Code size={24} />
                      FRONTEND.STACK
                    </h3>
                    <div className="space-y-3">
                      {skills.frontend.map(skill => (
                        <div
                          key={skill.name}
                          className="card-revolutionary hover-glow group"
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-white flex items-center gap-2">
                                <span className="text-lg group-hover:animate-micro-bounce">
                                  {skill.icon}
                                </span>
                                {skill.name}
                              </span>
                              <span className="text-cyber-glow font-cyber">
                                {skill.level}%
                              </span>
                            </div>
                            <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full animate-data-stream ${
                                  skill.level >= 95
                                    ? 'w-[95%]'
                                    : skill.level >= 90
                                      ? 'w-[90%]'
                                      : skill.level >= 85
                                        ? 'w-[85%]'
                                        : 'w-[80%]'
                                }`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Backend Skills */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-cyber text-cyber-secondary mb-4 flex items-center gap-2">
                      <Globe size={24} />
                      BACKEND.SYSTEMS
                    </h3>
                    <div className="space-y-3">
                      {skills.backend.map(skill => (
                        <div
                          key={skill.name}
                          className="card-revolutionary hover-glow group"
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-white flex items-center gap-2">
                                <span className="text-lg group-hover:animate-micro-bounce">
                                  {skill.icon}
                                </span>
                                {skill.name}
                              </span>
                              <span className="text-cyber-glow font-cyber">
                                {skill.level}%
                              </span>
                            </div>
                            <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r from-cyber-secondary to-cyber-accent rounded-full animate-data-stream ${
                                  skill.level >= 88
                                    ? 'w-[88%]'
                                    : skill.level >= 85
                                      ? 'w-[85%]'
                                      : skill.level >= 82
                                        ? 'w-[82%]'
                                        : 'w-[80%]'
                                }`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Creative Skills */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-cyber text-cyber-accent mb-4 flex items-center gap-2">
                      <Headphones size={24} />
                      CREATIVE.ARTS
                    </h3>
                    <div className="space-y-3">
                      {skills.creative.map(skill => (
                        <div
                          key={skill.name}
                          className="card-revolutionary hover-glow group"
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-white flex items-center gap-2">
                                <span className="text-lg group-hover:animate-micro-bounce">
                                  {skill.icon}
                                </span>
                                {skill.name}
                              </span>
                              <span className="text-cyber-glow font-cyber">
                                {skill.level}%
                              </span>
                            </div>
                            <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r from-cyber-accent to-cyber-primary rounded-full animate-data-stream ${
                                  skill.level >= 95
                                    ? 'w-[95%]'
                                    : skill.level >= 88
                                      ? 'w-[88%]'
                                      : skill.level >= 82
                                        ? 'w-[82%]'
                                        : 'w-[78%]'
                                }`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revolutionary Journey Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card-revolutionary hover-glow">
                <div className="p-8">
                  <h3 className="text-2xl font-cyber text-cyber-primary mb-4 flex items-center gap-3">
                    <span className="text-3xl animate-cyber-pulse">🎯</span>
                    CURRENT.FOCUS
                  </h3>
                  <p className="text-white leading-relaxed mb-4">
                    Currently exploring the frontiers of{' '}
                    <span className="text-cyber-glow">
                      immersive web experiences
                    </span>
                    , AI-assisted creative workflows, and sustainable technology
                    solutions. Always open to collaborating on projects that
                    push creative and technical boundaries.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="pill-revolutionary">
                      AI/ML Integration
                    </span>
                    <span className="pill-revolutionary">
                      WebXR Development
                    </span>
                    <span className="pill-revolutionary">Sustainable Tech</span>
                  </div>
                </div>
              </div>

              <div className="card-revolutionary hover-glow">
                <div className="p-8">
                  <h3 className="text-2xl font-cyber text-cyber-secondary mb-4 flex items-center gap-3">
                    <span className="text-3xl animate-cyber-pulse">🤝</span>
                    LET'S.CONNECT
                  </h3>
                  <p className="text-white leading-relaxed mb-6">
                    Ready to collaborate on something extraordinary? Whether
                    you're looking for technical expertise, creative direction,
                    or strategic partnership, I'm always excited to explore new
                    possibilities.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="mailto:denward.aulder@vizionscope.com"
                      className="button-revolutionary button-primary flex items-center gap-2"
                    >
                      <Mail size={16} />
                      EMAIL.ME
                    </a>
                    <a
                      href="https://linkedin.com/in/denward-aulder"
                      className="button-revolutionary button-secondary flex items-center gap-2"
                    >
                      <Linkedin size={16} />
                      LINKEDIN
                    </a>
                    <a
                      href="https://github.com/vizionscope"
                      className="button-revolutionary button-accent flex items-center gap-2"
                    >
                      <Github size={16} />
                      GITHUB
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="space-y-8">
            {/* Revolutionary Resume Header */}
            <div className="card-revolutionary text-center">
              <div className="p-8">
                <h2 className="text-4xl font-cyber text-revolutionary mb-2">
                  DENWARD LEE AULDER
                </h2>
                <h3 className="text-xl text-cyber-glow mb-6">
                  Full-Stack Developer & Creative Technologist
                </h3>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-secondary mb-6">
                  <div className="flex items-center gap-2 pill-revolutionary">
                    <Mail size={16} />
                    denward.aulder@vizionscope.com
                  </div>
                  <div className="flex items-center gap-2 pill-revolutionary">
                    <Globe size={16} />
                    vizionscope.com
                  </div>
                  <div className="flex items-center gap-2 pill-revolutionary">
                    <MapPin size={16} />
                    Remote / Worldwide
                  </div>
                </div>

                <button
                  onClick={downloadResume}
                  className="button-revolutionary button-primary flex items-center gap-2 mx-auto"
                >
                  <Download size={16} />
                  DOWNLOAD.RESUME
                </button>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="card-revolutionary">
              <div className="p-8">
                <h3 className="text-2xl font-cyber text-cyber-primary mb-4 flex items-center gap-3">
                  <span className="text-3xl">💼</span>
                  PROFESSIONAL.SUMMARY
                </h3>
                <p className="text-white leading-relaxed">
                  Innovative Full-Stack Developer and Creative Technologist with
                  5+ years of experience in building immersive web experiences.
                  Expert in React, TypeScript, Three.js, and modern web
                  technologies. Proven track record in audio engineering, UI/UX
                  design, and entrepreneurial ventures. Passionate about
                  creating accessible, cutting-edge digital solutions.
                </p>
              </div>
            </div>

            {/* Experience Section */}
            <div className="card-revolutionary">
              <div className="p-8">
                <h3 className="text-2xl font-cyber text-cyber-secondary mb-6 flex items-center gap-3">
                  <span className="text-3xl">🚀</span>
                  EXPERIENCE.LOG
                </h3>

                <div className="space-y-6">
                  <div className="border-l-2 border-cyber-primary pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-cyber-primary rounded-full animate-revolutionary"></div>
                    <div className="card-revolutionary hover-glow">
                      <div className="p-6">
                        <h4 className="text-xl font-cyber text-white mb-2">
                          Senior Full-Stack Developer
                        </h4>
                        <div className="text-cyber-glow font-mono mb-2">
                          VizionScope | 2021 - Present
                        </div>
                        <ul className="text-secondary space-y-1 list-disc list-inside">
                          <li>
                            Developed immersive 3D web experiences serving
                            10,000+ users
                          </li>
                          <li>
                            Implemented accessibility features improving user
                            experience by 40%
                          </li>
                          <li>
                            Led development of creative portfolio platform with
                            99.9% uptime
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-cyber-secondary pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-cyber-secondary rounded-full animate-revolutionary"></div>
                    <div className="card-revolutionary hover-glow">
                      <div className="p-6">
                        <h4 className="text-xl font-cyber text-white mb-2">
                          Audio Engineer & Producer
                        </h4>
                        <div className="text-cyber-glow font-mono mb-2">
                          Freelance | 2019 - Present
                        </div>
                        <ul className="text-secondary space-y-1 list-disc list-inside">
                          <li>
                            Produced 50+ professional audio projects for clients
                            worldwide
                          </li>
                          <li>
                            Specialized in podcast production and interactive
                            web audio
                          </li>
                          <li>
                            Designed custom audio solutions for web applications
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="card-revolutionary text-center revolutionary-shimmer">
              <div className="p-8">
                <h3 className="text-3xl font-cyber text-revolutionary mb-4 flex items-center justify-center gap-3">
                  <span className="text-4xl animate-cyber-pulse">🤝</span>
                  READY.TO.COLLABORATE?
                </h3>
                <p className="text-white mb-6 text-lg">
                  Let's create something extraordinary together
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <a
                    href="mailto:denward.aulder@vizionscope.com"
                    className="button-revolutionary button-primary flex items-center gap-2"
                  >
                    <Mail size={18} />
                    GET.IN.TOUCH
                  </a>
                  <a
                    href="https://github.com/vizionscope"
                    className="button-revolutionary button-secondary flex items-center gap-2"
                  >
                    <Github size={18} />
                    VIEW.PROJECTS
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
