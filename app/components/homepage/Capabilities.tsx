'use client';

import '@/app/theme.css';
import { motion } from 'framer-motion';
import Container from '../Container';
import ProductHunt from '../dark/navbar/ProductHunt';
import AiTools from '../dark/navbar/AiTools';

const capabilities = [
  {
    description:
      'Privacy Protection: Activate the "Remove Private Information" feature, and AnyParser will automatically redact P.I.I. during the document extraction.',
  },
  {
    description: 'You can instruct the model to include or omit page numbers, headers, footers, figures, charts, etc.',
  },
  {
    description: `AnyParser doesn't just extract text and tables, it also retrieves figures, charts, and footnotes packed with vital information 2X faster and 5X more cost efficient`,
  },
  {
    description:
      'Bid farewell to jumbled tables and chaotic layouts that plague traditional OCR-based models with a 2X more precision and 2.5X more recall than industry average.',
  },
];

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
              <span className="bg-gradient">AnyParser&apos;s Capabilities</span>
            </h1>
          </motion.div>

          <div className="pt-20 gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start justify-items-center w-full">
            {capabilities.map((capability, i) => (
              <CapabilityCard key={i} index={i} {...capability} />
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
