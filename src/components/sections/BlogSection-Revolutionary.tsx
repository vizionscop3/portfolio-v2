import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Headphones,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Star,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

interface VizionPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  audioUrl?: string;
  publishedAt: string;
  readingTime: number;
  category: 'personal' | 'tech' | 'creative' | 'inspiration';
  tags: string[];
  featured: boolean;
  likes: number;
  comments: number;
}

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<VizionPost | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const audioRef = useRef<HTMLAudioElement>(null);

  const vizionPosts: VizionPost[] = [
    {
      id: '1',
      title: 'The Vision Behind VizionScope',
      excerpt:
        'Exploring the philosophy and creative journey that led to building immersive digital experiences.',
      content: `Welcome to Life of Vizion, where technology meets artistic expression. This is more than just a portfolio - it's a journey through the creative process that defines who I am as a digital artist and developer.

VizionScope was born from a simple belief: that technology should enhance human creativity, not replace it. Every line of code, every 3D model, every user interface element is crafted with intention and purpose.

In this space, I share the stories behind the pixels, the inspiration behind the algorithms, and the human experiences that drive innovation. Whether you're here to listen while working, commuting, or simply exploring new ideas, these audio stories are designed to be accessible to everyone.

This blog serves as a bridge between the technical and the personal, offering insights into the creative process, industry trends, and the future of digital art. Each post is available in both written and audio format, ensuring that visual impairments never limit access to knowledge and inspiration.

Join me on this journey as we explore the intersection of creativity, technology, and human experience. Welcome to Life of Vizion.`,
      audioUrl: '/audio/vision-behind-vizionscope.mp3',
      publishedAt: '2024-09-01',
      readingTime: 4,
      category: 'personal',
      tags: ['philosophy', 'creativity', 'vision'],
      featured: true,
      likes: 127,
      comments: 23,
    },
    {
      id: '2',
      title: 'Building Accessible Digital Experiences',
      excerpt:
        "Why accessibility isn't just a feature - it's fundamental to creating inclusive digital spaces.",
      content: `Accessibility in digital design isn't an afterthought - it's a core principle that guides every decision in the development process. When we build for accessibility, we're not just helping people with disabilities; we're creating better experiences for everyone.

In my work with VizionScope, I've learned that accessibility often leads to innovation. The need to create audio versions of content pushed me to develop better storytelling techniques. The requirement for high contrast modes led to more thoughtful color palettes. The focus on keyboard navigation resulted in more intuitive interfaces.

This post explores practical approaches to accessibility in modern web development, from ARIA labels and semantic HTML to creating alternative content formats. I'll share real examples from projects where accessibility constraints led to breakthrough design solutions.

Audio content, like this post, serves multiple purposes: it provides access for visually impaired users, creates opportunities for multitasking, and offers different learning modalities. The production process involves careful script writing, professional narration, and audio editing to ensure clarity and engagement.

Building inclusive digital experiences requires empathy, technical knowledge, and a commitment to continuous learning. It's about understanding that diverse users bring diverse needs, and our job as creators is to meet them where they are.`,
      audioUrl: '/audio/building-accessible-experiences.mp3',
      publishedAt: '2024-08-28',
      readingTime: 6,
      category: 'tech',
      tags: ['accessibility', 'web-development', 'inclusive-design'],
      featured: true,
      likes: 89,
      comments: 15,
    },
    {
      id: '3',
      title: 'The Art of 3D Web Experiences',
      excerpt:
        'Diving deep into Three.js, WebGL, and the technical artistry behind immersive web applications.',
      content: `Three.js has revolutionized how we think about web experiences, transforming browsers into canvases for 3D art and interactive storytelling. But creating compelling 3D web experiences requires more than technical knowledge - it demands an understanding of spatial design, performance optimization, and user psychology.

In this exploration, I break down the process of creating the 3D elements in my portfolio, from initial concept sketches to final implementation. We'll cover the technical challenges of WebGL optimization, the creative decisions behind lighting and materials, and the user experience considerations that make 3D interfaces intuitive rather than overwhelming.

Performance is crucial in 3D web development. Users expect smooth 60fps experiences regardless of their device capabilities. This requires careful consideration of polygon counts, texture optimization, level-of-detail systems, and progressive loading strategies.

The creative process begins with understanding the story you want to tell. In my portfolio, each 3D scene serves a specific narrative purpose, guiding users through different aspects of my work while maintaining visual coherence and emotional resonance.`,
      audioUrl: '/audio/art-of-3d-web.mp3',
      publishedAt: '2024-08-25',
      readingTime: 8,
      category: 'tech',
      tags: ['three-js', 'webgl', '3d-design', 'performance'],
      featured: false,
      likes: 156,
      comments: 31,
    },
    {
      id: '4',
      title: 'Creative Coding and Generative Art',
      excerpt:
        'Exploring the intersection of programming and visual art through algorithmic creativity.',
      content: `Creative coding opens up new possibilities for artistic expression, where algorithms become brushes and data structures become canvases. This post explores my journey into generative art and how programming can be used as a creative medium.

The beauty of generative art lies in its unpredictability within defined parameters. By creating systems rather than fixed outputs, we can discover visual possibilities that would never emerge from traditional design processes.

I'll share techniques for creating dynamic visual systems, working with randomness and noise, and building interactive installations that respond to user input or environmental data. We'll explore tools like p5.js, Processing, and custom WebGL shaders.

The philosophical implications are fascinating: what does it mean for a computer to be creative? How do we maintain artistic intent when embracing algorithmic generation? These questions drive the exploration of computational creativity.`,
      audioUrl: '/audio/creative-coding.mp3',
      publishedAt: '2024-08-20',
      readingTime: 5,
      category: 'creative',
      tags: ['creative-coding', 'generative-art', 'algorithms'],
      featured: false,
      likes: 203,
      comments: 42,
    },
  ];

  const categories = [
    { id: 'all', label: 'ALL.POSTS', icon: '📝', color: 'cyber-primary' },
    { id: 'personal', label: 'PERSONAL', icon: '💭', color: 'cyber-secondary' },
    { id: 'tech', label: 'TECHNICAL', icon: '⚡', color: 'cyber-accent' },
    { id: 'creative', label: 'CREATIVE', icon: '🎨', color: 'neon-pink' },
    { id: 'inspiration', label: 'INSPIRATION', icon: '✨', color: 'neon-gold' },
  ];

  const filteredPosts =
    selectedCategory === 'all'
      ? vizionPosts
      : vizionPosts.filter(post => post.category === selectedCategory);

  const handlePlayAudio = (audioUrl: string) => {
    if (currentAudio === audioUrl && isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    } else {
      setCurrentAudio(audioUrl);
      setIsPlaying(true);
      // In a real implementation, you would load and play the audio file
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '📝';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'cyber-primary';
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
                <BookOpen className="w-16 h-16 text-black" />
              </div>
            </div>

            <h1 className="text-6xl font-cyber font-bold text-revolutionary mb-4 tracking-wider animate-cyber-pulse">
              LIFE.OF.VIZION
            </h1>
            <div className="text-xl font-mono text-cyber-glow mb-6 tracking-wide">
              &lt;Stories | Insights | Audio Experiences /&gt;
            </div>

            <div className="flex justify-center items-center gap-6 text-secondary text-sm font-mono flex-wrap">
              <div className="flex items-center gap-2 animate-micro-bounce">
                <Headphones className="w-4 h-4 text-cyber-primary" />
                <span>Audio-First Content</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-100">
                <Eye className="w-4 h-4 text-cyber-secondary" />
                <span>Accessible Design</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-200">
                <Zap className="w-4 h-4 text-cyber-accent" />
                <span>{vizionPosts.length} Posts Published</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revolutionary Category Filter */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          <div className="card-revolutionary p-2 inline-flex rounded-2xl min-w-max">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative px-6 py-4 font-mono font-bold tracking-wider transition-all duration-300 rounded-xl mx-1 ${
                  selectedCategory === category.id
                    ? `text-${category.color} bg-gradient-to-r from-${category.color}/20 to-cyber-secondary/20 shadow-cyber-glow animate-cyber-pulse`
                    : 'text-secondary hover:text-white hover:bg-cyber-primary/10 interactive-revolutionary'
                }`}
              >
                {selectedCategory === category.id && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-${category.color}/10 to-cyber-secondary/10 rounded-xl animate-energy-wave`}
                  ></div>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Blog Post Grid */}
        {!selectedPost ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredPosts.map(post => (
              <article
                key={post.id}
                className={`card-revolutionary hover-glow group cursor-pointer ${
                  post.featured ? 'ring-2 ring-cyber-primary/30' : ''
                }`}
                onClick={() => setSelectedPost(post)}
              >
                <div className="p-8">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl animate-micro-bounce`}>
                        {getCategoryIcon(post.category)}
                      </span>
                      <div>
                        <span
                          className={`text-${getCategoryColor(post.category)} font-cyber text-sm uppercase tracking-wider`}
                        >
                          {post.category}
                        </span>
                        {post.featured && (
                          <Star className="inline-block w-4 h-4 text-neon-gold ml-2" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.audioUrl && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePlayAudio(post.audioUrl!);
                          }}
                          className="p-2 rounded-lg bg-cyber-primary/20 hover:bg-cyber-primary/30 transition-colors group-hover:scale-110 transform duration-300"
                        >
                          {currentAudio === post.audioUrl && isPlaying ? (
                            <Pause className="w-4 h-4 text-cyber-primary" />
                          ) : (
                            <Play className="w-4 h-4 text-cyber-primary" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Title */}
                  <h2 className="text-2xl font-cyber text-white mb-4 group-hover:text-cyber-glow transition-colors duration-300">
                    {post.title}
                  </h2>

                  {/* Post Excerpt */}
                  <p className="text-secondary text-base leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Post Meta */}
                  <div className="flex items-center justify-between text-sm text-secondary font-mono">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-neon-pink" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-cyber-secondary" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="pill-revolutionary text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Selected Post Detail View */
          <div className="space-y-8">
            {/* Back Navigation */}
            <button
              onClick={() => setSelectedPost(null)}
              className="button-revolutionary button-secondary flex items-center gap-2"
            >
              ← BACK.TO.POSTS
            </button>

            {/* Post Content */}
            <article className="card-revolutionary">
              <div className="p-8">
                {/* Post Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-4xl">
                      {getCategoryIcon(selectedPost.category)}
                    </span>
                    <span
                      className={`text-${getCategoryColor(selectedPost.category)} font-cyber text-lg uppercase tracking-wider`}
                    >
                      {selectedPost.category}
                    </span>
                    {selectedPost.featured && (
                      <Star className="w-6 h-6 text-neon-gold" />
                    )}
                  </div>

                  <h1 className="text-4xl font-cyber text-revolutionary mb-4">
                    {selectedPost.title}
                  </h1>

                  <div className="flex items-center justify-center gap-6 text-secondary font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedPost.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{selectedPost.readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-neon-pink" />
                      <span>{selectedPost.likes} likes</span>
                    </div>
                  </div>
                </div>

                {/* Audio Player */}
                {selectedPost.audioUrl && (
                  <div className="card-revolutionary mb-8 bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              handlePlayAudio(selectedPost.audioUrl!)
                            }
                            className="p-3 rounded-full bg-cyber-primary hover:bg-cyber-secondary transition-colors"
                          >
                            {currentAudio === selectedPost.audioUrl &&
                            isPlaying ? (
                              <Pause className="w-6 h-6 text-white" />
                            ) : (
                              <Play className="w-6 h-6 text-white" />
                            )}
                          </button>
                          <div>
                            <h3 className="font-cyber text-white">
                              Audio Version
                            </h3>
                            <p className="text-secondary text-sm">
                              Listen while you browse
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleMute}
                            className="p-2 rounded-lg hover:bg-cyber-primary/20 transition-colors"
                          >
                            {isMuted ? (
                              <VolumeX className="w-5 h-5 text-secondary" />
                            ) : (
                              <Volume2 className="w-5 h-5 text-secondary" />
                            )}
                          </button>
                          <Headphones className="w-5 h-5 text-cyber-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Post Content */}
                <div className="prose prose-lg max-w-none">
                  {selectedPost.content
                    .split('\n\n')
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-white leading-relaxed mb-6"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-cyber-primary/30">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="pill-revolutionary">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Social Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-cyber-primary/30">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-neon-pink hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="font-mono">
                        {selectedPost.likes} likes
                      </span>
                    </button>
                    <button className="flex items-center gap-2 text-cyber-secondary hover:text-white transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-mono">
                        {selectedPost.comments} comments
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-mono text-sm">
                      Share:
                    </span>
                    <button className="pill-revolutionary text-xs">
                      Twitter
                    </button>
                    <button className="pill-revolutionary text-xs">
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Revolutionary Blog Philosophy */}
        {!selectedPost && (
          <div className="mt-16 card-revolutionary text-center revolutionary-shimmer">
            <div className="p-8">
              <h3 className="text-3xl font-cyber text-revolutionary mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl animate-revolutionary">🎧</span>
                AUDIO.FIRST.PHILOSOPHY
              </h3>
              <p className="text-white mb-6 text-lg max-w-4xl mx-auto leading-relaxed">
                Every post is designed to be experienced through multiple
                senses. Audio versions ensure accessibility for all users, while
                creating intimate connections between creator and audience. This
                is storytelling for the digital age—where technology serves
                humanity.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="pill-revolutionary">Accessible Content</div>
                <div className="pill-revolutionary">Multi-Modal Experience</div>
                <div className="pill-revolutionary">Professional Narration</div>
                <div className="pill-revolutionary">Mobile-Optimized</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;
