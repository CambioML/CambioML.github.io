import fs from 'fs/promises';
import { statSync, existsSync } from 'fs';
import path from 'path';
import { remark } from 'remark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import strip from 'strip-markdown';
import matter from 'gray-matter';
import html from 'remark-html';
import { type Locale } from './translations';

// Define the blog post type that includes markdown content
export interface BlogPost {
  slug: string;
  id: string;
  title: string;
  date: string;
  image?: string;
  keywords?: string;
  content: string;
  excerpt: string;
}

// Define the resource type that includes markdown content
export interface Resource {
  slug: string;
  id: string;
  title: string;
  date: string;
  image?: string;
  keywords?: string;
  content: string;
  excerpt: string;
}

const blogDirectory = path.join(process.cwd(), 'blog');
const resourcesDirectory = path.join(process.cwd(), 'resources');

// Get all blog posts from the markdown files for a specific locale
export async function getAllBlogPosts(locale: Locale = 'en'): Promise<BlogPost[]> {
  const localeDirectory = path.join(blogDirectory, locale);

  // Check if directory exists first
  if (!existsSync(localeDirectory)) {
    // Silent return for missing directories during build
    return [];
  }

  try {
    // Get all markdown files from the locale blog directory
    const fileNames = await fs.readdir(localeDirectory);

    // Filter for markdown files only
    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));

    // If no markdown files found, return empty array silently
    if (markdownFiles.length === 0) {
      return [];
    }

    // Process each file
    const allPostsDataPromises = markdownFiles.map(async (fileName): Promise<BlogPost | null> => {
      // Remove ".md" to get the slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(localeDirectory, fileName);

      try {
        const fileContents = await fs.readFile(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata
        const matterResult = matter(fileContents);

        // Extract title from the first heading if not in frontmatter
        let title = matterResult.data.title;
        if (!title) {
          // Look for the first heading in the content
          const match = matterResult.content.match(/^#\s+(.*)/m);
          if (match) {
            title = match[1];
          } else {
            title = slug; // Fallback to using the slug
          }
        }

        // Get date from frontmatter or fallback to file creation date
        let date = matterResult.data.date;
        if (!date) {
          try {
            const stats = statSync(fullPath);
            date = stats.birthtime.toISOString().split('T')[0];
          } catch {
            // Fallback to current date if stat fails
            date = new Date().toISOString().split('T')[0];
          }
        }

        // Get an excerpt using the cleanMarkdownForExcerpt function
        const cleanedContent = await cleanMarkdownForExcerpt(matterResult.content);
        const excerpt = cleanedContent.slice(0, 200) + '...';

        const image = matterResult.data.image || '';
        const keywords = matterResult.data.keywords || '';

        return {
          slug,
          id: slug,
          title,
          date,
          image,
          keywords,
          content: matterResult.content,
          excerpt,
        } as BlogPost;
      } catch (fileError) {
        console.warn(`Failed to process blog post ${fileName} for locale ${locale}:`, fileError);
        return null;
      }
    });

    // Wait for all promises to resolve and filter out null results
    const allPostsData = await Promise.all(allPostsDataPromises);
    const validPosts = allPostsData.filter((post): post is BlogPost => post !== null);

    // Sort posts by date
    return validPosts.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    // Only log during development, not during build
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Error reading blog posts for locale ${locale}:`, error);
    }
    return [];
  }
}

// Get a single blog post by slug for a specific locale
export async function getBlogPostBySlug(
  slug: string,
  locale: Locale = 'en'
): Promise<BlogPost & { contentHtml: string }> {
  const localeDirectory = path.join(blogDirectory, locale);
  const fullPath = path.join(localeDirectory, `${slug}.md`);
  const fileContents = await fs.readFile(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Extract title and date
  let title = matterResult.data.title;
  if (!title) {
    const match = matterResult.content.match(/^#\s+(.*)/m);
    if (match) {
      title = match[1];
    } else {
      title = slug;
    }
  }

  let date = matterResult.data.date;
  if (!date) {
    const stats = statSync(fullPath); // Keeping this sync for simplicity
    date = stats.birthtime.toISOString().split('T')[0];
  }

  const image = matterResult.data.image || '';
  const keywords = matterResult.data.keywords || '';

  // Use remark to convert markdown into HTML
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Extract excerpt
  const cleanedContent = await cleanMarkdownForExcerpt(matterResult.content);
  const excerpt = cleanedContent.slice(0, 250) + '...';

  return {
    slug,
    id: slug,
    title,
    date,
    image,
    keywords,
    content: matterResult.content,
    contentHtml,
    excerpt,
  };
}

// Helper function to clean markdown formatting for excerpt using remark plugins
async function cleanMarkdownForExcerpt(content: string): Promise<string> {
  // Remove the headings (title) from the content
  const contentWithoutTitle = content.replace(/^#+\s+.*$/m, '');

  const result = await unified().use(remarkParse).use(strip).use(remarkStringify).process(contentWithoutTitle);

  return String(result)
    .replace(/\n+/g, ' ') // Replace multiple newlines with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

// Get all resources from the markdown files for a specific locale
export async function getAllResources(locale: Locale = 'en'): Promise<Resource[]> {
  const localeDirectory = path.join(resourcesDirectory, locale);

  // Check if directory exists first
  if (!existsSync(localeDirectory)) {
    // Silent return for missing directories during build
    return [];
  }

  try {
    // Get all markdown files from the locale resources directory
    const fileNames = await fs.readdir(localeDirectory);

    // Filter for markdown files only
    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));

    // If no markdown files found, return empty array silently
    if (markdownFiles.length === 0) {
      return [];
    }

    // Process each file
    const allResourcesDataPromises = markdownFiles.map(async (fileName): Promise<Resource | null> => {
      // Remove ".md" to get the slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(localeDirectory, fileName);

      try {
        const fileContents = await fs.readFile(fullPath, 'utf8');

        // Use gray-matter to parse the resource metadata
        const matterResult = matter(fileContents);

        // Extract title from the first heading if not in frontmatter
        let title = matterResult.data.title;
        if (!title) {
          // Look for the first heading in the content
          const match = matterResult.content.match(/^#\s+(.*)/m);
          if (match) {
            title = match[1];
          } else {
            title = slug; // Fallback to using the slug
          }
        }

        // Get date from frontmatter or fallback to file creation date
        let date = matterResult.data.date;
        if (!date) {
          try {
            const stats = statSync(fullPath);
            date = stats.birthtime.toISOString().split('T')[0];
          } catch {
            // Fallback to current date if stat fails
            date = new Date().toISOString().split('T')[0];
          }
        }

        // Get an excerpt using the cleanMarkdownForExcerpt function
        const cleanedContent = await cleanMarkdownForExcerpt(matterResult.content);
        const excerpt = cleanedContent.slice(0, 200) + '...';

        const image = matterResult.data.image || '';
        const keywords = matterResult.data.keywords || '';

        return {
          slug,
          id: slug,
          title,
          date,
          image,
          keywords,
          content: matterResult.content,
          excerpt,
        } as Resource;
      } catch (fileError) {
        console.warn(`Failed to process resource ${fileName} for locale ${locale}:`, fileError);
        return null;
      }
    });

    // Wait for all promises to resolve and filter out null results
    const allResourcesData = await Promise.all(allResourcesDataPromises);
    const validResources = allResourcesData.filter((resource): resource is Resource => resource !== null);

    // Sort resources by date
    return validResources.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    // Only log during development, not during build
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Error reading resources for locale ${locale}:`, error);
    }
    return [];
  }
}

// Get a single resource by slug for a specific locale
export async function getResourceBySlug(
  slug: string,
  locale: Locale = 'en'
): Promise<Resource & { contentHtml: string }> {
  const localeDirectory = path.join(resourcesDirectory, locale);
  const fullPath = path.join(localeDirectory, `${slug}.md`);
  const fileContents = await fs.readFile(fullPath, 'utf8');

  // Use gray-matter to parse the resource metadata section
  const matterResult = matter(fileContents);

  // Extract title and date
  let title = matterResult.data.title;
  if (!title) {
    const match = matterResult.content.match(/^#\s+(.*)/m);
    if (match) {
      title = match[1];
    } else {
      title = slug;
    }
  }

  let date = matterResult.data.date;
  if (!date) {
    const stats = statSync(fullPath); // Keeping this sync for simplicity
    date = stats.birthtime.toISOString().split('T')[0];
  }

  const image = matterResult.data.image || '';
  const keywords = matterResult.data.keywords || '';

  // Use remark to convert markdown into HTML
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Extract excerpt
  const cleanedContent = await cleanMarkdownForExcerpt(matterResult.content);
  const excerpt = cleanedContent.slice(0, 250) + '...';

  return {
    slug,
    id: slug,
    title,
    date,
    image,
    keywords,
    content: matterResult.content,
    contentHtml,
    excerpt,
  };
}
