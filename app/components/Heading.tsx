'use client';

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  white?: boolean;
  customClass?: string;
}

const Heading = ({ title, subtitle, center, white, customClass }: HeadingProps) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <h1
        className={`${customClass || 'text-4xl'} leading-tight ${white ? 'text-white' : 'text-neutral-800 dark:text-gray-200'} font-semibold whitespace-pre-line`}
      >
        {title}
      </h1>
      <h2
        className={`font-light leading-relaxed ${white ? 'text-white' : 'text-neutral-500 dark:text-gray-300'} mt-5 text-2xl`}
      >
        {subtitle}
      </h2>
    </div>
  );
};

export default Heading;
