import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export default function BookDemoRedirectPage() {
  const redirectPath = `/${defaultLocale}/book-demo`;
  redirect(redirectPath);
}
