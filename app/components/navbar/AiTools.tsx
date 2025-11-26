'use client';

const AiTools = () => {
  return (
    <div className="flex items-center">
      <a href="https://aitools.inc/tools/any-parser" target="_blank" rel="noopener noreferrer">
        {/* Light theme image - visible in light mode */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://aitools.inc/tools/any-parser/embeds/v1/featured-badge.svg?theme=light"
          alt="Any Parser - Featured on AiTools.inc"
          className="block dark:hidden"
        />
        {/* Dark theme image - visible in dark mode */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://aitools.inc/tools/any-parser/embeds/v1/featured-badge.svg?theme=dark"
          alt="Any Parser - Featured on AiTools.inc"
          className="hidden dark:block"
        />
      </a>
    </div>
  );
};

export default AiTools;
