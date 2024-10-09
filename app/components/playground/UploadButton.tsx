import { useUploadModal } from '@/app/hooks/useUploadModal';
import Button from '../Button';
import { UploadSimple } from '@phosphor-icons/react';
import { usePostHog } from 'posthog-js/react';
interface UploadButtonProps {
  small?: boolean;
  disabled?: boolean;
  collapsed?: boolean;
}

const UploadButton = ({ small, disabled, collapsed }: UploadButtonProps) => {
  const posthog = usePostHog();
  const uploadModal = useUploadModal();
  return (
    <Button
      label={collapsed ? '' : 'Upload file'}
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
