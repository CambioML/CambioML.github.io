import { useAmplifyAuth } from '@/app/hooks/useAmplifyAuth';
import Button from '../Button';
import { SignOut } from '@phosphor-icons/react';
import { useTranslation } from '@/lib/use-translation';
import { useRouter } from 'next/navigation';

export interface LogoutButtonProps {
  disabled?: boolean;
  collapsed?: boolean;
}

const LogoutButton = ({ disabled, collapsed }: LogoutButtonProps) => {
  const { signOut } = useAmplifyAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Get current locale for redirect
      const currentPath = window.location.pathname;
      const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : 'en';

      // Save current URL to localStorage before logging out
      localStorage.setItem('auth_redirect_url', window.location.pathname + window.location.search);

      // Sign out using Amplify
      await signOut();

      // Redirect to home page after logout
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Error signing out:', error);
      // Still redirect even if there's an error
      const currentPath = window.location.pathname;
      const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : 'en';
      router.push(`/${locale}`);
    }
  };

  return (
    <div className="w-full h-full flex">
      <Button
        label={!collapsed ? t.auth.logout : ''}
        labelIcon={SignOut}
        onClick={handleLogout}
        small
        disabled={disabled}
      />
    </div>
  );
};

export default LogoutButton;
