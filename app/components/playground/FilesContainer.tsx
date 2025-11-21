import UploadButton from './UploadButton';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { CaretLeft, CaretRight, FileText, ChatCircleDots, SignOut, SignIn } from '@phosphor-icons/react';
import FileItem from './FileItem';
import QuotaDisplay from './QuotaDisplay';
import { useTranslation } from '@/lib/use-translation';
import { cn } from '@/lib/cn';
import usePlaygroundFeedbackModal from '@/app/hooks/usePlaygroundFeedbackModal';
import { useAmplifyAuth } from '@/app/hooks/useAmplifyAuth';
import { useRouter } from 'next/navigation';
import { usePopupAuth } from '@/app/hooks/usePopupAuth';

const FilesContainer = () => {
  const { t } = useTranslation();
  const { files, loggedIn, fileCollapsed, setFileCollapsed } = usePlaygroundStore();
  const feedbackModal = usePlaygroundFeedbackModal();
  const { signOut } = useAmplifyAuth();
  const router = useRouter();

  // Add popup auth hook for login
  const { openAuthPopup } = usePopupAuth({
    onSuccess: () => {
      // Auth state will be synced by PlaygroundContainer
      console.log('Login successful');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleFeedbackClick = () => feedbackModal.onOpen();

  const handleLogin = () => {
    openAuthPopup();
  };

  const handleLogout = async () => {
    try {
      const currentPath = window.location.pathname;
      const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : 'en';

      localStorage.setItem('auth_redirect_url', window.location.pathname + window.location.search);
      await signOut();
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Error signing out:', error);
      const currentPath = window.location.pathname;
      const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : 'en';
      router.push(`/${locale}`);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-sidebar text-sidebar-foreground relative">
      {/* Header Section */}
      <div className={cn('flex flex-col gap-4 p-4 pb-2', fileCollapsed && 'items-center px-2')}>
        {fileCollapsed ? (
          <button
            onClick={() => setFileCollapsed(false)}
            className={cn(
              'px-2 py-1.5 flex items-center justify-center text-muted-foreground uppercase tracking-wider hover:bg-muted/50 rounded-md transition-colors cursor-pointer'
            )}
            aria-label="Expand sidebar"
          >
            <FileText size={18} />
          </button>
        ) : (
          <div
            className={cn(
              'px-2 py-1.5 flex items-center text-muted-foreground uppercase tracking-wider justify-between text-base font-semibold'
            )}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span>{t.playground.files.title}</span>
            </div>
          </div>
        )}
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        {!fileCollapsed && (
          <div className="flex flex-col gap-1">
            {files.length > 0 ? (
              <div className="flex flex-col gap-1">
                {files.map((file, i) => (
                  <FileItem key={i} pgFile={file} index={i} />
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No files uploaded</div>
            )}
          </div>
        )}
      </div>

      {/* Footer / User Profile + Upload Button */}
      <div className="mt-auto border-t border-border p-2 flex flex-col gap-2">
        {/* Upload Button - always at top */}
        <UploadButton small={false} collapsed={fileCollapsed} />

        {/* Quota Display - below upload with separator */}
        {loggedIn && !fileCollapsed && (
          <>
            <div className="border-t border-border pt-2">
              <QuotaDisplay isCollapsed={fileCollapsed} />
            </div>
            <div className="border-t border-border" />
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Feedback Button */}
          {fileCollapsed ? (
            <button
              onClick={handleFeedbackClick}
              className="p-2 hover:bg-muted/50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label={t.playground.feedback.button}
            >
              <ChatCircleDots size={16} />
            </button>
          ) : (
            <button
              onClick={handleFeedbackClick}
              className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted/50 rounded-md transition-colors w-full text-left"
            >
              <ChatCircleDots size={16} />
              <span>{t.playground.feedback.button}</span>
            </button>
          )}

          {/* Login/Logout Button - show Login if logged out, Logout if logged in */}
          {loggedIn ? (
            // Logout Button
            fileCollapsed ? (
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-muted/50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label={t.auth.logout}
              >
                <SignOut size={16} />
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted/50 rounded-md transition-colors w-full text-left"
              >
                <SignOut size={16} />
                <span>{t.auth.logout}</span>
              </button>
            )
          ) : // Login Button
          fileCollapsed ? (
            <button
              onClick={handleLogin}
              className="p-2 hover:bg-muted/50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Login"
            >
              <SignIn size={16} />
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted/50 rounded-md transition-colors w-full text-left"
            >
              <SignIn size={16} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-background border border-border rounded-full p-1 shadow-sm z-10 hover:bg-muted transition-colors"
        onClick={() => setFileCollapsed(!fileCollapsed)}
      >
        {fileCollapsed ? <CaretRight size={12} /> : <CaretLeft size={12} />}
      </button>
    </div>
  );
};

export default FilesContainer;
