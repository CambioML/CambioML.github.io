'use client';

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem = ({ onClick, label }: MenuItemProps) => {
  return (
    <div
      className="px-4 py-3 hover:bg-border-1 transition font-semibold text-md text-foreground hover:text-light cursor-pointer"
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default MenuItem;
