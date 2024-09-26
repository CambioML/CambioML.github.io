'use client';

import Container from '../Container';
import Logo from './Logo';
import NavMenu from './NavMenu';
import NavMenuFull from './NavMenuFull';
import { useRouter } from 'next/navigation';
import { useWindowScroll } from '@/app/hooks/useWindowScroll';
import ProductHunt from './ProductHunt';
import Button from '../Button';

const menuItems = [
  {
    label: 'Blog',
    links: [],
  },
  {
    label: 'Company',
    links: ['About us'],
  },
  {
    label: 'Docs',
    url: 'https://docs.cambioml.com',
    links: [],
  },
];

const Navbar = () => {
  const router = useRouter();
  const isScrolled = useWindowScroll(50);

  const makeOnClick = (label: string, link: string, callback: () => void) => {
    const url = `/${label}/${link}`.toLowerCase().replaceAll(' ', '-');
    return () => {
      router.push(url);
      callback();
    };
  };

  return (
    <div
      className={`fixed w-full z-50 flex flex-col justify-center ${isScrolled ? 'bg-white shadow-sm border-b-[1px] h-[75px]' : 'bg-transparent h-[100px]'} transition-all duration-300 ease-in-out`}
    >
      <div
        className="
        py-4
        "
      >
        <Container>
          <h2 className="sr-only">Navigation Bar</h2>
          <div
            className="
                    flex
                    flex-row
                    items-center
                    justify-between
                    gap-3
                    md: gap-0
                    "
          >
            <div className="flex items-center gap-3">
              <Logo />
              <ProductHunt />
            </div>
            <div className="hidden lg:flex flex-row items-center gap-3">
              {menuItems.map((item, i) => (
                <NavMenu key={item.label + i} label={item.label} links={item.links} url={item.url} />
              ))}
              <div className="w-[150px]">
                <Button label="Try Sandbox" onClick={() => router.push('/sandbox')} outline />
              </div>
              <div className="w-[150px]">
                <Button label="Get API key" onClick={() => router.push('/account')} />
              </div>
            </div>
            <div className="lg:hidden">
              <NavMenuFull menuItems={menuItems} makeOnClick={makeOnClick} />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
