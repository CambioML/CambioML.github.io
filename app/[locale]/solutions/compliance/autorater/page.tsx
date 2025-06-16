'use client';

import PageHero from '@/app/components/hero/PageHero';
import Section from '@/app/components/Section';
import { useTranslation } from '@/lib/use-translation';

const AutoRaterSolutionsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pb-10 w-full h-full bg-white dark:bg-background">
      <PageHero
        title={t.solutionPages.compliance.autorater.title}
        description={t.solutionPages.compliance.autorater.description}
      />
      <div className="flex flex-col items-center justify-center py-20">
        <Section
          title={t.solutionPages.compliance.autorater.section.title}
          paragraphs={[t.solutionPages.compliance.autorater.section.paragraph]}
          center
        />
      </div>
    </div>
  );
};

export default AutoRaterSolutionsPage;
