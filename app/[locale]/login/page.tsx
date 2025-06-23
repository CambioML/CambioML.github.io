'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { type Locale } from '@/lib/translations';
import { useTranslation } from '@/lib/use-translation';
import PasswordStrength from './PasswordStrength';
import CheckboxField from '@/app/components/inputs/CheckboxField';
import { I18n } from 'aws-amplify/utils';
import { translations } from '@aws-amplify/ui-react';

// Import Amplify UI styles
import '@aws-amplify/ui-react/styles.css';

import './login.css';
// Import Amplify configuration
import '../../lib/amplify';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const [error, setError] = useState('');
  const [signingInEmail, setSigningInEmail] = useState<string>('');
  const [i18nReady, setI18nReady] = useState(false);

  const { user } = useAuthenticator((context) => [context.user]);
  const { t } = useTranslation();

  // Get locale from params
  const locale = (params?.locale as Locale) || 'en';

  // Preserve redirect URL from query parameters on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect');

    if (redirectParam) {
      // Save the redirect URL from query parameter to localStorage
      // This handles OAuth flows where localStorage might be cleared
      const decodedRedirect = decodeURIComponent(redirectParam);
      localStorage.setItem('auth_redirect_url', decodedRedirect);
      console.log('Preserved redirect URL from query parameter:', decodedRedirect);
    }
  }, []);

  // Setup Amplify UI i18n
  React.useEffect(() => {
    setI18nReady(false);

    // Load default Amplify UI translations
    I18n.putVocabularies(translations);

    // Set language based on locale
    I18n.setLanguage(locale);

    // Add custom vocabularies for login form
    I18n.putVocabularies({
      [locale]: {
        Email: t.login.form.email.label,
        'Enter your email': t.login.form.email.placeholder,
        Password: t.login.form.password.label,
        'Enter your password': t.login.form.password.placeholder,
        'Confirm Password': t.login.form.confirmPassword.label,
        'Confirm your password': t.login.form.confirmPassword.placeholder,
        'Sign Up with Google': t.login.socialProviders.google,
      },
    });

    // Force component to re-render after i18n setup
    setI18nReady(true);
  }, [locale, t]);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(async () => {
    if (!user) return;

    try {
      // Get the current session to access tokens
      const { tokens } = await fetchAuthSession();

      console.log('Auth session tokens:', tokens);

      let email = '';
      let fullName = '';

      // Get user attributes from Cognito
      try {
        const attributes = await fetchUserAttributes();
        console.log('User Attributes:', attributes);

        if (attributes.name) {
          fullName = attributes.name;
          console.log('Full name from attributes:', fullName);
        }

        if (attributes.email) {
          email = attributes.email;
          console.log('Email from attributes:', email);
        }
      } catch (attributesError) {
        console.warn('Error fetching user attributes:', attributesError);

        // Try to extract name from ID token if attributes fetch fails
        if (tokens?.idToken) {
          try {
            const payload = JSON.parse(atob(tokens.idToken.toString().split('.')[1]));

            if (payload.identities?.[0]?.providerName === 'Google') {
              if (payload.email) {
                const googleEmail = payload.email;
                if (!googleEmail || !googleEmail.includes('@')) {
                  console.error('Invalid or missing email from Google payload:', payload);
                  setError('Failed to get your email from Google. Please try again.');
                  return;
                }
              }

              if (payload.name) {
                fullName = payload.name;
                console.log('Name from token payload:', fullName);
              }

              if (payload.email) {
                email = payload.email;
                console.log('Email from token payload:', email);
              }
            }
          } catch (tokenError) {
            console.error('Error parsing ID token:', tokenError);
          }
        }
      }

      // Set email for display during sign-in process
      setSigningInEmail(email);

      if (tokens?.idToken) {
        try {
          console.log('ID Token:', tokens.idToken.toString());

          // Check if we're in popup mode
          const urlParams = new URLSearchParams(window.location.search);
          const isPopupMode = urlParams.get('mode') === 'popup';

          if (isPopupMode) {
            // Send success message to parent window
            window.opener?.postMessage({ type: 'AUTH_SUCCESS', email, fullName }, window.location.origin);
            window.close();
            return;
          }

          // Get saved redirect URL - prioritize localStorage over URL params
          const savedUrl = localStorage.getItem('auth_redirect_url');
          const urlRedirect = urlParams.get('redirect');
          localStorage.removeItem('auth_redirect_url');

          // Determine redirect destination
          let redirectTo: string;
          if (savedUrl) {
            redirectTo = savedUrl;
          } else if (urlRedirect) {
            redirectTo = decodeURIComponent(urlRedirect);
          } else {
            redirectTo = `/${locale}/anyparser`;
          }

          setTimeout(() => {
            router.push(redirectTo);
          }, 1000);
        } catch (err) {
          console.error('Resource authentication error:', err);
          const errorMessage = 'Failed to authenticate with the resource server. Please try again.';
          setError(errorMessage);

          // If in popup mode, send error to parent
          const urlParams = new URLSearchParams(window.location.search);
          const isPopupMode = urlParams.get('mode') === 'popup';
          if (isPopupMode) {
            window.opener?.postMessage({ type: 'AUTH_ERROR', error: errorMessage }, window.location.origin);
          }
        }
      } else {
        throw new Error('No ID token available');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      const errorMessage = 'Failed to authenticate. Please try again.';
      setError(errorMessage);

      // If in popup mode, send error to parent
      const urlParams = new URLSearchParams(window.location.search);
      const isPopupMode = urlParams.get('mode') === 'popup';
      if (isPopupMode) {
        window.opener?.postMessage({ type: 'AUTH_ERROR', error: errorMessage }, window.location.origin);
      }
    }
  }, [user, router, locale]);

  // Call handleAuthSuccess when user changes
  useEffect(() => {
    if (user) {
      handleAuthSuccess();
    }
  }, [user, handleAuthSuccess]);

  return (
    <main className="min-h-screen bg-background">
      <section className="relative">
        <div className="relative py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="text-center sm:mx-auto sm:max-w-3xl lg:max-w-4xl">
              <h1 className="mt-8 text-4xl font-semibold text-foreground md:text-5xl xl:text-5xl xl:[line-height:1.125]">
                {t.login.title}
                <br />
                {t.login.subtitle}
              </h1>
              <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg text-muted-foreground sm:block">
                {t.login.description}
              </p>
              <p className="mx-auto mt-6 max-w-xl text-wrap text-muted-foreground sm:hidden">
                {t.login.mobileDescription}
              </p>
            </div>

            <div className="relative mx-auto mt-12 max-w-md sm:max-w-lg md:mt-16 rounded-lg overflow-hidden">
              {/* Colorful backdrop elements */}
              <div className="absolute inset-0 -top-8 left-1/2 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)] dark:hidden"></div>
              <div className="absolute inset-x-0 top-4 mx-auto h-2/3 w-3/3 scale-[80%] rounded-full bg-blue-300 dark:bg-primary blur-[120px]"></div>

              {/* Auth Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full relative">
                <div className="shadow-md border border-border-1 rounded-lg bg-white dark:bg-gray-900">
                  <div className="p-6 dark:!bg-[rgb(10,10,10)]">
                    <div className="flex items-center justify-center gap-3 mb-6 pt-4">
                      <h2 className="text-2xl font-bold text-foreground">{t.login.brandName}</h2>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                      </div>
                    )}

                    {i18nReady && (
                      <Authenticator
                        key={`authenticator-${locale}`}
                        initialState="signIn"
                        loginMechanisms={['email']}
                        signUpAttributes={['email']}
                        socialProviders={['google']}
                        components={{
                          SignUp: {
                            FormFields() {
                              // Get the password value for validation display
                              const [password, setPassword] = useState('');
                              const [acknowledgementChecked, setAcknowledgementChecked] = useState(false);

                              // Monitor password field changes
                              useEffect(() => {
                                const passwordInput = document.querySelector(
                                  'input[name="password"]'
                                ) as HTMLInputElement;
                                if (passwordInput) {
                                  const handlePasswordChange = (e: Event) => {
                                    setPassword((e.target as HTMLInputElement).value);
                                  };

                                  passwordInput.addEventListener('input', handlePasswordChange);
                                  return () => {
                                    passwordInput.removeEventListener('input', handlePasswordChange);
                                  };
                                }
                              }, []);

                              return (
                                <>
                                  <Authenticator.SignUp.FormFields />

                                  {/* Password Strength Indicator */}
                                  <PasswordStrength password={password} />

                                  <CheckboxField
                                    errorMessage=""
                                    hasError={false}
                                    name="acknowledgement"
                                    value="yes"
                                    checked={acknowledgementChecked}
                                    onChange={setAcknowledgementChecked}
                                    label={
                                      <span>
                                        {t.login.checkboxLabel.agreeToThe}{' '}
                                        <a
                                          href="/legal/terms-of-service.pdf"
                                          target="_blank"
                                          className="text-primary hover:underline"
                                        >
                                          {t.login.checkboxLabel.termsAndConditions}
                                        </a>{' '}
                                        {t.login.checkboxLabel.andHaveRead}{' '}
                                        <a
                                          href="/legal/privacy-policy.pdf"
                                          target="_blank"
                                          className="text-primary hover:underline"
                                        >
                                          {t.login.checkboxLabel.privacyPolicy}
                                        </a>
                                      </span>
                                    }
                                  />
                                </>
                              );
                            },
                          },
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="w-full py-6"
                        >
                          <div className="flex flex-col items-center justify-center space-y-4">
                            {signingInEmail ? (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                                <h3 className="text-lg font-medium text-foreground">{signingInEmail}</h3>
                                <div className="flex items-center space-x-2 mt-1 text-muted-foreground">
                                  <span>{t.login.signingIn}</span>
                                  <ArrowRight className="h-4 w-4 animate-pulse" />
                                </div>
                              </motion.div>
                            ) : (
                              <div className="text-center">
                                <h3 className="text-lg font-medium text-foreground">{t.login.authenticating}</h3>
                              </div>
                            )}

                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      </Authenticator>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
