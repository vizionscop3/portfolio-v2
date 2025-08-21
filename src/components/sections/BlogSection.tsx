import React from 'react';

export const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      title: 'Building Immersive 3D Web Experiences',
      excerpt:
        'Exploring the intersection of Three.js and React to create engaging digital experiences...',
      date: '2024-01-15',
      readTime: '8 min read',
      tags: ['Three.js', 'React', 'WebGL'],
    },
    {
      title: 'The Future of Audio in Web Development',
      excerpt:
        'How Web Audio API is revolutionizing the way we think about sound in digital interfaces...',
      date: '2024-01-08',
      readTime: '6 min read',
      tags: ['Web Audio API', 'JavaScript', 'UX'],
    },
    {
      title: 'Cyberpunk Aesthetics in Modern UI Design',
      excerpt:
        'Creating futuristic interfaces that balance style with usability and accessibility...',
      date: '2024-01-01',
      readTime: '5 min read',
      tags: ['UI Design', 'CSS', 'Accessibility'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-mono text-cyan-400 mb-8">Digital Codex</h1>

        <p className="text-lg text-cyan-300 mb-12">
          Thoughts, insights, and explorations from the intersection of
          technology, creativity, and innovation.
        </p>

        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              className="border border-magenta-500 p-6 bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-mono text-cyan-300 mb-2 hover:text-cyan-400 cursor-pointer transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-mono bg-magenta-900 text-magenta-300 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button className="text-cyan-400 font-mono text-sm hover:text-cyan-300 transition-colors">
                READ MORE →
              </button>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="border border-cyan-400 text-cyan-400 font-mono px-6 py-3 hover:bg-cyan-400 hover:text-black transition-all duration-300">
            VIEW ALL POSTS
          </button>
        </div>
      </div>
    </div>
  );
};
