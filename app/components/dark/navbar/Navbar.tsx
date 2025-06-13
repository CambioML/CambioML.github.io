'use client';

import '@/app/theme.css';
import Logo from './Logo';
import Button from '../../Button';
import NavMenu from './NavMenu';
import NavMenuFull from './NavMenuFull';
import ProductHunt from '../../navbar/ProductHunt';
import Container from '../../Container';
import { ThemeToggle } from '../../ThemeToggle';
import { getLocaleFromPathname } from '@/lib/i18n';
import { useTranslation } from '@/lib/use-translation';
import { useRouter, usePathname } from 'next/navigation';
import { LanguageSwitcher } from '../../LanguageSwitcher';
import { useWindowScroll } from '@/app/hooks/useWindowScroll';

const Navbar = () => {
  const router = useRouter();
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
      url: 'https://docs.cambioml.com',
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
                <Button label={t.nav.trySandbox} onClick={() => router.push(`/${currentLocale}/anyparser`)} outline />
              </div>
              <div className="w-[150px]">
                <Button label={t.nav.getApiKey} onClick={() => router.push(`/${currentLocale}/account`)} />
              </div>
              <LanguageSwitcher className="ml-2" theme="dark" />
              <ThemeToggle variant="dark" />
            </div>
            <div className="lg:hidden">
              <div className="flex items-center gap-3">
                <LanguageSwitcher theme="dark" />
                <ThemeToggle variant="dark" />
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
