'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PlaygroundPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/anyparser');
  }, [router]);

  return null;
};

export default PlaygroundPage;
