import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export default function PricingRedirectPage() {
  const redirectPath = `/${defaultLocale}/pricing-rt`;
  redirect(redirectPath);
}
