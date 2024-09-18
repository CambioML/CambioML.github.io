import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
// import { getUserData } from '../actions/getUserData';

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
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        return; // Exit if the user is not authenticated
      }

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
            scope: 'openid profile email',
          },
        });
        setToken(accessToken);
        const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const profileData: UserProfile = await response.json();
<<<<<<< HEAD
        console.log(profileData);

        const cdkProfileData = await getUserData({
          userId: profileData.sub,
          api_url: process.env.NEXT_PUBLIC_PLAYGROUND_API_URL || 'https://o5uo2f15j7.execute-api.us-west-2.amazonaws.com/v1',
        });
        profileData.cdkProfile = cdkProfileData['user_data'];
=======
        // const cdkProfileData = await getUserData({
        //   userId: profileData.sub,
        //   api_url: 'https://o5uo2f15j7.execute-api.us-west-2.amazonaws.com/v1/',
        // });
        // profileData.cdkProfile = cdkProfileData['user_data'];
>>>>>>> origin/main
        setProfile(profileData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchUserProfile();
  }, [getAccessTokenSilently, isAuthenticated]);

  return { profile, error, loading: isLoading || (isAuthenticated && !profile && !error), token };
};

export default useUserProfile;
