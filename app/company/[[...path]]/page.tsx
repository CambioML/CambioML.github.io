import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

interface CompanyRedirectPageProps {
  params: {
    path?: string[];
  };
}

// Generate static params for known company paths
export function generateStaticParams() {
  return [
    // Base /company path
    { path: [] },
    // Known company sub-paths
    { path: ['about-us'] },
    // Add other company paths as needed
  ];
}

export default function CompanyRedirectPage({ params }: CompanyRedirectPageProps) {
  const { path } = params;

  // Build the redirect path with default locale
  const companyPath = path ? `/company/${path.join('/')}` : '/company';
  const redirectPath = `/${defaultLocale}${companyPath}`;

  redirect(redirectPath);
}
