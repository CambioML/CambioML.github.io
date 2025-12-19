'use client';

import { useTranslation } from '@/lib/use-translation';
import Container from '../Container';
import Logo from '../navbar/Logo';
import FooterMenu from './FooterMenu';
import SocialButton from './SocialButton';

const socialLinks = [
  {
    image: '/images/social/linkedin.png',
    url: 'https://www.linkedin.com/company/cambioml/about/',
  },
  {
    image: '/images/social/ycombinator-social.png',
    url: 'https://www.ycombinator.com/companies/cambioml',
  },
  {
    image: '/images/social/slack.png',
    url: 'https://cambiomlworkspace.slack.com/join/shared_invite/zt-37o1hwuvm-No4BFbIyd3~GPONJs9RXHA#/shared-invite/email',
  },
  {
    image: '/images/social/twitter.png',
    url: 'https://twitter.com/cambioml',
  },
];

const Footer = () => {
  const { t, locale } = useTranslation();

  return (
    <div className="w-full border-t border-border text-foreground">
      <Container styles="h-fit min-h-[300px]">
        <h2 className="sr-only">Footer</h2>
        <div className="py-10 h-full grid grid-cols-1 lg:grid-cols-[400px_50px_1fr] gap-6 md:gap-8 text-foreground">
          <div className="flex flex-col gap-3 md:gap-5">
            <Logo small />
            <div className="flex gap-3">
              {socialLinks.map((socialLink) => (
                <SocialButton key={socialLink.url} image={socialLink.image} url={socialLink.url} />
              ))}
            </div>
            <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <address className="not-italic">
                <div className="font-semibold">{t.footer.offices.abuDhabi.label}</div>
                <div>{t.footer.offices.abuDhabi.address}</div>
              </address>
              <address className="not-italic">
                <div className="font-semibold">{t.footer.offices.siliconValley.label}</div>
                <div>{t.footer.offices.siliconValley.address}</div>
              </address>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} {t.footer.copyright}{' '}
            </div>
          </div>
          <div className="col-span-1"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <FooterMenu
              title={t.footer.products.title}
              links={[
                {
                  title: 'Energent AI',
                  url: 'https://app.energent.ai',
                },
              ]}
            />
            <FooterMenu
              title={t.footer.solutions.title}
              links={[
                {
                  title: t.footer.solutions.finance,
                  url: `/${locale}/solutions/finance`,
                },
                {
                  title: t.footer.solutions.blog,
                  url: `/${locale}/blog`,
                },
              ]}
            />
            <FooterMenu
              title={t.footer.company.title}
              links={[
                {
                  title: t.footer.company.aboutUs,
                  url: `/${locale}/company/about-us`,
                },
              ]}
            />
            <FooterMenu
              title={t.footer.resources.title}
              links={[
                {
                  title: t.footer.resources.privacyPolicy,
                  url: '/legal/privacy-policy.pdf',
                },
                {
                  title: t.footer.resources.termsOfService,
                  url: '/legal/terms-of-service.pdf',
                },
              ]}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
