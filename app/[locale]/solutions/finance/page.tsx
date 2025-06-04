'use client';

import PageHero from '@/app/components/hero/PageHero';
import IconSection from '@/app/components/IconSection';
import Feature from '@/app/components/feature/Feature';
import DemoFeature from '@/app/components/feature/DemoFeature';
import { ChartLineUp, Gauge, FolderLock } from '@phosphor-icons/react';
import SolutionsList from '@/app/components/solutions/SolutionsList';
import { solutions } from '@/app/blog/data';
import { useRouter } from 'next/navigation';

const FintechSolutionsPage = () => {
  const router = useRouter();
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero
        title="Your Customized AI Assistant to Discover Insights"
        description={`Find mispriced equity faster.
        Explain your investment decisions with real data.
        Fully own and control your proprietary AI agent.`}
        button={{ label: 'Book a Demo', onClick: () => router.push('/book-demo') }}
      />
      <div className="flex flex-col gap-10 items-center justify-center py-20">
        <IconSection
          title={`Interested in using LLMs to boost your
          portfolio performance?`}
          points={[
            {
              icon: Gauge,
              text: 'Do you want to extract trading signals from unstructured data 10x faster?',
            },
            {
              icon: ChartLineUp,
              text: 'Do you need a personalized AI explainer to interpret the trading signals?',
            },
            {
              icon: FolderLock,
              text: 'Are you concerned about information leak from using public LLM APIs?',
            },
          ]}
          center
        />
        <Feature title="Access to unknown insights from multi-source data" center>
          <DemoFeature
            image="/images/graphics/cambio-flow-portfolio-20240708.png"
            alt="Cambio Flow Portfolio"
            text={`Reduce time spent on data cleaning by up to 90%

            Access to 10x more financial insights from multiple sources

            Fully own and control your proprietary AI agent`}
          />
        </Feature>
        <Feature title="Interpret your investment decisions with evidence" center>
          <DemoFeature
            demo="/images/pykoi/pykoi-rag-chatbot-modify.gif"
            alt="Cambio Flow Portfolio"
            text={`Back up your own investment decisions with real data

            Write your economist views with your own style

            Fully own and control your proprietary AI agent`}
          />
        </Feature>
        <Feature title="Use Cases" center>
          <SolutionsList solutions={solutions.filter((sol) => sol.industries.includes('finance'))} sortNewest />
        </Feature>
      </div>
    </div>
  );
};

export default FintechSolutionsPage;
