'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/use-translation';
import { LiquidBlob } from './energent/liquid-blob';

const Hero = () => {
  const { t } = useTranslation();
  const title = t.homepage.hero.title;
  const handlePrimaryCta = () => {
    window.open('https://app.energent.ai', '_blank', 'noopener,noreferrer');
  };
  const titleTokens = useMemo(() => {
    const words = title.trim().split(/\s+/);
    return words.length > 1 ? words : Array.from(title);
  }, [title]);

  return (
    <section
      id="hero"
      className="relative px-6 md:px-12 lg:px-24 py-24 overflow-hidden min-h-screen flex items-center justify-center"
      style={{
        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
      }}
    >
      <div className="w-full container mx-auto flex flex-col xl:flex-row items-center justify-center gap-10">
        {/* LEFT CONTENT */}
        <div className="flex-1 flex flex-col items-center xl:items-start justify-center text-center xl:text-left">
          <h1 className="relative z-10 max-w-3xl text-3xl font-bold text-slate-700 md:text-4xl lg:text-5xl dark:text-slate-100 leading-tight">
            {titleTokens.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeInOut',
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative z-10 max-w-xl py-6 text-sm md:text-base lg:text-lg font-normal text-neutral-600 dark:text-neutral-200"
          >
            <p>{t.homepage.hero.subtitle}</p>
            <p className="mt-2">{t.homepage.hero.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center xl:justify-start gap-4"
          >
            <motion.button
              onClick={handlePrimaryCta}
              className="relative px-6 py-3 rounded-lg text-md font-medium font-sans transition-all duration-200 bg-primary shadow-strong hover:bg-primary/90 text-white"
            >
              <span className="text-white">{t.homepage.hero.tryFree || 'Try for Free'}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT VIDEO (larger width, thick border, glow, fade bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="relative z-10 flex-[2] w-full max-w-4xl"
        >
          <div className="relative w-full overflow-hidden rounded-3xl border-10 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/gif/hero-section/hero-section-poster.jpg"
              className="w-full h-full object-contain rounded-2xl"
            >
              <source src="/gif/hero-section/hero-section-video.webm" type="video/webm" />
              <source src="/gif/hero-section/hero-section-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>
      <LiquidBlob className="absolute top-0 left-0 w-full h-full pointer-events-none" />
    </section>
  );
};

export default Hero;
