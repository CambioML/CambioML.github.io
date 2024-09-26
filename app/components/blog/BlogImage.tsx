import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Image from 'next/image';

interface BlogImageProps {
  src: string;
  alt: string;
  subtitle?: string;
}

const BlogImage = ({ src, alt, subtitle }: BlogImageProps) => {
  return (
    <div className="mb-6">
      <Image
        alt={alt}
        src={imgPrefix + '/images/solutions/' + src}
        width={1200}
        height={800}
        className="block w-full h-auto"
      />
      {subtitle && <p className="text-center text-sm text-neutral-500 pt-2">{subtitle}</p>}
    </div>
  );
};

export default BlogImage;
