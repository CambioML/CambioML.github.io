import { type Locale } from '@/lib/translations';
import { locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  // Validate locale (middleware should have already redirected invalid ones)
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return <>{children}</>;
}
