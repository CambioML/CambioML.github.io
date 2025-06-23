'use client';

import { ThemeProvider as AmplifyThemeProvider, Authenticator } from '@aws-amplify/ui-react';
import { useThemeContext } from '@/app/contexts/ThemeContext';
import { lightTheme, darkTheme } from '@/app/lib/amplify';
import '@aws-amplify/ui-react/styles.css';
import '@/app/lib/amplify';

interface AmplifyAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provides AWS Amplify Authenticator context and theming.
 * This wrapper is needed for components that use useAuthenticator hooks.
 */
export const AmplifyAuthProvider = ({ children }: AmplifyAuthProviderProps) => {
  const { resolvedTheme } = useThemeContext();
  const currentAmplifyTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <AmplifyThemeProvider theme={currentAmplifyTheme}>
      <Authenticator.Provider>{children}</Authenticator.Provider>
    </AmplifyThemeProvider>
  );
};

export default AmplifyAuthProvider;
