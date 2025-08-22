import { BlogPost } from '../types';

// Sample blog posts data
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Code: Finding Beauty in Programming',
    excerpt:
      'Exploring how programming can be a form of creative expression, blending technical precision with artistic vision.',
    content: `
# The Art of Code: Finding Beauty in Programming

Programming is often seen as a purely technical discipline, but I believe it's one of the most creative forms of expression available to us today. Every line of code is a brushstroke, every function a verse in a digital poem.

## The Creative Process

When I sit down to write code, I'm not just solving problems—I'm crafting experiences. The way variables are named, how functions flow together, the architecture of a system—these are all creative decisions that reflect the programmer's artistic vision.

\`\`\`javascript
// Beautiful code is like poetry
const createMagic = (inspiration, dedication) => {
  return inspiration
    .filter(idea => idea.isViable)
    .map(idea => idea.transform(dedication))
    .reduce((magic, element) => magic.combine(element), new Wonder());
};
\`\`\`

## Finding Inspiration

My inspiration comes from many sources: the rhythm of music, the composition of a photograph, the flow of a well-written story. All of these influence how I approach coding challenges.

The best code doesn't just work—it sings.
    `,
    author: 'Denward Lee Aulder',
    publishedAt: '2024-12-15',
    readingTime: 5,
    category: 'Tech',
    tags: ['programming', 'creativity', 'philosophy'],
    featured: true,
    slug: 'art-of-code',
  },
  {
    id: '2',
    title: 'Building Immersive 3D Experiences with React Three Fiber',
    excerpt:
      'A deep dive into creating engaging 3D web experiences using React Three Fiber and modern web technologies.',
    content: `
# Building Immersive 3D Experiences with React Three Fiber

The web has evolved far beyond static pages. Today, we can create immersive 3D experiences that rival native applications, all running in the browser. React Three Fiber has been a game-changer in this space.

## Why 3D on the Web?

3D interfaces offer unique opportunities for storytelling and user engagement. They can transform a simple portfolio into an interactive experience that visitors remember.

\`\`\`jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]}>
        <meshStandardMaterial color="orange" />
      </Box>
      <OrbitControls />
    </Canvas>
  );
}
\`\`\`

## Performance Considerations

When building 3D experiences, performance is crucial. Here are some key strategies I use:

- Level of Detail (LOD) systems
- Efficient asset loading
- Proper lighting optimization
- Frustum culling

The goal is to create something beautiful that runs smoothly on all devices.
    `,
    author: 'Denward Lee Aulder',
    publishedAt: '2024-12-10',
    readingTime: 8,
    category: 'Tech',
    tags: ['react', '3d', 'web-development', 'three.js'],
    featured: true,
    slug: 'react-three-fiber-guide',
  },
  {
    id: '3',
    title: 'The Intersection of Music and Code',
    excerpt:
      'How my background in audio engineering influences my approach to software development and creative problem-solving.',
    content: `
# The Intersection of Music and Code

As both an audio engineer and a developer, I've discovered fascinating parallels between music production and software development. Both require technical precision, creative vision, and an understanding of how individual elements combine to create something greater.

## Rhythm in Code

Just like music has rhythm, code has its own flow and cadence. Well-structured code has a natural rhythm that makes it easy to read and understand.

## Composition and Architecture

In music, we layer instruments to create rich soundscapes. In code, we layer abstractions to create robust systems. Both require careful attention to how each element supports the whole.

\`\`\`javascript
// Code can have musical qualities
class AudioProcessor {
  constructor() {
    this.reverb = new ReverbEffect();
    this.delay = new DelayEffect();
    this.compressor = new CompressorEffect();
  }
  
  process(signal) {
    return signal
      .through(this.compressor)
      .through(this.delay)
      .through(this.reverb);
  }
}
\`\`\`

The beauty is in the harmony between technical excellence and creative expression.
    `,
    author: 'Denward Lee Aulder',
    publishedAt: '2024-12-05',
    readingTime: 6,
    category: 'Music',
    tags: ['music', 'audio-engineering', 'creativity', 'programming'],
    featured: false,
    slug: 'music-and-code',
  },
  {
    id: '4',
    title: 'Fashion as Self-Expression in Tech',
    excerpt:
      'Breaking down the barriers between technical expertise and personal style in the modern workplace.',
    content: `
# Fashion as Self-Expression in Tech

The tech industry has long been associated with a particular aesthetic—hoodies, jeans, and sneakers. But I believe there's room for more diverse forms of self-expression, including fashion.

## Beyond the Stereotype

Your code quality isn't determined by your clothing choices. Some of the most innovative developers I know express themselves through bold fashion choices that reflect their creativity and attention to detail.

## Personal Branding

Fashion is part of personal branding. It's another way to communicate who you are and what you value. In a field where we're constantly creating and innovating, why not extend that creativity to how we present ourselves?

## Breaking Barriers

By embracing fashion and style, we can help break down stereotypes and make tech more inclusive and welcoming to people from all backgrounds.

Style is just another form of problem-solving—how do you present your best self to the world?
    `,
    author: 'Denward Lee Aulder',
    publishedAt: '2024-11-28',
    readingTime: 4,
    category: 'Fashion',
    tags: ['fashion', 'tech-culture', 'self-expression', 'diversity'],
    featured: false,
    slug: 'fashion-in-tech',
  },
  {
    id: '5',
    title: 'Building a Creative Business in the Digital Age',
    excerpt:
      'Lessons learned from combining technical skills with entrepreneurial vision to create meaningful digital products.',
    content: `
# Building a Creative Business in the Digital Age

Entrepreneurship in the creative tech space requires balancing artistic vision with business acumen. Here's what I've learned from building products that matter.

## Start with Purpose

Every successful creative business starts with a clear purpose. What problem are you solving? What experience are you creating? The technical implementation comes after you understand the why.

## Embrace Constraints

Constraints breed creativity. Limited budgets, tight timelines, and technical limitations often lead to the most innovative solutions.

\`\`\`javascript
// Sometimes the simplest solution is the most elegant
const solve = (problem, constraints) => {
  return problem
    .analyze(constraints)
    .simplify()
    .implement();
};
\`\`\`

## Build Community

The most successful creative businesses build communities, not just products. Focus on connecting with people who share your vision and values.

## Stay Authentic

In a world of endless digital noise, authenticity stands out. Don't try to be everything to everyone—be genuinely yourself, and the right audience will find you.

The intersection of creativity and business is where magic happens.
    `,
    author: 'Denward Lee Aulder',
    publishedAt: '2024-11-20',
    readingTime: 7,
    category: 'Business',
    tags: ['entrepreneurship', 'creativity', 'business', 'digital-products'],
    featured: false,
    slug: 'creative-business-digital-age',
  },
];

// Blog categories
export const blogCategories = [
  { id: 'all', name: 'All Posts', count: blogPosts.length },
  {
    id: 'tech',
    name: 'Tech',
    count: blogPosts.filter(post => post.category === 'Tech').length,
  },
  {
    id: 'music',
    name: 'Music',
    count: blogPosts.filter(post => post.category === 'Music').length,
  },
  {
    id: 'fashion',
    name: 'Fashion',
    count: blogPosts.filter(post => post.category === 'Fashion').length,
  },
  {
    id: 'business',
    name: 'Business',
    count: blogPosts.filter(post => post.category === 'Business').length,
  },
];

// Get all unique tags
export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  blogPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};

// Calculate reading time based on content length
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
