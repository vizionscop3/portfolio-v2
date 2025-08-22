/**
 * SEO Head Component
 * 
 * Manages document head meta tags, Open Graph tags, structured data,
 * and other SEO-related elements. Can be used declaratively in components.
 */

import { useEffect } from 'react';
import { useSEO } from '../../hooks/useSEO';
import { SEOData } from '../../utils/seoManager';
import { SectionId } from '../../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  section?: SectionId;
  noIndex?: boolean;
  customMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  structuredData?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type,
  section,
  noIndex,
  customMeta = [],
  structuredData
}) => {
  const { updateSEO } = useSEO({ updateOnMount: false });

  useEffect(() => {
    const customData: Partial<SEOData> = {};
    
    if (title) customData.title = title;
    if (description) customData.description = description;
    if (keywords) customData.keywords = keywords;
    if (image) customData.image = image;
    if (url) customData.url = url;
    if (type) customData.type = type;

    updateSEO(section, customData);

    // Add custom meta tags
    customMeta.forEach(meta => {
      let element: HTMLMetaElement | null = null;
      
      if (meta.name) {
        element = document.querySelector(`meta[name="${meta.name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.name = meta.name;
          document.head.appendChild(element);
        }
      } else if (meta.property) {
        element = document.querySelector(`meta[property="${meta.property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', meta.property);
          document.head.appendChild(element);
        }
      }
      
      if (element) {
        element.content = meta.content;
      }
    });

    // Add structured data if provided
    if (structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"][data-custom]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-custom', 'true');
      script.textContent = JSON.stringify(structuredData, null, 2);
      document.head.appendChild(script);
    }

    // Handle noIndex
    if (noIndex) {
      let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.content = 'noindex, nofollow';
    }
  }, [title, description, keywords, image, url, type, section, noIndex, customMeta, structuredData, updateSEO]);

  // This component doesn't render anything
  return null;
};

/**
 * Prebuilt SEO components for common pages
 */

export const AboutSEO: React.FC<{ customData?: Partial<SEOData> }> = ({ customData = {} }) => (
  <SEOHead
    section="about"
    title={customData.title}
    description={customData.description}
    keywords={customData.keywords}
    image={customData.image}
    type="profile"
    structuredData={{
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'John Developer',
      jobTitle: 'Full Stack Developer',
      description: 'Full Stack Developer specializing in React, TypeScript, and creative web experiences',
      url: 'https://johndeveloper.dev/about',
      sameAs: [
        'https://github.com/johndeveloper',
        'https://linkedin.com/in/johndeveloper',
        'https://twitter.com/johndeveloper'
      ],
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Three.js',
        'Full Stack Development', 'Web Development', 'Creative Coding'
      ]
    }}
  />
);

export const TechSEO: React.FC<{ customData?: Partial<SEOData> }> = ({ customData = {} }) => (
  <SEOHead
    section="tech"
    title={customData.title}
    description={customData.description}
    keywords={customData.keywords}
    image={customData.image}
    type="website"
  />
);

export const BlogSEO: React.FC<{ customData?: Partial<SEOData> }> = ({ customData = {} }) => (
  <SEOHead
    section="blog"
    title={customData.title}
    description={customData.description}
    keywords={customData.keywords}
    image={customData.image}
    type="website"
  />
);

export const FashionSEO: React.FC<{ customData?: Partial<SEOData> }> = ({ customData = {} }) => (
  <SEOHead
    section="fashion"
    title={customData.title}
    description={customData.description}
    keywords={customData.keywords}
    image={customData.image}
    type="website"
  />
);

export const MerchSEO: React.FC<{ customData?: Partial<SEOData> }> = ({ customData = {} }) => (
  <SEOHead
    section="merch"
    title={customData.title}
    description={customData.description}
    keywords={customData.keywords}
    image={customData.image}
    type="website"
  />
);

/**
 * Blog post specific SEO component
 */
interface BlogPostSEOProps {
  title: string;
  description: string;
  publishDate: string;
  modifiedDate?: string;
  author?: string;
  image?: string;
  slug: string;
  tags?: string[];
  readTime?: number;
}

export const BlogPostSEO: React.FC<BlogPostSEOProps> = ({
  title,
  description,
  publishDate,
  modifiedDate,
  author = 'John Developer',
  image,
  slug,
  tags = [],
  readTime
}) => {
  const url = `https://johndeveloper.dev/blog/${slug}`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://johndeveloper.dev/about'
    },
    publisher: {
      '@type': 'Organization',
      name: 'John Developer',
      logo: {
        '@type': 'ImageObject',
        url: 'https://johndeveloper.dev/logo.png'
      }
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image.startsWith('http') ? image : `https://johndeveloper.dev${image}`,
        width: 1200,
        height: 630
      }
    }),
    ...(tags.length > 0 && { keywords: tags.join(', ') }),
    ...(readTime && {
      timeRequired: `PT${readTime}M`
    })
  };

  return (
    <SEOHead
      title={`${title} | John Developer Blog`}
      description={description}
      keywords={[...tags, 'web development', 'programming', 'tutorial']}
      image={image}
      url={url}
      type="article"
      structuredData={structuredData}
      customMeta={[
        { property: 'article:published_time', content: publishDate },
        { property: 'article:modified_time', content: modifiedDate || publishDate },
        { property: 'article:author', content: author },
        { property: 'article:section', content: 'Technology' },
        ...tags.map(tag => ({ property: 'article:tag', content: tag }))
      ]}
    />
  );
};

export default SEOHead;