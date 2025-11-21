import { useUploadModal } from '@/app/hooks/useUploadModal';
import { UploadSimple } from '@phosphor-icons/react';
import { usePostHog } from 'posthog-js/react';
import { useTranslation } from '@/lib/use-translation';

interface UploadButtonProps {
  small?: boolean;
  disabled?: boolean;
  collapsed?: boolean;
}

const UploadButton = ({ small, disabled, collapsed }: UploadButtonProps) => {
  const posthog = usePostHog();
  const uploadModal = useUploadModal();
  const { t } = useTranslation();

  if (collapsed) {
    return (
      <button
        onClick={() => {
          posthog.capture('playground.upload.button', { route: '/playground' });
          uploadModal.onOpen();
        }}
        disabled={disabled}
        className="p-2 hover:bg-muted/50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        id="open-upload-modal-btn"
      >
        <UploadSimple size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        posthog.capture('playground.upload.button', { route: '/playground' });
        uploadModal.onOpen();
      }}
      disabled={disabled}
      className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted/50 rounded-md transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
      id="open-upload-modal-btn"
    >
      <UploadSimple size={16} />
      <span>{t.playground.files.uploadFile}</span>
    </button>
  );
};

export default UploadButton;
