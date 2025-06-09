import toast from 'react-hot-toast';
import PlaygroundTab from './PlaygroundTab';
import UploadButton from './UploadButton';
import MapContainer from './table/MapContainer';
import ExtractContainer from './ExtractContainer';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import ExtractKeyValuePairContainer from './ExtractKeyValuePairContainer';
import { usePostHog } from 'posthog-js/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from '@/lib/use-translation';
import { useCallback, useEffect, useState } from 'react';
import { PlaygroundFile, PlaygroundTabs, getPlaygroundTabLabel } from '@/app/types/PlaygroundTypes';
import useTheme from '@/app/hooks/useTheme';
import { cn } from '@/lib/cn';

const ActionContainer = () => {
  const { selectedFileIndex, files } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const { isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();
  const {
    remainingQuota,
    loggedIn,
    setLoggedIn,
    setClientId,
    setToken,
    setUserId,
    executePendingAction,
    loadingQuota,
  } = usePlaygroundStore();
  const posthog = usePostHog();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = useCallback(() => {
    console.log('logging out');
    setToken('');
    setLoggedIn(false);
    setClientId('');
    setToken('');
    logout();
  }, [logout, setClientId, setLoggedIn, setToken]);

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
  }, [getAccessTokenSilently, setToken, setLoggedIn, setClientId, handleLogout]);

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
  }, [getAccessTokenSilently, posthog, setUserId]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        getAccessToken();
        setLoggedIn(true);
        setClientId(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '');
        fetchUserProfile();
      }
    }
  }, [fetchUserProfile, getAccessToken, isAuthenticated, isLoading, loggedIn, setClientId, setLoggedIn]);

  // Execute pending action when user logs in
  useEffect(() => {
    if (loadingQuota) {
      return;
    }
    if (remainingQuota > 0) {
      executePendingAction();
    } else {
      toast.error(t.messages.error.quotaExceeded);
    }
  }, [remainingQuota, loadingQuota, executePendingAction]);

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      setSelectedFile(files[selectedFileIndex]);
    }
  }, [selectedFileIndex, files]);

  return (
    <div className="w-full h-full grid grid-rows-[50px_1fr] rounded-lg">
      <div className={`w-full grid grid-cols-3`}>
        {Object.values(PlaygroundTabs).map((tabKey) => (
          <PlaygroundTab key={tabKey} tabKey={tabKey} label={getPlaygroundTabLabel(tabKey, t)} />
        ))}
      </div>
      {selectedFileIndex === null ? (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="text-xl font-semibold text-neutral-500">{t.playground.files.pleaseUploadFile}</div>
          <div className="w-[300px]">
            <UploadButton small />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            isDark ? 'h-[400px]' : 'h-[73vh]',
            'border-solid border border-t-0 border-neutral-200 rounded-b-xl p-4 pt-0 box-border'
          )}
        >
          {(selectedFile?.activeTab === PlaygroundTabs.PLAIN_TEXT || selectedFileIndex === null) && (
            <ExtractContainer />
          )}
          {selectedFile?.activeTab === PlaygroundTabs.TABLE && <MapContainer />}
          {selectedFile?.activeTab === PlaygroundTabs.KEY_VALUE_PAIR && <ExtractKeyValuePairContainer />}
        </div>
      )}
    </div>
  );
};

export default ActionContainer;
