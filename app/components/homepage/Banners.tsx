'use client';

import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Container from '../Container';
import Button from '../Button';
import Image from 'next/image';
import CodeBlock from '../CodeBlock';
import { useRouter } from 'next/navigation';

interface BannerProps {
  title: string;
  description: string;
  actionLabel: string;
  action: () => void;
  inverse?: boolean;
  imgPath?: string;
  code?: string;
}

const Banner = ({ title, description, actionLabel, action, inverse, imgPath, code }: BannerProps) => {
  return (
    <div className={`w-full h-full flex ${inverse ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`w-[80%] grid grid-cols-2 gap-16 p-16 rounded-2xl ${inverse ? 'bg-[#1E1E1E] text-white' : 'bg-[#F1EAE5]'} ${code && 'pr-4'}`}
      >
        <div>
          <h2 className="text-2xl font-semibold pb-8">{title}</h2>
          <div className="text-md w-full pb-16">{description}</div>
          <div>
            <Button label={actionLabel} onClick={action} outline={inverse} />
          </div>
        </div>
        {imgPath && (
          <div className="w-full h-full flex items-center justify-center relative">
            <Image
              src={`${imgPrefix}${imgPath}`}
              alt={description}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-md"
            />
          </div>
        )}
        {code && (
          <div className="h-full w-full">
            <CodeBlock code={code} language="python" />
          </div>
        )}
      </div>
    </div>
  );
};

const Banners = () => {
  const router = useRouter();

  return (
    <div className="h-fit w-full pt-20">
      <Container styles="relative z-10 min-h-[800px] h-fit bg-white pb-20">
        <div className="w-full h-full flex flex-col items-center justify-start px-10 gap-8">
          <Banner
            title="Parse data accurately"
            description="AnyParser playground is straight-forward, fast, and intuitive. Try the interface now and take a break for the rest of the day"
            actionLabel={'Try on our website!'}
            action={() => router.push('/sandbox')}
            imgPath="/images/homepage/banner-1.png"
          />
          <Banner
            title="Build with AnyParser"
            description="AnyParser playground is straight-forward, fast, truly intuitive, try the interface now and take a break for the rest of the day"
            actionLabel={'Get API access'}
            action={() => router.push('/account')}
            inverse
            code={`from any_parser import AnyParser

op = AnyParser(example_apikey)

content_result = op.extract(example_local_file)`}
          />
        </div>
      </Container>
    </div>
  );
};

export default Banners;
