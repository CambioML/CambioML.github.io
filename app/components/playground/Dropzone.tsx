import { useDropzone } from 'react-dropzone';
import { CloudArrowUp, Info } from '@phosphor-icons/react';
import { useCallback } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useUploadModal, UploadModalState } from '@/app/hooks/useUploadModal';
import toast from 'react-hot-toast';
import { useProductionContext } from './ProductionContext';
import { useTranslation } from '@/lib/use-translation';

const DropzoneContainerClass =
  'border-2 bg-gray-100 border-dashed border-gray-300 h-[40vh] min-h-[150px] rounded-md text-center cursor-pointer transition duration-300 ease-in-out flex flex-col items-center justify-center hover:border-neutral-500 w-full text-gray-600';

const iconContainerClasses = 'flex items-center justify-center text-3xl mb-4 text-gray-600';

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
    <div className={DropzoneContainerClass} {...getRootProps()} id="dropzone-container">
      <div className={iconContainerClasses}>{<CloudArrowUp size={32} />}</div>
      <input {...getInputProps()} className="hidden" id="upload-file-input" />
      <p className="mt-2">{isDragActive ? t.playground.upload.dropFiles : t.playground.upload.dragAndDrop}</p>
      <p className="text-sm text-gray-500">{generateAllowedTypesString(allowedTypes)}</p>
      <p className="text-sm text-gray-500">{t.playground.upload.noSensitiveInfo}</p>
      <div className="flex justify-center items-center gap-2 bg-amber-200 rounded-lg p-2">
        <Info weight="bold" className="text-amber-700" />
        {t.playground.upload.maxSize}
      </div>
    </div>
  );
};

export default Dropzone;
