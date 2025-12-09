'use client';

import { useEffect } from 'react';
import FilesContainer from './FilesContainer';
import ActionContainer from './ActionContainer';
import PlaygroundInfoBar from './PlaygroundInfoBar';
import PreviewModal from '../modals/PreviewModal';
import CompareModal from '../modals/CompareModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useAmplifyAuth } from '@/app/hooks/useAmplifyAuth';
import { cn } from '@/lib/cn';

const PlaygroundContainer = () => {
  const { fileCollapsed, setLoggedIn, setToken, setUserId, setClientId } = usePlaygroundStore();
  const { tokens, userAttributes, isAuthenticated } = useAmplifyAuth();

  // Initialize auth state on mount
  useEffect(() => {
    if (isAuthenticated && tokens.idToken && userAttributes.email) {
      // Update playground store with current auth state
      setToken(tokens.idToken);
      setLoggedIn(true);
      setUserId(userAttributes.email);
      setClientId(process.env.NEXT_PUBLIC_COGNITO_APPCLIENT_ID || '');
    } else if (!isAuthenticated) {
      // Clear playground store when not authenticated
      setToken('');
      setLoggedIn(false);
      setUserId('');
      setClientId('');
    }
  }, [isAuthenticated, tokens.idToken, userAttributes.email, setToken, setLoggedIn, setUserId, setClientId]);

  return (
    <>
      <PreviewModal />
      <CompareModal />
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Info Bar at the top */}
        <div className="flex-none">
          <PlaygroundInfoBar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div
            className={cn(
              'h-full border-r bg-sidebar transition-all duration-300 ease-in-out flex flex-col',
              fileCollapsed ? 'w-[60px]' : 'w-[280px]'
            )}
          >
            <FilesContainer />
          </div>
          <div className="flex-1 h-full overflow-hidden bg-background relative">
            <ActionContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaygroundContainer;
