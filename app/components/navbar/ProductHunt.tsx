'use client';

const ProductHunt = () => {
  return (
    <div className="flex items-center">
      {/* Light theme image - visible in light mode */}
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=716228&theme=light&period=daily"
        alt="Any Parser - Extract data from any documents | Product Hunt"
        className="block dark:hidden"
      />
      {/* Dark theme image - visible in dark mode */}
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=716228&theme=dark&period=daily"
        alt="Any Parser - Extract data from any documents | Product Hunt"
        className="hidden dark:block"
      />
    </div>
  );
};

export default ProductHunt;
