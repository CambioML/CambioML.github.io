'use client';

interface MenuItemProps {
  onClick?: () => void;
  label: string;
  url: string;
}

const MenuItem = ({ onClick, label, url }: MenuItemProps) => {
  return (
    <a
      href={url}
      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-border-1 transition font-semibold text-md text-gray-800 dark:text-foreground hover:text-gray-600 dark:hover:text-light cursor-pointer"
      onClick={onClick}
    >
      {label}
    </a>
  );
};

export default MenuItem;
