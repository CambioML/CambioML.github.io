import { getAllBlogPosts } from '@/lib/markdown';
import type { BlogPost } from '@/lib/markdown';
import type { Locale } from '@/lib/translations';
import { getTranslation } from '@/lib/translations';
import { BlogCard } from '@/app/components/blog/BlogCard';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  // Get locale from URL params, following Next.js 15 pattern
  const { locale: paramLocale } = await params;
  const locale: Locale = (paramLocale as Locale) || 'en';
  const t = getTranslation(locale);
  const blogPosts = getAllBlogPosts(locale);

  return (
    // Full-width background container
    <div className="min-h-screen bg-background">
      {/* Centered content container */}
      <div className="max-w-screen-lg mx-auto">
        {/* Blog Header */}
        <div className="pt-16 pb-0 px-4 md:px-8 lg:px-40">
          <div className="container mx-auto">
            <h1 className="text-5xl !md:text-8xl !font-semibold mt-20 text-center !leading-relaxed">
              <span className="bg-gradient">{t.nav.blog}</span>
            </h1>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="py-16 px-4 md:px-8 lg:px-40">
          <div className="container">
            {blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {blogPosts.map((post: BlogPost, index: number) => (
                  <BlogCard key={post.slug} post={post} index={index} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">{t.blog.noPosts}</p>
                <p className="text-gray-500 text-sm mt-2">{t.blog.checkBackSoon}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
