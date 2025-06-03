import Banners from './components/homepage/Banners';
import Reviews from './components/homepage/Reviews';
import Capabilities from './components/homepage/Capabilities';
import Hero from './components/homepage/Hero';
import HowItWorks from './components/homepage/HowItWorks';

export default function Home() {
  return (
    <>
      <Hero />
      <Reviews />
      <Capabilities />
      <HowItWorks />
      <Banners />
    </>
  );
}
