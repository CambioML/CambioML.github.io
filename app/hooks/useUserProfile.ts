import { useState, useEffect } from 'react';
import { useAmplifyAuth } from './useAmplifyAuth';
import { getUserData } from '../actions/getUserData';

interface UserProfile {
  name: string;
  email: string;
  email_verified: boolean;
  sub: string;
  picture: string;
  cdkProfile: CdkProfile;
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
          cdkProfile: {} as CdkProfile, // Will be populated below
        };

        // Fetch CDK profile data using the user ID
        try {
          const cdkProfileData = await getUserData({
            userId: cognitoUserId,
            api_url: process.env.NEXT_PUBLIC_PLAYGROUND_API_URL || '',
          });
          profileData.cdkProfile = cdkProfileData['user_data'];
        } catch (cdkError) {
          console.warn('Failed to fetch CDK profile data:', cdkError);
          // Set default CDK profile if fetch fails
          profileData.cdkProfile = {
            apiKey: '',
            pageLimit: 0,
            remainingPages: 0,
            subscriptionId: '',
            stripeCustomerId: '',
            updatedAt: '',
            createdAt: '',
            userId: cognitoUserId,
            userType: 'free',
            cancelAtPeriodEnd: false,
            currentPeriodEnd: '',
          };
        }

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
