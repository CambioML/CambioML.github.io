'use client';

import ModalBase from './ModalBase';

interface FullscreenModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
}

const FullscreenModal = ({ isOpen, onClose, title, body, footer }: FullscreenModalProps) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title} size="full">
      {body}
      {footer}
    </ModalBase>
  );
};

export default FullscreenModal;
