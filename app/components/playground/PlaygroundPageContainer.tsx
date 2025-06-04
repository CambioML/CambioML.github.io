'use client';
import PageHero from '../hero/PageHero';
import UploadModal from '../modals/UploadModal';
import PlaygroundContainer from './PlaygroundContainer';
import { Auth0Provider } from '@auth0/auth0-react';
import { useTranslation } from '@/lib/use-translation';
import { ProductionProvider } from './ProductionContext';

interface PlaygroundPageContainerProps {
  production: boolean;
}

const PlaygroundPageContainer = ({ production }: PlaygroundPageContainerProps) => {
  const { t } = useTranslation();
  const redirectUri = production
    ? process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI
    : process.env.NEXT_PUBLIC_PRE_PROD_AUTH0_REDIRECT_URI;

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
        <div className="relative min-h-screen w-full overflow-hidden bg-gray-50">
          {/* Main content */}
          <div className="relative z-10 py-10 w-full h-fit flex flex-col justify-center items-center">
            <PageHero title={t.playground.title} description={t.playground.description} short />
            <PlaygroundContainer />
            <UploadModal />
          </div>
        </div>
      </ProductionProvider>
    </Auth0Provider>
  );
};

export default PlaygroundPageContainer;
