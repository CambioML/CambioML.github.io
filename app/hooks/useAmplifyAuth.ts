'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useCallback, useEffect, useState, useRef } from 'react';

interface AuthTokens {
  idToken: string | null;
  accessToken: string | null;
}

interface UserAttributes {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  userId?: string;
  sub?: string;
  [key: string]: any;
}

// Helper function to decode JWT token payload
const decodeJWTPayload = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return {};
  }
};

export const useAmplifyAuth = () => {
  const { user, signOut } = useAuthenticator((context: any) => [context.user, context.signOut]);
  const [tokens, setTokens] = useState<AuthTokens>({ idToken: null, accessToken: null });
  const [userAttributes, setUserAttributes] = useState<UserAttributes>({});
  const [loading, setLoading] = useState(false);
  const lastUserRef = useRef<any>(null);

  const fetchTokens = useCallback(async () => {
    if (!user) {
      setTokens({ idToken: null, accessToken: null });
      setUserAttributes({});
      return;
    }

    // Skip if this is the same user we already processed
    if (lastUserRef.current === user) {
      return;
    }

    try {
      setLoading(true);
      const { tokens: authTokens } = await fetchAuthSession();

      const idToken = authTokens?.idToken?.toString() || null;
      const accessToken = authTokens?.accessToken?.toString() || null;

      setTokens({
        idToken,
        accessToken,
      });

      // Extract user attributes from ID token payload
      if (idToken) {
        const payload = decodeJWTPayload(idToken);

        // Extract user ID from the 'sub' field
        const userId = payload.sub;

        const attributes: UserAttributes = {
          email: payload.email,
          given_name: payload.given_name,
          family_name: payload.family_name,
          name:
            payload.given_name && payload.family_name
              ? `${payload.given_name} ${payload.family_name}`
              : payload.given_name || payload.family_name || '',
          userId: userId,
          sub: payload.sub,
          // Include any other attributes from the token
          ...payload,
        };

        setUserAttributes(attributes);

        // Console log the user ID and key user info
        console.log('Email:', payload.email);
        console.log('Name:', attributes.name);
        console.log('User ID:', userId);
      }

      lastUserRef.current = user;
    } catch (error) {
      console.error('Error fetching auth tokens:', error);
      setTokens({ idToken: null, accessToken: null });
      setUserAttributes({});
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTokens();
  }, [user]); // Remove fetchTokens from dependencies to prevent re-renders

  // Reset when user changes or signs out
  useEffect(() => {
    if (!user) {
      setTokens({ idToken: null, accessToken: null });
      setUserAttributes({});
      lastUserRef.current = null;
    }
  }, [user]);

  return {
    user,
    tokens,
    userAttributes,
    loading,
    signOut,
    refreshTokens: fetchTokens,
    isAuthenticated: !!user,
  };
};
