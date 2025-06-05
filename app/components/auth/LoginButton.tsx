'use client';

import { SignIn } from '@phosphor-icons/react/dist/ssr';
import Button from '../Button';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from '@/lib/use-translation';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const { t } = useTranslation();

  const handleAuth0Login = () => {
    // Save current URL to localStorage before redirecting to Auth0
    localStorage.setItem('auth_redirect_url', window.location.pathname + window.location.search);

    // posthog.capture('playground_login', { route: '/playground' });
    loginWithRedirect({
      authorizationParams: {
        scope: 'openid profile email',
      },
      appState: { returnTo: '/login/callback' }, // Send user back to the current page
    });
  };
  return (
    <div className="w-full max-w-[500px]">
      <Button label={t.auth.login} small onClick={handleAuth0Login} labelIcon={SignIn} />
    </div>
  );
};

export default LoginButton;
