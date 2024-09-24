import Banners from './components/homepage/Banners';
import Capabilities from './components/homepage/Capabilities';
import Hero from './components/homepage/Hero';
import HowItWorks from './components/homepage/HowItWorks';
import Testimonials from './components/homepage/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <Testimonials />
      <Capabilities />
      <HowItWorks />
      <Banners />
    </>
  );
}
