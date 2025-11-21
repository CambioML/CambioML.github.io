import toast from 'react-hot-toast';
import PlaygroundTab from './PlaygroundTab';
import MapContainer from './table/MapContainer';
import ExtractContainer from './ExtractContainer';
import InlineUploadPanel from './InlineUploadPanel';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import ExtractKeyValuePairContainer from './ExtractKeyValuePairContainer';
import { usePostHog } from 'posthog-js/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from '@/lib/use-translation';
import { useCallback, useEffect, useState } from 'react';
import { PlaygroundFile, PlaygroundTabs, getPlaygroundTabLabel } from '@/app/types/PlaygroundTypes';
import PlaygroundInfoBar from './PlaygroundInfoBar';

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
    pendingAction,
    executePendingAction,
    loadingQuota,
  } = usePlaygroundStore();
  const posthog = usePostHog();
  const { t } = useTranslation();

  const handleLogout = useCallback(() => {
    setToken('');
    setLoggedIn(false);
    setClientId('');
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
      toast.error('Failed to get access token');
      handleLogout();
    }
  }, [getAccessTokenSilently, setToken, setLoggedIn, setClientId, handleLogout]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
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
    if (!isLoading && isAuthenticated) {
      getAccessToken();
      setLoggedIn(true);
      setClientId(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '');
      fetchUserProfile();
    }
  }, [fetchUserProfile, getAccessToken, isAuthenticated, isLoading, setClientId, setLoggedIn]);

  useEffect(() => {
    if (loadingQuota) {
      return;
    }
    if (remainingQuota > 0) {
      executePendingAction();
    } else {
      toast.error(t.messages.error.quotaExceeded);
    }
  }, [remainingQuota, loadingQuota, executePendingAction, t.messages.error.quotaExceeded]);

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      setSelectedFile(files[selectedFileIndex]);
    }
  }, [selectedFileIndex, files]);

  return (
    <div className="w-full h-full flex flex-col relative bg-background text-foreground">
      {selectedFileIndex === null ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Analyze with <span className="text-blue-400">AnyParser</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto pt-2">{t.playground.description}</p>
          </div>
          <div className="w-full max-w-3xl">
            <InlineUploadPanel />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-none border-b border-border px-4 py-3">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-background/70 dark:bg-neutral-900/70 px-1 py-1 shadow-sm">
                {Object.values(PlaygroundTabs).map((tabKey) => (
                  <PlaygroundTab key={tabKey} tabKey={tabKey} label={getPlaygroundTabLabel(tabKey, t)} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-4">
            {(selectedFile?.activeTab === PlaygroundTabs.PLAIN_TEXT || selectedFileIndex === null) && (
              <ExtractContainer />
            )}
            {selectedFile?.activeTab === PlaygroundTabs.TABLE && <MapContainer />}
            {selectedFile?.activeTab === PlaygroundTabs.KEY_VALUE_PAIR && <ExtractKeyValuePairContainer />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionContainer;
