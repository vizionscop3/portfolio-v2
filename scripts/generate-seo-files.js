/**
 * Generate SEO Files Script
 *
 * Generates sitemap.xml and robots.txt files for the portfolio website.
 * Run with: node scripts/generate-seo-files.js
 */

/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const fs = require('fs');
const path = require('path');

// Simple sitemap generator (no dependencies on src files)
function generateSitemap() {
  const baseUrl = 'https://johndeveloper.dev';
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: baseUrl, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${baseUrl}/tech`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/blog`, priority: '0.7', changefreq: 'daily' },
    { loc: `${baseUrl}/fashion`, priority: '0.6', changefreq: 'weekly' },
    { loc: `${baseUrl}/merch`, priority: '0.6', changefreq: 'weekly' },
  ];

  const urlElements = urls
    .map(
      url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
}

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Disallow admin or private areas
Disallow: /admin/
Disallow: /api/
Disallow: /.well-known/

# Sitemap location
Sitemap: https://johndeveloper.dev/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
}

// Generate files
const publicDir = path.join(__dirname, '..', 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate sitemap.xml
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const sitemapContent = generateSitemap();
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log('✅ Generated sitemap.xml');

// Generate robots.txt
const robotsPath = path.join(publicDir, 'robots.txt');
const robotsContent = generateRobotsTxt();
fs.writeFileSync(robotsPath, robotsContent, 'utf8');
console.log('✅ Generated robots.txt');

console.log('\n🚀 SEO files generated successfully!');
console.log('Files created:');
console.log(`  - ${sitemapPath}`);
console.log(`  - ${robotsPath}`);
