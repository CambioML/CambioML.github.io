import Image from 'next/image';

// Component for custom markdown styling
export const MarkdownComponents = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-semibold mt-8 mb-4 text-gray-900 dark:text-blue-300" {...props} />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-900 dark:text-blue-200" {...props} />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100" {...props} />
  ),
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="my-4 leading-relaxed text-gray-900 dark:text-gray-100" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => <ul className="list-disc ml-6 my-4 space-y-2" {...props} />,
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal ml-6 my-4 space-y-2" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => <li className="mb-1 text-gray-900 dark:text-gray-100" {...props} />,
  a: (props: React.HTMLProps<HTMLAnchorElement>) => {
    const href = props.href || '';

    // Check if it's a Loom embed link
    if (href.includes('loom.com/embed/')) {
      const videoId = href.split('/embed/')[1];
      return (
        <div className="my-6">
          <iframe
            src={`https://www.loom.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
            className="w-full h-64 md:h-96 rounded-lg"
            title="Loom Video"
          />
        </div>
      );
    }

    // Check if it's a YouTube embed link
    if (href.includes('youtube.com/embed/') || href.includes('youtu.be/')) {
      let videoId = '';
      if (href.includes('youtube.com/embed/')) {
        videoId = href.split('/embed/')[1].split('?')[0];
      } else if (href.includes('youtu.be/')) {
        videoId = href.split('youtu.be/')[1].split('?')[0];
      }

      if (videoId) {
        return (
          <div className="my-6">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allowFullScreen
              className="w-full h-64 md:h-96 rounded-lg"
              title="YouTube Video"
            />
          </div>
        );
      }
    }

    // Regular link
    return (
      <a
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
        {...props}
      />
    );
  },
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-blue-600 dark:border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400"
      {...props}
    />
  ),
  code: ({
    className,
    children,
    ...props
  }: { className?: string; children?: React.ReactNode } & React.HTMLProps<HTMLElement>) => {
    // Inline code doesn't have a className and is not wrapped in a pre tag
    const isInline = !className;

    return isInline ? (
      <code
        className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-pink-600 dark:text-pink-400 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto font-mono text-sm my-4 text-gray-900 dark:text-gray-100"
        {...props}
      >
        {children}
      </code>
    );
  },
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // Use Next.js Image component for better performance
    const src = props.src || '';
    const alt = props.alt || 'Image';

    return (
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className="max-w-full h-auto rounded-lg my-6"
        style={{ width: 'auto', height: 'auto' }}
      />
    );
  },
  iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement>) => (
    <div className="my-6">
      <iframe className="w-full h-64 md:h-96 rounded-lg" frameBorder="0" allowFullScreen {...props} />
    </div>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table
        className="w-full border-collapse border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-black"
        {...props}
      />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-gray-50 dark:bg-black" {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="bg-white dark:bg-black" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-gray-200 dark:border-slate-600 transition-colors" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-blue-100 border-r border-gray-200 dark:border-slate-600 last:border-r-0"
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td
      className="py-3 px-4 text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600 last:border-r-0"
      {...props}
    />
  ),
  strong: (props: React.HTMLProps<HTMLElement>) => (
    <strong className="font-semibold text-gray-900 dark:text-white" {...props} />
  ),
  em: (props: React.HTMLProps<HTMLElement>) => <em className="italic" {...props} />,
};
