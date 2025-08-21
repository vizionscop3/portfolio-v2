import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-mono text-cyan-400 mb-8">About Me</h1>

        <div className="space-y-6 text-lg">
          <p className="text-cyan-300">
            Welcome to my digital realm. I'm Denward Lee Aulder, a multifaceted
            creative professional operating at the intersection of technology,
            audio engineering, and entrepreneurship. With over 5 years of
            experience in full-stack development and a passion for immersive
            digital experiences, I transform ideas into reality through code,
            sound, and creative vision.
          </p>

          <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-6 rounded-lg border border-cyan-400/30">
            <h2 className="text-xl font-mono text-cyan-400 mb-3">
              Professional Journey
            </h2>
            <p className="text-gray-300">
              My journey began with a fascination for how technology could
              amplify human creativity. From building my first website to
              engineering complex 3D web applications, I've consistently pushed
              the boundaries of what's possible in digital spaces. My unique
              blend of technical expertise and creative intuition allows me to
              craft experiences that are both functionally robust and
              emotionally resonant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-mono text-magenta-400 mb-4">
                Tech Enthusiast
              </h2>
              <p className="text-gray-300">
                Passionate about cutting-edge technologies including React,
                TypeScript, Three.js, and WebGL. I specialize in creating
                immersive 3D web experiences, progressive web applications, and
                scalable full-stack solutions. My technical stack spans modern
                JavaScript frameworks, cloud infrastructure, and emerging web
                technologies.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-cyan-400/20 text-cyan-300 text-sm rounded">
                  React
                </span>
                <span className="px-2 py-1 bg-cyan-400/20 text-cyan-300 text-sm rounded">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-cyan-400/20 text-cyan-300 text-sm rounded">
                  Three.js
                </span>
                <span className="px-2 py-1 bg-cyan-400/20 text-cyan-300 text-sm rounded">
                  Node.js
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-mono text-magenta-400 mb-4">
                Audio Engineer
              </h2>
              <p className="text-gray-300">
                With professional experience in sound design, mixing, and audio
                production, I create immersive soundscapes that enhance digital
                experiences. From podcast production to interactive web audio, I
                understand how sound shapes emotion and drives engagement in
                digital spaces.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-magenta-400/20 text-magenta-300 text-sm rounded">
                  Pro Tools
                </span>
                <span className="px-2 py-1 bg-magenta-400/20 text-magenta-300 text-sm rounded">
                  Logic Pro
                </span>
                <span className="px-2 py-1 bg-magenta-400/20 text-magenta-300 text-sm rounded">
                  Web Audio API
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-mono text-magenta-400 mb-4">
                Creative Visionary
              </h2>
              <p className="text-gray-300">
                My creative philosophy centers on the intersection of technology
                and artistry. Whether designing user interfaces, curating
                fashion collections, or crafting digital experiences, I approach
                each project with an eye for aesthetic innovation and emotional
                resonance. I believe great design tells a story.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-400/20 text-purple-300 text-sm rounded">
                  UI/UX Design
                </span>
                <span className="px-2 py-1 bg-purple-400/20 text-purple-300 text-sm rounded">
                  Fashion Curation
                </span>
                <span className="px-2 py-1 bg-purple-400/20 text-purple-300 text-sm rounded">
                  Digital Art
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-mono text-magenta-400 mb-4">
                Entrepreneur
              </h2>
              <p className="text-gray-300">
                As an entrepreneur, I've launched multiple ventures that bridge
                technology and creativity. From developing SaaS platforms to
                launching creative brands, I understand the full spectrum of
                bringing ideas from concept to market. My approach combines
                strategic thinking with hands-on execution.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-orange-400/20 text-orange-300 text-sm rounded">
                  Product Strategy
                </span>
                <span className="px-2 py-1 bg-orange-400/20 text-orange-300 text-sm rounded">
                  Brand Development
                </span>
                <span className="px-2 py-1 bg-orange-400/20 text-orange-300 text-sm rounded">
                  Market Analysis
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="p-6 border border-cyan-400 bg-black bg-opacity-50">
            <h3 className="text-xl font-mono text-cyan-400 mb-4">
              Current Focus
            </h3>
            <p className="text-gray-300">
              Currently exploring the frontiers of immersive web experiences,
              AI-assisted creative workflows, and sustainable technology
              solutions. Always open to collaborating on projects that push
              creative and technical boundaries.
            </p>
          </div>

          <div className="p-6 border border-magenta-400 bg-black bg-opacity-50">
            <h3 className="text-xl font-mono text-magenta-400 mb-4">
              Let's Connect
            </h3>
            <p className="text-gray-300 mb-4">
              Ready to collaborate on something extraordinary? Whether you're
              looking for technical expertise, creative direction, or strategic
              partnership, I'm always excited to explore new possibilities.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:denward@example.com"
                className="px-4 py-2 bg-cyan-400/20 text-cyan-300 rounded hover:bg-cyan-400/30 transition-colors"
              >
                Email
              </a>
              <a
                href="https://linkedin.com/in/denward-aulder"
                className="px-4 py-2 bg-magenta-400/20 text-magenta-300 rounded hover:bg-magenta-400/30 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/denward-aulder"
                className="px-4 py-2 bg-purple-400/20 text-purple-300 rounded hover:bg-purple-400/30 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
