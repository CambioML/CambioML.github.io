'use client';

import { usePathname } from 'next/navigation';
import LightNavbar from './navbar/Navbar';
import DarkNavbar from './dark/navbar/Navbar';

// List of pathnames where the dark navbar should be used
// Supports both localized (/en/blog) and non-localized (/blog) paths
const DARK_NAVBAR_PATHS = [
  '^/(?:[a-z]{2})$', // /, /en, /zh, etc.
  '^/(?:[a-z]{2}/)company', // /company, /en/company, /zh/company, etc.
  '^/(?:[a-z]{2}/)pricing-rt', // /pricing-rt, /en/pricing-rt, /zh/pricing-rt, etc.
  '^/(?:[a-z]{2}/)blog', // /blog, /en/blog, /zh/blog, etc.
];

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
