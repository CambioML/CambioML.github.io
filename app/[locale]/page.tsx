import Hero from '@/app/components/homepage/Hero';
import Banners from '@/app/components/homepage/Banners';
import Reviews from '@/app/components/homepage/Reviews';
import HowItWorks from '@/app/components/homepage/HowItWorks';
import Capabilities from '@/app/components/homepage/Capabilities';

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
