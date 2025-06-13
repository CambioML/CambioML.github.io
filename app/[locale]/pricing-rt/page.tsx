'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/use-translation';

import { Divider } from '@/app/components/divider';
import { SwitchButtons } from '@/app/components/switch-buttons';
import FadeIn from '@/app/components/animations/fade-in';
import Card, { CardContent } from '@/app/components/card';
import usePricingContactModal from '@/app/hooks/usePricingContactModal';

function AnimatedTextBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div layout transition={{ duration: 0.3, ease: 'easeInOut' }} className={className}>
      {children}
    </motion.div>
  );
}

const Pricing = () => {
  const contactModal = usePricingContactModal();
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const handleTabChange = (id: string) => {
    setBillingCycle(id as 'monthly' | 'annually');
  };

  const isMonthly = billingCycle === 'monthly';

  const switchItems = [
    {
      id: 'monthly',
      label: t.pricing.billing.monthly,
    },
    {
      id: 'annually',
      label: t.pricing.billing.annually,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <section
        id="pricing"
        className="px-3.75 py-12.5 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-6.25 items-center bg-gray-50 dark:bg-background"
      >
        <div className="container flex flex-col gap-6.25 text-center">
          <h1 className="text-6xl dark:bg-gradient">{t.pricing.realTimeApi.title}</h1>
          <p className="text-gray-700 dark:text-foreground">{t.pricing.realTimeApi.description}</p>
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
                        <h3 className="text-3xl bg-gradient">{t.pricing.plans.starter.name}</h3>
                        <div className="flex items-center gap-1.25">
                          <p className="text-[40px] font-medium dark:text-white">
                            <span className="bg-gradient">
                              ${isMonthly ? t.pricing.plans.starter.monthlyPrice : t.pricing.plans.starter.annualPrice}
                            </span>
                          </p>
                          <AnimatedTextBox>
                            <span className="text-gray-700 dark:text-white">
                              {isMonthly ? t.pricing.billing.perMonth : t.pricing.billing.perYear}
                            </span>
                          </AnimatedTextBox>
                        </div>
                        <p className="text-gray-700 dark:text-foreground">{t.pricing.plans.starter.description}</p>
                      </div>

                      <Divider />

                      <div className="flex flex-col gap-3.75">
                        {t.pricing.plans.starter.features.map((feature: string, index: number) => (
                          <div key={index} className="flex gap-3.75 items-center">
                            <Image
                              src="https://framerusercontent.com/images/Gzt7Mob6QF9jUtvCvNeTeQYboU.png"
                              className="h-[11.25px] w-[15px]"
                              alt="icon"
                              width={15}
                              height={11.25}
                            />
                            <p className="text-gray-700 dark:text-foreground">{feature}</p>
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
                        <h3 className="text-3xl bg-gradient">{t.pricing.plans.silver.name}</h3>
                        <div className="flex items-center gap-1.25">
                          <p className="text-[40px] font-medium dark:text-white">
                            <span className="bg-gradient">
                              ${isMonthly ? t.pricing.plans.silver.monthlyPrice : t.pricing.plans.silver.annualPrice}
                            </span>
                          </p>
                          <AnimatedTextBox>
                            <span className="text-gray-700 dark:text-white">
                              {isMonthly ? t.pricing.billing.perMonth : t.pricing.billing.perYear}
                            </span>
                          </AnimatedTextBox>
                        </div>
                        <p className="text-gray-700 dark:text-foreground">{t.pricing.plans.silver.description}</p>
                      </div>

                      <Divider />

                      <div className="flex flex-col gap-3.75">
                        {t.pricing.plans.silver.features.map((feature: string, index: number) => (
                          <div key={index} className="flex gap-3.75 items-center">
                            <Image
                              src="https://framerusercontent.com/images/Gzt7Mob6QF9jUtvCvNeTeQYboU.png"
                              className="h-[11.25px] w-[15px]"
                              alt="icon"
                              width={15}
                              height={11.25}
                            />
                            <p className="text-gray-700 dark:text-foreground">{feature}</p>
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
                        <h3 className="text-3xl bg-gradient">{t.pricing.plans.gold.name}</h3>
                        <div className="flex items-center gap-1.25">
                          <p className="text-[40px] font-medium dark:text-white">
                            <span className="bg-gradient">
                              ${isMonthly ? t.pricing.plans.gold.monthlyPrice : t.pricing.plans.gold.annualPrice}
                            </span>
                          </p>
                          <AnimatedTextBox>
                            <span className="text-gray-700 dark:text-white">
                              {isMonthly ? t.pricing.billing.perMonth : t.pricing.billing.perYear}
                            </span>
                          </AnimatedTextBox>
                        </div>
                        <p className="text-gray-700 dark:text-foreground">{t.pricing.plans.gold.description}</p>
                      </div>

                      <Divider />

                      <div className="flex flex-col gap-3.75">
                        {t.pricing.plans.gold.features.map((feature: string, index: number) => (
                          <div key={index} className="flex gap-3.75 items-center">
                            <Image
                              src="https://framerusercontent.com/images/Gzt7Mob6QF9jUtvCvNeTeQYboU.png"
                              className="h-[11.25px] w-[15px]"
                              alt="icon"
                              width={15}
                              height={11.25}
                            />
                            <p className="text-gray-700 dark:text-foreground">{feature}</p>
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
                        <h3 className="text-3xl bg-gradient">{t.pricing.plans.enterprise.name}</h3>
                        <div className="flex items-center gap-1.25">
                          <p className="text-[40px] font-medium dark:text-white">
                            <span className="bg-gradient">{t.pricing.plans.enterprise.price}</span>
                          </p>
                        </div>
                        <p className="text-gray-700 dark:text-foreground">{t.pricing.plans.enterprise.description}</p>
                      </div>

                      <button
                        onClick={contactModal.onOpen}
                        className="relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white border border-black dark:border-gray-600"
                      >
                        <span className="text-white dark:bg-gradient">{t.common.contactUs}</span>
                      </button>

                      <Divider />

                      <div className="flex flex-col gap-3.75">
                        {t.pricing.plans.enterprise.features.map((feature: string, index: number) => (
                          <div key={index} className="flex gap-3.75 items-center">
                            <Image
                              src="https://framerusercontent.com/images/Gzt7Mob6QF9jUtvCvNeTeQYboU.png"
                              className="h-[11.25px] w-[15px]"
                              alt="icon"
                              width={15}
                              height={11.25}
                            />
                            <p className="text-gray-700 dark:text-foreground">{feature}</p>
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
            <div className="bg-white dark:bg-card-1 border border-gray-300 dark:border-border-1 rounded-lg p-6 shadow-sm">
              <div className="text-center space-y-4">
                <p className="text-gray-700 dark:text-foreground">
                  <strong>{t.pricing.specialOffer.title}</strong>
                </p>
                <p className="text-gray-700 dark:text-foreground">
                  {t.pricing.specialOffer.getStart}{' '}
                  <span className="bg-gradient font-semibold">{t.pricing.specialOffer.highlight}</span>{' '}
                  {t.pricing.specialOffer.forText} {t.pricing.specialOffer.startupDetails}{' '}
                  {t.pricing.specialOffer.orText} {t.pricing.specialOffer.nonprofitText}
                </p>
                <p className="text-gray-700 dark:text-foreground">
                  {t.pricing.specialOffer.emailText}{' '}
                  <a
                    href={`mailto:${t.pricing.specialOffer.emailLink}`}
                    className="hover:text-gray-700 dark:text-blue-400 dark:hover:text-blue-300 underline font-semibold"
                  >
                    {t.pricing.specialOffer.emailLink}
                  </a>{' '}
                  {t.pricing.specialOffer.redeemText}
                </p>
              </div>
            </div>
          </div>

          {/* Footer notes */}
          <div className="w-full max-w-4xl mx-auto px-4 text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t.pricing.disclaimers.noHiddenFees}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t.pricing.disclaimers.tokenExplanation}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
