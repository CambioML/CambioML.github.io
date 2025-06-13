import './globals.css';
import dynamic from 'next/dynamic';
import ConditionalNavbar from './components/ConditionalNavbar';
import Footer from './components/footer/Footer';
import InfoModal from './components/modals/InfoModal';
import DemoModal from './components/modals/DemoModal';
import ImageModal from './components/modals/ImageModal';
import ToasterProvider from './providers/ToasterProvider';
import ResultZoomModal from './components/modals/ResultZoomModal';
import PricingContactModal from './components/modals/PricingContactModal';
import PlaygroundFeedbackModal from './components/modals/PlaygroundFeedbackModal';
import HtmlAttributes from './components/HtmlAttributes';
import { Lato } from 'next/font/google';
import { PHProvider } from './providers';
import { GoogleTagManager } from '@next/third-parties/google';
import { ThemeProvider } from './contexts/ThemeContext';

export const metadata = {
  title: 'CambioML - AnyParser API: The first LLM for document parsing with accuracy and speed',
  description:
    'AnyParser enhances document retrieval accuracy by up to 2x via vision language model. It precisely extracts text, tables, charts, and layout information from PDFs, PowerPoints, and images. The API prioritizes client privacy and seamless enterprise integration.',
};

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
});

const font = Lato({
  weight: ['400', '700'],
  style: 'normal',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d, w, c) {
                  w.AppUrl = 'chatbot/9678c337-11d6-4436-a6f9-4c881a003549-342615291/b9eaa217-4994-444f-9806-da156a982bca?mode=embed';
                  w.themeColor = '#001f3f';
                  var s = d.createElement('script');
                  w[c] = w[c] || function() {
                      (w[c].q = w[c].q || []).push(arguments);
                  };
                  s.async = true;
                  s.src = 'https://script.epsilla.com/epsilla.js';
                  if (d.head) d.head.appendChild(s);
              })(document, window, 'Epsilla');
            `,
          }}
        />
      </head>

      <PHProvider>
        <body className={font.className}>
          <ThemeProvider>
            <HtmlAttributes />
            <PostHogPageView />
            <ToasterProvider />
            <ConditionalNavbar />
            <DemoModal />
            <ImageModal />
            <PricingContactModal />
            <PlaygroundFeedbackModal />
            <InfoModal />
            <ResultZoomModal />
            <div className="min-h-screen min-w-[650px]">{children}</div>
            <Footer />
          </ThemeProvider>
        </body>
      </PHProvider>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
    </html>
  );
}
