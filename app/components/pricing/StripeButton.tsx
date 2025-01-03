import { useState } from 'react';
import LoginButton from '../auth/LoginButton';
import PortalButton from './PortalButton';

export enum Period {
  MONTHLY = 'month',
  ANNUAL = 'year',
}

interface StripeButtonProps {
  priceLookupKey: string;
  loggedIn: boolean;
  userId: string;
  subscriptionId: string;
  period: Period;
  authLoading: boolean;
}

const StripeButton = ({ priceLookupKey, userId, loggedIn, subscriptionId, period, authLoading }: StripeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget); // Collect form data
    const lookupKey = formData.get('lookup_key'); // Get the lookup_key from the form
    const domainUrl =
      process.env.NEXT_PUBLIC_STRIPE_RETURN_URL ||
      'https://www.cambioml.com/products-fdce3eb9-aa2b-4abf-8842-4bde6dc987c4';

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRIPE_SESSION_URL}/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, lookupKey, domainUrl }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      // Redirect the user to the Stripe Checkout page
      window.location.href = result.url;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <>
      {!loggedIn ? (
        <>
          {authLoading ? <div className="w-full p-4 rounded-lg bg-neutral-100 animate-pulse"></div> : <LoginButton />}
        </>
      ) : (
        priceLookupKey &&
        (subscriptionId ? (
          <PortalButton />
        ) : (
          <form id="stripe-form" onSubmit={handleSubmit} className="w-full flex items-center justify-center">
            <input type="hidden" name="lookup_key" value={priceLookupKey} />
            <button
              type="submit"
              className={`text-md min-w-[200px] text-white ${period === Period.MONTHLY ? 'bg-sky-800 hover:bg-sky-200' : 'bg-cambio-gray hover:bg-neutral-200'} hover:text-cambio-gray px-4 py-2 rounded-lg cursor-pointer ${
                isLoading ? 'opacity-40' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : period === Period.MONTHLY ? 'Subscribe Monthly' : 'Subscribe Annually'}
            </button>
          </form>
        ))
      )}
    </>
  );
};
export default StripeButton;
