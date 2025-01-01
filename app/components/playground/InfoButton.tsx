import useInfoModal from '@/app/hooks/useInfoModal';
import { Question } from '@phosphor-icons/react';
import { PlaygroundTabs } from '@/app/types/PlaygroundTypes';

interface InfoButtonProps {
  infoType: string;
}

const textStyle = 'text-lg text-neutral-700 flex flex-col gap-2';
const h1Style = 'text-2xl font-semibold';
const h2Style = 'text-xl font-semibold pt-4';

const plainTextContent = (
  <>
    <div className={h1Style}>Extract Full Content</div>
    <div className={textStyle}>
      <div>
        With AnyParser, you can extract the content from your raw, unstructured data, like PDFs, TXTs, and HTML files.
      </div>
      <div>
        {`Once you've uploaded and selected a file, run the 'Plain Text' flow, which will extract the content of your file and return it in a Markdown format.`}
      </div>
    </div>
    <div className={h2Style}>Next Steps</div>
    <div
      className={textStyle}
    >{`You can download the raw Markdown as a text file, or download the JSON from any extracted tables`}</div>
  </>
);

const tableContent = (
  <>
    <div className={h1Style}>Table Only Extraction</div>
    <div className={textStyle}>
      <div>
        With AnyParser, you can extract tables from your files, extract specific keys from them, and map it to your
        database schema.
      </div>
    </div>
    <div className={h2Style}>1. Extract Tables</div>
    <div
      className={textStyle}
    >{`First, you need to extract the tables from your file. AnyParser will extract all the tables into HTML format.

    Once extracted, you can download the raw HTML or download all the tables into an Excel file.`}</div>
    <div className={h2Style}>2. Select Tables to Map</div>
    <div
      className={textStyle}
    >{`After running the table extract, select the tables that you'd like to extract data from.

    In this section, you'll also have the ability to preview each table's html.`}</div>
    <div className={h2Style}>3. Map Schema</div>
    <div
      className={textStyle}
    >{`Once you've exracted and selected the tables, you can then add the keys that you want to extract. If you wish to remove the mapped key, click the (X) in the box. If you wish to remove an Input Key, you can click the (X) icon in its box.

    Once you've added some keys, you can run the Map Schema function. After mapping, you can edit any of the mapped keys by clicking on the edit pencil icon.


    Clicking 'Map Schema' again will only re-run the Input Keys without any Mapped Keys. If you wish to generate a new mapped key, you can remove the Mapped Key first by clicking X.`}</div>
    <div className={h2Style}>Next Steps</div>
    <div
      className={textStyle}
    >{`Once you're satisfied with the output, you can hit the download the CSV or JSON. This will only be enabled if at least one Input Key has a non-empty Mapped Key.`}</div>
  </>
);

const keyValuePairContent = (
  <>
    <div className={h1Style}>Extract Key-Value Pairs</div>
    <div className={textStyle}>
      <div>
        With AnyParser, you can identify and extract structured key-value pairs from your raw, unstructured data, like
        invoices, contracts, or forms.
      </div>
      <div>
        Once you've uploaded and selected a file, run the 'Key-Value Pair' flow, which will analyze your file, identify
        key fields, and extract their corresponding values in a structured JSON format.
      </div>
    </div>
    <div className={h2Style}>Next Steps</div>
    <div className={textStyle}>
      You can download the extracted key-value pairs as a JSON file, or integrate directly with your workflow via our
      API to automate further processing.
    </div>
  </>
);

const infoContent: { [key: string]: React.ReactElement } = {
  [PlaygroundTabs.PLAIN_TEXT]: plainTextContent,
  [PlaygroundTabs.TABLE]: tableContent,
  [PlaygroundTabs.KEY_VALUE_PAIR]: keyValuePairContent,
};

const InfoButton = ({ infoType }: InfoButtonProps) => {
  const infoModal = useInfoModal();
  const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    infoModal.setContent(infoContent[infoType] || '');
    infoModal.onOpen();
  };
  return (
    <button
      onClick={handleInfoClick}
      className="w-fit h-fit hover:text-cambio-red rounded-full text-neutral-700 p-1 font-bold transition duration-300"
    >
      <Question size={18} weight="bold" />
    </button>
  );
};

export default InfoButton;
