import useUserProfile from '@/app/hooks/useUserProfile';
import { useState } from 'react';
import Button from '../Button';
import toast from 'react-hot-toast';

const PortalButton = () => {
  const { profile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!profile) {
      toast.error('Please sign in to manage your subscription');
      return;
    }

    const userId = profile.sub;
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRIPE_SESSION_URL}payment/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          returnUrl: process.env.NEXT_PUBLIC_STRIPE_PORTAL_RETURN_URL || 'https://www.cambioml.com/account',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      window.location.href = result.url;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return <Button label="Manage Subscription" small disabled={isLoading} onClick={handleSubmit} />;
};

export default PortalButton;
