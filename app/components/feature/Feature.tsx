'use client';

import Container from '../Container';
import Heading from '../Heading';

interface FeatureProps {
  title: string;
  description?: string;
  center?: boolean;
  children: React.ReactNode;
  alternate?: boolean;
}

const Feature = ({ title, description, center, alternate, children }: FeatureProps) => {
  return (
    <div className={`w-full h-full py-10 ${alternate && 'bg-neutral-100 dark:bg-card-1'}`}>
      <Container styles="h-max w-full">
        <div className="flex flex-col items-center gap-10 py-10 h-max w-full">
          <Heading title={title} subtitle={description} center={center} />
          <div className="flex flex-col items-center justify-center h-max w-full max-w-[1000px]">{children}</div>
        </div>
      </Container>
    </div>
  );
};

export default Feature;
