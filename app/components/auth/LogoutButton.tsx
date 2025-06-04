import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button';
import { SignOut } from '@phosphor-icons/react';
import { useTranslation } from '@/lib/use-translation';

export interface LogoutButtonProps {
  logoutUrl: string;
  disabled?: boolean;
  collapsed?: boolean;
}

const LogoutButton = ({ logoutUrl, disabled, collapsed }: LogoutButtonProps) => {
  const { logout } = useAuth0();
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex">
      <Button
        label={!collapsed ? t.auth.logout : ''}
        labelIcon={SignOut}
        onClick={() =>
          logout({
            logoutParams: { returnTo: logoutUrl },
          })
        }
        small
        disabled={disabled}
      />
    </div>
  );
};

export default LogoutButton;
