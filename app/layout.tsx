import { Lato } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import DemoModal from './components/modals/DemoModal';
import ImageModal from './components/modals/ImageModal';
import ToasterProvider from './providers/ToasterProvider';
import { GoogleTagManager } from '@next/third-parties/google';
import PlaygroundFeedbackModal from './components/modals/PlaygroundFeedbackModal';
import InfoModal from './components/modals/InfoModal';
import PricingContactModal from './components/modals/PricingContactModal';
import ResultZoomModal from './components/modals/ResultZoomModal';
import { PHProvider } from './providers';
import dynamic from 'next/dynamic';

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

      </head>

      <PHProvider>
        <body className={font.className}>
          <PostHogPageView />
          <ToasterProvider />
          <Navbar />
          <DemoModal />
          <ImageModal />
          <PricingContactModal />
          <PlaygroundFeedbackModal />
          <InfoModal />
          <ResultZoomModal />
          <div className="pb-500 min-h-screen min-w-[650px]">{children}</div>
          <Footer />
        </body>
      </PHProvider>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
    </html>
  );
}
