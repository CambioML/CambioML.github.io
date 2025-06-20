import { useState, useEffect } from 'react';
import { useAmplifyAuth } from './useAmplifyAuth';
import { ApiKey } from './useAccountStore';

interface UserProfile {
  name: string;
  email: string;
  email_verified: boolean;
  sub: string;
  picture: string;
  cdkProfile: CdkProfile;
  apiKey: string;
}

export type CdkProfile = {
  apiKey: string;
  pageLimit: number;
  remainingPages: number;
  subscriptionId: string;
  stripeCustomerId: string;
  updatedAt: string;
  createdAt: string;
  userId: string;
  userType: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
};

const useUserProfile = () => {
  const { isAuthenticated, tokens, userAttributes, loading: authLoading, user } = useAmplifyAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated || !user || !tokens?.idToken) {
        setProfile(null);
        setToken(null);
        return;
      }

      setLoading(true);
      try {
        // Get the ID token as the access token for our API calls
        const idToken = tokens.idToken.toString();
        setToken(idToken);

        // Parse user information from Cognito
        const cognitoUserId = user.userId || user.username;

        // Create profile object from Cognito data
        const profileData: UserProfile = {
          name: userAttributes?.name || userAttributes?.email || 'User',
          email: userAttributes?.email || '',
          email_verified: userAttributes?.email_verified === 'true' || userAttributes?.email_verified === true,
          sub: cognitoUserId,
          picture: userAttributes?.picture || '/images/default-profile.png',
          cdkProfile: {} as CdkProfile,
          apiKey: '',
        };

        setProfile(profileData);
        setError(null);
      } catch (error: unknown) {
        console.error('Error fetching user profile:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, tokens, userAttributes, user]);

  return {
    profile,
    error,
    loading: authLoading || loading,
    token,
  };
};

export default useUserProfile;
