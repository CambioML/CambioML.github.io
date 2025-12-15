'use client';

import { motion } from 'framer-motion';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import { useTranslation } from '@/lib/use-translation';
import Container from '../Container';
import Image from 'next/image';
import CodeBlock from '../CodeBlock';

import { cn } from '@/lib/cn';

interface BannerProps {
  title: string;
  description: string;
  actionLabel: string;
  action: () => void;
  inverse?: boolean;
  imgPath?: string;
  code?: string;
  index: number;
}

const Banner = ({ title, description, actionLabel, action, inverse, imgPath, code, index }: BannerProps) => {
  return (
    <motion.div
      className={cn(
        'w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 p-8 lg:p-16 rounded-2xl transition-all duration-300',
        'bg-white dark:bg-card border border-border/50 hover:shadow-lg dark:hover:shadow-[0px_0px_2px_0.5px_rgba(112,190,250,0.75)]',
        inverse && 'pr-4'
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div>
        <h2 className={cn('text-2xl font-semibold pb-8 text-gray-900 dark:text-inherit')}>
          <span className={cn('text-gray-900 dark:bg-gradient')}>{title}</span>
        </h2>
        <div className={cn('text-md w-full pb-16 text-gray-700 dark:text-gray-200')}>{description}</div>
        <div>
          <motion.button
            onClick={action}
            className={cn(
              'relative px-6 py-3 rounded-lg text-md font-medium font-sans transition-all duration-200',
              inverse
                ? 'bg-card border border-border text-foreground hover:bg-card/80'
                : 'bg-primary shadow-strong hover:bg-primary/90 text-white'
            )}
          >
            <span className={inverse ? 'text-foreground' : 'text-white'}>{actionLabel}</span>
          </motion.button>
        </div>
      </div>
      {imgPath && (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center relative min-h-[300px] rounded-lg overflow-hidden',
            'border border-border/50'
          )}
        >
          <Image
            src={`${imgPrefix}${imgPath}`}
            alt={description}
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-md"
          />
        </div>
      )}
      {code && (
        <div className={cn('h-full w-full rounded-lg overflow-hidden', 'border border-border/50')}>
          <CodeBlock code={code} language="python" />
        </div>
      )}
    </motion.div>
  );
};

const Banners = () => {
  const { t } = useTranslation();
  const banner = t.homepage.banners[0];

  return (
    <section className={cn('h-fit w-full pt-20')}>
      <Container styles="min-h-[500px] h-fit pb-20">
        <div className="w-full h-full flex flex-col items-center justify-center px-10 gap-8">
          <div className="w-full h-full flex justify-center">
            <Banner
              index={0}
              title={banner.title}
              description={banner.description}
              actionLabel={banner.actionLabel}
              action={() => {
                window.open(banner.url, '_blank', 'noopener,noreferrer');
              }}
              imgPath={banner.imgPath}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Banners;
