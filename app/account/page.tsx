import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export default function AccountRedirectPage() {
  const redirectPath = `/${defaultLocale}/account`;
  redirect(redirectPath);
}
