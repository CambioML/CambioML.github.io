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
        className="
                    text-xl
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    text-neutral-800
                    hover:text-cambio-red
                    transition
                    cursor-pointer
                    "
        ref={excludeRef}
      >
        {label.toUpperCase()}
      </div>
      {isOpen && (
        <div
          className="
            absolute
            rounded-xl
            shadow-md
            w-[150px]
            bg-white
            overflow-hidden
            right-0
            top-12
            text-sm
            text-neutral-800
          "
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
