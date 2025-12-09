'use client';
import React from 'react';
import usePreviewModal from '@/app/hooks/usePreviewModal';
import LargeModal from './LargeModal';
import DocumentViewer from '../DocumentViewer';

const PreviewModal = () => {
  const { isOpen, onClose, file } = usePreviewModal();

  if (!file) return null;

  const content = (
    <div className="w-full h-[80vh] min-h-[600px] overflow-scroll text-foreground">
      <DocumentViewer fileType={file?.type} fileUrl={URL.createObjectURL(file)} />
    </div>
  );

  return <LargeModal isOpen={isOpen} onClose={onClose} title={file.name} body={content} />;
};

export default PreviewModal;
