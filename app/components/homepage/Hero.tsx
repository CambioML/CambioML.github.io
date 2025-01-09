'use client';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import Container from '../Container';
import Heading from '../Heading';
import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import { useState } from 'react';

const Hero = () => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    setIsPlaying(true);
  };

  return (
    <div className="h-fit w-full pt-20">
      <Container styles="relative z-10 h-fit min-h-[650px] py-10 lg:py-20">
        <div className="w-full h-fit relative mb-4">
          <div className="absolute -top-20 -right-4 mt-2 mr-2 w-54 h-36">
            <Image
              src={`${imgPrefix}/images/homepage/upperright-highlight.png`}
              alt="Badge"
              width={216}
              height={144}
              className="object-contain"
            />
          </div>
          <Heading title="AnyParser: Vision LLM for Document Parsing" center />
          <div className="text-lg text-center py-1.5 max-w-4xl mx-auto">
            Parsing PDFs, PPTs, Word, and images with configurable options in a few clicks!
          </div>
        </div>
        <div className="w-full h-fit grid gap-2 grid-cols-1 lg:grid-cols-3">
          <div className="w-full h-[500px] py-0 lg:h-full lg:col-span-2">
            <div className="flex items-center justify-center w-full h-full py-0">
              <div className="relative w-full max-w-[960px] h-auto" style={{ aspectRatio: '16/9' }}>
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
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="bg-red-600 bg-opacity-100 text-white rounded-xl p-4 w-[75px]">▶</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center px-10 lg:col-span-1">
            <div className="text-lg text-left py-2">
              80% of OCR users are tired of maintaining glue code. Free up your time with unmatched accuracy, complete
              privacy and configurable options such as:
              <ul className="list-disc pl-6 py-1">
                <li>removing private identity info,</li>
                <li>extract table and charts,</li>
                <li>keeping footnotes and headers,</li>
              </ul>
              and much more!
            </div>
            <div className="w-full pt-8 pb-2 flex items-center justify-center gap-4">
              <Button label="Try for FREE" onClick={() => router.push('/sandbox')} />
              <Button label="Get API Access" onClick={() => router.push('/account')} outline />
            </div>
            <div className="w-full pt-4">
              <Button label="Book a Demo" onClick={() => router.push('/book-demo')} secondaryColor />
            </div>
            <div className="w-full py-1 flex items-center justify-center">No credit card required</div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
