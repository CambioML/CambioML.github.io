'use client';

import '@/app/theme.css';
import Logo from './Logo';
import NavMenu from './NavMenu';
import NavMenuFull from './NavMenuFull';
import ProductHunt from './ProductHunt';
import Container from '../Container';
import { ThemeToggle } from '../ThemeToggle';
import { getLocaleFromPathname } from '@/lib/i18n';
import { useTranslation } from '@/lib/use-translation';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useWindowScroll } from '@/app/hooks/useWindowScroll';

const Navbar = () => {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const { t, locale } = useTranslation();
  const isScrolled = useWindowScroll(50);

  const menuItems = [
    {
      label: t.nav.pricing,
      links: [],
      url: `/${locale}/pricing-rt`,
    },
    {
      label: t.nav.blog,
      links: [],
      url: `/${locale}/blog`,
    },
    {
      label: t.nav.company,
      links: [
        {
          label: t.nav.aboutUs,
          url: `/${locale}/company/about-us`,
        },
      ],
      url: `/${locale}/company/about-us`,
    },
    {
      label: t.nav.docs,
      url: 'https://docs.cambioml.com/introduction',
      links: [],
    },
  ];

  return (
    <div
      className={`fixed w-full z-40 flex flex-col justify-center transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border-1 h-[75px]' : 'bg-transparent h-[100px]'
      }`}
    >
      <div className="py-4">
        <Container>
          <h2 className="sr-only">Navigation Bar</h2>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <div className="flex items-center gap-3">
              <Logo />
              <ProductHunt />
            </div>
            <div className="hidden lg:flex flex-row items-center gap-3">
              {menuItems.map((item, i) => (
                <NavMenu key={item.label + i} label={item.label} links={item.links} url={item.url} />
              ))}
              <div className="w-[150px]">
                <a
                  href={`/${currentLocale}/anyparser`}
                  className="relative disabled:opacity-70 disabled:cursor-not-allowed rounded-xl whitespace-nowrap hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-cambio-gray dark:hover:text-neutral-200 transition w-full h-fit px-4 bg-white dark:bg-transparent border-cambio-gray dark:border-border-1 border text-neutral-800 dark:text-foreground py-3 text-lg inline-block text-center"
                >
                  {t.nav.trySandbox}
                </a>
              </div>
              <div className="w-[150px]">
                <a
                  href={`/${currentLocale}/account`}
                  className="relative disabled:opacity-70 disabled:cursor-not-allowed rounded-xl whitespace-nowrap hover:bg-neutral-200 dark:hover:bg-primary/90 hover:text-cambio-gray dark:hover:text-primary-foreground transition w-full h-fit px-4 bg-cambio-gray dark:bg-primary border-none text-neutral-100 dark:text-primary-foreground py-3 text-lg inline-block text-center"
                >
                  {t.nav.getApiKey}
                </a>
              </div>
              <LanguageSwitcher className="ml-2" />
              <ThemeToggle />
            </div>
            <div className="lg:hidden">
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <ThemeToggle />
                <NavMenuFull menuItems={menuItems} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
