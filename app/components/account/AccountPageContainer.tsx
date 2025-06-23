'use client';
import { Confetti, Icon, Key } from '@phosphor-icons/react';
import Container from '../Container';
import Heading from '../Heading';
import LoginButton from '../auth/LoginButton';
import LogoutButton, { LogoutButtonProps } from '../auth/LogoutButton';
import PageHero from '../hero/PageHero';
import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Button from '../Button';
import useAccountStore from '@/app/hooks/useAccountStore';
import getApiKey, { checkApiKey } from '@/app/actions/account/ApiKey';
import { useEffect, useState } from 'react';
import ApiKeyRow from './ApiKeyRow';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useProductionContext } from '../playground/ProductionContext';
import { useTranslation } from '@/lib/use-translation';
import BuyPagesButton from './BuyCreditsButton';
import { useAmplifyAuth } from '../../hooks/useAmplifyAuth';

const MAX_API_KEYS = 1;

interface LoadingComponentProps {
  icon: Icon;
}

const LoadingComponent = ({ icon: Icon }: LoadingComponentProps) => {
  return (
    <div className="w-full h-full min-h-[200px] bg-neutral-100 rounded-xl animate-pulse flex items-center justify-center text-neutral-600">
      <Icon size={48} />
    </div>
  );
};

interface ProfileContainerProps {
  logoutButton?: React.FC<LogoutButtonProps>;
  loginButton?: React.FC;
  profilePic?: string;
  phrase: string;
  disabled?: boolean;
}

const ProfileContainer = ({
  logoutButton: LogoutButton,
  loginButton: LoginButton,
  profilePic,
  phrase,
  disabled,
}: ProfileContainerProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-8">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <Image
          src={`${profilePic || imgPrefix + '/images/default-profile.png'}`}
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full"
        />
        <h1 className="text-xl text-neutral-800">{phrase}</h1>
      </div>
      <div className="w-full h-[50px] flex items-center justify-center">
        {LogoutButton && <LogoutButton disabled={disabled} />}
        {LoginButton && <LoginButton />}
      </div>
    </div>
  );
};

const sectionHeadingStyle = `text-xl font-semibold pb-4`;

const AccountPageContainer = () => {
  const { userAttributes, tokens, isAuthenticated, loading } = useAmplifyAuth();
  const { apiKeys, setApiKeys, addApiKey } = useAccountStore();
  const { apiURL } = useProductionContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingApiKeys, setIsFetchingApiKeys] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleGenerateAPIKey = async () => {
    if (!isAuthenticated || !tokens.idToken) {
      toast.error('Please log in to generate API key');
      return;
    }

    setIsLoading(true);
    try {
      const newApiKey = await getApiKey({
        token: tokens.idToken,
        apiURL,
        email: userAttributes.email,
      });
      addApiKey(newApiKey);
      toast.success('API key generated successfully!');
    } catch (error) {
      console.error('Error generating API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing API keys after authentication
  useEffect(() => {
    const checkAndFetchApiKeys = async () => {
      if (!isAuthenticated || !tokens.idToken || !userAttributes.userId || apiKeys.length > 0) {
        return;
      }

      setIsFetchingApiKeys(true);

      try {
        // First check if API key exists using JWT token
        const checkResult = await checkApiKey({
          token: tokens.idToken,
          apiURL,
        });

        // Only fetch API key if checkResult indicates an API key exists
        if (checkResult) {
          // Now fetch the actual API key details
          const existingApiKey = await getApiKey({
            token: tokens.idToken,
            apiURL,
            email: userAttributes.email,
          });

          setApiKeys([existingApiKey]);
        } else {
          // Don't call getApiKey, just leave apiKeys empty to show the generate button
        }
      } catch (error) {
        console.log('No existing API key found or error checking:', error);
        // If checkApiKey fails, it means no API key exists or there was an error
        // Keep the existing behavior - show the generate button
      } finally {
        setIsFetchingApiKeys(false);
      }
    };

    checkAndFetchApiKeys();
  }, [
    isAuthenticated,
    tokens.idToken,
    userAttributes.userId,
    apiURL,
    userAttributes.email,
    apiKeys.length,
    setApiKeys,
  ]);

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={t.account.title} short />
      <Container styles="min-h-[70vh] h-fit py-10 w-[850px]">
        <div className="w-full h-full flex flex-col gap-16">
          <div>
            <Heading title={t.account.profile.title} />
            <div className="w-full h-[275px] flex flex-col items-center justify-center">
              {!isAuthenticated && (
                <ProfileContainer
                  loginButton={LoginButton}
                  profilePic={imgPrefix + '/images/default-profile.png'}
                  phrase={t.account.profile.pleaseLogin}
                />
              )}
              {isAuthenticated && userAttributes.email && (
                <ProfileContainer
                  logoutButton={LogoutButton}
                  profilePic={imgPrefix + '/images/default-profile.png'}
                  phrase={`${t.account.profile.welcome}, ${userAttributes.name || userAttributes.email}`}
                  disabled={isLoading}
                />
              )}
            </div>
          </div>
          <div>
            <Heading title={t.account.apiKey.title} />
            <div>
              <h3 className={sectionHeadingStyle}>{t.account.apiKey.gettingStarted}</h3>
              <div className="w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-2 mb-4">
                <p className="font-semibold">{t.account.apiKey.limitedTime}</p>
                <p>{t.account.apiKey.freePages}</p>
                <p> </p>
                <p className="font-semibold mt-4">{t.account.apiKey.note}</p>
                <ul className="list-disc ml-4">
                  <li>{t.account.apiKey.limitations[0]}</li>
                  <li>{t.account.apiKey.limitations[1]}</li>
                </ul>
              </div>
            </div>
            <div className="w-full h-fit min-h-[300px] flex flex-col items-center gap-8">
              {!isAuthenticated && !loading && (
                <div className="w-full h-full min-h-[300px] bg-neutral-100 rounded-xl flex items-center justify-center">
                  <Key size={48} />
                </div>
              )}
              {(loading || isFetchingApiKeys) && <LoadingComponent icon={Key} />}
              {isAuthenticated && !loading && !isFetchingApiKeys && (
                <div className="w-full h-full flex flex-col items-start justify-start gap-8">
                  {apiKeys.length >= MAX_API_KEYS ? (
                    <div className="w-full h-[50px] flex items-center justify-center gap-4 text-lg bg-neutral-100 border border-neutral-300 p-4 rounded-xl text-neutral-700">
                      {t.account.apiKey.maxKeysGenerated}
                      <Confetti size={32} />
                    </div>
                  ) : (
                    <div className="w-full h-[50px]">
                      <Button
                        label={`${isLoading ? t.account.apiKey.generating : t.account.apiKey.generateNew}`}
                        onClick={handleGenerateAPIKey}
                        small
                        disabled={isLoading || apiKeys.length >= MAX_API_KEYS}
                        labelIcon={Key}
                      />
                    </div>
                  )}
                  <div className="w-full">
                    <div className="flex flex-col gap-2 max-h-[300px] overflow-auto">
                      {apiKeys.length === 0 && (
                        <div className="w-full h-full min-h-[300px] bg-neutral-100 rounded-xl flex items-center justify-center">
                          <Key size={48} />
                        </div>
                      )}
                      {apiKeys.length > 0 && (
                        <>
                          {apiKeys
                            .slice()
                            .reverse()
                            .map((key, i) => (
                              <ApiKeyRow key={i} apiKey={key} />
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subscriptions section - visible when authenticated */}
          {isAuthenticated && (
            <div>
              <h3 className={sectionHeadingStyle}>{t.account.subscriptions.title}</h3>
              <p className="pb-4">{t.account.subscriptions.description}</p>
              <div className="flex flex-col gap-4">
                <Button
                  label={t.account.subscriptions.viewProducts}
                  onClick={() => router.push('/products-fdce3eb9-aa2b-4abf-8842-4bde6dc987c4')}
                  small
                />
                <BuyPagesButton />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default AccountPageContainer;
