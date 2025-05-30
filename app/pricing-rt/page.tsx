'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { Divider } from '../components/dark/divider';
import { SwitchButtons } from '../components/dark/switch-buttons';
import FadeIn from '../components/animations/fade-in';
import Card, { CardContent } from '../components/dark/card';
import usePricingContactModal from '../hooks/usePricingContactModal';

function AnimatedTextBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div layout transition={{ duration: 0.3, ease: 'easeInOut' }} className={className}>
      {children}
    </motion.div>
  );
}

const Pricing = () => {
  const contactModal = usePricingContactModal();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const handleTabChange = (id: string) => {
    setBillingCycle(id as 'monthly' | 'annually');
  };

  const isMonthly = billingCycle === 'monthly';

  const switchItems = [
    {
      id: 'monthly',
      label: 'Monthly',
    },
    {
      id: 'annually',
      label: 'Annually',
    },
  ];

  // Define the pricing plans based on the existing data
  const starterFeatures = [
    'Extract full text to Markdown or Extract tables from PDF/image to CSV',
    '20k credits per month, then $0.025 per credit',
    'Extract key values pairs into JSON',
    'Unused credits roll over to the next month',
    'No hidden fees',
    '30 days money back guaranteed',
  ];

  const silverFeatures = [
    'All Starter features',
    '100k credits per month, then $0.015 per credit',
    'Customized client onboarding',
    'Unused credits roll over to the next month',
    'No hidden fees',
    '30 days money back guaranteed',
  ];

  const goldFeatures = [
    'All Silver features',
    '500k credits per month, then $0.009 per credit',
    'Private Model Hosting (On-prem or Cloud)',
    'Customization services available',
    'Unused credits roll over to the next month',
    'No hidden fees',
    '30 days money back guaranteed',
  ];

  const enterpriseFeatures = [
    'All Gold features',
    'Custom Model Training',
    'Custom Integrations and API Responses',
    'Personalized 1-1 team training',
    'Dedicated Account Manager',
    'Priority Support',
  ];

  return (
    <div className="theme-dark min-h-screen bg-background">
      <section
        id="pricing"
        className="px-3.75 py-12.5 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-6.25 items-center bg-[radial-gradient(25%_30%_at_50%_25.8%,rgba(112,190,250,0.1)_0%,rgb(10,10,10)_100%)]"
      >
        <div className="container flex flex-col gap-6.25 text-center">
          <h1>
            <span className="bg-gradient">Real-time API Pricing</span>
          </h1>
          <p className="text-foreground">
            The fastest vision language model with real-time response around 0.5 to 5 seconds per page.
          </p>
        </div>

        <div className="container flex flex-col items-center gap-12.5">
          {/* Billing toggle */}
          <SwitchButtons
            options={switchItems}
            activeOption={billingCycle}
            onChange={handleTabChange}
            className="h-full"
          />

          {/* Pricing cards */}
          <div className="flex flex-col xl:flex-row gap-6.75 lg:px-12.5">
            {/* Starter Plan */}
            <div className="flex-1">
              <FadeIn variant="fadeInLeft" className="h-full">
                <Card variant="top-light" className="h-full">
                  <CardContent className="h-full">
                    <div className="flex flex-col h-full gap-6.25">
                      <div className="flex flex-col gap-6.25">
                        <h3>
                          <span className="bg-gradient">Starter</span>
                        </h3>
                        <div className="flex items-center gap-1.25">
                          <p className="text-[40px] font-medium">
                            <span className="bg-gradient">${isMonthly ? '499' : '5000'}</span>
                          </p>
                          <AnimatedTextBox>
                            <span className="text-white">{isMonthly ? '/month' : '/year'}</span>
                          </AnimatedTextBox>
                        </div>
                        <p className="text-foreground">
                          For businesses looking to get started with real-time document processing and data extraction.
                        </p>
                      </div>

                      <Divider />

                      <div className="flex flex-col gap-3.75">
                        {starterFeatures.map((feature, index) => (
                          <div key={index} className="flex gap-3.75 items-center">
                            <Image
                              src="https://framerusercontent.com/images/Gzt7Mob6QF9jUtvCvNeTeQYboU.png"
                              className="h-[11.25px] w-[15px]"
                              alt="icon"
                              width={15}
                              height={11.25}
                            />
                            <p className="text-foreground">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            {/* Silver Plan */}
            <div className="flex-1">
              <FadeIn variant="fadeInUp" className="h-full">
                <Card variant="top-light" className="h-full">
                  <CardContent className="h-full">
                    <div className="flex flex-col h-full gap-6.25">
                      <div className="flex flex-col gap-6.25">
                        <h3>
                          <span className="bg-gradient">Silver</span>
                        </h3>
                        <div className="flex items-center gap-1.25">
                          <p className="text-[40px] font-medium">
                            <span className="bg-gradient">${isMonthly ? '1500' : '15000'}</span>
                          </p>
                          <AnimatedTextBox>
                            <span className="text-white">{isMonthly ? '/month' : '/year'}</span>
                          </AnimatedTextBox>
                        </div>
                        <p className="text-foreground">
                          For teams looking to scale their document processing with enhanced support and features.
                        </p>
                      </div>

                      <Divider />

                      <div className="flex flex-col gap-3.75">
                        {silverFeatures.map((feature, index) => (
                          <div key={index} className="flex gap-3.75 items-center">
                            <Image
                              src="https://framerusercontent.com/images/Gzt7Mob6QF9jUtvCvNeTeQYboU.png"
                              className="h-[11.25px] w-[15px]"
                              alt="icon"
                              width={15}
                              height={11.25}
                            />
                            <p className="text-foreground">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            {/* Gold Plan */}
            <div className="flex-1">
              <FadeIn variant="fadeInUp" className="h-full">
                <Card variant="top-light" className="h-full">
                  <CardContent className="h-full">
                    <div className="flex flex-col h-full gap-6.25">
                      <div className="flex flex-col gap-6.25">
                        <h3>
                          <span className="bg-gradient">Gold</span>
                        </h3>
                        <div className="flex items-center gap-1.25">
                          <p className="text-[40px] font-medium">
                            <span className="bg-gradient">${isMonthly ? '4500' : '45000'}</span>
                          </p>
                          <AnimatedTextBox>
                            <span className="text-white">{isMonthly ? '/month' : '/year'}</span>
                          </AnimatedTextBox>
                        </div>
                        <p className="text-foreground">
                          For enterprises needing advanced features, private hosting, and premium support.
                        </p>
                      </div>

                      <Divider />

                      <div className="flex flex-col gap-3.75">
                        {goldFeatures.map((feature, index) => (
                          <div key={index} className="flex gap-3.75 items-center">
                            <Image
                              src="https://framerusercontent.com/images/Gzt7Mob6QF9jUtvCvNeTeQYboU.png"
                              className="h-[11.25px] w-[15px]"
                              alt="icon"
                              width={15}
                              height={11.25}
                            />
                            <p className="text-foreground">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            {/* Enterprise Plan */}
            <div className="flex-1">
              <FadeIn variant="fadeInRight" className="h-full">
                <Card variant="top-light" className="h-full">
                  <CardContent className="h-full">
                    <div className="flex flex-col h-full gap-6.25">
                      <div className="flex flex-col gap-6.25">
                        <h3>
                          <span className="bg-gradient">Enterprise</span>
                        </h3>
                        <div className="flex justify-center">
                          <p className="text-[40px] font-medium">
                            <span className="bg-gradient">Contact Us</span>
                          </p>
                        </div>
                        <p className="text-foreground">
                          For large organizations requiring custom solutions, dedicated support, and enterprise-grade
                          security.
                        </p>
                      </div>

                      <button
                        onClick={contactModal.onOpen}
                        className="relative px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-200"
                        style={{
                          background: 'rgba(22, 22, 22)',
                          border: '1px solid rgb(34, 34, 34)',
                        }}
                      >
                        <span className="bg-gradient">Contact Sales</span>
                      </button>

                      <Divider />

                      <div className="flex flex-col gap-3.75 flex-1">
                        {enterpriseFeatures.map((feature, index) => (
                          <div key={index} className="flex gap-3.75 items-center">
                            <Image
                              src="https://framerusercontent.com/images/Gzt7Mob6QF9jUtvCvNeTeQYboU.png"
                              className="h-[11.25px] w-[15px]"
                              alt="icon"
                              width={15}
                              height={11.25}
                            />
                            <p className="text-foreground">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>

          {/* Additional information */}
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="bg-card-1 border border-border-1 rounded-lg p-6">
              <div className="text-center space-y-4">
                <p className="text-foreground">
                  <strong>🎉 Special Offer for Startups and Non-profits! 🎉</strong>
                </p>
                <p className="text-foreground">
                  Get <span className="bg-gradient font-bold">3 months FREE</span> for startups (less than 10 people) or
                  Non-profit organizations.
                </p>
                <p className="text-foreground">
                  Email{' '}
                  <a href="mailto:info@cambioml.com" className="text-blue-400 hover:text-blue-300 underline font-bold">
                    info@cambioml.com
                  </a>{' '}
                  to redeem your credit!
                </p>
              </div>
            </div>
          </div>

          {/* Footer notes */}
          <div className="w-full max-w-4xl mx-auto px-4 text-center space-y-2">
            <p className="text-gray-400 text-sm">
              * No hidden fees; Monthly pay as you go; 30 days money back guaranteed.
            </p>
            <p className="text-gray-400 text-sm">
              ** Pages exceeding 500 tokens will incur an extra credit for every additional 500 tokens.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
