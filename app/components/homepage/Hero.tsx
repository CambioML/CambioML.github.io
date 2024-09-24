'use client';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import Container from '../Container';
import Heading from '../Heading';
import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import ProductHunt from '../navbar/ProductHunt';

const Hero = () => {
  const router = useRouter();
  return (
    <div className="h-fit w-full pt-20">
      <Container styles="relative z-10 h-fit min-h-[650px] py-10 lg:py-20">
        <div className="w-full h-fit grid gap-10 grid-cols-1 lg:grid-cols-2 lg:min-h-[700px]">
          <div className="w-full h-[500px] py-4 lg:h-full">
            <div className="flex items-center justify-center w-full h-full py-4 lg:py-20">
              <div className="relative w-full max-w-[800px] h-auto" style={{ aspectRatio: '16/9' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src="https://www.tella.tv/video/clyqcwrvm0fde09jvg77n0rgh/embed?b=1&title=1&a=1&loop=0&t=0&muted=0&wt=1"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center px-10">
            <div className="py-2">
              <ProductHunt />
            </div>
            <div className="w-full h-fit relative">
              <div className="absolute -top-20 -right-4 mt-2 mr-2 w-36 h-24">
                <Image
                  src={`${imgPrefix}/images/homepage/upperright-highlight.png`}
                  alt="Badge"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <Heading title="AnyParser: Vision LLM for Document Parsing" center />
            </div>
            <div className="text-lg text-center py-2">
              80% of OCR users are tired of maintaining glue code. Free up your time with our hands-free document LLM,
              offering unmatched accuracy and complete privacy.
            </div>
            <div className="text-lg text-center py-2">
              Parsing PDFs, PPTs, Word, and images with configurable options such as removing private identity info,
              extract table and charts, keeping footnotes and headers, and much more!
            </div>
            <div className="w-full pt-8 pb-2 flex items-center justify-center gap-4">
              <Button label="Try on our website!" onClick={() => router.push('/sandbox')} />
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
