import DemoButton from '../DemoButton';
import FeatureImage from './FeatureImage';

interface DemoFeatureProps {
  image?: string;
  demo?: string;
  alt: string;
  text: string;
}

const DemoFeature = ({ image, demo, alt, text }: DemoFeatureProps) => {
  return (
    <div className="lg:h-[800px] py-5 rounded-lg">
      <div className="gap-5 p-10 w-full lg:w-[80vw] max-w-screen-xl h-max lg:h-[700px] grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-[50px] lg:absolute lg:left-[50%] lg:translate-x-[-50%] border-solid border-neutral-200 dark:border-border-1 border shadow-md rounded-xl bg-white dark:bg-card-1">
        {image && <FeatureImage image={image} alt={alt} height="h-full" />}
        {demo && <FeatureImage image={demo} alt={alt} height="h-full" enableModal />}
        <div className="h-full w-full flex items-center justify-center">
          <div className="py-5 lg:h-[400px] w-full flex flex-col items-center justify-center">
            <div className="text-2xl pb-10 whitespace-pre-line text-neutral-600 dark:text-gray-300">{text}</div>
          </div>
        </div>
        <div className="flex w-full items-center justify-center col-span-1 lg:col-span-2">
          <DemoButton />
        </div>
      </div>
    </div>
  );
};

export default DemoFeature;
