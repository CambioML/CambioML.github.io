import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';
import { getAllBlogPosts } from '@/lib/markdown';

interface BlogRedirectPageProps {
  params: {
    slug?: string[];
  };
}

// Generate static params for all blog posts to support static export
export function generateStaticParams() {
  const paths: { slug: string[] }[] = [];

  // Get all blog posts for the default locale to generate paths
  const posts = getAllBlogPosts(defaultLocale);

  // Add the base /blog path
  paths.push({ slug: [] });

  // Add all individual blog post paths
  posts.forEach((post) => {
    paths.push({ slug: [post.slug] });
  });

  return paths;
}

export default function BlogRedirectPage({ params }: BlogRedirectPageProps) {
  const { slug } = params;

  // Build the redirect path with default locale
  const blogPath = slug ? `/blog/${slug.join('/')}` : '/blog';
  const redirectPath = `/${defaultLocale}${blogPath}`;

  redirect(redirectPath);
}
