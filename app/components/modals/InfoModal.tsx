'use client';

import useInfoModal from '@/app/hooks/useInfoModal';
import Modal from './Modal';

const InfoModal = () => {
  const infoModal = useInfoModal();

  const bodyContent = (
    <div className="flex items-start justify-center w-auto h-full md:h-[500px] overflow-y-auto p-4">
      <div className="h-fit text-foreground p-1 flex flex-col items-start justify-start gap-2">{infoModal.content}</div>
    </div>
  );

  return <Modal isOpen={infoModal.isOpen} onClose={infoModal.onClose} title={infoModal.title} body={bodyContent} />;
};

export default InfoModal;
