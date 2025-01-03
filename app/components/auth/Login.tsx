import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import toast from 'react-hot-toast';
import { useCallback, useEffect } from 'react';
import { UserCircle } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import { useAuth0 } from '@auth0/auth0-react';
import { usePostHog } from 'posthog-js/react';
import LoginButton from './LoginButton';

const LoginComponent = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();
  const posthog = usePostHog();
  const { loggedIn, setLoggedIn, setClientId, setToken, setUserId } = usePlaygroundStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        getAccessToken();
        setLoggedIn(true);
        setClientId(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '');
        fetchUserProfile();
      } else if (loggedIn) {
        handleLogout();
      }
    }
  }, [isAuthenticated, isLoading, loggedIn]);

  const getAccessToken = useCallback(async () => {
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: 'openid profile email',
        },
      });
      setToken(accessToken);
      setLoggedIn(true);
      setClientId(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '');
    } catch (e) {
      console.log(e);
      toast.error('Failed to get access token');
      handleLogout();
    }
  }, [getAccessTokenSilently, setToken, setLoggedIn, setClientId]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const profile = await response.json();
      setUserId(profile.sub);
      if (profile.email) {
        posthog.identify(profile.email);
      }
    } catch (e) {
      console.log('Failed to fetch user profile', e);
    }
  }, [getAccessTokenSilently, posthog]);

  const handleLogout = () => {
    console.log('logging out');
    setToken('');
    setLoggedIn(false);
    setClientId('');
    setToken('');
    logout();
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      {isLoading ? (
        <PulsingIcon Icon={UserCircle} size={48} />
      ) : (
        <>
          <UserCircle size={80} className="text-neutral-700" />
          <LoginButton />
        </>
      )}
    </div>
  );
};

export default LoginComponent;
