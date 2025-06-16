'use client';

import DarkNavbar from './dark/navbar/Navbar';
import Navbar from './navbar/Navbar';

const ConditionalNavbar = () => {
  return (
    <>
      {/* Light navbar - visible in light mode */}
      <div className="block dark:hidden">
        <Navbar />
      </div>

      {/* Dark navbar - visible in dark mode */}
      <div className="hidden dark:block">
        <DarkNavbar />
      </div>
    </>
  );
};

export default ConditionalNavbar;
