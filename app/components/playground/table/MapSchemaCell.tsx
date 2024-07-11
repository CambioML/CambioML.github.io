import { Icon } from '@phosphor-icons/react';
import { IconType } from 'react-icons';
import React, { forwardRef } from 'react';

interface MapSchemaCellProps {
  text: string;
  handleIconClick: () => void;
  handleSecondIconClick?: () => void;
  icon: Icon | IconType;
  secondIcon?: Icon | IconType;
  isLoading: boolean;
  bold?: boolean;
}

const MapSchemaCell = forwardRef<HTMLDivElement, MapSchemaCellProps>(
  ({ text, handleIconClick, icon: Icon, isLoading, bold, handleSecondIconClick, secondIcon: SecondIcon }, ref) => {
    const inputStyles = `p-2 rounded-xl h-[40px] overflow-hidden ${bold ? 'font-semibold border-[2px] border-neutral-400' : 'border-[1px] border-neutral-300'}`;

    return (
      <>
        {isLoading && (text.length === 0 || text === 'None') ? (
          <div ref={ref} className={`bg-neutral-200 animate-pulse ${inputStyles}`} />
        ) : (
          <>
            {text.length === 0 ? (
              <div ref={ref} className={`bg-neutral-100 ${inputStyles}`} />
            ) : (
              <div
                ref={ref}
                className={`flex justify-between items-center group ${text === 'None' && 'bg-neutral-100 text-neutral-500'} ${inputStyles}`}
              >
                <div className="overflow-auto whitespace-nowrap flex-1">{text}</div>
                <button
                  onClick={handleIconClick}
                  className="ml-2 w-[25px] h-[25px] hidden group-hover:block hover:text-neutral-900 hover:bg-neutral-200 rounded-full text-neutral-700 p-1 font-bold transition duration-300"
                >
                  <Icon size={18} weight="bold" />
                </button>
                {SecondIcon && (
                  <button
                    onClick={handleSecondIconClick}
                    className="ml-2 w-[25px] h-[25px] hidden group-hover:block hover:text-neutral-900 hover:bg-neutral-200 rounded-full text-neutral-700 p-1 font-bold transition duration-300"
                  >
                    <SecondIcon size={18} weight="bold" />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </>
    );
  }
);

export default MapSchemaCell;
