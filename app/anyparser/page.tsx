import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export default function AnyparserRedirectPage() {
  const redirectPath = `/${defaultLocale}/anyparser`;
  redirect(redirectPath);
}
