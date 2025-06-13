import CodeBlock from './CodeBlock';
import FeatureImage from './feature/FeatureImage';

interface DemoTabProps {
  code: string;
  image: string;
  alt: string;
}

const DemoTab = ({ code, image, alt }: DemoTabProps) => {
  return (
    <div className="py-4 w-full lg:w-[80vw] max-w-screen-xl h-full lg:h-[500px] grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 lg:absolute lg:left-[50%] lg:translate-x-[-50%]">
      <div className="h-full w-full flex items-center justify-center">
        <CodeBlock code={code} language="python" />
      </div>
      <div className="w-full flex items-center justify-center">
        <FeatureImage image={image} alt={alt} height="h-[500px]" />
      </div>
    </div>
  );
};

export default DemoTab;
