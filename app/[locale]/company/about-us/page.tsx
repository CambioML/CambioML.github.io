'use client';

import '@/app/theme.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Card, { CardContent } from '@/app/components/dark/card';
import FadeIn from '@/app/components/dark/animations/fade-in';
import { useTranslation } from '@/lib/use-translation';
import Container from '@/app/components/Container';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import TeamMember from '@/app/components/about-us/TeamMember';

const investors = [
  {
    image: '/images/investors/ycombinator.png',
    alt: 'Y Combinator',
    url: 'https://www.ycombinator.com/companies/cambioml',
    height: 'h-[100px]',
  },
  {
    image: '/images/investors/general-catalyst.png',
    alt: 'General Catalyst',
    url: 'https://www.generalcatalyst.com/',
    height: 'h-[100px]',
  },
  {
    image: '/images/investors/samsung-next.png',
    alt: 'Samsung Next',
    url: 'https://www.samsungnext.com/',
    height: 'h-[50px]',
  },
  {
    image: '/images/investors/zvc.png',
    alt: 'Z Venture Capital',
    url: 'https://zvc.vc/en/',
    height: 'h-[65px]',
  },
];

// Who We Are Section
function WhoWeAre() {
  const { t } = useTranslation();

  return (
    <section
      id="who-we-are"
      className="px-3.75 py-12.5 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-12.5 items-center"
    >
      <div className="container flex flex-col gap-6.25 text-center">
        <h2 className="text-5xl font-medium">
          <span className="bg-gradient">{t.company.whoWeAre.title}</span>
        </h2>
        <div className="text-lg leading-relaxed max-w-5xl mx-auto space-y-4 text-white">
          {t.company.whoWeAre.description.map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

// Founding Team Section
function FoundingTeam() {
  const { t } = useTranslation();

  return (
    <section
      id="founding-team"
      className="px-3.75 py-12.5 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-12.5 items-center"
    >
      <div className="container flex flex-col gap-6.25 text-center">
        <h2 className="text-5xl font-medium">
          <span className="bg-gradient">{t.company.foundingTeam.title}</span>
        </h2>
        <div className="pt-5 grid gap-3 grid-cols-1 md:grid-cols-2 w-full max-w-4xl">
          <TeamMember
            name="Rachel Hu"
            title="CEO"
            image="/images/team/rachel.png"
            url="https://www.linkedin.com/in/rachelsonghu/"
            logos={[
              {
                image: '/images/companies/aws-logo.png',
                alt: 'AWS',
                url: 'https://aws.amazon.com/',
              },
              {
                image: '/images/team/berkeley.png',
                alt: 'University of California, Berkeley',
                url: 'https://www.berkeley.edu//',
              },
            ]}
          />
          <TeamMember
            name="Lingjie Kong"
            title="Co-Founder"
            image="/images/team/kimi.jpeg"
            url="https://www.linkedin.com/in/0xlingjiekong/"
            logos={[
              {
                image: '/images/companies/deepmind.png',
                alt: 'DeepMind',
                url: 'https://deepmind.google/',
              },
              {
                image: '/images/team/stanford.png',
                alt: 'Stanford University',
                url: 'https://www.stanford.edu/',
                height: 'h-[45px]',
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

// What We Offer Section
function WhatWeOffer() {
  const { t } = useTranslation();

  return (
    <section
      id="what-we-offer"
      className="px-3.75 py-12.5 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-12.5 items-center"
    >
      <div className="container flex flex-col gap-6.25 text-center">
        <h2 className="text-5xl font-medium">
          <span className="bg-gradient">{t.company.whatWeOffer.title}</span>
        </h2>
        {t.company.whatWeOffer.description.map((paragraph: string, index: number) => (
          <p key={index} className="text-lg leading-relaxed max-w-5xl mx-auto text-white">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

// Investors Section
function Investors() {
  const { t } = useTranslation();

  return (
    <section
      id="investors"
      className="px-3.75 py-12.5 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-12.5 items-center"
    >
      <div className="flex flex-col items-center gap-12.5">
        <h2 className="text-5xl font-medium text-center">
          <span className="bg-gradient">{t.company.investors.title}</span>
        </h2>

        <div className="container">
          <FadeIn variant="fadeInUp" className="h-full">
            <Card variant="top-light">
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-8 max-w-4xl items-center justify-center">
                  {investors.map((investor, index) => (
                    <a
                      key={index}
                      href={investor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center transition-transform hover:scale-105 bg-white rounded-md"
                    >
                      <div className={`${investor.height} w-auto h-full flex items-center justify-center`}>
                        <Image
                          src={imgPrefix + investor.image}
                          alt={investor.alt}
                          width={200}
                          height={100}
                          className="cursor-pointer max-h-full max-w-full object-contain p-2"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// Get Started Section
function GetStarted() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  return (
    <section
      id="get-started"
      className="px-3.75 py-12.5 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-12.5 items-center"
    >
      <div className="container flex flex-col gap-8 text-center items-center">
        <h2 className="text-5xl font-medium leading-relaxed pb-2">
          <span className="bg-gradient">{t.company.getStarted.title}</span>
        </h2>
        <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-8 text-white">{t.company.getStarted.description}</p>
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push(`/${locale}/anyparser`)}
            className="relative px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-200"
            style={{
              background: 'rgba(22, 22, 22)',
              border: '1px solid rgb(34, 34, 34)',
            }}
          >
            <span className="bg-gradient">{t.company.getStarted.buttonText}</span>
          </button>
          <button
            onClick={() => window.open('https://docs.cambioml.com/introduction', '_blank')}
            className="relative px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-200"
            style={{
              background: 'rgba(22, 22, 22)',
              border: '1px solid rgb(34, 34, 34)',
            }}
          >
            <span className="bg-gradient">{t.company.getStarted.docsButtonText}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

const AboutPage = () => {
  return (
    <div className="theme-dark w-full h-full flex flex-col justify-center items-center">
      <Container styles="h-max pt-24" centerX center-y>
        <WhoWeAre />
        <FoundingTeam />
        <WhatWeOffer />
        <Investors />
        <GetStarted />
      </Container>
    </div>
  );
};

export default AboutPage;
