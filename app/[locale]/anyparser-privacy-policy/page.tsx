'use client';
import PageHero from '@/app/components/hero/PageHero';
import Container from '@/app/components/Container';

const h1Styles = 'font-semibold text-3xl py-4';
const pStyles = 'text-lg pb-2';
const h2Styles = 'font-semibold text-2xl py-2';

const BookDemoPage = () => {
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center ">
      <PageHero title="AnyParser Privacy Policy" short />
      <Container styles="h-[50vh] min-h-[1000px] py-10 w-full max-w-screen-lg">
        <div className={h1Styles}>AnyParser API Privacy and Data Security Disclosure</div>
        <div className={h2Styles}>Privacy Disclosure</div>
        <p className={pStyles}>
          Our top priority is ensuring the security and privacy of your documents. To prevent leaks of sensitive
          information, activate &quot;Privacy Mode&quot; on AnyParser to automatically redact confidential PII during
          document parsing.
        </p>
        <div className={h2Styles}>Information Collection</div>
        <p className={pStyles}>
          Your documents are processed solely to deliver results and are not stored on our servers for model training.
          We auto delete your each user session cached after 24 hours.
        </p>
        <p className={pStyles}>
          Essential data for user login, such as your email address (via Auth0), is collected for account creation and
          application setup. We use this information for:
          <ul className="list-disc pl-4">
            <li className="italic">Notify you of important updates, including service and policy changes.</li>
            <li className="italic">Improve the user experience by addressing bugs and glitches.</li>
          </ul>
        </p>

        <div className={h2Styles}>Contact Us</div>
        <p className={pStyles}>
          If you have any questions about privacy and data security, please contact us at{' '}
          <a
            className="underline underline-offset-1 cursor-pointer hover:text-cambio-red"
            href="mailto:info@cambioml.com"
          >
            info@cambioml.com
          </a>
          .
        </p>
      </Container>
    </div>
  );
};

export default BookDemoPage;
