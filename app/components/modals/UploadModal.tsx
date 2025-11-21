'use client';

import { useUploadModal, UploadModalState } from '@/app/hooks/useUploadModal';
import { CloudArrowUp } from '@phosphor-icons/react';
import { useEffect, useState, useCallback } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import Dropzone from '../playground/Dropzone';
import { toast } from 'react-hot-toast';
import PulsingIcon from '../PulsingIcon';
import { usePostHog } from 'posthog-js/react';
import SampleUploadFile from '../playground/SampleUploadFile';
import { playgroundSampleUploadFiles } from '../playground/sampleUploadFiles';
import { useTranslation } from '@/lib/use-translation';
import { useRouter } from 'next/navigation';
import ModalBase from './ModalBase';

const UploadModal = () => {
  const uploadModal = useUploadModal();
  const posthog = usePostHog();
  const { t } = useTranslation();
  const router = useRouter();

  const { filesToUpload, addFiles, setFilesToUpload, files } = usePlaygroundStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (uploadModal.uploadModalState === UploadModalState.UPLOADING) {
      setIsLoading(true);
      filesToUpload.forEach((file) => {
        posthog.capture('playground.upload.start', { route: '/playground', file_type: file.type, module: 'upload' });
        addFiles({ files: file });
      });

      setFilesToUpload([]);
      posthog.capture('playground.upload.success', {
        route: '/playground',
        module: 'upload',
      });
      uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
      setIsLoading(false);
      uploadModal.onClose();
      toast.success(t.messages.success.fileUploaded);
    }
  }, [uploadModal.uploadModalState, uploadModal, filesToUpload, addFiles, posthog, setFilesToUpload, t]);

  const generateRandomString = (length = 4) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const clipboardItems = event.clipboardData?.items;
      const filesToUploadList: File[] = [];
      const existingFileNames = files.map((file) => {
        if (file.file instanceof File) return file.file.name;
      });
      if (clipboardItems) {
        for (let i = 0; i < clipboardItems.length; i++) {
          const item = clipboardItems[i];
          if (item.type.startsWith('image')) {
            const file = item.getAsFile();
            if (file) {
              let newName;
              do {
                const randomString = generateRandomString();
                newName = `image_${randomString}.${file.type.split('/')[1]}`;
              } while (existingFileNames.includes(newName));

              const newFile = new File([file], newName, { type: file.type });
              filesToUploadList.push(newFile);
            }
          }
        }

        if (filesToUploadList.length > 0) {
          setFilesToUpload(filesToUploadList);
          uploadModal.setUploadModalState(UploadModalState.UPLOADING);
        }
      }
    },
    [setFilesToUpload, uploadModal, files]
  );

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const body = (
    <div className="w-full flex flex-col gap-6">
      {uploadModal.uploadModalState === UploadModalState.ADD_FILES && (
        <>
          <Dropzone />
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {playgroundSampleUploadFiles.map((file, index) => (
              <SampleUploadFile
                key={index}
                fileName={file.fileName}
                fileLabel={file.fileLabel}
                previewImage={file.previewImage}
              />
            ))}
          </div>
          <div className="w-full text-xs text-muted-foreground italic text-center leading-tight opacity-80">
            <p>{t.playground.disclaimers.pageLimit}</p>
            <p>
              {t.playground.disclaimers.fileSize}{' '}
              <button
                type="button"
                className="underline underline-offset-2 hover:text-blue-400 transition-colors"
                onClick={() => router.push('/legal/privacy-policy.pdf')}
              >
                {t.playground.disclaimers.privacyPolicy}
              </button>
            </p>
          </div>
        </>
      )}
      {uploadModal.uploadModalState === UploadModalState.UPLOADING && (
        <div className="flex flex-col justify-center items-center gap-4 text-xl">
          {t.playground.uploadModal.uploading}
          <PulsingIcon Icon={CloudArrowUp} size={40} />
        </div>
      )}
    </div>
  );

  return (
    <ModalBase
      isOpen={uploadModal.isOpen}
      onClose={uploadModal.onClose}
      title={t.playground.files.uploadFile}
      size="lg"
      zIndexClass="z-[100]"
      overlayProps={{ id: 'upload-modal' }}
    >
      {body}
    </ModalBase>
  );
};

export default UploadModal;
