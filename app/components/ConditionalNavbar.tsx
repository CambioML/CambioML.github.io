'use client';

import useTheme from '../hooks/useTheme';
import LightNavbar from './navbar/Navbar';
import DarkNavbar from './dark/navbar/Navbar';

const ConditionalNavbar = () => {
  const theme = useTheme();

  if (theme === 'dark') {
    return <DarkNavbar />;
  }

  return <LightNavbar />;
};

export default ConditionalNavbar;
