'use client';
import { BookOpenText, Confetti, Icon, Key, UserCircle } from '@phosphor-icons/react';
import Container from '../Container';
import Heading from '../Heading';
import LoginButton from '../auth/LoginButton';
import LogoutButton, { LogoutButtonProps } from '../auth/LogoutButton';
import PageHero from '../hero/PageHero';
import useUserProfile from '@/app/hooks/useUserProfile';
import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Button from '../Button';
import useAccountStore from '@/app/hooks/useAccountStore';
import getNewApiKey from '@/app/actions/account/getNewApiKey';
import getApiKeysForUser from '@/app/actions/account/getApiKeysForUser';
import { useEffect, useState } from 'react';
import ApiKeyRow from './ApiKeyRow';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useProductionContext } from '../playground/ProductionContext';
import { resendVerificationEmail } from '../../actions/account/resendVerificationEmail';
import PortalButton from '../pricing/PortalButton';
import { useTranslation } from '@/lib/use-translation';
import BuyCreditsButton from './BuyCreditsButton';

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
  const { profile, error, loading, token } = useUserProfile();
  const { apiURL } = useProductionContext();
  const { apiKeys, setApiKeys } = useAccountStore();
  const [isLoading, setIsLoading] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const { isProduction } = useProductionContext();
  const router = useRouter();
  const [emailVerified, setEmailVerified] = useState(false);
  const { t } = useTranslation();

  const handleGenerateAPIKey = async () => {
    setIsLoading(true);
    try {
      if (!profile?.sub || !token) return;
      await getNewApiKey({ userId: profile?.sub, token: token, apiURL });
      fetchApiKeys();
    } catch {
      // Do nothing
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApiKeys = async () => {
    if (!profile?.sub || !token) return;
    try {
      const apiKeys = await getApiKeysForUser({ userId: profile?.sub, token: token, apiURL });
      setApiKeys(apiKeys);
    } catch (error) {
      toast.error(`Error fetching API keys: ${error}`);
    }
  };
  useEffect(() => {
    fetchApiKeys();
  }, [profile?.sub, token]); // Add dependencies here

  useEffect(() => {
    if (profile) {
      setEmailVerified(profile.email_verified);
    }
  }, [profile]);

  const handleResendVerificationEmail = async () => {
    if (!profile) return;
    setSendingVerification(true);
    setIsLoading(true);

    try {
      await resendVerificationEmail({
        userId: profile.sub,
      });
      toast.success('Verification email resent!');
    } catch (error) {
      console.error(error);
      toast.error('Error resending verification email');
    } finally {
      setSendingVerification(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={t.account.title} short />
      <Container styles="min-h-[70vh] h-fit py-10 w-[850px]">
        <div className="w-full h-full flex flex-col gap-16">
          <div>
            <Heading title={t.account.profile.title} />
            <div className="w-full h-[275px] flex flex-col items-center justify-center">
              {loading && <LoadingComponent icon={UserCircle} />}
              {!loading && error && (
                <ProfileContainer
                  loginButton={LoginButton}
                  profilePic={imgPrefix + '/images/default-profile.png'}
                  phrase={`${t.account.profile.errorLoading}: ${error}`}
                />
              )}
              {!loading && !error && !profile && (
                <ProfileContainer
                  loginButton={LoginButton}
                  profilePic={imgPrefix + '/images/default-profile.png'}
                  phrase={t.account.profile.pleaseLogin}
                />
              )}
              {!loading && !error && profile && (
                <ProfileContainer
                  logoutButton={LogoutButton}
                  profilePic={profile.picture}
                  phrase={`${t.account.profile.welcome}, ${profile.name}`}
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
              {loading && <LoadingComponent icon={Key} />}
              {!loading && error && (
                <>
                  <div>
                    {t.account.profile.errorLoading}: {error}
                  </div>
                </>
              )}
              {!loading && !error && !profile && (
                <div className="w-full h-full min-h-[300px] bg-neutral-100 rounded-xl flex items-center justify-center">
                  <Key size={48} />
                </div>
              )}
              {!loading && !error && profile && !emailVerified && (
                <>
                  <p className="text-md">{t.account.apiKey.verifyEmail} </p>
                  <Button
                    label={`${sendingVerification ? t.account.apiKey.sendingVerification : t.account.apiKey.resendVerification}`}
                    onClick={handleResendVerificationEmail}
                    disabled={isLoading}
                    small
                  />
                  <div className="w-full h-full min-h-[300px] bg-neutral-100 rounded-xl flex items-center justify-center">
                    <Key size={48} />
                  </div>
                </>
              )}
              {!loading && !error && profile && emailVerified && (
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
              {!isProduction && (
                <div className="w-full">
                  <h3 className={sectionHeadingStyle}>{t.account.subscriptions.title}</h3>
                  <p className="pb-4">{t.account.subscriptions.description}</p>
                  {loading ? (
                    <LoadingComponent icon={UserCircle} />
                  ) : profile?.cdkProfile && profile?.cdkProfile.subscriptionId ? (
                    <PortalButton />
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Button
                        label={t.account.subscriptions.viewProducts}
                        onClick={() => router.push('/products-fdce3eb9-aa2b-4abf-8842-4bde6dc987c4')}
                        small
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Payment section - always visible for testing */}
              <div className="w-full">
                <div className="border-t pt-4">
                  <h4 className="text-lg font-medium mb-2">Buy Credits (Test Mode)</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Purchase credits to use with the AnyParser API. Each $1 gives you 10 credits.
                    <br />
                    <span className="text-orange-600 font-medium">
                      Note: Using test user ID for payment testing regardless of login status.
                    </span>
                  </p>
                  <BuyCreditsButton />
                </div>
              </div>
              <Button
                label={t.account.documentation}
                onClick={() => window.open('https://docs.cambioml.com/introduction', '_blank')}
                small
                labelIcon={BookOpenText}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AccountPageContainer;
