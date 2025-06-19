'use client';

import { SignIn } from '@phosphor-icons/react/dist/ssr';
import Button from '../Button';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from '@/lib/use-translation';
import { useAmplifyAuth } from '@/app/hooks/useAmplifyAuth';

const LoginButton = () => {
  const { loginWithPopup } = useAuth0();
  const { t } = useTranslation();

  // Example of how to use the new Amplify auth hook
  const { isAuthenticated: isAmplifyAuthenticated, tokens, userAttributes } = useAmplifyAuth();

  const handleAuth0Login = () => {
    // Save current URL to localStorage before redirecting to Auth0
    localStorage.setItem('auth_redirect_url', window.location.pathname + window.location.search);

    // posthog.capture('playground_login', { route: '/playground' });
    loginWithPopup({
      authorizationParams: {
        scope: 'openid profile email',
      },
    });
  };

  // Example: You could easily switch to use Amplify instead
  const handleAmplifyLogin = () => {
    // With Amplify, the Authenticator component handles the login flow
    // You would typically navigate to the login page instead
    const currentPath = window.location.pathname;
    const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : 'en';

    localStorage.setItem('auth_redirect_url', window.location.pathname + window.location.search);
    window.location.href = `/${locale}/login`;
  };

  // For debugging: log Amplify auth state
  if (isAmplifyAuthenticated) {
    console.log('Amplify User Email:', userAttributes.email);
    console.log('Amplify ID Token available:', !!tokens.idToken);
  }

  return (
    <div className="w-full max-w-[500px]">
      <Button label={t.auth.login} small onClick={handleAuth0Login} labelIcon={SignIn} />
      {/* TODO: Switch to Amplify when ready */}
      {/* <Button label={t.auth.login} small onClick={handleAmplifyLogin} labelIcon={SignIn} /> */}
    </div>
  );
};

export default LoginButton;
