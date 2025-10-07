/**
 * Sitemap Generator Utility
 *
 * Generates XML sitemaps for search engine optimization.
 * Includes dynamic routes and priority settings.
 */

import { SectionId } from '../types';
import { SITE_CONFIG } from './seoManager';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
  images?: Array<{
    loc: string;
    caption?: string;
    title?: string;
  }>;
}

export interface SitemapOptions {
  baseUrl?: string;
  includeBlogPosts?: boolean;
  includeProjects?: boolean;
  includeImages?: boolean;
}

/**
 * Generate sitemap data
 */
export const generateSitemapData = (
  options: SitemapOptions = {}
): SitemapUrl[] => {
  const {
    baseUrl = SITE_CONFIG.siteUrl,
    includeBlogPosts = true,
    includeProjects = true,
    includeImages = true,
  } = options;

  const urls: SitemapUrl[] = [];
  const currentDate = new Date().toISOString().split('T')[0];

  // Main pages
  const mainPages: Array<{
    path: string;
    changefreq: SitemapUrl['changefreq'];
    priority: number;
    section?: SectionId;
  }> = [
    { path: '', changefreq: 'weekly', priority: 1.0 },
    { path: '/about', changefreq: 'monthly', priority: 0.9, section: 'about' },
    { path: '/tech', changefreq: 'weekly', priority: 0.8, section: 'tech' },
    { path: '/blog', changefreq: 'daily', priority: 0.7, section: 'blog' },
    {
      path: '/fashion',
      changefreq: 'weekly',
      priority: 0.6,
      section: 'fashion',
    },
    { path: '/merch', changefreq: 'weekly', priority: 0.6, section: 'merch' },
  ];

  // Add main pages
  mainPages.forEach(page => {
    const url: SitemapUrl = {
      loc: `${baseUrl}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
    };

    // Add images for sections if enabled
    if (includeImages && page.section) {
      url.images = [
        {
          loc: `${baseUrl}/og-${page.section}.jpg`,
          caption: `${page.section} section preview`,
          title: `John Developer - ${page.section.charAt(0).toUpperCase() + page.section.slice(1)}`,
        },
      ];
    }

    urls.push(url);
  });

  // Add blog posts if enabled
  if (includeBlogPosts) {
    // This would typically fetch from a CMS or blog data source
    const blogPosts = getBlogPostsForSitemap();
    blogPosts.forEach(post => {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.lastmod,
        changefreq: 'monthly',
        priority: 0.5,
        images: post.image
          ? [
              {
                loc: `${baseUrl}${post.image}`,
                caption: post.title,
                title: post.title,
              },
            ]
          : undefined,
      });
    });
  }

  // Add project pages if enabled
  if (includeProjects) {
    const projects = getProjectsForSitemap();
    projects.forEach(project => {
      urls.push({
        loc: `${baseUrl}/tech/${project.slug}`,
        lastmod: project.lastmod,
        changefreq: 'monthly',
        priority: 0.6,
        images: project.image
          ? [
              {
                loc: `${baseUrl}${project.image}`,
                caption: project.title,
                title: project.title,
              },
            ]
          : undefined,
      });
    });
  }

  return urls;
};

/**
 * Generate XML sitemap string
 */
export const generateSitemapXML = (urls: SitemapUrl[]): string => {
  const urlElements = urls
    .map(url => {
      let urlXML = `  <url>\n    <loc>${escapeXML(url.loc)}</loc>\n`;

      if (url.lastmod) {
        urlXML += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }

      if (url.changefreq) {
        urlXML += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }

      if (url.priority !== undefined) {
        urlXML += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
      }

      // Add images if present
      if (url.images && url.images.length > 0) {
        url.images.forEach(image => {
          urlXML += `    <image:image>\n`;
          urlXML += `      <image:loc>${escapeXML(image.loc)}</image:loc>\n`;
          if (image.caption) {
            urlXML += `      <image:caption>${escapeXML(image.caption)}</image:caption>\n`;
          }
          if (image.title) {
            urlXML += `      <image:title>${escapeXML(image.title)}</image:title>\n`;
          }
          urlXML += `    </image:image>\n`;
        });
      }

      urlXML += `  </url>`;
      return urlXML;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = (
  options: { baseUrl?: string; sitemapPath?: string } = {}
): string => {
  const { baseUrl = SITE_CONFIG.siteUrl, sitemapPath = '/sitemap.xml' } =
    options;

  return `User-agent: *
Allow: /

# Disallow admin or private areas (if any)
Disallow: /admin/
Disallow: /api/
Disallow: /.well-known/

# Sitemap location
Sitemap: ${baseUrl}${sitemapPath}

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
};

/**
 * Escape XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Mock function to get blog posts for sitemap
 * In a real application, this would fetch from your CMS or data source
 */
function getBlogPostsForSitemap(): Array<{
  slug: string;
  title: string;
  lastmod: string;
  image?: string;
}> {
  // Mock data - replace with actual blog post fetching
  return [
    {
      slug: 'react-three-fiber-guide',
      title: 'Getting Started with React Three Fiber',
      lastmod: '2025-01-15',
      image: '/blog/react-three-fiber.jpg',
    },
    {
      slug: 'typescript-best-practices',
      title: 'TypeScript Best Practices for Large Applications',
      lastmod: '2025-01-10',
      image: '/blog/typescript-practices.jpg',
    },
    {
      slug: 'web-performance-optimization',
      title: 'Advanced Web Performance Optimization Techniques',
      lastmod: '2025-01-05',
      image: '/blog/performance-optimization.jpg',
    },
  ];
}

/**
 * Mock function to get projects for sitemap
 * In a real application, this would fetch from your projects data
 */
function getProjectsForSitemap(): Array<{
  slug: string;
  title: string;
  lastmod: string;
  image?: string;
}> {
  // Mock data - replace with actual project fetching
  return [
    {
      slug: '3d-portfolio',
      title: '3D Interactive Portfolio',
      lastmod: '2025-01-20',
      image: '/projects/3d-portfolio.jpg',
    },
    {
      slug: 'ecommerce-platform',
      title: 'Full Stack E-Commerce Platform',
      lastmod: '2025-01-15',
      image: '/projects/ecommerce.jpg',
    },
    {
      slug: 'task-management-app',
      title: 'Real-time Task Management App',
      lastmod: '2025-01-10',
      image: '/projects/task-app.jpg',
    },
  ];
}

/**
 * Sitemap generator class for advanced usage
 */
export class SitemapGenerator {
  private options: Required<SitemapOptions>;

  constructor(options: SitemapOptions = {}) {
    this.options = {
      baseUrl: SITE_CONFIG.siteUrl,
      includeBlogPosts: true,
      includeProjects: true,
      includeImages: true,
      ...options,
    };
  }

  /**
   * Generate complete sitemap XML
   */
  generate(): string {
    const urls = generateSitemapData(this.options);
    return generateSitemapXML(urls);
  }

  /**
   * Generate robots.txt
   */
  generateRobots(): string {
    return generateRobotsTxt({ baseUrl: this.options.baseUrl });
  }

  /**
   * Get sitemap URLs for programmatic use
   */
  getUrls(): SitemapUrl[] {
    return generateSitemapData(this.options);
  }

  /**
   * Update options
   */
  updateOptions(newOptions: Partial<SitemapOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }
}

export default {
  generateSitemapData,
  generateSitemapXML,
  generateRobotsTxt,
  SitemapGenerator,
};
