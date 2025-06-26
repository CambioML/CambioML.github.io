import Link from 'next/link';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { locales } from '@/lib/i18n';
import { getTranslation, type Locale } from '@/lib/translations';
import { MarkdownComponents } from '@/app/components/dark/markdown-components';
import { getAllBlogPosts, getBlogPostBySlug, type BlogPost } from '@/lib/markdown';

const PlaygroundWithProvider = dynamic(() => import('@/app/components/playground/PlaygroundWithProvider'), {
  ssr: false,
});

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const locale: Locale = (params.locale as Locale) || 'en';
  const post = await getBlogPostBySlug(params.slug, locale);

  return {
    title: `${post.title} | CambioML Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    metadataBase: new URL('https://www.cambioml.com'),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [post.image] : [],
      siteName: 'CambioML',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: `https://www.cambioml.com/${locale}/blog/${post.slug}`,
    },
  };
}

// Generate static paths for all blog posts and locales
export function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    try {
      const posts = getAllBlogPosts(locale as Locale);
      const localePaths = posts.map((post: BlogPost) => ({
        locale: locale,
        slug: post.slug,
      }));
      paths.push(...localePaths);
    } catch (error) {
      console.warn(`Error generating static params for blog posts in locale ${locale}:`, error);
    }
  }

  return paths;
}

export default async function BlogPostPage({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale: paramLocale } = params;
  const locale: Locale = (paramLocale as Locale) || 'en';
  const post = await getBlogPostBySlug(slug, locale);
  const t = getTranslation(locale);

  return (
    // Full-width background container with responsive theme
    <div className="min-h-screen bg-background">
      {/* Centered content container */}
      <div className="max-w-screen-lg mx-auto">
        {/* Blog Header */}
        <div className="pb-4 px-4 md:px-8 lg:px-40 pt-40">
          <div className="container mx-auto">
            <div className="mb-4">
              <Link
                href={`/${locale}/blog`}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
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
                {t.blog.backTo} {t.nav.blog}
              </Link>
            </div>

            <h1 className="text-4xl md:text-6xl font-medium leading-tight mb-6 text-gray-900 dark:text-white">
              <span className="text-gray-900 dark:bg-gradient">{post.title}</span>
            </h1>
            <div className="text-gray-600 dark:text-gray-400 mb-6">{post.date}</div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="pb-8 px-4 md:px-8 lg:px-40">
          <div className="container mx-auto">
            <article className="max-w-none text-gray-900 dark:text-gray-100">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
                {post.content}
              </ReactMarkdown>
            </article>
          </div>
        </div>

        {/* Playground Component - placed before back to blog link */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <PlaygroundWithProvider initialValue={true} />
        </div>

        {/* Navigation back to blog */}
        <div className="py-8 px-4 md:px-8 lg:px-40 border-t border-gray-300 dark:border-gray-700">
          <div className="container mx-auto text-center">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
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
              {t.blog.backTo} {t.nav.blog}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
