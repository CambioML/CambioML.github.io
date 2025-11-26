'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/use-translation';
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
      className="flex flex-col justify-between h-full w-full bg-white dark:bg-card border border-border/50 rounded-xl p-8 hover:shadow-lg dark:hover:shadow-[0px_0px_2px_0.5px_rgba(112,190,250,0.75)] transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <div className="w-[80%] flex-grow">
        <h2 className="text-6xl font-semibold pb-8">
          <span className="text-gray-900 dark:bg-gradient">{title}</span>
        </h2>
        <h3 className="text-2xl w-full font-semibold pb-4 text-gray-900 dark:text-gray-100">{subtitle}</h3>
        <div className="text-md w-full text-gray-700 dark:text-gray-200">{description}</div>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const { t } = useTranslation();
  const handlePrimaryCta = () => {
    window.open('https://app.energent.ai', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="h-fit w-full">
      <Container styles="h-fit">
        <div className="w-full h-fit flex flex-col items-center text-center px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl lg:text-5xl font-semibold whitespace-nowrap">
              <span className="text-gray-900 dark:bg-gradient">{t.homepage.howItWorks.title}</span>
            </h1>
          </motion.div>

          <motion.div
            className="w-full max-w-2xl py-4 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t.homepage.howItWorks.subtitle}
          </motion.div>

          <motion.div
            className="w-full pt-2 pb-6 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={handlePrimaryCta}
              className="relative px-6 py-3 rounded-lg text-md font-medium font-sans transition-all duration-200 bg-primary shadow-strong hover:bg-primary/90 text-white"
            >
              <span className="text-white">{t.homepage.howItWorks.tryFree || 'Try for Free'}</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="flex items-center justify-center w-full h-full py-4 lg:py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="border border-border/50 rounded-lg overflow-hidden">
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
