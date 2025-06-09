'use client';

import { ProductionProvider } from './ProductionContext';
import PlaygroundContainerForBlog from './PlaygroundContainerForBlog';
import { Auth0Provider } from '@auth0/auth0-react';

interface PlaygroundWithProviderProps {
  initialValue: boolean;
}

export default function PlaygroundWithProvider({ initialValue }: PlaygroundWithProviderProps) {
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/login/callback`;
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
      <ProductionProvider initialValue={initialValue}>
        <PlaygroundContainerForBlog />
      </ProductionProvider>
    </Auth0Provider>
  );
}
