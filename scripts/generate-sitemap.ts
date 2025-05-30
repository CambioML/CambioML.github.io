#!/usr/bin/env bun

import fs from 'fs';
import path from 'path';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// Configuration
const BLOG_DIR = path.join(process.cwd(), 'blog/en');
const RESOURCES_DIR = path.join(process.cwd(), 'resources/en');
const SITEMAP_PATH = path.join(process.cwd(), 'public/sitemap.xml');
const BASE_URL = 'https://www.energent.ai';

// Helper function to get current date in ISO format
const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Initialize sitemap structure
let sitemap: SitemapData = {
  urlset: {
    '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    '@_xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
    url: [],
  },
};

// Check if sitemap exists and read it
if (fs.existsSync(SITEMAP_PATH)) {
  console.log('Reading existing sitemap...');
  const existingSitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf-8');

  // Parse the existing sitemap
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  try {
    sitemap = parser.parse(existingSitemapXml);
  } catch (error) {
    console.error('Error parsing sitemap XML:', (error as Error).message);
    console.log('Creating new sitemap...');
  }
} else {
  console.log('Creating new sitemap...');
}

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

type SitemapData = {
  urlset: {
    '@_xmlns'?: string;
    '@_xmlns:xhtml'?: string;
    url: SitemapUrl[] | SitemapUrl;
  };
};

// Ensure sitemap has the correct structure
if (!sitemap.urlset) {
  sitemap.urlset = {
    '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    '@_xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
    url: [],
  };
}

if (!sitemap.urlset.url) {
  sitemap.urlset.url = [];
}

// Convert to array if it's a single object
if (!Array.isArray(sitemap.urlset.url)) {
  sitemap.urlset.url = [sitemap.urlset.url];
}

// Get existing URLs
const existingUrls = new Set(sitemap.urlset.url.map((entry) => entry.loc));

// Make sure basic URLs are included with proper SEO metadata
const essentialUrls = [
  {
    url: `${BASE_URL}/`,
    priority: '1.0',
    changefreq: 'weekly',
    lastmod: getCurrentDate(),
  },
  {
    url: `${BASE_URL}/blog`,
    priority: '0.9',
    changefreq: 'daily',
    lastmod: getCurrentDate(),
  },
  {
    url: `${BASE_URL}/resources`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: getCurrentDate(),
  },
  {
    url: `${BASE_URL}/pricing`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: getCurrentDate(),
  },
  {
    url: `${BASE_URL}/company`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: getCurrentDate(),
  },
  {
    url: `${BASE_URL}/hr`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: getCurrentDate(),
  },
  {
    url: `${BASE_URL}/data-science`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: getCurrentDate(),
  },
  {
    url: `${BASE_URL}/og`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: getCurrentDate(),
  },
  {
    url: `${BASE_URL}/terms-and-conditions`,
    priority: '0.3',
    changefreq: 'yearly',
    lastmod: getCurrentDate(),
  },
  {
    url: `${BASE_URL}/privacy-policy`,
    priority: '0.3',
    changefreq: 'yearly',
    lastmod: getCurrentDate(),
  },
  {
    url: 'https://app.energent.ai/',
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: getCurrentDate(),
  },
];

for (const { url, priority, changefreq, lastmod } of essentialUrls) {
  if (!existingUrls.has(url)) {
    sitemap.urlset.url.push({
      loc: url,
      priority,
      changefreq,
      lastmod,
    });
    existingUrls.add(url);
  }
}

// Get all blog post files
console.log('Scanning blog directory...');
const blogFiles = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

console.log(`Found ${blogFiles.length} blog posts`);

// Add blog post URLs to sitemap with metadata
for (const file of blogFiles) {
  const slug = file.replace(/\.md$/, '');
  const blogUrl = `${BASE_URL}/blog/${slug}`;

  if (!existingUrls.has(blogUrl)) {
    console.log(`Adding ${blogUrl} to sitemap`);

    // Get file modification date for lastmod
    const filePath = path.join(BLOG_DIR, file);
    const stats = fs.statSync(filePath);
    const lastmod = stats.mtime.toISOString().split('T')[0];

    sitemap.urlset.url.push({
      loc: blogUrl,
      lastmod,
      changefreq: 'monthly',
      priority: '0.7',
    });
    existingUrls.add(blogUrl);
  }
}

// Get all resource files
console.log('Scanning resources directory...');
const resourceFiles = fs.readdirSync(RESOURCES_DIR).filter((file) => file.endsWith('.md'));

console.log(`Found ${resourceFiles.length} resources`);

// Add resource URLs to sitemap with metadata
for (const file of resourceFiles) {
  const slug = file.replace(/\.md$/, '');
  const resourceUrl = `${BASE_URL}/resources/${slug}`;

  if (!existingUrls.has(resourceUrl)) {
    console.log(`Adding ${resourceUrl} to sitemap`);

    // Get file modification date for lastmod
    const filePath = path.join(RESOURCES_DIR, file);
    const stats = fs.statSync(filePath);
    const lastmod = stats.mtime.toISOString().split('T')[0];

    sitemap.urlset.url.push({
      loc: resourceUrl,
      lastmod,
      changefreq: 'monthly',
      priority: '0.6',
    });
    existingUrls.add(resourceUrl);
  }
}

// Build the XML
const builder = new XMLBuilder({
  attributeNamePrefix: '@_',
  ignoreAttributes: false,
  format: true,
  indentBy: '  ',
});

const newSitemapXml = builder.build(sitemap);

// Write the updated sitemap
console.log('Writing updated sitemap...');
fs.writeFileSync(SITEMAP_PATH, newSitemapXml, 'utf-8');

console.log('Sitemap generation complete!');
console.log(`Total URLs in sitemap: ${sitemap.urlset.url.length}`);
