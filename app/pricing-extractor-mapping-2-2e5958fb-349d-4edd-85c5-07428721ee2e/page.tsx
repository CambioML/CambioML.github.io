'use client';

import PageHero from '../components/hero/PageHero';
import usePricingContactModal from '../hooks/usePricingContactModal';
import { Check } from '@phosphor-icons/react';

type Plan = {
  name: string;
  price: string;
  pages: string;
  bgColor?: string;
  features: {
    autoCapture: boolean;
    autoRollover: boolean;
    clientOnboarding: boolean;
    customizationServices: boolean;
    customModelTraining: boolean;
    customIntegrations: boolean;
    personalizedTraining: boolean;
  };
  additional?: string[];
};

const plans: Plan[] = [
  {
    name: 'Starter',
    price: '$99/month*, or $1k/year',
    pages: 'Includes 2k credits** per month, then $0.045 per credit',
    bgColor: 'bg-neutral-100',
    features: {
      autoCapture: true,
      autoRollover: true,
      clientOnboarding: false,
      customizationServices: false,
      customIntegrations: false,
      customModelTraining: false,
      personalizedTraining: false,
    },
  },
  {
    name: 'Pro',
    price: '$499/month*, or $5k/year',
    pages: 'Includes 20k credits** per month, then $0.025 per credit',
    bgColor: 'bg-sky-200',
    features: {
      autoCapture: true,
      autoRollover: true,
      clientOnboarding: false,
      customizationServices: false,
      customIntegrations: false,
      customModelTraining: false,
      personalizedTraining: false,
    },
  },
  {
    name: 'Silver',
    price: '$1k/month* or $10k/year',
    pages: 'Includes 100k credits** per month, then $0.01 per credit',
    bgColor: 'bg-[#bcc6cc]',
    features: {
      autoCapture: true,
      autoRollover: true,
      clientOnboarding: true,
      customizationServices: false,
      customIntegrations: false,
      customModelTraining: false,
      personalizedTraining: false,
    },
  },
  {
    name: 'Gold',
    price: '$3k/month* or $30k/year',
    pages: 'Includes 500k credits** per month, then $0.006 per credit',
    bgColor: 'bg-teal-600 text-white',
    features: {
      autoCapture: true,
      autoRollover: true,
      clientOnboarding: true,
      customizationServices: true,
      customIntegrations: false,
      customModelTraining: false,
      personalizedTraining: false,
    },
  },
  {
    name: 'Enterprise',
    bgColor: 'bg-sky-800 text-white',
    price: 'contact-us',
    pages: 'contact-us',
    features: {
      autoCapture: true,
      autoRollover: true,
      clientOnboarding: true,
      customizationServices: true,
      customIntegrations: true,
      customModelTraining: true,
      personalizedTraining: true,
    },
    additional: ['Custom model training', 'Custom Integrations and API Responses', 'Personalized 1-1 team training'],
  },
];

const headerStyle = 'text-2xl font-semibold text-neutral-800 text-center pb-4 py-2 px-4 border-b border-gray-200';
const rowHeaderStyle =
  'text-xl text-center py-2 px-4 border-b border-gray-200 font-semibold text-neutral-800 text-left bg-white border-r-2';
const featureRowHeaderStyle =
  'text-md py-2 px-4 border-b border-gray-200 text-neutral-800 text-left bg-white border-r-2';

const priceStyle = 'text-lg py-2 px-4 border-b border-gray-200 font-semibold text-neutral-800 text-centers';

const checkCellStyle = 'py-2 px-4 border-b border-gray-200';

const checkCellDivStyle = 'flex justify-center items-center';

interface FeatureCheckProps {
  enabled: boolean;
}

const FeatureCheck = ({ enabled }: FeatureCheckProps) => {
  if (!enabled) {
    return <div className="bg-red-100"></div>;
  }
  return <Check size={32} className="text-green-500" />;
};

const PricingPage = () => {
  const contactModal = usePricingContactModal();
  return (
    <div className="x pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero
        title={`Real-time API Pricing`}
        description={'The fastest vision language model with real-time response around 0.5 to 5 seconds per page.'}
        short
      />
      <div className="container mx-auto px-4 py-16">
        <table className="pricing-table min-w-full bg-white border border-gray-200">
          <thead className="text-2xl">
            <tr>
              <th className="bg-neutral-100 border-b border-r border-gray-200"></th>
              {plans.map((plan, index) => (
                <th key={index} className={`${headerStyle} ${plan.bgColor}`}>
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className={rowHeaderStyle}>Price</th>
              {plans.map((plan, index) => {
                if (plan.price === 'contact-us') {
                  return (
                    <td key={index} rowSpan={2} className="w-[300px] pt-20 bg-sky-200 flex items-center justify-center">
                      <button
                        className="text-lg min-w-[200px] text-white bg-sky-800 p-4 rounded-lg cursor-pointer hover:bg-sky-900 hover:text-neutral-100"
                        onClick={contactModal.onOpen}
                      >
                        Contact us
                      </button>
                    </td>
                  );
                } else {
                  return (
                    <td key={index} className={priceStyle}>
                      {plan.price}
                    </td>
                  );
                }
              })}
            </tr>
            <tr>
              <td className={rowHeaderStyle}>Packages</td>
              {plans.map((plan, index) => {
                if (plan.price !== 'contact-us') {
                  return (
                    <td key={index} className="py-2 px-4 border-b border-gray-200">
                      {plan.pages}
                    </td>
                  );
                } else {
                  return <td key={index} className="bg-sky-200 border-gray-200"></td>;
                }
              })}
            </tr>
            <tr>
              <td
                className="text-2xl font-semibold text-center pt-4 pb-4 border-b border-gray-200 bg-neutral-100"
                colSpan={6}
              >
                Features
              </td>
            </tr>
            <tr>
              <td className={featureRowHeaderStyle}>Auto-capture tables and transform to Markdown, CSV, or JSON</td>
              {plans.map((plan, index) => (
                <td key={index} className={checkCellStyle}>
                  <div className={checkCellDivStyle}>
                    <FeatureCheck enabled={plan.features.autoCapture} />
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className={featureRowHeaderStyle}>Credits automatically roll over</td>
              {plans.map((plan, index) => (
                <td key={index} className={checkCellStyle}>
                  <div className={checkCellDivStyle}>
                    <FeatureCheck enabled={plan.features.autoRollover} />
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className={featureRowHeaderStyle}>Customized client onboarding</td>
              {plans.map((plan, index) => (
                <td key={index} className={checkCellStyle}>
                  <div className={checkCellDivStyle}>
                    <FeatureCheck enabled={plan.features.clientOnboarding} />
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className={featureRowHeaderStyle}>
                Customization services available (e.g. Annotation, quality audit)
              </td>
              {plans.map((plan, index) => (
                <td key={index} className={checkCellStyle}>
                  <div className={checkCellDivStyle}>
                    <FeatureCheck enabled={plan.features.customizationServices} />
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className={featureRowHeaderStyle}>Private Model Hosting (On-prem or Cloud)</td>
              {plans.map((plan, index) => (
                <td key={index} className={checkCellStyle}>
                  <div className={checkCellDivStyle}>
                    <FeatureCheck enabled={plan.features.customModelTraining} />
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className={featureRowHeaderStyle}>Custom Model Training, Integrations and API Responses</td>
              {plans.map((plan, index) => (
                <td key={index} className={checkCellStyle}>
                  <div className={checkCellDivStyle}>
                    <FeatureCheck enabled={plan.features.customIntegrations} />
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className={featureRowHeaderStyle}>Personalized 1-1 Team Training</td>
              {plans.map((plan, index) => (
                <td key={index} className={checkCellStyle}>
                  <div className={checkCellDivStyle}>
                    <FeatureCheck enabled={plan.features.personalizedTraining} />
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="h-[100px] p-8 rounded-xl w-screen-xl items-center justify-center">
        <ul>
          <li>* No hidden fees; Monthly pay as you go; 30 days money back guaranteed.</li>
        </ul>
        <ul>
          <li>
            ** 1 credit covers 1 page extraction up to 300 tokens (a normal A4 page). Pages exceeding 300 
            tokens will incur an extra credit for every additional 300 tokens.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PricingPage;
