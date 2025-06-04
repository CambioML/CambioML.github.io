'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/use-translation';

const PlaygroundPage = () => {
  const { locale } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${locale}/anyparser`);
  }, [locale, router]);

  return null;
};

export default PlaygroundPage;
