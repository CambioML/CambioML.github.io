import { Icon } from '@phosphor-icons/react';

interface IconRowProps {
  icon: Icon;
  text: string;
}

const IconRow = ({ icon: RowIcon, text }: IconRowProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 text-neutral-800 dark:text-gray-200 px-2">
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center rounded-2xl shadow-md bg-cambio-blue dark:bg-cambio-blue-2 py-10 w-[200px] h-[175px]">
          <RowIcon size={70} className="text-neutral-800 dark:text-white" />
        </div>
      </div>
      <div className="h-[150px] flex items-center text-center text-2xl leading-relaxed text-neutral-700 dark:text-gray-300">{text}</div>
    </div>
  );
};

export default IconRow;
