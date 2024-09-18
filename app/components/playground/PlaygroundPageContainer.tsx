'use client';
import PageHero from '../hero/PageHero';
import PlaygroundContainer from './PlaygroundContainer';
import { Auth0Provider } from '@auth0/auth0-react';
import { ProductionProvider } from './ProductionContext';
import UploadModal from '../modals/UploadModal';

interface PlaygroundPageContainerProps {
  production: boolean;
}

const PlaygroundPageContainer = ({ production }: PlaygroundPageContainerProps) => {
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
        <div className="pb-10 w-full h-fit flex flex-col justify-center items-center">
          <UploadModal />
          <PageHero
            title={`${production ? 'AnyParser Sandbox' : '🚧 PreProd Sandbox'}`}
            description={`The first LLM to quickly and accurately extract full content from PDFs*, PPTs, and images**.`}
            short
          />
          <PlaygroundContainer />
        </div>
      </ProductionProvider>
    </Auth0Provider>
  );
};

export default PlaygroundPageContainer;
