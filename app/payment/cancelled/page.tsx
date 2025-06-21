'use client';

import Container from '@/app/components/Container';
import PageHero from '@/app/components/hero/PageHero';
import Button from '@/app/components/Button';
import { XCircle } from '@phosphor-icons/react';

export default function PaymentCancelledPage() {
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title="Payment Cancelled" short />
      <Container styles="min-h-[50vh] h-fit py-10 w-[600px]">
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 text-center">
          <XCircle size={80} className="text-red-500" />
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Payment Cancelled</h1>
            <p className="text-gray-600">Your payment was cancelled. No charges were made to your account.</p>
            <p className="text-gray-500">You can try again or contact support if you need assistance.</p>
          </div>
          <div className="flex gap-4">
            <Button label="Back to Account" onClick={() => (window.location.href = '/account')} small />
            <Button label="Try Again" onClick={() => (window.location.href = '/account')} small />
          </div>
        </div>
      </Container>
    </div>
  );
}
