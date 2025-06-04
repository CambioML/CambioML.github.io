import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

interface SolutionsRedirectPageProps {
  params: Promise<{
    path?: string[];
  }>;
}

// Required for static export - provide all solution paths that need redirects
export function generateStaticParams() {
  return [
    // Base /solutions path
    {},
    // Solution sub-paths
    { path: ['compliance'] },
    { path: ['compliance', 'autorater'] },
    { path: ['finance'] },
    { path: ['research-&-development'] },
  ];
}

export default async function SolutionsRedirectPage({ params }: SolutionsRedirectPageProps) {
  const { path } = await params;

  // Build the redirect path
  const subPath = decodeURIComponent(path ? `/${path.join('/')}` : '');
  redirect(`/${defaultLocale}/solutions${subPath}`);
}
