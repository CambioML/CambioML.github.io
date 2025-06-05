'use client';

import '@/app/theme.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/use-translation';
import Button from '../Button';
import Container from '../Container';

const Hero = () => {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section id="hero" className="theme-dark pt-20 h-fit relative flex items-center justify-center overflow-hidden">
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
                  <h1 className="text-center">
                    <span className="bg-gradient">{t.homepage.hero.title}</span>
                  </h1>
                  <div className="text-lg text-center py-1.5 max-w-4xl mx-auto text-foreground">
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
                      className="relative w-full max-w-[960px] h-auto border border-border-1 rounded-lg overflow-hidden bg-white"
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
                  <div className="text-lg text-left py-2 text-foreground">
                    {t.homepage.hero.description}
                    <ul className="list-disc pl-6 py-1">
                      {t.homepage.hero.features.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    {t.homepage.hero.moreFeatures}
                  </div>
                  <div className="w-full pt-8 pb-2 flex items-center justify-center gap-4">
                    <Button label={t.homepage.hero.tryFree} onClick={() => router.push(`/${locale}/anyparser`)} />
                    <Button label={t.homepage.hero.getApi} onClick={() => router.push(`/${locale}/account`)} outline />
                  </div>
                  <div className="w-full pt-4">
                    <Button label={t.homepage.hero.bookDemo} onClick={() => router.push('/book-demo')} secondaryColor />
                  </div>
                  <div className="w-full py-1 flex items-center justify-center text-foreground">
                    {t.homepage.hero.noCreditCard}
                  </div>
                </div>
              </motion.div>
            </Container>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient transition overlay for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-[50px] pointer-events-none z-20">
        <div
          className="w-full h-full"
          style={{
            background:
              'linear-gradient(rgba(10, 10, 10, 0) 0%, rgba(10, 10, 10, 0.2) 49.6165%, rgba(10, 10, 10, 0.5) 74.9037%, rgb(10, 10, 10) 100%)',
            opacity: 1,
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
