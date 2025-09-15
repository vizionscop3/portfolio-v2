import { motion } from 'framer-motion';
import {
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
import { fadeIn, textVariant } from '../../utils/motion';
import { CollapsibleSection, ExpandableCard } from '../ui/CollapsibleSection';

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
    { id: 'all', label: 'ALL TRANSMISSIONS', icon: '🌌', color: 'purple-400' },
    { id: 'personal', label: 'PERSONAL LOGS', icon: '�', color: 'purple-300' },
    { id: 'tech', label: 'TECH INSIGHTS', icon: '⚡', color: 'purple-500' },
    {
      id: 'creative',
      label: 'CREATIVE VISIONS',
      icon: '✨',
      color: 'purple-200',
    },
    {
      id: 'inspiration',
      label: 'COSMIC INSPIRATION',
      icon: '🌟',
      color: 'purple-600',
    },
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

  return (
    <section className="relative w-full min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          variants={textVariant(0.1)}
          initial="hidden"
          animate="show"
          className="text-center mb-16"
        >
          <p className="sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider">
            Digital Thoughts
          </p>
          <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
            Blog.
          </h2>
        </motion.div>

        <CollapsibleSection
          title="Digital Thoughts & Insights"
          subtitle={`${vizionPosts.length} posts exploring technology, creativity, and human experience`}
          icon={<Headphones className="w-5 h-5" />}
          variant="minimal"
          defaultOpen={true}
          className="mb-12"
        >
          <div className="flex justify-center items-center gap-6 text-gray-300 text-sm flex-wrap py-4">
            <div className="flex items-center gap-2 group hover:text-purple-300 transition-colors duration-300">
              <Headphones className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <span>Audio Experiences</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-purple-300 transition-colors duration-300">
              <Eye className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <span>Deep Insights</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-purple-300 transition-colors duration-300">
              <Zap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <span>Professional Narration</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="bg-tertiary border border-white/10 p-1 rounded-xl inline-flex">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 mx-1 ${
                  selectedCategory === category.id
                    ? 'bg-[#915EFF] text-white shadow-lg'
                    : 'text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{category.icon}</span>
                  <span className="text-xs font-medium">{category.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Minimalistic Blog Posts */}
        {!selectedPost ? (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <ExpandableCard
                key={post.id}
                title={post.title}
                summary={`${formatDate(post.publishedAt)} • ${post.readingTime} min read • ${post.category}`}
                icon={
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getCategoryIcon(post.category)}
                    </span>
                    {post.featured && (
                      <Star className="w-4 h-4 text-yellow-400" />
                    )}
                    {post.audioUrl && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handlePlayAudio(post.audioUrl!);
                        }}
                        className="p-2 rounded-lg bg-[#915EFF]/20 hover:bg-[#915EFF]/30 transition-colors"
                      >
                        {currentAudio === post.audioUrl && isPlaying ? (
                          <Pause className="w-4 h-4 text-[#915EFF]" />
                        ) : (
                          <Play className="w-4 h-4 text-[#915EFF]" />
                        )}
                      </button>
                    )}
                  </div>
                }
              >
                <div className="space-y-4">
                  {/* Post Excerpt */}
                  <p className="text-secondary leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Post Meta */}
                  <div className="flex items-center justify-between text-xs text-secondary border-t border-white/10 pt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 4).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[#915EFF]/20 text-[#915EFF] rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Read Full Post Button */}
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="w-full px-4 py-2 bg-[#915EFF] hover:bg-[#915EFF]/80 text-white rounded-lg text-sm font-medium transition-colors duration-300"
                  >
                    Read Full Post
                  </button>
                </div>
              </ExpandableCard>
            ))}
          </div>
        ) : (
          /* Selected Post Detail View */
          <div className="space-y-8">
            {/* Back Navigation */}
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-secondary hover:text-white transition-colors duration-300 mb-8"
            >
              ← Back to Posts
            </button>

            {/* Post Content */}
            <article className="green-pink-gradient p-[1px] rounded-[20px] shadow-card">
              <div className="bg-tertiary rounded-[20px] p-8">
                {/* Post Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl">
                      {getCategoryIcon(selectedPost.category)}
                    </span>
                    <span className="text-[#915EFF] text-lg font-semibold uppercase tracking-wider">
                      {selectedPost.category}
                    </span>
                    {selectedPost.featured && (
                      <Star className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>

                  <h1 className="text-white font-black md:text-[40px] sm:text-[30px] xs:text-[25px] text-[20px] mb-4">
                    {selectedPost.title}
                  </h1>

                  <div className="flex items-center justify-center gap-6 text-secondary text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedPost.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{selectedPost.readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span>{selectedPost.likes} likes</span>
                    </div>
                  </div>
                </div>

                {/* Audio Player */}
                {selectedPost.audioUrl && (
                  <div className="bg-tertiary border border-white/10 rounded-[20px] p-6 mb-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            handlePlayAudio(selectedPost.audioUrl!)
                          }
                          className="p-3 rounded-full bg-[#915EFF] hover:bg-[#915EFF]/80 transition-colors"
                        >
                          {currentAudio === selectedPost.audioUrl &&
                          isPlaying ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white" />
                          )}
                        </button>
                        <div>
                          <h3 className="text-white font-semibold">
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
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 text-secondary" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-secondary" />
                          )}
                        </button>
                        <Headphones className="w-5 h-5 text-[#915EFF]" />
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
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-white/10">
                  {selectedPost.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#915EFF]/20 text-[#915EFF] rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Social Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-pink-400 hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">
                        {selectedPost.likes} likes
                      </span>
                    </button>
                    <button className="flex items-center gap-2 text-[#915EFF] hover:text-white transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">
                        {selectedPost.comments} comments
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-secondary text-sm">Share:</span>
                    <button className="px-3 py-1 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20 transition-colors">
                      Twitter
                    </button>
                    <button className="px-3 py-1 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20 transition-colors">
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Audio-First Philosophy */}
        {!selectedPost && (
          <motion.div
            variants={fadeIn('up', 'spring', 0.2, 0.75)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-12"
          >
            <CollapsibleSection
              title="Audio-First Philosophy"
              subtitle="Experience storytelling through multiple senses"
              icon={<span className="text-2xl">🎧</span>}
              variant="card"
              defaultOpen={false}
            >
              <div className="text-center space-y-6">
                <p className="text-secondary text-base leading-relaxed">
                  Every post is designed to be experienced through multiple
                  senses. Audio versions ensure accessibility for all users,
                  while creating intimate connections between creator and
                  audience. This is storytelling for the digital age—where
                  technology serves humanity.
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-[#915EFF]/20 text-[#915EFF] rounded-full text-sm">
                    Accessible Content
                  </span>
                  <span className="px-3 py-1 bg-[#915EFF]/20 text-[#915EFF] rounded-full text-sm">
                    Multi-Modal Experience
                  </span>
                  <span className="px-3 py-1 bg-[#915EFF]/20 text-[#915EFF] rounded-full text-sm">
                    Professional Narration
                  </span>
                  <span className="px-3 py-1 bg-[#915EFF]/20 text-[#915EFF] rounded-full text-sm">
                    Mobile-Optimized
                  </span>
                </div>
              </div>
            </CollapsibleSection>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
