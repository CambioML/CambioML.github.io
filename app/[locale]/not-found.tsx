'use client';

import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button';

export default function Custom404() {
  const router = useRouter();
  return (
    <div className="h-[80vh] w-full flex flex-col gap-5 items-center justify-center">
      <h1 className="text-6xl font-semibold">404</h1>
      <h2 className="text-3xl text-neutral-500 pb-10">{`Oops! This page doesn't exist`}</h2>
      <div className="w-[250px]">
        <Button label="Go to Homepage" onClick={() => router.push('/')} small />
      </div>
    </div>
  );
}
