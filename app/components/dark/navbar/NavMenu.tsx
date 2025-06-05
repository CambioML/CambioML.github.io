'use client';

import { useCallback, useState, useRef } from 'react';
import MenuItem from './MenuItem';
import { useRouter } from 'next/navigation';
import { useOutsideClick } from '@/app/hooks/useOutsideClick';

interface NavMenuProps {
  label: string;
  links: { label: string; url: string }[];
  url?: string;
}

const NavMenu = ({ label, links, url }: NavMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const excludeRef = useRef<HTMLDivElement>(null);
  const ref = useOutsideClick(() => {
    toggleOpen();
  }, excludeRef);

  const makeOnClick = (linkObj: { label: string; url: string }) => {
    return () => {
      router.push(linkObj.url);
      setIsOpen(false);
    };
  };

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleLabelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (links.length === 0) {
      const link_url = url || `/${label}`.toLowerCase().replaceAll(' ', '-');
      router.push(link_url);
      return;
    }
    toggleOpen();
  };

  return (
    <div className="relative">
      <div
        onClick={handleLabelClick}
        className="text-lg font-semibold py-3 px-4 rounded-full text-white hover:text-blue-400 transition-colors cursor-pointer"
        ref={excludeRef}
      >
        {label.toUpperCase()}
      </div>
      {isOpen && (
        <div
          className="absolute rounded-2xl w-[200px] bg-zinc-900/95 backdrop-blur-xl border border-blue-500/30 overflow-hidden right-0 top-12 text-sm z-40 shadow-[0_0_20px_4px_rgba(0,0,0,0.5)] shadow-blue-500/20"
          ref={ref}
        >
          <div className="flex flex-col cursor-pointer">
            <>
              {links.map((linkObj, i) => (
                <MenuItem key={i + linkObj.label} onClick={makeOnClick(linkObj)} label={linkObj.label} />
              ))}
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
