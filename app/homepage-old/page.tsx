'use client';

import ProductCard from '../components/ProductCard';
import Feature from '../components/feature/Feature';
import Hero from '../components/hero/Hero';
import { FaAws } from 'react-icons/fa';
import { SiMicrosoftazure, SiGooglecloud } from 'react-icons/si';
import UseCaseOverview from '../components/home-page/UseCaseOverview';
import Customers from '../components/home-page/Customers';
import Card from '../components/Card';
import { FileMagnifyingGlass, LockKey, Lock, Table, Target, Robot } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import SolutionsCarousel from '../components/solutions/SolutionsCarousel';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Hero
        title="Vision LLM for Document Parsing"
        subtitle="80% of OCR users are tired of maintaining glue code. Free up your time with our hands-free document LLM, offering unmatched accuracy and complete privacy."
        typingWords={[
          'removing private information (P.I.I.)',
          'keeping footnotes, headers and footers',
          'converting charts to tables',
          'describing figures',
        ]}
        typingStaticWords="Parsing PDFs, PPTs, Word, and images with configurable options such as "
        image="/images/hero.png"
        center
      />
      <div className="h-full w-full pt-10">
        <Feature title="Extract key information with full confidence" center>
          <div className="h-[1000px] lg:h-[450px] grid grid-cols-1 lg:grid-cols-3 gap-10 py-10">
            <Card
              text="Extract 10x more hidden insights from tables, charts, indexes, headers and footers."
              center
              cardIcon={FileMagnifyingGlass}
            />
            <Card text="Redact confidential information during the retrieval as needed." center cardIcon={Lock} />
            <Card
              text="Supported inputs include PDF, PPT, Word or Images; Output to JSON, CSV or Markdown"
              center
              cardIcon={Table}
            />
          </div>
        </Feature>
        <div className="w-full h-[200px] flex items-center justify-center">
          <a
            href="https://www.ycombinator.com/launches/KWQ-cambioml-enterprise-data-gold-mining"
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt="Launch YC: CambioML - Enterprise data gold mining"
              src="https://www.ycombinator.com/launches/KWQ-cambioml-enterprise-data-gold-mining/upvote_embed.svg"
              className="w-[400px]"
            />
          </a>
        </div>
        <Feature title="Adopted by Researchers and Engineers at" alternate center>
          <Customers />
        </Feature>
        <Feature title="Accurate, Automatic, and Secure" center>
          <div className="h-[1000px] lg:h-[450px] grid grid-cols-1 lg:grid-cols-3 gap-10 py-10">
            <Card
              text="Fully privacy preserved. Redact confidential information during the retrieval as needed."
              center
              cardIcon={LockKey}
            />
            <Card
              text="No hallucination. 90% less error rate than traditional OCR based model."
              center
              cardIcon={Target}
            />
            <Card text="No more manual data entry. Map to the schema as you need." center cardIcon={Robot} />
          </div>
        </Feature>
        <Feature title="Use Cases" center alternate>
          <SolutionsCarousel sortNewest />
        </Feature>
        <Feature title="Extract Insights from your Proprietary Data with Ease" center>
          <UseCaseOverview />
        </Feature>
        <Feature title="Host your private LLMs anywhere in your control" description="" center alternate>
          <div
            className="w-full min-w-[1200px] h-full
            mt-10
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
            "
          >
            <ProductCard
              title="Test Cambio API today"
              outline
              buttonText="Try it for Free"
              buttonHandler={() => router.push('account')}
            >
              Extract and Map your files on our Playground.
            </ProductCard>
            <ProductCard title="Deploy on the Cloud">
              <FaAws size={80} />
              <SiMicrosoftazure size={50} />
              <SiGooglecloud size={70} />
            </ProductCard>
            <ProductCard title="Deploy on your data center" outline>
              Host our services on your data center
            </ProductCard>
          </div>
        </Feature>
      </div>
    </>
  );
}
