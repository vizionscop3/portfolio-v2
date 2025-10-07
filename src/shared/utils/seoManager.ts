/**
 * SEO and Meta Tag Management System
 *
 * Provides comprehensive SEO functionality including dynamic meta tags,
 * Open Graph support, structured data, and social sharing optimization.
 */

import { SectionId } from '../types';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  section?: SectionId;
}

export interface OpenGraphData extends SEOData {
  siteName: string;
  locale?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  image?: string;
  author?: {
    '@type': string;
    name: string;
    url?: string;
  };
  skills?: string[];
  workExample?: Array<{
    '@type': string;
    name: string;
    description: string;
    url?: string;
    image?: string;
  }>;
}

// Default SEO configuration
export const DEFAULT_SEO: SEOData = {
  title: 'John Developer - Full Stack Developer & Creative Portfolio',
  description:
    'Immersive 3D portfolio showcasing full-stack development projects, technical blog, fashion photography, and creative merchandise. Experience cutting-edge web development in a cyberpunk virtual environment.',
  keywords: [
    'full stack developer',
    'web development',
    'react',
    'typescript',
    'three.js',
    '3d portfolio',
    'creative developer',
    'frontend',
    'backend',
    'javascript',
    'portfolio',
    'cyberpunk',
    'interactive',
    'immersive',
  ],
  image: '/og-image.jpg',
  type: 'website',
};

// Section-specific SEO configurations
export const SECTION_SEO: Record<SectionId, SEOData> = {
  about: {
    title:
      'About John Developer - Full Stack Developer & Creative Professional',
    description:
      "Learn about John Developer's journey in full-stack development, creative coding, and innovative web experiences. Expertise in React, TypeScript, Node.js, and immersive 3D web applications.",
    keywords: [
      'about john developer',
      'full stack developer bio',
      'web developer background',
      'react expert',
      'typescript developer',
      'creative developer',
      'software engineer',
      'tech professional',
    ],
    image: '/og-about.jpg',
    type: 'profile',
    section: 'about',
  },

  tech: {
    title: 'Technical Projects - Full Stack Development Portfolio',
    description:
      'Explore cutting-edge web development projects featuring React, TypeScript, Three.js, and modern web technologies. Interactive demos, code examples, and technical deep-dives.',
    keywords: [
      'web development projects',
      'react projects',
      'typescript applications',
      'three.js demos',
      'frontend development',
      'backend systems',
      'api development',
      'database design',
      'cloud architecture',
    ],
    image: '/og-tech.jpg',
    type: 'website',
    section: 'tech',
  },

  blog: {
    title: 'Tech Blog - Web Development Insights & Tutorials',
    description:
      'In-depth articles on modern web development, React patterns, TypeScript tips, performance optimization, and emerging web technologies. Practical tutorials and industry insights.',
    keywords: [
      'web development blog',
      'react tutorials',
      'typescript guides',
      'javascript tips',
      'frontend optimization',
      'web performance',
      'coding best practices',
      'tech articles',
    ],
    image: '/og-blog.jpg',
    type: 'website',
    section: 'blog',
  },

  fashion: {
    title: 'Fashion Photography - Creative Visual Portfolio',
    description:
      'Stunning fashion photography portfolio featuring editorial shoots, creative concepts, and artistic visual storytelling. Explore the intersection of technology and creative arts.',
    keywords: [
      'fashion photography',
      'creative photography',
      'editorial shoots',
      'visual arts',
      'creative portfolio',
      'artistic photography',
      'fashion editorial',
      'creative direction',
    ],
    image: '/og-fashion.jpg',
    type: 'website',
    section: 'fashion',
  },

  merch: {
    title: 'Creative Merchandise - Developer & Designer Goods',
    description:
      'Unique merchandise collection featuring developer-themed designs, creative artwork, and tech-inspired products. Premium quality items for the creative tech community.',
    keywords: [
      'developer merchandise',
      'tech t-shirts',
      'programming gifts',
      'creative merchandise',
      'developer gear',
      'tech accessories',
      'coding apparel',
      'geek fashion',
    ],
    image: '/og-merch.jpg',
    type: 'website',
    section: 'merch',
  },

  contact: {
    title: 'Contact Lee Aulder - Schedule a Meeting | VIZIONSCOPE',
    description:
      'Get in touch with Lee Aulder for project collaborations, consultations, or technical discussions. Schedule meetings via Calendly or send a direct message. Available for freelance projects and partnerships.',
    keywords: [
      'contact lee aulder',
      'hire full stack developer',
      'project consultation',
      'calendly booking',
      'freelance developer',
      'web development services',
      'tech consultation',
      'schedule meeting',
      'contact form',
      'project inquiry',
    ],
    image: '/og-contact.jpg',
    type: 'website',
    section: 'contact',
  },
};

// Site configuration
export const SITE_CONFIG = {
  siteName: 'John Developer Portfolio',
  siteUrl: 'https://vizionscope.com',
  locale: 'en_US',
  twitterSite: '@johndeveloper',
  twitterCreator: '@johndeveloper',
  author: {
    name: 'John Developer',
    url: 'https://vizionscope.com',
    email: 'hello@vizionscope.com',
  },
};

/**
 * SEO Manager Class
 */
export class SEOManager {
  private currentSection: SectionId | null = null;

  /**
   * Update document meta tags for a specific section
   */
  updateMetaTags(section?: SectionId): void {
    const seoData = section ? SECTION_SEO[section] : DEFAULT_SEO;
    const fullTitle = section ? seoData.title : DEFAULT_SEO.title;
    const url = section
      ? `${SITE_CONFIG.siteUrl}/${section}`
      : SITE_CONFIG.siteUrl;

    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    this.setMetaTag('description', seoData.description);
    this.setMetaTag('keywords', seoData.keywords.join(', '));
    this.setMetaTag('author', SITE_CONFIG.author.name);
    this.setMetaTag('robots', 'index, follow');
    this.setMetaTag('language', 'english');
    this.setMetaTag('revisit-after', '7 days');

    // Canonical URL
    this.setLinkTag('canonical', url);

    // Update Open Graph tags
    this.updateOpenGraphTags({
      ...seoData,
      siteName: SITE_CONFIG.siteName,
      url,
      locale: SITE_CONFIG.locale,
      twitterSite: SITE_CONFIG.twitterSite,
      twitterCreator: SITE_CONFIG.twitterCreator,
      twitterCard: 'summary_large_image',
    });

    // Update structured data
    this.updateStructuredData(seoData, section);

    this.currentSection = section || null;
  }

  /**
   * Update Open Graph meta tags
   */
  private updateOpenGraphTags(data: OpenGraphData): void {
    // Open Graph tags
    this.setMetaProperty('og:title', data.title);
    this.setMetaProperty('og:description', data.description);
    this.setMetaProperty('og:type', data.type || 'website');
    this.setMetaProperty('og:url', data.url || SITE_CONFIG.siteUrl);
    this.setMetaProperty('og:site_name', data.siteName);
    this.setMetaProperty('og:locale', data.locale || 'en_US');

    if (data.image) {
      const imageUrl = data.image.startsWith('http')
        ? data.image
        : `${SITE_CONFIG.siteUrl}${data.image}`;
      this.setMetaProperty('og:image', imageUrl);
      this.setMetaProperty(
        'og:image:alt',
        `${data.title} - ${SITE_CONFIG.siteName}`
      );
      this.setMetaProperty('og:image:width', '1200');
      this.setMetaProperty('og:image:height', '630');
    }

    // Twitter Card tags
    this.setMetaName('twitter:card', data.twitterCard || 'summary_large_image');
    this.setMetaName('twitter:site', data.twitterSite || '');
    this.setMetaName('twitter:creator', data.twitterCreator || '');
    this.setMetaName('twitter:title', data.title);
    this.setMetaName('twitter:description', data.description);

    if (data.image) {
      const imageUrl = data.image.startsWith('http')
        ? data.image
        : `${SITE_CONFIG.siteUrl}${data.image}`;
      this.setMetaName('twitter:image', imageUrl);
    }
  }

  /**
   * Update structured data (JSON-LD)
   */
  private updateStructuredData(seoData: SEOData, section?: SectionId): void {
    // Remove existing structured data
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': section === 'about' ? 'Person' : 'WebSite',
      name: section === 'about' ? SITE_CONFIG.author.name : seoData.title,
      description: seoData.description,
      url: seoData.url || SITE_CONFIG.siteUrl,
      image: seoData.image
        ? `${SITE_CONFIG.siteUrl}${seoData.image}`
        : undefined,
    };

    // Add person-specific data for about section
    if (section === 'about') {
      (structuredData as any).jobTitle = 'Full Stack Developer';
      (structuredData as any).worksFor = {
        '@type': 'Organization',
        name: 'Freelance Developer',
      };
      structuredData.skills = [
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'Three.js',
        'Full Stack Development',
        'Web Development',
        'Creative Coding',
      ];
    }

    // Add work examples for tech section
    if (section === 'tech') {
      structuredData.workExample = [
        {
          '@type': 'CreativeWork',
          name: '3D Interactive Portfolio',
          description:
            'Immersive 3D portfolio built with React Three Fiber and TypeScript',
          url: `${SITE_CONFIG.siteUrl}/tech`,
        },
        {
          '@type': 'CreativeWork',
          name: 'Performance Monitoring System',
          description:
            'Real-time performance monitoring and optimization system for web applications',
          url: `${SITE_CONFIG.siteUrl}/tech`,
        },
      ];
    }

    // Insert structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }

  /**
   * Set meta tag with name attribute
   */
  private setMetaTag(name: string, content: string): void {
    this.setMetaName(name, content);
  }

  /**
   * Set meta tag with name attribute
   */
  private setMetaName(name: string, content: string): void {
    let meta = document.querySelector(
      `meta[name="${name}"]`
    ) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  /**
   * Set meta tag with property attribute (for Open Graph)
   */
  private setMetaProperty(property: string, content: string): void {
    let meta = document.querySelector(
      `meta[property="${property}"]`
    ) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  /**
   * Set link tag
   */
  private setLinkTag(rel: string, href: string): void {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
  }

  /**
   * Generate social sharing URLs
   */
  generateSharingUrls(section?: SectionId): Record<string, string> {
    const seoData = section ? SECTION_SEO[section] : DEFAULT_SEO;
    const url = section
      ? `${SITE_CONFIG.siteUrl}/${section}`
      : SITE_CONFIG.siteUrl;
    const title = encodeURIComponent(seoData.title);
    const description = encodeURIComponent(seoData.description);

    return {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}&via=${SITE_CONFIG.twitterCreator?.replace('@', '')}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${title}&body=${description}%0A%0A${encodeURIComponent(url)}`,
      copy: url,
    };
  }

  /**
   * Get current section
   */
  getCurrentSection(): SectionId | null {
    return this.currentSection;
  }

  /**
   * Get SEO data for a section
   */
  getSEOData(section?: SectionId): SEOData {
    return section ? SECTION_SEO[section] : DEFAULT_SEO;
  }
}

// Export singleton instance
export const seoManager = new SEOManager();

// Initialize with default SEO
seoManager.updateMetaTags();

export default seoManager;
