'use client';
import PageHero from '../hero/PageHero';
import UploadModal from '../modals/UploadModal';
import PlaygroundContainer from './PlaygroundContainer';
import { Auth0Provider } from '@auth0/auth0-react';
import { useTranslation } from '@/lib/use-translation';
import { ProductionProvider } from './ProductionContext';
import { cn } from '@/lib/cn';

interface PlaygroundPageContainerProps {
  production: boolean;
}

const PlaygroundPageContainer = ({ production }: PlaygroundPageContainerProps) => {
  const { t } = useTranslation();
  // Always redirect to the callback page for consistent handling
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
      <ProductionProvider initialValue={production}>
        <div className={cn('relative w-full overflow-hidden bg-background text-foreground pt-[100px]')}>
          {/* Main content */}
          <div className="w-full h-[calc(100vh-100px)] flex flex-col border-y border-border">
            <PlaygroundContainer />
            <UploadModal />
          </div>
        </div>
      </ProductionProvider>
    </Auth0Provider>
  );
};

export default PlaygroundPageContainer;
