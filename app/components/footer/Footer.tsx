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
  return (
    <div className="w-full bg-[#1E1E1E]">
      <Container styles="h-fit min-h-[300px]">
        <div className="py-10 h-full grid grid-cols-[175px_50px_1fr] gap-2 md:gap-5 text-neutral-100">
          <div className="flex flex-col gap-3 md:gap-5">
            <Logo small white />
            <div className="flex gap-3">
              {socialLinks.map((socialLink) => (
                <SocialButton key={socialLink.url} image={socialLink.image} url={socialLink.url} />
              ))}
            </div>
            <div className="text-sm">© {new Date().getFullYear()} Cambio Corp </div>
          </div>
          <div className="col-span-1"></div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <FooterMenu
              title="Libraries"
              links={[
                {
                  title: 'AnyParser',
                  url: 'https://docs.cambioml.com',
                },
                {
                  title: 'uniflow',
                  url: '/libraries/uniflow',
                },
                {
                  title: 'pykoi',
                  url: '/libraries/pykoi',
                },
              ]}
            />
            <FooterMenu
              title="Solutions"
              links={[
                {
                  title: 'Finance',
                  url: '/solutions/finance',
                },
                {
                  title: 'Blog',
                  url: '/blog',
                },
              ]}
            />
            <FooterMenu
              title="Sandbox"
              links={[
                {
                  title: 'Launch Sandbox',
                  url: '/sandbox',
                },
                {
                  title: 'Account',
                  url: '/account',
                },
              ]}
            />
            <FooterMenu
              title="Company"
              links={[
                {
                  title: 'About us',
                  url: '/company/about-us',
                },
              ]}
            />
            <FooterMenu
              title="Resources"
              links={[
                {
                  title: 'AnyParser Docs',
                  url: 'https://docs.cambioml.com',
                },
                {
                  title: 'Privacy Policy',
                  url: '/legal/privacy-policy.pdf',
                },
                {
                  title: 'Terms of Service',
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
