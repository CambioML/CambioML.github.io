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
    url: 'https://join.slack.com/t/cambiomlworkspace/shared_invite/zt-1zes33rmt-20Rag043uvExUaUdvt5_xQ',
  },
  {
    image: '/images/social/twitter.png',
    url: 'https://twitter.com/cambioml',
  },
];

const Footer = () => {
  const { t, locale } = useTranslation();

  return (
    <div className="w-full bg-[#1E1E1E]">
      <Container styles="h-fit min-h-[300px]">
        <h2 className="sr-only">Footer</h2>
        <div className="py-10 h-full grid grid-cols-[175px_50px_1fr] gap-2 md:gap-5 text-neutral-100">
          <div className="flex flex-col gap-3 md:gap-5">
            <Logo small white />
            <div className="flex gap-3">
              {socialLinks.map((socialLink) => (
                <SocialButton key={socialLink.url} image={socialLink.image} url={socialLink.url} />
              ))}
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} {t.footer.copyright}{' '}
            </div>
          </div>
          <div className="col-span-1"></div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <FooterMenu
              title={t.footer.libraries.title}
              links={[
                {
                  title: t.footer.libraries.anyParser,
                  url: 'https://docs.cambioml.com',
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
              title={t.footer.sandbox.title}
              links={[
                {
                  title: t.footer.sandbox.launchSandbox,
                  url: `/${locale}/anyparser`,
                },
                {
                  title: t.footer.sandbox.account,
                  url: `/${locale}/account`,
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
                  title: t.footer.resources.anyParserDocs,
                  url: 'https://docs.cambioml.com',
                },
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
