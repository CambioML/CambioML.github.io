'use client';

import React from 'react';
import { List, X } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';
import { useTranslation } from '@/lib/use-translation';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/i18n';

interface NavMenuProps {
  menuItems: {
    label: string;
    links: { label: string; url: string }[];
    url?: string;
  }[];
}

const NavMenu = ({ menuItems }: NavMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const { t } = useTranslation();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  return (
    <>
      <div className="relative">
        <div className="flex flex-row items-center gap-3">
          <div
            onClick={() => {
              toggleOpen();
            }}
            className="
                    p-4
                    border-[1px]
                    border-border-1
                    text-foreground
                    flex
                    flex-row
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:bg-border-1
                    hover:shadow-[0px_0px_2px_0.5px_rgba(112,190,250,0.75)]
                    transition
                    "
          >
            {isOpen ? <X /> : <List />}
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
                absolute
                shadow-[0px_4px_12px_rgba(0,0,0,0.4)]
                w-[100vw]
                h-[50vh]
                lg:hidden
                bg-background/95
                backdrop-blur-lg
                border-b
                border-border-1
                left-0
                top-[83px]
                z-10
                pb-10
                "
        >
          <div className="w-full flex flex-col justify-center">
            {menuItems.map((item) => (
              <React.Fragment key={item.label}>
                {item.links.length === 0 ? (
                  <a
                    href={item.url || `/${item.label.toLowerCase()}`}
                    className="w-full h-max flex justify-center text-4xl py-5 font-semibold text-foreground cursor-pointer hover:text-light transition"
                    onClick={toggleOpen}
                  >
                    {item.label}
                  </a>
                ) : (
                  <div className="w-full h-max flex justify-center text-4xl py-5 font-semibold text-foreground">
                    {item.label}
                  </div>
                )}
                <div className="flex flex-col items-center justify-center gap-4">
                  {item.links.map((linkObj, i) => (
                    <a
                      key={linkObj.label + i}
                      href={linkObj.url}
                      onClick={toggleOpen}
                      className="w-full h-[20px] flex justify-center text-2xl text-foreground cursor-pointer hover:text-light transition"
                    >
                      {linkObj.label}
                    </a>
                  ))}
                </div>
              </React.Fragment>
            ))}
            <div className="w-full flex flex-col gap-4 px-20 ">
              <div className="w-full pt-20">
                <a
                  href={`/${currentLocale}/anyparser`}
                  onClick={toggleOpen}
                  className="relative disabled:opacity-70 disabled:cursor-not-allowed rounded-xl whitespace-nowrap hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-cambio-gray dark:hover:text-neutral-200 transition w-full h-fit px-4 bg-white dark:bg-transparent border-cambio-gray dark:border-border-1 border text-neutral-800 dark:text-foreground py-3 text-lg inline-block text-center"
                >
                  {t.nav.trySandbox}
                </a>
              </div>
              <div className="w-full">
                <a
                  href={`/${currentLocale}/account`}
                  onClick={toggleOpen}
                  className="relative disabled:opacity-70 disabled:cursor-not-allowed rounded-xl whitespace-nowrap hover:bg-neutral-200 dark:hover:bg-primary/90 hover:text-cambio-gray dark:hover:text-primary-foreground transition w-full h-fit px-4 bg-cambio-gray dark:bg-primary border-none text-neutral-100 dark:text-primary-foreground py-3 text-lg inline-block text-center"
                >
                  {t.nav.getApiKey}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavMenu;
