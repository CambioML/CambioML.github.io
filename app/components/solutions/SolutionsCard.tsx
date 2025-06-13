'use client';

import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';

interface SolutionsCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  image?: string;
  imageContain?: boolean;
}

const createId = (title: string) => {
  return title.toLowerCase().replaceAll(' ', '-');
};

const SolutionsCard = ({ title, subtitle, description, url, image, imageContain }: SolutionsCardProps) => {
  return (
    <a target="_blank" href={url} rel="noopener noreferrer">
      <div
        className="
        col-span-1
        cursor-pointer
        group
        h-full
        w-full
        max-w-[800px]
        lg:w-full
        lg:max-w-[1200px]
        relative
        "
      >
        <div id={createId(title)} className="absolute -top-28" />
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-fit lg:h-[400px] border-solid border border-neutral-200 dark:border-border-1 rounded-3xl xl:rounded-4xl hover:shadow-md">
          <div
            className="
                    aspect-square
                    w-full
                    h-[400px]
                    lg:h-full
                    relative
                    overflow-hidden
                    rounded-[inherit]
                    rounded-b-none
                    lg:rounded-r-none
                    lg:rounded-l-[inherit]
                    border-solid
                    border-b
                    border-neutral-200
                    dark:border-border-1
                    lg:border-r-2
                    lg:border-b-0
                    "
          >
            <Image
              fill
              alt="Solution Image"
              src={imgPrefix + (image || '/images/cambioml-logo-large.png')}
              className={`${imageContain ? 'object-contain' : 'object-cover'}
                            h-full
                            w-full
                            group-hover:scale-110
                            transition
                            `}
            />
          </div>
          <div className="flex flex-col lg:justify-center p-5 h-[300px] lg:h-full gap-5 bg-white dark:bg-card-1 rounded-b-3xl lg:rounded-l-none lg:rounded-3xl">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-xl text-neutral-800 dark:text-gray-200">{title.toUpperCase()}</div>
              {subtitle && <div className="text-xl italic text-neutral-700 dark:text-gray-300">{subtitle}</div>}
            </div>
            {description && <div className="text-lg text-neutral-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: description }} />}
          </div>
        </div>
      </div>
    </a>
  );
};

export default SolutionsCard;
