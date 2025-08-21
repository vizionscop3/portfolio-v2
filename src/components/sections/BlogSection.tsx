import React from 'react';

export const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      title: 'The Art of Cyberpunk Web Design: Beyond Aesthetics',
      excerpt:
        'Diving deep into the philosophy behind cyberpunk design systems, exploring how neon aesthetics can enhance user experience while maintaining accessibility standards. A comprehensive guide to building interfaces that feel futuristic yet functional.',
      date: '2024-02-15',
      readTime: '12 min read',
      tags: ['Design Systems', 'Cyberpunk', 'Accessibility', 'UI/UX'],
      featured: true,
    },
    {
      title: 'Building Immersive 3D Portfolios with React Three Fiber',
      excerpt:
        'A technical deep-dive into creating interactive 3D experiences on the web. From performance optimization to user interaction patterns, learn how to build engaging 3D portfolios that tell your story in three dimensions.',
      date: '2024-02-08',
      readTime: '15 min read',
      tags: ['Three.js', 'React', 'WebGL', 'Performance'],
    },
    {
      title: 'The Intersection of Audio Engineering and Web Development',
      excerpt:
        'How my background in audio production influences my approach to web development. Exploring the parallels between mixing audio and crafting user experiences, and how Web Audio API opens new creative possibilities.',
      date: '2024-01-28',
      readTime: '10 min read',
      tags: ['Web Audio API', 'Audio Engineering', 'Creative Process'],
    },
    {
      title: 'Entrepreneurship in the Creative Tech Space',
      excerpt:
        'Lessons learned from launching creative technology ventures. From identifying market opportunities to building products that bridge art and technology, sharing insights from my entrepreneurial journey.',
      date: '2024-01-20',
      readTime: '8 min read',
      tags: ['Entrepreneurship', 'Creative Tech', 'Product Strategy'],
    },
    {
      title: 'The Future of Fashion Meets Technology',
      excerpt:
        'Exploring how digital innovation is reshaping the fashion industry. From virtual try-ons to sustainable production methods, examining the convergence of style and technology in the modern era.',
      date: '2024-01-12',
      readTime: '7 min read',
      tags: ['Fashion Tech', 'Innovation', 'Sustainability'],
    },
    {
      title: 'Code as Poetry: The Creative Side of Programming',
      excerpt:
        'Reflecting on the artistic aspects of software development. How clean code, elegant algorithms, and thoughtful architecture can be forms of creative expression that transcend mere functionality.',
      date: '2024-01-05',
      readTime: '6 min read',
      tags: ['Philosophy', 'Clean Code', 'Creativity'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-mono text-cyan-400 mb-8">Digital Codex</h1>

        <p className="text-lg text-cyan-300 mb-8">
          Thoughts, insights, and explorations from the intersection of
          technology, creativity, and innovation.
        </p>

        <div className="mb-12 p-6 border border-cyan-400/50 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
          <h2 className="text-xl font-mono text-cyan-400 mb-3">
            About This Blog
          </h2>
          <p className="text-gray-300">
            Welcome to my digital codex—a space where I share insights from my
            journey as a creative technologist. Here you'll find deep dives into
            web development, reflections on the creative process, and
            explorations of emerging technologies that shape our digital future.
          </p>
        </div>

        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              className={`border p-6 bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 ${
                post.featured
                  ? 'border-cyan-400 bg-gradient-to-r from-cyan-900/10 to-purple-900/10'
                  : 'border-magenta-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-mono text-cyan-300 hover:text-cyan-400 cursor-pointer transition-colors">
                      {post.title}
                    </h2>
                    {post.featured && (
                      <span className="text-xs font-mono bg-cyan-400 text-black px-2 py-1 rounded">
                        FEATURED
                      </span>
                    )}
                  </div>
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
