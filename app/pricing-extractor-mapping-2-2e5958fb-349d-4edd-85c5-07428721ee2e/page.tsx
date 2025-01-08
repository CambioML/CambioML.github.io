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
    customModelHosting: boolean;
    customIntegrations: boolean;
    personalizedTraining: boolean;
  };
  additional?: string[];
};

const plans: Plan[] = [
  {
    name: 'Starter',
    price: '$499/month* or $5k/year',
    pages: 'Includes 20k credits** per month, then $0.025 per credit. Unused credits roll over to the next month.',
    bgColor: 'bg-sky-200',
    features: {
      autoCapture: true,
      autoRollover: true,
      clientOnboarding: false,
      customizationServices: false,
      customIntegrations: false,
      customModelHosting: false,
      personalizedTraining: false,
    },
  },
  {
    name: 'Silver',
    price: '$1.5k/month or $15k/year',
    pages: 'Includes 100k credits** per month, then $0.015 per credit. Unused credits roll over to the next month.',
    bgColor: 'bg-[#bcc6cc]',
    features: {
      autoCapture: true,
      autoRollover: true,
      clientOnboarding: true,
      customizationServices: false,
      customIntegrations: false,
      customModelHosting: false,
      personalizedTraining: false,
    },
  },
  {
    name: 'Gold',
    price: '$4.5k/month or $45k/year',
    pages: 'Includes 500k credits** per month, then $0.009 per credit. Unused credits roll over to the next month.',
    bgColor: 'bg-teal-600 text-white',
    features: {
      autoCapture: true,
      autoRollover: true,
      clientOnboarding: true,
      customizationServices: true,
      customIntegrations: false,
      customModelHosting: true,
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
      customModelHosting: true,
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
              <td className={featureRowHeaderStyle}>
                Extract full text to Markdown or Extract tables from PDF/image to CSV. (1 credit covers 1 page
                extraction, up to 500 tokens**.)
              </td>
              {plans.map((plan, index) => (
                <td key={index} className={checkCellStyle}>
                  <div className={checkCellDivStyle}>
                    <FeatureCheck enabled={plan.features.autoCapture} />
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td className={featureRowHeaderStyle}>
                Extract key values pairs into JSON. (1 credit covers up to 10 key value pairs.)
              </td>
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
              <td className={featureRowHeaderStyle}>Private Model Hosting (On-prem or Cloud)</td>
              {plans.map((plan, index) => (
                <td key={index} className={checkCellStyle}>
                  <div className={checkCellDivStyle}>
                    <FeatureCheck enabled={plan.features.customModelHosting} />
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
          </tbody>
        </table>
      </div>

      <div className="h-[100px] p-8 rounded-xl w-screen-xl items-center justify-center">
        <ul>
          <li>* No hidden fees; Monthly pay as you go; 30 days money back guaranteed.</li>
        </ul>
        <ul>
          <li>
            <p>{`** Pages exceeding 500 tokens will incur an extra credit for every additional 500 tokens.`}</p>
          </li>
        </ul>
      </div>
      {/* Enhanced promotional banner */}
      <div className="w-full px-4 mt-12">
        <div className="container mx-auto bg-gradient-to-r from-sky-100 to-sky-200 rounded-2xl py-8 shadow-lg border border-sky-200">
          <p className="text-center text-xl md:text-2xl text-sky-900 font-semibold">
            🎉 Special Offer for Startups and Non-profits! 🎉
          </p>
          <p className="text-center text-lg md:text-xl text-sky-900 mt-2">
            Get <span className="font-bold text-sky-700">3 months FREE</span> for startups (less than 10 people) of
            Non-profit organizations.
            <br />
            <span className="mt-2 inline-block">
              Email{' '}
              <a href="mailto:info@cambioml.com" className="text-sky-700 hover:underline font-bold">
                info@cambioml.com
              </a>{' '}
              to redeem your credit!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
