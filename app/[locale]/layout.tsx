import { type Locale } from '@/lib/translations';
import { locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Validate that the incoming `locale` parameter is valid
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return <>{children}</>;
}
