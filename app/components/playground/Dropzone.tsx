import { useDropzone } from 'react-dropzone';
import { CloudArrowUp } from '@phosphor-icons/react';
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
        'relative group cursor-pointer transition-all duration-300 ease-in-out w-full',
        'bg-muted/30 hover:bg-muted/50 border border-border rounded-xl p-6',
        'shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)] dark:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.25)]',
        isDragActive && 'ring-2 ring-primary border-primary bg-muted/50 shadow-[0_0_60px_-10px_rgba(59,130,246,0.4)]'
      )}
      {...getRootProps()}
      id="dropzone-container"
    >
      <input {...getInputProps()} className="hidden" id="upload-file-input" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-background rounded-2xl border border-border shadow-sm">
            <CloudArrowUp size={36} className="text-primary" />
          </div>
          <div className="flex flex-col gap-1 text-left">
            <p className="text-lg font-semibold text-foreground">
              {isDragActive ? t.playground.upload.dropFiles : 'Drag & drop, or click to upload.'}
            </p>
            <p className="text-xs text-muted-foreground">PDF, PNG, JPEG, JPG, PPT, and DOCX files only.</p>
            <p className="text-xs text-muted-foreground">{t.playground.upload.maxSize}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
