'use client';

import ModalBase from './ModalBase';

interface LargeModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
}

const LargeModal = ({ isOpen, onClose, title, body, footer }: LargeModalProps) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title} size="lg">
      {body}
      {footer}
    </ModalBase>
  );
};

export default LargeModal;
