import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
// import usePreviewModal from '@/app/hooks/usePreviewModal';
import { UploadModalState, useUploadModal } from '@/app/hooks/useUploadModal';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface SampleUploadFileProps {
  fileName: string;
  fileLabel: string;
  previewImage: string;
}

const basePath = '/sample_files/';

const SampleUploadFile = ({ fileName, fileLabel, previewImage }: SampleUploadFileProps) => {
  // const previewModal = usePreviewModal();
  const { setFilesToUpload } = usePlaygroundStore();
  const uploadModal = useUploadModal();
  const loadPdfFile = async (fileName: string) => {
    const filePath = `${basePath}${fileName}`;
    return fetch(filePath)
      .then((response) => response.blob())
      .then((blob) => new File([blob], fileName, { type: 'application/pdf' }))
      .catch((error) => {
        console.error('Error loading PDF file:', error);
      });
  };

  // const handlePreviewClick = async () => {
  //   const filePath = `${basePath}${fileName}`;
  //   const file = await fetch(filePath)
  //     .then((response) => response.blob())
  //     .then((blob) => new File([blob], fileName, { type: 'application/pdf' }));
  //   previewModal.setFile(file);
  //   previewModal.onOpen();
  // };

  const handleStarterFile = async () => {
    const starterFile = await loadPdfFile(fileName);
    if (!starterFile) {
      uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
      toast.error('Error loading starter file. Please try again.');
      return;
    }
    setFilesToUpload([starterFile]);
    uploadModal.setUploadModalState(UploadModalState.UPLOADING);
  };
  return (
    <div
      onClick={handleStarterFile}
      className="group h-48 w-full border border-border bg-card rounded-xl cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col md:h-56 overflow-hidden"
    >
      <div className="relative flex-1 overflow-hidden">
        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
          <Image src={`${basePath}${previewImage}`} alt={fileName} className="object-cover" fill />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </div>
      <div className="h-[40px] px-3 py-2 text-center bg-card border-t border-border flex items-center justify-center group-hover:bg-muted/50 transition-colors duration-300">
        <p className="text-sm font-medium text-card-foreground truncate">{fileLabel}</p>
      </div>
    </div>
  );
};

export default SampleUploadFile;
