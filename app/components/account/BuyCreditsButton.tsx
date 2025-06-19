'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../Button';
import { CreditCard } from '@phosphor-icons/react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Test user ID for development purposes
const TEST_USER_ID = '88b1f350-f001-7025-9432-734180d10e48';

interface BuyCreditsButtonProps {
  className?: string;
}

export default function BuyCreditsButton({ className }: BuyCreditsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(1);

  // Use test user ID for testing purposes
  const effectiveUserId = TEST_USER_ID;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setAmount(value);
      setError(null);
    }
  };

  const handleClick = async () => {
    if (amount < 1) {
      setError('Minimum amount is $1');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the Checkout Session on your backend
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/checkout/create/${effectiveUserId}`,
        { qty: amount } // matches Subscription model in FastAPI
      );

      // Backend can return either {checkout_url} or {sessionId, url}. Tolerate both.
      const { checkout_url, url, sessionId } = resp.data;

      // Redirect the user
      if (checkout_url || url) {
        window.location.href = checkout_url || url; // simplest
      } else if (sessionId) {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to load');
        }
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw error;
      } else {
        throw new Error('No checkout URL or sessionId in response');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Could not start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <label htmlFor="amount" className="text-sm font-medium text-gray-700 min-w-[60px]">
          Amount:
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">$</span>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={handleAmountChange}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <span className="text-sm text-gray-500">= {amount * 10} credits</span>
        </div>
      </div>
      
      <Button
        onClick={handleClick}
        disabled={loading || amount < 1}
        label={loading ? 'Redirecting...' : `Purchase ${amount * 10} credits ($${amount})`}
        labelIcon={CreditCard}
        small
      />
      
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      {/* Show test user ID for development */}
      <p className="text-xs text-gray-500">Test User ID: {effectiveUserId}</p>
    </div>
  );
} 