import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { ArrowLeft, Download } from '@phosphor-icons/react';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { useProductionContext } from './ProductionContext';
import { runSyncExtractKeyValue } from '@/app/actions/runSyncExtractKeyValue';
import Button from '../Button';
import CodeBlock from '../CodeBlock';
import DocumentViewer from '../DocumentViewer';
import KeyValueInputs from './KeyValueInputs';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import ExtractKeyValuePairTutorial from '../tutorials/ExtractKeyValuePairTutorial';

const downloadExtractedData = (data: string | null, file?: PlaygroundFile['file']) => {
  if (!data || !file) return;
  
  const fileName = file instanceof File ? file.name : 'extracted_data';
  const blob = new Blob([JSON.stringify(JSON.parse(data), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const baseFileName = fileName.replace(/\.[^/.]+$/, '');
  a.download = `${baseFileName}_extracted.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const ExtractKeyValuePairContainer = () => {
  const { apiURL } = useProductionContext();
  const { selectedFileIndex, files, updateFileAtIndex, token } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedResult, setExtractedResult] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
      setExtractedResult(null);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);

  const getFileUrl = (file: PlaygroundFile) => {
    if (!file.file) return '';
    if (typeof file.file === 'string') return file.file;
    return URL.createObjectURL(file.file);
  };

  const onSubmit = async (extractInstruction: Record<string, string>) => {
    if (!selectedFile?.file) {
      toast.error('Please select a file first');
      return;
    }

    let loadingToast: string | undefined = undefined;
    try {
      setIsLoading(true);
      loadingToast = toast.loading('Extracting data...');
      const file = selectedFile.file;
      let base64String = '';
      
      if (file instanceof File) {
        const buffer = await file.arrayBuffer();
        base64String = Buffer.from(buffer).toString('base64');
      } else {
        base64String = file;
      }
      
      const result = await runSyncExtractKeyValue({
        token,
        apiUrl: apiURL,
        base64String,
        fileType: file instanceof File ? file.type : 'pdf',
        extractInstruction,
      });

      setExtractedResult(result);
      toast.dismiss(loadingToast);
      toast.success('Extraction complete!');
    } catch (error) {
      toast.error('Extraction failed. Please try again.');
      toast.dismiss(loadingToast);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full pt-4 relative">
      <div className="w-[calc(90%-11rem)] h-full overflow-auto overscroll-contain">
        <ExtractKeyValuePairTutorial />
        {!extractedResult && selectedFile && (
          <DocumentViewer 
            fileType={selectedFile.file instanceof File ? selectedFile.file.type : 'text/plain'} 
            fileUrl={getFileUrl(selectedFile)} 
          />
        )}
        {extractedResult && (
          <div className="pb-24">
            <CodeBlock 
              language="json" 
              code={typeof extractedResult === 'string' ? JSON.stringify(JSON.parse(extractedResult), null, 2) : JSON.stringify(extractedResult, null, 2)} 
              aria-label="Extraction Result"
            />
            <div className="absolute bottom-4 left-4 flex gap-2 w-fit">
              <Button 
                label="Back to File"
                labelIcon={ArrowLeft}
                onClick={() => {
                  setExtractedResult(null);
                }} 
              />
              <Button 
                label="Download" 
                labelIcon={Download} 
                onClick={() => downloadExtractedData(extractedResult, selectedFile?.file)} 
              />
            </div>
          </div>
        )}
      </div>
      <div className="h-[calc(100%-1rem)] min-w-60 max-w-72 w-[18vw] p-4 rounded-2xl shadow-[0px_0px_4px_2px_rgba(0,_0,_0,_0.1)] absolute top-4 right-0">
        <div className="w-full max-h-full overflow-hidden flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <KeyValueInputs 
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractKeyValuePairContainer;
