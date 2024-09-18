'use client';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import Container from '../Container';
import Image from 'next/image';

interface HowItWorksCardProps {
  imgPath: string;
  title: string;
  subtitle: string;
  description: string;
}

const HowItWorksCard = ({ imgPath, title, subtitle, description }: HowItWorksCardProps) => {
  return (
    <div className="flex flex-col justify-between h-full w-full bg-white rounded-xl p-8 shadow-xl shadow-[#FC557126]">
      <div className="w-[70%] flex-grow">
        <div className="text-6xl font-semibold pb-8">{title}</div>
        <div className="text-2xl w-full font-semibold pb-4">{subtitle}</div>
        <div className="text-md w-full">{description}</div>
      </div>
      <div className="w-full h-[300px] flex justify-end py-10">
        <div className="relative w-[70%]">
          <Image src={imgPath} alt={description} fill style={{ objectFit: 'contain' }} className="rounded-md" />
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const router = useRouter();
  return (
    <div className="h-fit w-full pt-20 bg-[linear-gradient(167.86deg,rgba(141,24,27,0.4)_6.41%,rgba(79,131,176,0)_79.81%)]">
      <Container styles="relative z-10 h-fit">
        <div className="w-full h-fit grid grid-cols-1 lg:grid-cols-[400px_1fr]">
          <div className="w-full h-full flex flex-col items-center justify-center px-10">
            <div className="text-6xl font-semibold">How AnyParser Works</div>
            <div className="w-full pt-8 pb-2 flex items-center justify-center gap-4">
              <Button label="Try on our website free!" onClick={() => router.push('/sandbox')} />
            </div>
            <div className="w-full py-1 flex items-center justify-center">
              Parse any data from any documents with straight-forward user interface
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-full py-4 lg:py-20">
            <div className="relative w-full max-w-[800px] h-auto" style={{ aspectRatio: '16/9' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full border-0"
                src="https://www.youtube.com/embed/T80TMGOTlK4?si=66Gr2MyYTubtq_mi"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="h-fit">
          <div className="pt-20 gap-20 grid grid-cols-1 lg:grid-cols-3 items-stretch justify-items-center w-full h-fit pb-8">
            <HowItWorksCard
              imgPath="/images/homepage/how-it-works-1.png"
              title="01"
              subtitle="Drag and drop the documents"
              description="Click “Upload File” to easily drag and drop the documents you want to parse, or simply paste a screenshot from your clipboard. We’ve also provided sample documentation to help you get started."
            />
            <HowItWorksCard
              imgPath="/images/homepage/how-it-works-2.png"
              title="02"
              subtitle="Edit parsing and privacy settings"
              description="AnyParser automatically categorizes various types of information, including PII (Personally Identifiable Information), footnotes, tables, and more. Just export the data you need!"
            />
            <HowItWorksCard
              imgPath="/images/homepage/how-it-works-3.png"
              title="03"
              subtitle="Export results to your system"
              description="Download your data in your preferred format—whether it’s HTML, Excel, JSON, or a database schema tailored to your business workflow."
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HowItWorks;
