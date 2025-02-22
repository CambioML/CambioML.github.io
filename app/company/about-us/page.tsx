'use client';

import PageHero from '@/app/components/hero/PageHero';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Section from '@/app/components/Section';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Heading from '@/app/components/Heading';
import TeamMember from '@/app/components/about-us/TeamMember';
import { useRouter } from 'next/navigation';

const investors = [
  {
    image: '/images/investors/ycombinator.png',
    alt: 'Y Combinator',
    url: 'https://www.ycombinator.com/companies/cambioml',
  },
  {
    image: '/images/investors/general-catalyst.png',
    alt: 'General Catalyst',
    url: 'https://www.generalcatalyst.com/',
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

const AboutPage = () => {
  const router = useRouter();
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center ">
      <PageHero title="About us" short />
      <Container styles="h-max" centerX center-y>
        <div className="pt-10 max-w-[800px]">
          <Section
            title="Who we are"
            paragraphs={[
              `CambioML is a team of former ML scientists and engineers at AWS and Tesla, driven by a shared passion for leveraging AI to fast-track R&D across various industries. Our team's blend of machine learning acumen and sector-specific insights enables us to create technology that's not only state-of-the-art, but also deeply attuned to our customers' needs.`,
            ]}
            center
          />
        </div>
        <div className="pt-40 max-w-[800px] w-full">
          <Heading title="Founding Team" center />
          <div className="pt-5 grid gap-3 grid-cols-1 md:grid-cols-2 w-full">
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
        <div className="py-40 max-w-[800px]">
          <Section
            title="What we offer"
            paragraphs={[
              'CambioML offers LLM-based data enrichment tools that precisely extract unstructured data from mixed formats such as PDFs, HTMLs and images. With CambioML, ML scientists and R&D engineers can extract accurate information without spending 80% of their time on data cleaning or worrying about the information loss. Users can ask complex research questions and identify semantic trends across multiple data sources, and understand the LLM outputs via in-depth interpretation, thereby accelerating R&D processes.',
            ]}
            center
          />
        </div>
        <Heading title="Our Investors" center />
        <div className="pt-5 flex gap-8 max-w-800 align-items justify-items h-[100px] w-max">
          {investors.map((investor, i) => (
            <a target="_blank" href={investor.url} rel="noopener noreferrer" key={investor.url + i}>
              <div className={`flex items-center justify-center h-full w-max`}>
                <div className={`${investor.height || 'h-[100px]'} w-auto`}>
                  <img
                    src={imgPrefix + investor.image}
                    alt={investor.alt}
                    className={`cursor-pointer max-h-full max-w-full`}
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="flex items-center align-center w-[500px] gap-5 mt-20">
          <Button
            label="Get Started"
            onClick={() => {
              router.push('/docs');
            }}
            small
          />
          <Button
            label="Read the documentation"
            onClick={() => {
              router.push('/docs');
            }}
            outline
            small
          />
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
