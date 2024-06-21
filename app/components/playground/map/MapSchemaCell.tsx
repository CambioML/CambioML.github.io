import { Icon } from '@phosphor-icons/react';
import { IconType } from 'react-icons';
import React, { forwardRef } from 'react';

interface MapSchemaCellProps {
  text: string;
  handleIconClick: () => void;
  icon: Icon | IconType;
  isLoading: boolean;
  bold?: boolean;
}

const MapSchemaCell = forwardRef<HTMLDivElement, MapSchemaCellProps>(
  ({ text, handleIconClick, icon: Icon, isLoading, bold }, ref) => {
    const inputStyles = `p-2 rounded-xl h-[40px] w-full overflow-hidden ${bold ? 'font-semibold border-[2px] border-neutral-400' : 'border-[1px] border-neutral-300'}`;
    return (
      <>
        {text.length === 0 ? (
          <>
            {isLoading ? (
              <div ref={ref} className={`bg-neutral-200 animate-pulse ${inputStyles}`} />
            ) : (
              <div ref={ref} className={`bg-neutral-100 ${inputStyles}`} />
            )}
          </>
        ) : (
          <div ref={ref} className={`flex justify-between items-center group ${inputStyles}`}>
            <div className="overflow-auto whitespace-nowrap flex-1">{text}</div>
            <button
              onClick={handleIconClick}
              className="ml-2 w-[25px] h-[25px] hidden group-hover:block hover:text-neutral-900 hover:bg-neutral-200 rounded-full text-neutral-700 p-1 font-bold transition duration-300"
            >
              <Icon size={18} weight="bold" />
            </button>
          </div>
        )}
      </>
    );
  }
);

export default MapSchemaCell;