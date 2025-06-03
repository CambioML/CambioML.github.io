'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PlaygroundOld() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/anyparser');
  }, [router]);

  return (
    <div className="h-[80vh] w-full flex flex-col gap-5 items-center justify-center">
      <h1 className="text-6xl font-semibold">{`🚛 We've moved!`}</h1>
      <h2 className="text-3xl text-neutral-500 pb-10">{`Redirecting...`}</h2>
    </div>
  );
}
