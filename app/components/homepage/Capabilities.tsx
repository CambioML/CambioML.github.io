'use client';

import '@/app/theme.css';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/use-translation';
import Container from '../Container';
import ProductHunt from '../dark/navbar/ProductHunt';
import AiTools from '../dark/navbar/AiTools';

interface CapabilityCardProps {
  description: string;
  index: number;
}

const CapabilityCard = ({ description, index }: CapabilityCardProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-start w-full p-6 border border-border-1 rounded-lg bg-card-1 hover:shadow-[0px_0px_2px_0.5px_rgba(112,190,250,0.75)] transition-all duration-300 h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <div className="text-lg text-center w-full text-foreground">{description}</div>
    </motion.div>
  );
};

const Capabilities = () => {
  const { t } = useTranslation();

  return (
    <section className="theme-dark h-fit w-full pt-20">
      <Container styles="relative z-10 h-fit lg:h-[600px]">
        <div className="w-full h-full flex flex-col items-center justify-start px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-center">
              <span className="bg-gradient">{t.homepage.capabilities.title}</span>
            </h1>
          </motion.div>

          <div className="pt-20 gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start justify-items-center w-full">
            {t.homepage.capabilities.items.map((description: string, i: number) => (
              <CapabilityCard key={i} index={i} description={description} />
            ))}
          </div>

          <motion.div
            className="my-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex space-x-4">
              <ProductHunt />
              <AiTools />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Capabilities;
