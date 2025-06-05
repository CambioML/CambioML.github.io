import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button';
import { SignOut } from '@phosphor-icons/react';
import { useTranslation } from '@/lib/use-translation';

export interface LogoutButtonProps {
  disabled?: boolean;
  collapsed?: boolean;
}

const LogoutButton = ({ disabled, collapsed }: LogoutButtonProps) => {
  const { logout } = useAuth0();
  const { t } = useTranslation();

  const handleLogout = () => {
    // Save current URL to localStorage before redirecting to Auth0
    localStorage.setItem('auth_redirect_url', window.location.pathname + window.location.search);

    logout({
      logoutParams: { returnTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/logout/callback` },
    });
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
