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
      className="h-full w-full border-2 rounded-lg cursor-pointer hover:border-neutral-700 hover:shadow-lg flex flex-col"
    >
      <div className="flex-grow relative overflow-hidden rounded-t-lg">
        <div className="relative w-full h-full overflow-hidden rounded-t-lg hover:scale-105 transition-transform duration-300">
          <Image src={`${basePath}${previewImage}`} alt={fileName} className="object-cover rounded-t-lg" fill />
        </div>
      </div>
      <div className="h-[40px] p-1 text-center text-neutral-100 rounded-b-md flex items-center justify-center bg-neutral-700">
        <p className="text-sm font-medium font-semibold truncate">{fileLabel}</p>
      </div>
    </div>
  );
};

export default SampleUploadFile;
