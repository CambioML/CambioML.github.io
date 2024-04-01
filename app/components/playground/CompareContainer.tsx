import { TextColumns } from '@phosphor-icons/react';
import Button from '../Button';
import { Option } from '../inputs/Select';
import Select from '../inputs/Select';
import { useEffect, useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { CompareState, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import PulsingIcon from '../PulsingIcon';
import JSZip from 'jszip';
import ComingSoonBanner from './ComingSoonBanner';

const columnStyles = 'w-full flex flex-col items-center justify-center gap-4';

const CompareContainer = () => {
  const { files, selectedFileIndex, updateFileAtIndex } = usePlaygroundStore();
  const [paperOptions, setPaperOptions] = useState<Option[]>([]);

  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
      if (thisFile.file instanceof File) {
        setFilename(thisFile.file.name);
      } else {
        setFilename(thisFile.file);
      }
    }
  }, [selectedFileIndex, files]);

  const checkIfPDF = (file: File | string) => {
    return file instanceof File && file.name.toLowerCase().endsWith('.pdf');
  };

  useEffect(() => {
    const paperOptions = files
      .map((file, i) => {
        if (file.file instanceof File && checkIfPDF(file.file) && i !== selectedFileIndex) {
          return { label: file.file.name, value: i.toString() } as Option;
        }
        return undefined;
      })
      .filter((option) => option !== undefined) as Option[];
    setPaperOptions(paperOptions);
  }, [files, selectedFileIndex]);

  const handlePaper2Change = (paper: Option) => {
    const compareFile = files[parseInt(paper.value)].file;
    updateFileAtIndex(selectedFileIndex, 'compareFile', compareFile);
  };

  const zipFiles = async () => {
    if (!selectedFile || !selectedFile.compareFile || selectedFile?.file instanceof File === false) {
      return;
    }
    const zip = new JSZip();

    zip.file(selectedFile?.file.name, selectedFile?.file);
    zip.file(selectedFile?.compareFile?.name, selectedFile?.compareFile);

    const zippedFolder = await zip.generateAsync({ type: 'blob' });
    return zippedFolder;
  };

  const handleCompare = async () => {
    updateFileAtIndex(selectedFileIndex, 'compareState', CompareState.COMPARING);
    const zippedFolder = await zipFiles();
    console.log('Zipped Folder', zippedFolder);
    setTimeout(() => {
      updateFileAtIndex(selectedFileIndex, 'compareState', CompareState.DONE_COMPARING);
    }, 3000);
  };

  return (
    <div className="w-full h-full pt-4">
      {selectedFile && !checkIfPDF(selectedFile.file) ? (
        <div className="h-full flex items-center justify-center text-2xl font-semibold">
          Please select a PDF paper to compare
        </div>
      ) : (
        <>
          {selectedFile?.compareState === CompareState.READY && (
            <div className="flex flex-col items-start w-full h-full gap-4">
              <ComingSoonBanner />
              <div className="w-full h-full text-neutral-800 grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
                {/* {paperOptions.length < 1 && (
                  <div className="absolute left-0 top-0 w-full flex items-center justify-center gap-4 bg-neutral-100 p-2 rounded-lg text-neutral-700">
                    <Warning size={20} weight="bold" />
                    <div className="italic">Please upload at least 2 Paper PDFs to compare.</div>
                  </div>
                )} */}
                <div className={columnStyles}>
                  <div className="text-2xl font-semibold">Paper 1</div>
                  <div className="container mx-auto overflow-x-auto whitespace-no-wrap text-center bg-neutral-100 rounded-lg">
                    <div className="inline-block text-justify p-2">{filename}</div>
                  </div>
                </div>
                <div className={columnStyles}>
                  <div className="text-2xl font-semibold">Paper 2</div>
                  <div className="w-full">
                    <Select
                      options={paperOptions}
                      disabled //={paperOptions.length === 0 && checkIfPDF(selectedFile?.file)}
                      callback={handlePaper2Change}
                      optionLabel="Select a paper"
                    />
                  </div>
                </div>
              </div>
              <div className={`w-full h-fit gap-4`}>
                <Button
                  label="Compare Papers"
                  onClick={handleCompare}
                  small
                  labelIcon={TextColumns}
                  disabled //{selectedFile.compareFile === undefined}
                />
              </div>
            </div>
          )}
          {selectedFile?.compareState === CompareState.COMPARING && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-xl font-semibold text-neutral-500">Comparing Papers</div>
              <PulsingIcon Icon={TextColumns} size={40} />
            </div>
          )}
          {selectedFile?.compareState === CompareState.DONE_COMPARING && <div>Done Comparing</div>}
        </>
      )}
    </div>
  );
};

export default CompareContainer;
