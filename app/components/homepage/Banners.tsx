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
      className={`w-full h-full flex ${inverse ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <div
        className={`w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 p-8 lg:p-16 rounded-2xl bg-card-1 border border-border-1 hover:shadow-[0px_0px_2px_0.5px_rgba(112,190,250,0.75)] transition-all duration-300 ${code && 'pr-4'}`}
      >
        <div>
          <h2 className="text-2xl font-semibold pb-8">
            <span className="bg-gradient">{title}</span>
          </h2>
          <div className="text-md w-full pb-16 text-foreground">{description}</div>
          <div>
            <Button label={actionLabel} onClick={action} outline={inverse} />
          </div>
        </div>
        {imgPath && (
          <div className="w-full h-full flex items-center justify-center relative min-h-[300px] border border-border-1 rounded-lg overflow-hidden">
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
          <div className="h-full w-full border border-border-1 rounded-lg overflow-hidden">
            <CodeBlock code={code} language="python" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Banners = () => {
  const router = useRouter();
  const { t, locale } = useTranslation();

  return (
    <section className="theme-dark h-fit w-full pt-20">
      <Container styles="min-h-[800px] h-fit pb-20">
        <div className="w-full h-full flex flex-col items-center justify-start px-10 gap-8">
          {t.homepage.banners.map(
            (banner: { title: string; description: string; actionLabel: string }, index: number) => (
              <Banner
                key={index}
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
            )
          )}
        </div>
      </Container>
    </section>
  );
};

export default Banners;
