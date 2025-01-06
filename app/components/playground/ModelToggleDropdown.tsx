import { useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ModelType } from '@/app/types/PlaygroundTypes';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ModelToggleDropdown = () => {
  const { modelType, updateModelType } = usePlaygroundStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option: ModelType) => {
    updateModelType(option);
    setIsOpen(false);
  };

  const miniLabel = 'AnyParser-base';
  const proLabel = 'AnyParser-pro';
  const ultraLabel = 'AnyParser-ultra';

  const modelTypes = Object.values(ModelType).filter((value): value is ModelType => typeof value === 'number');

  const getLabel = (type: ModelType) => {
    switch (type) {
      case ModelType.BASE:
        return miniLabel;
      case ModelType.PRO:
        return proLabel;
      case ModelType.ULTRA:
        return ultraLabel;
      default:
        return 'Select Model';
    }
  };

  const disabledTypes: ModelType[] = [ModelType.ULTRA];

  return (
    <div className="relative inline-block text-left">
      <div className="w-[150px]">
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-between items-center w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-md font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {getLabel(modelType)}
          {isOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1">
            {modelTypes.map((type: ModelType) => {
              if (disabledTypes.includes(type)) return null;
              return (
                <button
                  key={type}
                  onClick={() => handleOptionSelect(type)}
                  className={`${
                    modelType === type ? 'bg-gray-100' : ''
                  } block w-full text-left px-4 py-2 text-md text-gray-700 hover:bg-gray-100`}
                  role="menuitem"
                >
                  {getLabel(type)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelToggleDropdown;
