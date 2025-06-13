'use client';

import '@/app/theme.css';
import { motion } from 'framer-motion';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/use-translation';
import Container from '../Container';
import Button from '../Button';
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
        'bg-white dark:bg-card-1 border-gray-200 dark:border-border-1 border hover:shadow-lg dark:hover:shadow-[0px_0px_2px_0.5px_rgba(112,190,250,0.75)]',
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
          <Button label={actionLabel} onClick={action} outline={inverse} />
        </div>
      </div>
      {imgPath && (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center relative min-h-[300px] rounded-lg overflow-hidden',
            'border border-gray-200 dark:border-border-1'
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
        <div className={cn('h-full w-full rounded-lg overflow-hidden', 'border border-gray-200 dark:border-border-1')}>
          <CodeBlock code={code} language="python" />
        </div>
      )}
    </motion.div>
  );
};

const Banners = () => {
  const router = useRouter();
  const { t, locale } = useTranslation();

  return (
    <section className={cn('h-fit w-full pt-20 bg-gray-50 dark:bg-background')}>
      <Container styles="min-h-[800px] h-fit pb-20">
        <div className="w-full h-full flex flex-col items-center justify-start px-10 gap-8">
          {t.homepage.banners.map(
            (banner: { title: string; description: string; actionLabel: string }, index: number) => (
              <div key={index} className={`w-full h-full flex ${index === 1 ? 'justify-end' : 'justify-start'}`}>
                <Banner
                  index={index}
                  title={banner.title}
                  description={banner.description}
                  actionLabel={banner.actionLabel}
                  action={() => router.push(index === 0 ? `/${locale}/anyparser` : `/${locale}/account`)}
                  inverse={index === 1}
                  imgPath={index === 0 ? '/images/homepage/banner-1.png' : undefined}
                  code={
                    index === 1
                      ? `from any_parser import AnyParser

op = AnyParser(example_apikey)

content_result = op.extract(example_local_file)`
                      : undefined
                  }
                />
              </div>
            )
          )}
        </div>
      </Container>
    </section>
  );
};

export default Banners;
