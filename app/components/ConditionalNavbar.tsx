'use client';

import { usePathname } from 'next/navigation';
import LightNavbar from './navbar/Navbar';
import DarkNavbar from './dark/navbar/Navbar';

// List of pathnames where the dark navbar should be used
const DARK_NAVBAR_PATHS = ['^/$', '^/company/', '^/pricing-rt', '^/blog'];

const ConditionalNavbar = () => {
  const pathname = usePathname();

  // Check if current pathname should use dark navbar
  const shouldUseDarkNavbar = DARK_NAVBAR_PATHS.some((path) => new RegExp(path).test(pathname));

  if (shouldUseDarkNavbar) {
    return <DarkNavbar />;
  }

  return <LightNavbar />;
};

export default ConditionalNavbar;
