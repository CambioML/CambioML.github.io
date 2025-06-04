import { useUploadModal } from '@/app/hooks/useUploadModal';
import Button from '../Button';
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

  return (
    <Button
      label={collapsed ? '' : t.playground.files.uploadFile}
      onClick={() => {
        posthog.capture('playground.upload.button', { route: '/playground' });
        uploadModal.onOpen();
      }}
      small={small}
      labelIcon={UploadSimple}
      disabled={disabled}
      id="open-upload-modal-btn"
    />
  );
};

export default UploadButton;
