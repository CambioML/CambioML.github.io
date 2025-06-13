import { useDropzone } from 'react-dropzone';
import { CloudArrowUp, Info } from '@phosphor-icons/react';
import { useCallback } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useUploadModal, UploadModalState } from '@/app/hooks/useUploadModal';
import toast from 'react-hot-toast';
import { useProductionContext } from './ProductionContext';
import { useTranslation } from '@/lib/use-translation';
import { cn } from '@/lib/cn';

// Removed static classes - now using dynamic theme-aware styling

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
  const { t } = useTranslation();

  if (!isProduction)
    allowedTypes = {
      ...allowedTypes,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { limit: 10, name: 'XLSX' },
    };

  function generateAllowedTypesString(types: AllowedTypes) {
    const typeNames = Object.values(types).map((type) => type.name);
    const lastType = typeNames.pop();
    return typeNames.length
      ? `${typeNames.join(', ')}${typeNames.length > 1 ? ',' : ''} and ${lastType} ${t.playground.upload.filesOnly}`
      : `${lastType} ${t.playground.upload.filesOnly}`;
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        if (file) {
          if (!Object.keys(allowedTypes).includes(file.type)) {
            toast.error(`Error processing ${file.name}: ${t.playground.upload.fileTypeNotSupported}`);
            uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
            return;
          }
          if (file.size > allowedTypes[file.type].limit * 1024 * 1024) {
            toast.error(
              `Error processing ${file.name}: ${t.playground.upload.sizeLimitExceeded.replace('{limit}', allowedTypes[file.type].limit.toString())}`
            );
            uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
            return;
          }
        }
      }
      setFilesToUpload(acceptedFiles);
      uploadModal.setUploadModalState(UploadModalState.UPLOADING);
    },
    [setFilesToUpload, uploadModal, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className={cn(
        'border border-dashed h-[40vh] min-h-[150px] rounded-md text-center cursor-pointer transition duration-300 ease-in-out flex flex-col items-center justify-center w-full',
        'bg-gray-100 dark:bg-neutral-700 border-gray-300 dark:border-neutral-500 text-gray-600 dark:text-neutral-200 hover:border-neutral-500 dark:hover:border-neutral-400'
      )}
      {...getRootProps()}
      id="dropzone-container"
    >
      <div className={cn('flex items-center justify-center text-3xl mb-4 text-gray-600 dark:text-neutral-300')}>
        <CloudArrowUp size={32} />
      </div>
      <input {...getInputProps()} className="hidden" id="upload-file-input" />
      <p className="mt-2">{isDragActive ? t.playground.upload.dropFiles : t.playground.upload.dragAndDrop}</p>
      <p className={cn('text-sm text-gray-500 dark:text-neutral-400')}>{generateAllowedTypesString(allowedTypes)}</p>
      <p className={cn('text-sm text-gray-500 dark:text-neutral-400')}>{t.playground.upload.noSensitiveInfo}</p>
      <div
        className={cn(
          'flex justify-center items-center gap-2 rounded-lg p-2',
          'bg-amber-200 dark:bg-amber-800/30 text-amber-700 dark:text-amber-300'
        )}
      >
        <Info weight="bold" />
        {t.playground.upload.maxSize}
      </div>
    </div>
  );
};

export default Dropzone;
