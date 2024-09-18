import { useDropzone } from 'react-dropzone';
import { CloudArrowUp, Info } from '@phosphor-icons/react';
import { useCallback } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useUploadModal, UploadModalState } from '@/app/hooks/useUploadModal';
import toast from 'react-hot-toast';
import { useProductionContext } from './ProductionContext';

const DropzoneContainerClass =
  'border-2 bg-gray-100 border-dashed border-gray-300 h-[40vh] min-h-[150px] rounded-md text-center cursor-pointer transition duration-300 ease-in-out flex flex-col items-center justify-center hover:border-neutral-500 w-full';

const iconContainerClasses = 'flex items-center justify-center text-3xl mb-4';

type AllowedTypes = {
  [key: string]: { limit: number; name: string };
};

let allowedTypes: AllowedTypes = {
  'application/pdf': { limit: 10, name: 'PDF' },
  'image/png': { limit: 10, name: 'PNG' },
  'image/jpeg': { limit: 10, name: 'JPEG' },
  'image/jpg': { limit: 10, name: 'JPG' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { limit: 10, name: 'PPT' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { limit: 10, name: 'DOCX' },
};

const Dropzone = () => {
  const uploadModal = useUploadModal();
  const { setFilesToUpload } = usePlaygroundStore();
  const { isProduction } = useProductionContext();
  if (!isProduction)
    allowedTypes = {
      ...allowedTypes,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { limit: 10, name: 'XLSX' },
    };

  function generateAllowedTypesString(types: AllowedTypes) {
    const typeNames = Object.values(types).map((type) => type.name);
    const lastType = typeNames.pop();
    return typeNames.length
      ? `${typeNames.join(', ')}${typeNames.length > 1 ? ',' : ''} and ${lastType} files only`
      : `${lastType} files only`;
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        if (file) {
          if (!Object.keys(allowedTypes).includes(file.type)) {
            toast.error(`Error processing ${file.name}: File type is not supported.`);
            uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
            return;
          }
          if (file.size > allowedTypes[file.type].limit * 1024 * 1024) {
            toast.error(
              `Error processing ${file.name}: Size exceeds the ${allowedTypes[file.type]}MB limit. Please try again.`
            );
            uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
            return;
          }
        }
      }
      setFilesToUpload(acceptedFiles);
      uploadModal.setUploadModalState(UploadModalState.UPLOADING);
    },
    [setFilesToUpload, uploadModal]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={DropzoneContainerClass} {...getRootProps()}>
      <div className={iconContainerClasses}>{<CloudArrowUp size={32} />}</div>
      <input {...getInputProps()} className="hidden" />
      <p className="mt-2">
        {isDragActive ? 'Drop files here' : 'Drag and drop a single file here or click to select a file'}
      </p>
      <p className="text-sm text-gray-500">{generateAllowedTypesString(allowedTypes)}</p>
      <p className="text-sm text-gray-500">Please do not upload any sensitive information.</p>
      <div className="text-md text-amber-700 text-gray-500 flex justify-center items-center gap-2 bg-amber-200 rounded-lg p-2">
        <Info weight="bold" />
        Max size 10MB
      </div>
    </div>
  );
};

export default Dropzone;
