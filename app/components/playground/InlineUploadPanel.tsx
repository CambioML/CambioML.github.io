'use client';

import Dropzone from './Dropzone';
import SampleUploadFile from './SampleUploadFile';
import { playgroundSampleUploadFiles } from './sampleUploadFiles';
import { useTranslation } from '@/lib/use-translation';
import { useRouter } from 'next/navigation';

const InlineUploadPanel = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handlePrivacyClick = () => {
    router.push('/legal/privacy-policy.pdf');
  };

  return (
    <div className="flex h-full w-full flex-col items-stretch justify-start gap-8">
      <Dropzone />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {playgroundSampleUploadFiles.map((file, index) => (
            <SampleUploadFile
              key={index}
              fileName={file.fileName}
              fileLabel={file.fileLabel}
              previewImage={file.previewImage}
            />
          ))}
        </div>

        <div className="text-xs text-foreground/70 italic leading-tight">
          <p>{t.playground.disclaimers.pageLimit}</p>
          <p>
            {t.playground.disclaimers.fileSize}{' '}
            <button
              type="button"
              onClick={handlePrivacyClick}
              className="underline underline-offset-2 hover:text-blue-400 transition-colors"
            >
              {t.playground.disclaimers.privacyPolicy}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InlineUploadPanel;
