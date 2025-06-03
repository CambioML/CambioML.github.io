'use client';

import { usePathname } from 'next/navigation';
import LightNavbar from './navbar/Navbar';
import DarkNavbar from './dark/navbar/Navbar';

// List of pathnames where the dark navbar should be used
const DARK_NAVBAR_PATHS = ['^/$', '^/company/', '^/pricing-rt', '^/blog'];

// Precompile regex patterns to avoid creating new RegExp on every render
const darkNavbarRegexes = DARK_NAVBAR_PATHS.map((pattern) => new RegExp(pattern));

const ConditionalNavbar = () => {
  const pathname = usePathname();

  // Check if current pathname should use dark navbar
  const shouldUseDarkNavbar = darkNavbarRegexes.some((regex) => regex.test(pathname));

  if (shouldUseDarkNavbar) {
    return <DarkNavbar />;
  }

  return <LightNavbar />;
};

export default ConditionalNavbar;
