import { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getAllBlogPosts, getBlogPostBySlug, type BlogPost } from '@/lib/markdown';
import { getTranslation, type Locale } from '@/lib/translations';
import { MarkdownComponents } from '@/app/components/dark/markdown-components';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // In Next.js 15, params is a Promise that needs to be awaited
  const resolvedParams = await params;
  const locale: Locale = 'en'; // Default to English for now
  const post = await getBlogPostBySlug(resolvedParams.slug, locale);

  return {
    title: `${post.title} | Energent.ai Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [post.image] : [],
      siteName: 'Energent.ai',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: `https://www.energent.ai/blog/${post.slug}`,
    },
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const locale: Locale = 'en'; // Default to English for now

  try {
    const posts = await getAllBlogPosts(locale);
    return posts.map((post: BlogPost) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.warn(`Error generating static params for blog posts:`, error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const locale: Locale = 'en'; // Default to English for now
  const post = await getBlogPostBySlug(slug, locale);
  const t = getTranslation(locale);

  return (
    // Full-width background container with dark theme
    <div className="theme-dark min-h-screen bg-background">
      {/* Centered content container */}
      <div className="max-w-screen-lg mx-auto">
        {/* Blog Header */}
        <div className="pb-4 px-4 md:px-8 lg:px-40 pt-40">
          <div className="container mx-auto">
            <div className="mb-4">
              <Link
                href="/blog"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to {t.nav.blog}
              </Link>
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
              <span className="bg-gradient">{post.title}</span>
            </h1>
            <div className="text-gray-400 mb-6">{post.date}</div>

            {/* Display image if available */}
            {post.image && (
              <div className="mb-8">
                <img src={post.image} alt={post.title} className="w-full h-auto rounded-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <div className="py-8 px-4 md:px-8 lg:px-40">
          <div className="container mx-auto">
            <article className="max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
                {post.content}
              </ReactMarkdown>
            </article>
          </div>
        </div>

        {/* Navigation back to blog */}
        <div className="py-8 px-4 md:px-8 lg:px-40 border-t border-gray-700">
          <div className="container mx-auto text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to {t.nav.blog}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
