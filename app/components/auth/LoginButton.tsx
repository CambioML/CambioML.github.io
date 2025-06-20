'use client';

import { SignIn } from '@phosphor-icons/react/dist/ssr';
import Button from '../Button';
import { useTranslation } from '@/lib/use-translation';
import { useAmplifyAuth } from '@/app/hooks/useAmplifyAuth';

const LoginButton = () => {
  const { t } = useTranslation();

  // Use Amplify auth hook for authentication state
  const { isAuthenticated: isAmplifyAuthenticated, tokens, userAttributes } = useAmplifyAuth();

  const handleLogin = () => {
    // Save current URL to localStorage before redirecting
    const redirectUrl = window.location.pathname + window.location.search;
    localStorage.setItem('auth_redirect_url', redirectUrl);
    console.log('Saving redirect URL to localStorage:', redirectUrl);

    // Navigate to Cognito login page with redirect URL as query parameter
    const currentPath = window.location.pathname;
    const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : 'en';

    // Include the redirect URL as a query parameter for OAuth flows
    const loginUrl = `/${locale}/login?redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = loginUrl;
  };

  return (
    <div className="w-full max-w-[500px]">
      <Button label={t.auth.login} small onClick={handleLogin} labelIcon={SignIn} />
    </div>
  );
};

export default LoginButton;
