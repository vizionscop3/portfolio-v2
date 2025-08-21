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
            audio engineering, and entrepreneurship.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-mono text-magenta-400 mb-4">
                Tech Enthusiast
              </h2>
              <p className="text-gray-300">
                Passionate about cutting-edge technologies, from React and
                TypeScript to 3D web experiences. I build digital solutions that
                push boundaries and create memorable user experiences.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-mono text-magenta-400 mb-4">
                Audio Engineer
              </h2>
              <p className="text-gray-300">
                With a deep understanding of sound design and audio production,
                I craft immersive audio experiences that complement visual
                storytelling.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-mono text-magenta-400 mb-4">
                Creative Visionary
              </h2>
              <p className="text-gray-300">
                I believe in the power of creative expression across multiple
                mediums, from fashion to digital art, always seeking new ways to
                inspire and connect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-mono text-magenta-400 mb-4">
                Entrepreneur
              </h2>
              <p className="text-gray-300">
                Building innovative solutions and brands that make a difference,
                combining technical expertise with creative vision to bring
                ideas to life.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 border border-cyan-400 bg-black bg-opacity-50">
          <h3 className="text-xl font-mono text-cyan-400 mb-4">Get In Touch</h3>
          <p className="text-gray-300">
            Ready to collaborate on something amazing? Let's connect and create
            something extraordinary together.
          </p>
        </div>
      </div>
    </div>
  );
};
