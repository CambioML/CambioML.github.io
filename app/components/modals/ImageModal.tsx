'use client';

import useImageModal from '@/app/hooks/useImageModal';
import Modal from './Modal';

const ImageModal = () => {
  const imageModal = useImageModal();

  const bodyContent = (
    <div className="flex items-center justify-center h-auto lg:h-[600px] xl:h-[800px] w-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageModal.image} alt="modal" className="h-auto lg:h-auto w-auto lg:w-full" />
    </div>
  );

  return <Modal isOpen={imageModal.isOpen} onClose={imageModal.onClose} body={bodyContent} />;
};

export default ImageModal;
