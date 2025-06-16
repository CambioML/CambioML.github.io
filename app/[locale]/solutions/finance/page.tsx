'use client';

import PageHero from '@/app/components/hero/PageHero';
import IconSection from '@/app/components/IconSection';
import Feature from '@/app/components/feature/Feature';
import DemoFeature from '@/app/components/feature/DemoFeature';
import { ChartLineUp, Gauge, FolderLock } from '@phosphor-icons/react';
import SolutionsList from '@/app/components/solutions/SolutionsList';
import { solutions } from '@/app/data';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/use-translation';

const FintechSolutionsPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  // Type assertion to access new solutionPages translations
  const solutionPages = t.solutionPages;

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center bg-white dark:bg-background">
      <PageHero
        title={solutionPages.finance.title}
        description={solutionPages.finance.description}
        button={{ label: t.bookDemo.title, onClick: () => router.push('/book-demo') }}
      />
      <div className="flex flex-col gap-10 items-center justify-center py-20">
        <IconSection
          title={solutionPages.finance.iconSection.title}
          points={[
            {
              icon: Gauge,
              text: solutionPages.finance.iconSection.points[0],
            },
            {
              icon: ChartLineUp,
              text: solutionPages.finance.iconSection.points[1],
            },
            {
              icon: FolderLock,
              text: solutionPages.finance.iconSection.points[2],
            },
          ]}
          center
        />
        <Feature title={solutionPages.finance.features[0].title} center>
          <DemoFeature
            image="/images/graphics/cambio-flow-portfolio-20240708.png"
            alt="Cambio Flow Portfolio"
            text={solutionPages.finance.features[0].text}
          />
        </Feature>
        <Feature title={solutionPages.finance.features[1].title} center>
          <DemoFeature
            demo="/images/pykoi/pykoi-rag-chatbot-modify.gif"
            alt="Cambio Flow Portfolio"
            text={solutionPages.finance.features[1].text}
          />
        </Feature>
        <Feature title={solutionPages.finance.features[2].title} center>
          <SolutionsList solutions={solutions.filter((sol) => sol.industries.includes('finance'))} sortNewest />
        </Feature>
      </div>
    </div>
  );
};

export default FintechSolutionsPage;
