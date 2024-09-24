'use client';

import Button from '../Button';
import Container from '../Container';

interface PageHeroProps {
  title: string;
  description?: string;
  image?: string;
  button?: { label: string; link?: string; onClick?: () => void };
  short?: boolean;
}

const PageHero = ({ title, description, button, image, short }: PageHeroProps) => {
  return (
    <div
      className={`w-full h-full overflow-hidden relative ${!image && 'bg-gradient-to-tr from-cambio-primary from-30% via-white to-cambio-primary to-70%'}`}
    >
      <Container styles={`relative z-10 ${short ? 'h-[200px] mt-20' : 'h-[55vh] min-h-[650px]'} w-full`}>
        <div className="flex justify-center items-center h-full w-full">
          <div className="max-w-[800px] flex flex-col items-center justify-center gap-20 h-full">
            <div>
              <h1 className="text-6xl font-bold mb-8 text-center whitespace-pre-line">{title}</h1>
              {description && <p className="text-3xl text-center whitespace-pre-line">{description}</p>}
            </div>
            {button && (
              <div className="w-[300px]">
                {button.onClick ? (
                  <Button label={button.label} onClick={button.onClick} />
                ) : (
                  <a href={button.link} target="_blank" rel="noopener noreferrer">
                    <Button label={button.label} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PageHero;
