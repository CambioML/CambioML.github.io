'use client';

import { useCallback, useState, useRef } from 'react';
import MenuItem from './MenuItem';
import { useOutsideClick } from '@/app/hooks/useOutsideClick';

interface NavMenuProps {
  label: string;
  links: { label: string; url: string }[];
  url?: string;
}

const NavMenu = ({ label, links, url }: NavMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const excludeRef = useRef<HTMLDivElement>(null);
  const ref = useOutsideClick(() => {
    toggleOpen();
  }, excludeRef);

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleLabelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (links.length === 0) {
      return; // Let the anchor tag handle navigation
    }
    toggleOpen();
  };

  return (
    <div className="relative">
      {links.length === 0 ? (
        <a
          href={url || `/${label}`.toLowerCase().replaceAll(' ', '-')}
          className="text-lg font-semibold py-3 px-4 rounded-full text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer inline-block"
        >
          {label.toUpperCase()}
        </a>
      ) : (
        <div
          onClick={handleLabelClick}
          className="text-lg font-semibold py-3 px-4 rounded-full text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          ref={excludeRef}
        >
          {label.toUpperCase()}
        </div>
      )}
      {isOpen && (
        <div
          className="absolute rounded-2xl w-[200px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-200 dark:border-blue-500/30 overflow-hidden right-0 top-12 text-sm z-40 shadow-lg dark:shadow-[0_0_20px_4px_rgba(0,0,0,0.5)] dark:shadow-blue-500/20"
          ref={ref}
        >
          <div className="flex flex-col cursor-pointer">
            <>
              {links.map((linkObj, i) => (
                <MenuItem
                  key={i + linkObj.label}
                  onClick={handleMenuItemClick}
                  label={linkObj.label}
                  url={linkObj.url}
                />
              ))}
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
