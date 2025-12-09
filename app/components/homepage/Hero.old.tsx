'use client';

import '@/app/theme.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/use-translation';
import { HeroButtons } from './HeroButtons';
import Container from '../Container';

const Hero = () => {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section id="hero" className="pt-20 h-fit relative flex items-center justify-center overflow-hidden bg-background">
      <div className="z-10 w-full">
        {/* Main content */}
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Container styles="h-fit min-h-[650px] py-10 lg:py-20">
              <div className="w-full h-fit relative mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  <h1 className="text-center text-5xl lg:text-6xl">
                    <span className="text-gray-900 dark:bg-gradient font-semibold">{t.homepage.hero.title}</span>
                  </h1>
                  <div className="text-lg text-center py-1.5 max-w-4xl mx-auto text-gray-700 dark:text-gray-200">
                    {t.homepage.hero.subtitle}
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="w-full h-fit grid gap-2 grid-cols-1 lg:grid-cols-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                <div className="w-full h- py-0 lg:h-full lg:col-span-2">
                  <div className="flex items-center justify-center w-full h-full py-0">
                    <div
                      className="relative w-full max-w-[960px] h-auto border border-gray-200 dark:border-border-1 rounded-lg overflow-hidden bg-white"
                      style={{ aspectRatio: '16/9' }}
                    >
                      {isPlaying ? (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full border-0"
                          src="https://www.loom.com/embed/5d92fdd403b14013b463b9026acd2800?hide_owner=false&hide_share=false&hide_title=false&hideEmbedTopBar=false&autoplay=1&muted=1&loop=1&t=0&showCaptions=1"
                          allowFullScreen
                        />
                      ) : (
                        <div className="relative cursor-pointer" onClick={playVideo}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgPrefix + '/images/homepage/sandbox-product-tour-all-in-one.png'}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button className="bg-red-600 bg-opacity-100 text-white rounded-xl p-4 w-[75px] hover:bg-red-700 transition-colors">
                              ▶
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full h-full flex flex-col items-center justify-center px-10 lg:col-span-1">
                  <div className="text-lg text-left py-2 text-gray-700 dark:text-gray-200">
                    {t.homepage.hero.description}
                    <ul className="list-disc pl-6 py-1">
                      {t.homepage.hero.features.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    {t.homepage.hero.moreFeatures}
                  </div>
                  <HeroButtons className="w-full pt-8" />
                  <div className="w-full py-3 flex items-center justify-center text-gray-600 dark:text-gray-300">
                    {t.homepage.hero.noCreditCard}
                  </div>
                </div>
              </motion.div>
            </Container>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient transition overlay for smooth transition to next section - adaptive to theme */}
      <div className="absolute bottom-0 left-0 w-full h-[50px] pointer-events-none z-20">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-gray-50/20 to-gray-50 dark:from-transparent dark:via-background/20 dark:to-background" />
      </div>
    </section>
  );
};

export default Hero;
