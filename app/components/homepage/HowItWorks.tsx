'use client';

import '@/app/theme.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/use-translation';
import Button from '../Button';
import Container from '../Container';
import YouTubeFacade from '../YoutubeFacade';

interface HowItWorksCardProps {
  title: string;
  subtitle: string;
  description: string;
  index: number;
}

const HowItWorksCard = ({ title, subtitle, description, index }: HowItWorksCardProps) => {
  return (
    <motion.div
      className="flex flex-col justify-between h-full w-full bg-card-1 border border-border-1 rounded-xl p-8 hover:shadow-[0px_0px_2px_0.5px_rgba(112,190,250,0.75)] transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <div className="w-[80%] flex-grow">
        <h2 className="text-6xl font-semibold pb-8">
          <span className="bg-gradient">{title}</span>
        </h2>
        <h3 className="text-2xl w-full font-semibold pb-4 text-foreground">{subtitle}</h3>
        <div className="text-md w-full text-foreground">{description}</div>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const router = useRouter();
  const { t, locale } = useTranslation();

  return (
    <section className="theme-dark h-fit w-full">
      <Container styles="h-fit">
        <div className="w-full h-fit grid grid-cols-1 lg:grid-cols-[400px_1fr]">
          <div className="w-full h-full flex flex-col items-center justify-center px-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h1 className="text-6xl font-semibold">
                <span className="bg-gradient">{t.homepage.howItWorks.title}</span>
              </h1>
            </motion.div>

            <motion.div
              className="w-full pt-8 pb-2 flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Button label={t.homepage.howItWorks.tryFree} onClick={() => router.push(`/${locale}/anyparser`)} />
            </motion.div>

            <motion.div
              className="w-full py-1 flex items-center justify-center text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {t.homepage.howItWorks.subtitle}
            </motion.div>
          </div>

          <motion.div
            className="flex items-center justify-center w-full h-full py-4 lg:py-20"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="border border-border-1 rounded-lg overflow-hidden">
              <YouTubeFacade videoId="T80TMGOTlK4" />
            </div>
          </motion.div>
        </div>

        <div className="h-fit">
          <div className="pt-20 gap-8 grid grid-cols-1 lg:grid-cols-3 items-stretch justify-items-center w-full h-fit pb-8">
            {t.homepage.howItWorks.steps.map(
              (step: { title: string; subtitle: string; description: string }, index: number) => (
                <HowItWorksCard
                  key={index}
                  index={index}
                  title={step.title}
                  subtitle={step.subtitle}
                  description={step.description}
                />
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
