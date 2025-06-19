'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { useCallback, useEffect, useState } from 'react';

interface AuthTokens {
  idToken: string | null;
  accessToken: string | null;
}

interface UserAttributes {
  email?: string;
  name?: string;
  [key: string]: any;
}

export const useAmplifyAuth = () => {
  const { user, signOut } = useAuthenticator((context: any) => [context.user, context.signOut]);
  const [tokens, setTokens] = useState<AuthTokens>({ idToken: null, accessToken: null });
  const [userAttributes, setUserAttributes] = useState<UserAttributes>({});
  const [loading, setLoading] = useState(false);

  const fetchTokens = useCallback(async () => {
    if (!user) {
      setTokens({ idToken: null, accessToken: null });
      return;
    }

    try {
      setLoading(true);
      const { tokens: authTokens } = await fetchAuthSession();

      setTokens({
        idToken: authTokens?.idToken?.toString() || null,
        accessToken: authTokens?.accessToken?.toString() || null,
      });
    } catch (error) {
      console.error('Error fetching auth tokens:', error);
      setTokens({ idToken: null, accessToken: null });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchAttributes = useCallback(async () => {
    if (!user) {
      setUserAttributes({});
      return;
    }

    try {
      const attributes = await fetchUserAttributes();
      setUserAttributes(attributes);
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      setUserAttributes({});
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTokens();
      fetchAttributes();
    } else {
      setTokens({ idToken: null, accessToken: null });
      setUserAttributes({});
    }
  }, [user, fetchTokens, fetchAttributes]);

  return {
    user,
    tokens,
    userAttributes,
    loading,
    signOut,
    refreshTokens: fetchTokens,
    refreshAttributes: fetchAttributes,
    isAuthenticated: !!user,
  };
};
