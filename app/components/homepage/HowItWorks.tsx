'use client';

import '@/app/theme.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  return (
    <section className="theme-dark h-fit w-full">
      <Container styles="relative z-10 h-fit">
        <div className="w-full h-fit grid grid-cols-1 lg:grid-cols-[400px_1fr]">
          <div className="w-full h-full flex flex-col items-center justify-center px-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h1 className="text-6xl font-semibold">
                <span className="bg-gradient">How AnyParser Works</span>
              </h1>
            </motion.div>

            <motion.div
              className="w-full pt-8 pb-2 flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Button label="Try for FREE" onClick={() => router.push('/sandbox')} />
            </motion.div>

            <motion.div
              className="w-full py-1 flex items-center justify-center text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Parse any data from any documents with straight-forward user interface
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
            <HowItWorksCard
              index={0}
              title="01"
              subtitle="Drag and drop the documents"
              description="Click 'Upload File' to easily drag and drop the documents you want to parse, or simply paste a screenshot from your clipboard. We've also provided sample documentation to help you get started."
            />
            <HowItWorksCard
              index={1}
              title="02"
              subtitle="Edit parsing and privacy settings"
              description="AnyParser automatically categorizes various types of information, including PII (Personally Identifiable Information), footnotes, tables, and more. Just export the data you need!"
            />
            <HowItWorksCard
              index={2}
              title="03"
              subtitle="Export results to your system"
              description="Download your data in your preferred format—whether it's HTML, Excel, JSON, or a database schema tailored to your business workflow."
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
