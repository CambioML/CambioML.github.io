'use client';

import { useEffect } from 'react';
import { useAuth0, Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import PulsingIcon from '@/app/components/PulsingIcon';
import { UserCircle } from '@phosphor-icons/react';

const LoginCallbackContent = () => {
  const { isLoading, isAuthenticated, error } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Get the saved URL from localStorage
        const savedUrl = localStorage.getItem('auth_redirect_url');

        // Clean up localStorage
        localStorage.removeItem('auth_redirect_url');

        // Redirect to saved URL or default fallback
        const redirectTo = savedUrl || '/playground';

        // Add a small delay to ensure auth state is properly set
        setTimeout(() => {
          router.push(redirectTo);
        }, 100);
      } else if (error) {
        console.error('Authentication error:', error);
        // Redirect to login page or home on error
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, error, router]);

  // Show loading state while processing authentication
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-50">
      <PulsingIcon Icon={UserCircle} size={48} />
      <p className="text-neutral-600 text-lg">Completing authentication...</p>
    </div>
  );
};

const LoginCallback = () => {
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/login/callback`;

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
        scope: 'read:current_user update:current_user_metadata',
      }}
    >
      <LoginCallbackContent />
    </Auth0Provider>
  );
};

export default LoginCallback;
