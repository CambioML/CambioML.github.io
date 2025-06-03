'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { imgPrefix } from '@/app/hooks/useImgPrefix';

interface LogoProps {
  small?: boolean;
  white?: boolean;
}

const Logo = ({ small, white = true }: LogoProps) => {
  const router = useRouter();

  return (
    <div className="cursor-pointer" onClick={() => router.push('/')}>
      <Image
        alt="Logo"
        className="transition-opacity hover:opacity-80"
        height={small ? '100' : '175'}
        width={small ? '100' : '175'}
        src={imgPrefix + `${white ? '/images/logo-white.png' : '/images/logo.png'}`}
      />
    </div>
  );
};

export default Logo;
