'use client';

import PageHero from '@/app/components/hero/PageHero';
import Container from '@/app/components/Container';
import SolutionsCard from '@/app/components/solutions/SolutionsCard';
import Section from '@/app/components/Section';
import Button from '@/app/components/Button';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/use-translation';

const ComplianceSolutionsPage = () => {
  const router = useRouter();
  const { t, locale } = useTranslation();

  // Type assertion to access new solutionPages translations
  const solutionPages = t.solutionPages;

  return (
    <div className="pb-10 w-full h-full bg-background">
      <PageHero
        title={solutionPages?.compliance?.title || 'ComplianceAI'}
        description={solutionPages?.compliance?.description || 'Get Auto Compliant with LLMs'}
      />
      <div className="flex flex-col items-center justify-center py-20">
        <Section
          title={solutionPages?.compliance?.section?.title || 'Automate your compliance process with AI raters'}
          paragraphs={[
            solutionPages?.compliance?.section?.paragraph ||
              'Are you worried about compliance or risk for your private LLMs? We offer a specialized compliance LLM for regulatory compliance and risk management. This system automatically monitors regulatory changes and aligns them with your internal policies and controls, ensuring timely tracking, response, and reporting on significant regulations and requirements.',
          ]}
          center
        />
      </div>
      <Container>
        <div className="pt-10 flex items-center justify-center">
          <div className="max-w-[1200px] w-full h-full">
            <div
              className="
                            mt-10
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-8
                            "
            >
              {(solutionPages?.compliance?.useCases || []).map((useCase, i) => (
                <SolutionsCard
                  key={useCase.title + i}
                  title={useCase.title}
                  description={useCase.description}
                  url="https://www.cambioml.com"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
      <div className="w-full flex items-center justify-center py-20">
        <div className="w-[300px]">
          <Button
            label={solutionPages?.compliance?.button || 'Start with AutoRater'}
            onClick={() => {
              router.push(`/${locale}/solutions/compliance/autorater`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ComplianceSolutionsPage;
