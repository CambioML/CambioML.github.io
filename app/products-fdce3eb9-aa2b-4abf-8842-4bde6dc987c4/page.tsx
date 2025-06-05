'use client';

import { useEffect, useState, useRef } from 'react';
import ProductDisplay from '../components/pricing/ProductDisplay';
import SuccessDisplay from '../components/pricing/SuccessDisplay';
import toast from 'react-hot-toast';
import { Auth0Provider } from '@auth0/auth0-react';

const PlaygroundPage = () => {
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const toastShownRef = useRef(false);

  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/login/callback`;
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setSuccess(true);
      setSessionId(query.get('session_id') || '');

      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast.success('Subscription was successful!');
      }
    }

    if (query.get('canceled')) {
      setSuccess(false);

      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast('Subscription canceled.');
      }
    }
  }, []);

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: redirectUri || '',
        audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
        scope: 'read:current_user update:current_user_metadata',
      }}
    >
      {success && sessionId !== '' ? <SuccessDisplay /> : <ProductDisplay />}
    </Auth0Provider>
  );
};

export default PlaygroundPage;
