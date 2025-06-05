'use client';

import AccountPageContainer from '@/app/components/account/AccountPageContainer';
import { Auth0Provider } from '@auth0/auth0-react';
import { ProductionProvider } from '@/app/components/playground/ProductionContext';

const AccountPage = () => {
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/login/callback`;
  return (
    <div>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
        authorizationParams={{
          redirect_uri: redirectUri,
          audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
          scope: 'read:current_user update:current_user_metadata',
        }}
      >
        <ProductionProvider initialValue={false}>
          <AccountPageContainer />
        </ProductionProvider>
      </Auth0Provider>
    </div>
  );
};

export default AccountPage;
