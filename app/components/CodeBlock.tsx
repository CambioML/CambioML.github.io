import { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import py from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';

SyntaxHighlighter.registerLanguage('python', py);
interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock = ({ language, code }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={handleCopyClick}
        className="absolute top-2 right-2 px-2 py-1 text-sm bg-gray-800 text-white rounded focus:outline-none"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
      <div className="rounded-lg overflow-x-scroll w-full p-5 bg-[#f8f8ff]">
        <SyntaxHighlighter language={language} style={docco} showLineNumbers>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
