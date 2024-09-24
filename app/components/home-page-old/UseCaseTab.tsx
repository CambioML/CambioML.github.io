import Button from '../Button';
import CodeBlock from '../CodeBlock';
import FeatureImage from '../feature/FeatureImage';
import { useRouter } from 'next/navigation';

interface UseCaseTabProps {
  code?: string;
  demo?: string;
  benefits: string[];
  image: string;
  alt: string;
  detailsPath?: string;
}

const UseCaseTab = ({ code, demo, benefits, image, alt, detailsPath }: UseCaseTabProps) => {
  const router = useRouter();
  return (
    <div className="gap-5 p-4 w-full lg:w-[80vw] max-w-screen-xl h-full lg:h-[750px] grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 lg:grid-rows-[550px_100px] gap-[50px] lg:absolute lg:left-[50%] lg:translate-x-[-50%] border-solid border-neutral-200 border-2 shadow-md rounded-xl bg-white">
      <div className="w-full flex flex-col items-center justify-center py-4 rounded-lg">
        <FeatureImage image={image} alt={alt} />
      </div>
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-full w-full pt-16 flex flex-col items-center justify-start gap-8 pr-2">
          <div className="text-neutral-800 text-4xl pb-10 flex flex-col gap-5">
            {benefits.map((benefit, index) => (
              <p key={index}>{benefit}</p>
            ))}
          </div>
          {code && <CodeBlock code={code} language="python" />}
          {demo && <FeatureImage image={demo} alt={alt} height="h-[400px]" enableModal />}
        </div>
      </div>
      <div className="flex gap-10 w-full items-center justify-center col-span-1 lg:col-span-2">
        <div className="w-[250px]">
          <Button
            label="Try it for Free"
            onClick={() => {
              router.push('/playground');
            }}
          />
        </div>
        {detailsPath && (
          <div className="w-[250px]">
            <Button
              label="Get more details"
              onClick={() => {
                router.push(detailsPath);
              }}
              outline
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UseCaseTab;
