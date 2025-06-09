'use client';

import { usePathname } from 'next/navigation';

// List of pathnames where the dark theme should be used
// Supports both localized (/en/blog) and non-localized (/blog) paths
const DARK_PATHS = [
  '^/(?:[a-z]{2})$', // /, /en, /zh, etc.
  '^/(?:[a-z]{2}/)company', // /company, /en/company, /zh/company, etc.
  '^/(?:[a-z]{2}/)pricing-rt', // /pricing-rt, /en/pricing-rt, /zh/pricing-rt, etc.
  '^/(?:[a-z]{2}/)blog', // /blog, /en/blog, /zh/blog, etc.
];

// Precompile regex patterns to avoid creating new RegExp on every render
const darkRegexes = DARK_PATHS.map((pattern) => new RegExp(pattern));

const useTheme = () => {
  const pathname = usePathname();

  // Check if current pathname should use dark theme
  const isDarkTheme = darkRegexes.some((regex) => regex.test(pathname));

  if (isDarkTheme) {
    return 'dark';
  }

  return 'light';
};

export default useTheme;
