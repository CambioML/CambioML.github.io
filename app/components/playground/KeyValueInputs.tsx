import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { BiPlus, BiMinus, BiCaretRight } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import Button from '../Button';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';

interface InputProps {
  id: string;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
  onAdd?: () => void;
  onRemove?: () => void;
  canRemove?: boolean;
  onInputChange: () => void;
}

interface KeyValueInputsProps {
  onSubmit: (extractInstructions: Record<string, string>) => void;
  isLoading?: boolean;
}

const AddButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button 
      className="border hover:bg-gray-100 p-1 rounded" 
      onClick={onClick}
      aria-label="Add Key-Value Pair"
    >
      <BiPlus size={12} />
    </button>
  );
};

const RemoveButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button 
      className="border hover:bg-gray-100 p-1 rounded" 
      onClick={onClick}
      aria-label="Remove Key-Value Pair"
    >
      <BiMinus size={12} />
    </button>
  );
};

const ExpandButton = ({ active, onClick }: { active: boolean, onClick: () => void }) => {
  return (
    <button 
      className="hover:bg-gray-100 p-1 rounded -mt-1" 
      onClick={onClick} 
      aria-label="Expand Key Description"
    >
      <BiCaretRight className={`transition-all duration-300 ${active ? 'rotate-90' : ''}`} />
    </button>
  );
};

const Input = ({
  id,
  errors,
  register,
  onAdd,
  onRemove,
  canRemove = true,
  onInputChange,
}: InputProps) => {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  return (
    <div className="flex min-h-12">
      <div className="flex flex-col gap-1 mr-1">
        <AddButton onClick={onAdd} />
        {canRemove && <RemoveButton onClick={onRemove} />}
      </div>
      <div className="flex flex-col items-center">
        <ExpandButton onClick={() => {setDescriptionExpanded(!descriptionExpanded)}} active={descriptionExpanded} />
        <div className="w-0.5 bg-cambio-gray transition-all duration-300 h-4/5"></div>
      </div>
      <div className="w-full relative flex flex-col gap-1 justify-center">
        <input
          id={`${id}-key`}
          {...register(`${id}-key`, {
            required: true,
            onChange: () => setTimeout(onInputChange, 0)
          })}
          placeholder="Key Name"
          type="text"
          aria-label="Key Name Input"
          className={`
            w-full
            p-1
            font-light
            bg-white
            border-2
            rounded-md
            outline-none
            transition-colors
            ${errors[`${id}-key`] ? 'border-rose-500 bg-rose-50' : 'border-neutral-300'}
            ${errors[`${id}-key`] ? 'focus:border-rose-500' : 'focus:border-black'}
          `}
        />
        {errors[`${id}-key`] && (
          <span className="text-xs text-rose-500 mt-0.5">
            {errors[`${id}-key`]?.message?.toString() || 'Key name is required'}
          </span>
        )}
        <div className={`transition-all duration-300 ${descriptionExpanded ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <textarea
            id={`${id}-description`}
            {...register(`${id}-description`, {
              onChange: () => setTimeout(onInputChange, 0)
            })}
            placeholder="(Optional) Define keys to enhance AnyParser's accuracy"
            rows={2}
            aria-label="Key Description"
            className={`
              resize-none
              text-sm
              break-all
              w-full
              p-1
              font-light
              bg-white
              border-2
              rounded-md
              outline-none
              transition
              ${errors[`${id}-description`] ? 'border-rose-500' : 'border-neutral-300'}
              ${errors[`${id}-description`] ? 'focus:border-rose-500' : 'focus:border-black'}
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default function KeyValueInputs({ onSubmit, isLoading = false }: KeyValueInputsProps) {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    unregister,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    shouldUnregister: true
  });
  const [inputs, setInputs] = useState<string[]>([uuidv4()]);
  const [prevFileIndex, setPrevFileIndex] = useState<number | null>(null);

  // Load saved inputs when selectedFile changes
  useEffect(() => {
    if (selectedFileIndex === null) return;
    if (selectedFileIndex === prevFileIndex) return; // Skip if same file
    
    setPrevFileIndex(selectedFileIndex);
    const file = files[selectedFileIndex];
    const savedInputs = file?.keyValueInputs || [{ key: '', description: '' }];
    
    // Clear existing form data
    reset();
    
    // Clear existing inputs
    inputs.forEach(uuid => {
      unregister(`${uuid}-key`);
      unregister(`${uuid}-description`);
    });

    // Create new UUIDs for each saved input
    const newUuids = savedInputs.map(() => uuidv4());
    setInputs(newUuids);

    // Set form values in the next tick to ensure fields are registered
    setTimeout(() => {
      savedInputs.forEach((input, index) => {
        setValue(`${newUuids[index]}-key`, input.key);
        setValue(`${newUuids[index]}-description`, input.description);
      });
    }, 0);
  }, [selectedFileIndex, files]);

  // Save to store whenever inputs change
  const saveToStore = () => {
    if (selectedFileIndex === null) return;
    
    const formValues = getValues();
    const savedInputs = inputs.map(uuid => ({
      key: formValues[`${uuid}-key`] || '',
      description: formValues[`${uuid}-description`] || ''
    }));

    updateFileAtIndex(selectedFileIndex, 'keyValueInputs', savedInputs);
  };

  const addInput = () => {
    if (inputs.length < 10) {
      const newUuid = uuidv4();
      setInputs(prev => [...prev, newUuid]);
      toast.success('New input added');
      // Save after adding new input
      setTimeout(saveToStore, 0);
    } else {
      toast.error('Maximum 10 inputs allowed');
    }
  };

  const removeInput = (uuid: string) => {
    const position = inputs.indexOf(uuid);
    if (position === -1) return;
    
    // Save the form values before removing
    const formValues = getValues();
    const keyValue = formValues[`${uuid}-key`] || '';
    const descriptionValue = formValues[`${uuid}-description`] || '';
    
    // Unregister the form fields
    unregister(`${uuid}-key`);
    unregister(`${uuid}-description`);
    
    const removedData = {
      uuid,
      position,
      values: {
        key: keyValue,
        description: descriptionValue
      }
    };
    
    setInputs(currentInputs => {
      const newInputs = currentInputs.filter(id => id !== uuid);
      // Save after removing input
      setTimeout(() => {
        saveToStore();
      }, 0);
      return newInputs;
    });
    
    // Dismiss any existing undo toasts
    toast.dismiss('undo-toast');
    
    toast.success(
      (t) => (
        <div className="flex items-center gap-2">
          <span>Input removed</span>
          <button
            className="text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              
              if (removedData) {
                const insertPosition = Math.min(removedData.position, inputs.length);
                setInputs(currentInputs => {
                  const newInputs = [
                    ...currentInputs.slice(0, insertPosition),
                    removedData.uuid,
                    ...currentInputs.slice(insertPosition)
                  ];
                  setTimeout(() => {
                    setValue(`${removedData.uuid}-key`, removedData.values.key);
                    setValue(`${removedData.uuid}-description`, removedData.values.description);
                    saveToStore();
                  }, 0);
                  return newInputs;
                });
                
                toast.dismiss(t.id);
                toast.success('Remove undone');
              }
            }}
          >
            Undo
          </button>
        </div>
      ),
      { 
        duration: 5000,
        id: 'undo-toast'
      }
    );
  };

  const getExtractInstructions = () => {
    const extractInstruction: Record<string, string> = {};
    const formValues = getValues();
    
    inputs.forEach(uuid => {
      const keyValue = formValues[`${uuid}-key`];
      const description = formValues[`${uuid}-description`] || '';
      
      if (keyValue) {
        extractInstruction[keyValue] = description || keyValue;
      }
    });

    return extractInstruction;
  };

  const extractButtonClickHandler = () => {
    const instructions = getExtractInstructions();
    onSubmit(instructions);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        id="extract-key-value-btn"
        label={isLoading ? "Extracting..." : "Extract Key-Value"}
        onClick={handleSubmit(extractButtonClickHandler)}
        disabled={isLoading}
        aria-label="Extract Key-Value Pairs"
      />
      <strong>Your Keys</strong>
      <div className="h-[calc(80vh-240px)] overscroll-contain overflow-y-auto">
        <div className="flex flex-col gap-2 p-2">
          {inputs.map((uuid) => (
            <Input 
              key={uuid}
              id={uuid}
              register={register}
              errors={errors}
              onAdd={addInput}
              onRemove={() => removeInput(uuid)}
              canRemove={inputs.length > 1}
              onInputChange={saveToStore}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
