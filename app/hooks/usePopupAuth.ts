'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from '@/lib/use-translation';

interface UsePopupAuthOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectUrl?: string;
}

interface AuthPopupState {
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}

export const usePopupAuth = (options: UsePopupAuthOptions = {}) => {
  const { onSuccess, onError, redirectUrl } = options;
  const { locale } = useTranslation();
  const [state, setState] = useState<AuthPopupState>({
    isLoading: false,
    error: null,
    isOpen: false,
  });

  const openAuthPopup = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null, isOpen: true }));

      // For popup-based auth, we need to use a different approach
      // Since Amplify's signInWithRedirect doesn't support popup mode directly,
      // we'll open a new window with our login page
      const currentOrigin = window.location.origin;
      const loginUrl = `${currentOrigin}/${locale}/login?mode=popup&redirect=${encodeURIComponent(
        redirectUrl || window.location.pathname
      )}`;

      const popup = window.open(loginUrl, 'amplify-auth');

      if (!popup) {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      }

      // Listen for popup closure and auth events
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setState((prev) => ({ ...prev, isLoading: false, isOpen: false }));
        }
      }, 1000);

      // Listen for auth success message from popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== currentOrigin) return;

        if (event.data.type === 'AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup.close();
          setState((prev) => ({ ...prev, isLoading: false, isOpen: false, error: null }));
          onSuccess?.();
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'AUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          setState((prev) => ({ ...prev, isLoading: false, isOpen: false, error: event.data.error }));
          onError?.(event.data.error);
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup if component unmounts
      return () => {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        if (!popup.closed) {
          popup.close();
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage, isOpen: false }));
      onError?.(errorMessage);
    }
  }, [locale, onSuccess, onError, redirectUrl]);

  const closePopup = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  }, []);

  return {
    openAuthPopup,
    closePopup,
    isLoading: state.isLoading,
    error: state.error,
    isOpen: state.isOpen,
  };
};
