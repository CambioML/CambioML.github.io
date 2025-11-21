'use client';

import ModalBase from './ModalBase';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, body, footer }: ModalProps) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title}>
      {body}
      {footer}
    </ModalBase>
  );
};

export default Modal;
