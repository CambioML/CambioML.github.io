'use client';

interface ParagraphsProps {
  paragraphs: string[];
  center?: boolean;
  between?: boolean;
  large?: boolean;
}

const Paragraphs = ({ paragraphs, center, between, large }: ParagraphsProps) => {
  return (
    <div className={`${center ? 'text-center' : 'text-start'} h-full`}>
      <div className={`flex flex-col items-center ${between ? 'justify-between' : 'justify-center gap-5'} h-full`}>
        {paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className={`font-light leading-relaxed text-neutral-600 dark:text-gray-300 ${large ? 'text-3xl' : 'text-2xl'}`}
          >
            <p key={index}>{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Paragraphs;
