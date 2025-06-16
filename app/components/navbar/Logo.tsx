'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import { useThemeContext } from '@/app/contexts/ThemeContext';

interface LogoProps {
  small?: boolean;
  white?: boolean;
}

const Logo = ({ small, white = false }: LogoProps) => {
  const router = useRouter();
  const { resolvedTheme } = useThemeContext();

  return (
    <div className="cursor-pointer" onClick={() => router.push('/')}>
      <Image
        alt="Logo"
        className="transition-opacity hover:opacity-80"
        height={small ? '100' : '175'}
        width={small ? '100' : '175'}
        src={imgPrefix + `${white || resolvedTheme === 'dark' ? '/images/logo-white.png' : '/images/logo.png'}`}
      />
    </div>
  );
};

export default Logo;
