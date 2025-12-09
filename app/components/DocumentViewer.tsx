import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';
import Image from 'next/image';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './document-viewer.css';
import ComingSoonBanner from './playground/ComingSoonBanner';

type DocumentViewerProps = {
  fileType: string;
  fileUrl: string;
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileType, fileUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
  });

  const renderContent = () => {
    if (fileType === 'application/pdf') {
      return (
        <div className="document-viewer-container h-full w-full">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </div>
      );
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return (
        <div className="document-viewer-container h-[80vh] w-full">
          <ComingSoonBanner text="Preview for Office Files coming soon" />
          {/* <DocViewer documents={[{ uri: fileUrl, fileName: fileName }]} pluginRenderers={DocViewerRenderers} /> */}
        </div>
      );
    } else if (fileType.startsWith('image/')) {
      return (
        <div className="document-viewer-container h-auto w-full">
          <Image
            alt="Document"
            src={fileUrl}
            width={0}
            height={0}
            sizes="100%"
            style={{ width: '100%', height: 'auto' }}
            className="rounded-lg"
          />
        </div>
      );
    } else {
      return <div>Unsupported file type</div>;
    }
  };

  return <>{renderContent()}</>;
};

export default DocumentViewer;
