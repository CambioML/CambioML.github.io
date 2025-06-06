/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { QueryResult } from '@/app/actions/apiInterface';
import useCompareModal from '@/app/hooks/useCompareModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import useResultZoomModal from '@/app/hooks/useResultZoomModal';
import { CaretLeft, CaretRight, Copy, Files, FrameCorners } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Markdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from '@/lib/use-translation';

interface ResultContentProps {
  extractResult: QueryResult;
}

const markdownComponents: Components = {
  p: ({ node, ...props }) => <p dir="auto" {...props} />,
  h1: ({ node, ...props }) => <h1 dir="auto" {...props} />,
  h2: ({ node, ...props }) => <h2 dir="auto" {...props} />,
  h3: ({ node, ...props }) => <h3 dir="auto" {...props} />,
  h4: ({ node, ...props }) => <h4 dir="auto" {...props} />,
  h5: ({ node, ...props }) => <h5 dir="auto" {...props} />,
  h6: ({ node, ...props }) => <h6 dir="auto" {...props} />,
  ul: ({ node, ...props }) => <ul dir="auto" {...props} />,
  ol: ({ node, ...props }) => <ol dir="auto" {...props} />,
  li: ({ node, ...props }) => <li dir="auto" {...props} />,
  tr: ({ node, ...props }) => <tr dir="auto" {...props} />,
  td: ({ node, ...props }) => <td dir="auto" {...props} />,
  th: ({ node, ...props }) => <th dir="auto" {...props} />,
  pre: ({ node, ...props }) => <pre dir="auto" {...props} />,
  code: ({ node, ...props }) => <code dir="auto" {...props} />,
  table: ({ node, ...props }) => <table dir="auto" {...props} />,
  blockquote: ({ node, ...props }) => <blockquote dir="auto" {...props} />,
};

const ResultContent = ({ extractResult }: ResultContentProps) => {
  const resultZoomModal = useResultZoomModal();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageHeights, setPageHeights] = useState<number[]>([]);
  const currentPageRef = useRef(resultZoomModal.page);
  const { t } = useTranslation();

  const handleScroll = () => {
    if (containerRef.current && pageHeights.length > 0) {
      const scrollTop = containerRef.current.scrollTop;
      let accumulatedHeight = 0;
      let newPage = 0;

      for (let i = 0; i < pageHeights.length; i++) {
        accumulatedHeight += pageHeights[i];
        if (scrollTop < accumulatedHeight) {
          newPage = i;
          break;
        }
      }

      if (currentPageRef.current !== newPage) {
        currentPageRef.current = newPage;
        resultZoomModal.setPage(newPage);
      }
    }
  };

  const measurePageHeights = () => {
    if (containerRef.current) {
      const heights = Array.from(containerRef.current.children).map((child) => (child as HTMLDivElement).offsetHeight);
      setPageHeights(heights);
    }
  };

  useEffect(() => {
    measurePageHeights();
  }, [extractResult]);

  useEffect(() => {
    const container = containerRef.current;
    if (pageHeights.length > 0 && container) {
      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [pageHeights]);

  useEffect(() => {
    window.addEventListener('resize', measurePageHeights);
    return () => {
      window.removeEventListener('resize', measurePageHeights);
    };
  }, []);

  const handleNextPageClick = () => {
    const nextPage = (resultZoomModal.page + 1) % extractResult.length;
    resultZoomModal.setPage(nextPage);
    const top = pageHeights.slice(0, nextPage).reduce((acc, height) => acc + height, 0);
    containerRef.current?.scrollTo({
      top,
      behavior: 'smooth',
    });
  };

  const handlePrevPageClick = () => {
    const prevPage = (resultZoomModal.page - 1 + extractResult.length) % extractResult.length;
    resultZoomModal.setPage(prevPage);
    const top = pageHeights.slice(0, prevPage).reduce((acc, height) => acc + height, 0);
    containerRef.current?.scrollTo({
      top,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div
        className="absolute top-1/2 right-5 z-10 cursor-pointer p-2 rounded-full text-neutral-600 bg-neutral-100 hover:text-neutral-800 hover:bg-neutral-200 font-semibold"
        onClick={handleNextPageClick}
      >
        <CaretRight size={18} weight="bold" />
      </div>
      <div
        className="absolute top-1/2 left-5 z-10 cursor-pointer p-2 rounded-full text-neutral-600 bg-neutral-100 hover:text-neutral-800 hover:bg-neutral-200 font-semibold"
        onClick={handlePrevPageClick}
      >
        <CaretLeft size={18} weight="bold" />
      </div>
      <div className="absolute bottom-5 right-5 z-10 p-2 rounded-full text-neutral-600 bg-white font-semibold">
        {t.playground.results.pageOf
          .replace('{page}', String(resultZoomModal.page + 1))
          .replace('{total}', String(extractResult.length))}
      </div>
      <div
        ref={containerRef}
        className="overflow-auto relative w-full h-full rounded-xl border border-1 border-solid px-10 max-w-full overscroll-none"
      >
        {extractResult.map((content, index) => (
          <div key={index} className="p-4 w-full border-b-2" style={{ minHeight: '100%' }} id="result-container">
            {hasHtmlTags(content) ? (
              <div
                dir="auto"
                dangerouslySetInnerHTML={{
                  // Convert triple newlines (\n\n\n) to double HTML line breaks (<br/><br/>)
                  // This preserves the spacing/formatting in the rendered HTML output
                  // Without this, all newlines would be collapsed into a single space
                  __html: content.replace(/\n\n\n/g, '<br/><br/>'),
                }}
              />
            ) : (
              // This complex way ensures only arabic text is RTL for every different line
              <Markdown className="markdown" remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
              </Markdown>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

function hasHtmlTags(input: string): boolean {
  // Updated regex to include all custom HTML tags used in the document
  // Matches: <text>, <section_header>, <header>, <footer>, <list>, <page_number>
  // Plus any other standard HTML tags via [a-z]+
  const htmlTagsRegex = /<\/?(?:text|section_header|header|footer|list|page_number|[a-z]+)[^>]*>/i;
  // Matches markdown image syntax: ![alt text](url)
  // Used to prevent treating markdown images as HTML content
  const markdownImageRegex = /!\[.*?\]\(.*?\)/;
  // Returns true if content contains HTML tags but isn't just a markdown image
  return htmlTagsRegex.test(input) && !markdownImageRegex.test(input);
}

interface ResultContainerProps {
  extractResult: QueryResult;
}

const ResultContainer = ({ extractResult }: ResultContainerProps) => {
  const { files, selectedFileIndex } = usePlaygroundStore();
  const resultZoomModal = useResultZoomModal();
  const compareModal = useCompareModal();
  const { t } = useTranslation();

  const handleZoomClick = () => {
    resultZoomModal.setContent(
      <div className="overflow-auto relative w-full h-[80vh]">
        <ResultContent extractResult={extractResult} />
      </div>
    );
    resultZoomModal.onOpen();
  };

  const handleCompareClick = () => {
    compareModal.setContent(
      <div className="w-full h-full">
        {hasHtmlTags(extractResult.join('')) ? (
          <div
            className="p-4 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: extractResult
                .map(
                  (content, index) =>
                    `<div>${content}</div>
                <div style="font-weight: bold; position: relative; margin-top: 5px;">
                    <span style="position: absolute; right: 0; bottom: 0;">Page ${index + 1}</span>
                </div>
                <hr style="margin-top: 10px; margin-bottom: 20px;">`
                )
                .join(''),
            }}
          />
        ) : (
          <Markdown
            className="markdown p-4 whitespace-pre-wrap"
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {extractResult
              .map((content, index) => {
                return `${content}\n\n**Page ${index + 1}**\n\n---\n\n`;
              })
              .join('')}
          </Markdown>
        )}
      </div>
    );
    compareModal.onOpen();
  };

  const handleCopyClick = () => {
    const text = extractResult.join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success(t.messages.success.resultCopied);
  };

  useEffect(() => {
    resultZoomModal.setPage(0);
  }, [extractResult]);

  useEffect(() => {
    if (selectedFileIndex !== null && files[selectedFileIndex]) {
      const thisFile = files[selectedFileIndex].file;
      compareModal.setFile(thisFile as File);
    }
  }, [files, selectedFileIndex]);

  return (
    <div className="w-full h-[calc(100%-60px)] relative">
      <div style={{ display: 'none' }} id="raw-extract-result">
        {JSON.stringify(extractResult)}
      </div>
      <div
        className="absolute top-4 right-5 z-10 cursor-pointer px-4 py-2 rounded-full text-neutral-600 bg-neutral-100 hover:text-neutral-800 hover:bg-neutral-200 font-semibold flex items-center gap-1"
        onClick={handleZoomClick}
      >
        {t.playground.results.expand} <FrameCorners size={18} weight="bold" />
      </div>
      <div
        className="absolute top-16 right-5 z-10 cursor-pointer p-2 rounded-full text-neutral-600 bg-neutral-100 hover:text-neutral-800 hover:bg-neutral-200 font-semibold flex items-center gap-1"
        onClick={handleCompareClick}
      >
        {t.playground.results.compare} <Files size={18} weight="bold" />
      </div>
      <div
        className="absolute top-28 right-5 z-10 cursor-pointer px-4 py-2 rounded-full text-neutral-600 bg-neutral-100 hover:text-neutral-800 hover:bg-neutral-200 font-semibold flex items-center gap-1"
        onClick={handleCopyClick}
      >
        {t.playground.results.copy} <Copy size={18} weight="bold" />
      </div>
      <ResultContent extractResult={extractResult} />
    </div>
  );
};

export default ResultContainer;
