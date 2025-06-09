'use client';

import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Image from 'next/image';
import useImageModal from '@/app/hooks/useImageModal';

interface FeatureImageProps {
  image: string;
  alt: string;
  height?: string;
  shadow?: boolean;
  border?: boolean;
  enableModal?: boolean;
}

const FeatureImage = ({ image, alt, height, shadow, border, enableModal }: FeatureImageProps) => {
  const imageModal = useImageModal();
  return (
    <div
      className={`${border && 'border-solid border border-neutral-100'} ${shadow && 'shadow-lg'} rounded-xl w-full ${height || 'h-[600px]'} relative ${enableModal && 'cursor-pointer hover:scale-105 transition-all duration-300'}`}
      onClick={() => {
        if (enableModal) {
          imageModal.setImage(imgPrefix + image);
          imageModal.onOpen();
        }
      }}
    >
      <Image src={imgPrefix + image} fill style={{ objectFit: 'contain' }} alt={alt} />
    </div>
  );
};

export default FeatureImage;
