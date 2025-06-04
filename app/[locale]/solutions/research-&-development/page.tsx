'use client';

import PageHero from '@/app/components/hero/PageHero';
import useDemoModal from '@/app/hooks/useDemoModal';
import Feature from '@/app/components/feature/Feature';
import DemoFeature from '@/app/components/feature/DemoFeature';
import SolutionsList from '@/app/components/solutions/SolutionsList';
import { solutions } from '@/app/data';
import { useTranslation } from '@/lib/use-translation';

const RDSolutionsPage = () => {
  const demoModal = useDemoModal();
  const { t } = useTranslation();

  // Type assertion to access new solutionPages translations
  const solutionPages = t.solutionPages;

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero
        title={
          solutionPages?.researchDevelopment?.title ||
          `Access the Knowns and
        Unlock the Unknowns in R&D`
        }
        description={
          solutionPages?.researchDevelopment?.description ||
          `Reduce time spent on data cleaning by up to 90%
        Keep up-to-date with the state-of-the-art research
        Discover the unknowns in R&D with ease`
        }
        button={{ label: t.bookDemo.title, onClick: demoModal.onOpen }}
      />
      <div className="flex flex-col gap-10 items-center justify-center py-20">
        <Feature
          title={
            solutionPages?.researchDevelopment?.features?.[0]?.title || 'Access unknown insights from multi-source data'
          }
          center
        >
          <DemoFeature
            image="/images/graphics/cambio-flow-rd.png"
            alt="Cambio Flow R&D"
            text={
              solutionPages?.researchDevelopment?.features?.[0]?.text ||
              `• Reduce time spent on data cleaning by up to 90%
            • Discover the unknowns in R&D with ease
            • Fully own and control your proprietary AI agent`
            }
          />
        </Feature>
        <Feature
          title={
            solutionPages?.researchDevelopment?.features?.[1]?.title ||
            'Write your research report to prove state-of-the-art'
          }
          center
        >
          <DemoFeature
            demo="/images/pykoi/pykoi-rag-chatbot-modify.gif"
            alt="Cambio Flow Portfolio"
            text={
              solutionPages?.researchDevelopment?.features?.[1]?.text ||
              `• Back up your research novelty with real data
            • Compare your research with the SOTA at ease
            • Fully own and control your proprietary AI agent`
            }
          />
        </Feature>
        <Feature title={solutionPages?.researchDevelopment?.features?.[2]?.title || 'Use Cases'} center>
          <SolutionsList
            solutions={solutions.filter((sol) => sol.industries.includes('research-&-development'))}
            sortNewest
          />
        </Feature>
      </div>
    </div>
  );
};

export default RDSolutionsPage;
