'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@/app/components/Container';
import PageHero from '@/app/components/hero/PageHero';
import Button from '@/app/components/Button';
import { CheckCircle } from '@phosphor-icons/react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    setSessionId(sessionIdParam);
  }, [searchParams]);

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title="Payment Successful" short />
      <Container styles="min-h-[50vh] h-fit py-10 w-[600px]">
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 text-center">
          <CheckCircle size={80} className="text-green-500" />
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Thank you for your purchase!</h1>
            <p className="text-gray-600">
              Your payment has been processed successfully. Your credits have been added to your account.
            </p>
            {sessionId && <p className="text-sm text-gray-500">Session ID: {sessionId}</p>}
          </div>
          <div className="flex gap-4">
            <Button label="Back to Account" onClick={() => (window.location.href = '/account')} small />
            <Button label="Go to Dashboard" onClick={() => (window.location.href = '/')} small />
          </div>
        </div>
      </Container>
    </div>
  );
}
