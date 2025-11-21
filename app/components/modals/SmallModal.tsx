'use client';

import ModalBase from './ModalBase';

interface SmallModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
}

const SmallModal = ({ isOpen, onClose, title, body, footer }: SmallModalProps) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title} size="sm">
      {body}
      {footer}
    </ModalBase>
  );
};

export default SmallModal;
