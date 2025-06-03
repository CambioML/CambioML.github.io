'use client';

import '@/app/theme.css';
import Image from 'next/image';
import { Marquee } from '../dark/magicui/marquee';
import { useTranslation } from '@/lib/use-translation';

const reviewerImages = [
  'richard-song.png',
  'ethan-zheng.png',
  'jon-conradt.png',
  'cass.png',
  'felix-bai.png',
  'steve-cooper.png',
  'jamal.png',
];

export default function Reviews() {
  const { t } = useTranslation();

  // Create review cards using translations
  const reviewCards = t.reviews.testimonials.map(
    (review: { text: string; author: string; position: string }, index: number) => (
      <div
        key={index}
        className="border border-border-1 bg-card-1 rounded-lg hover:shadow-[0px_0px_2px_0.5px_rgba(112,190,250,0.75)] transition-all duration-300"
      >
        <div className="p-10 flex flex-col gap-3.75 h-[320px]">
          <div className="border border-border-1 max-w-80 rounded-lg bg-background mb-auto">
            <p className="text-foreground p-2.5">{review.text}</p>
          </div>
          <div className="py flex items-center gap-2.5 border border-border-1 rounded-lg bg-background">
            <div className="h-[50px] w-[50px]">
              <Image
                src={`/images/reviewers/${reviewerImages[index]}`}
                alt={review.author}
                width={50}
                height={50}
                className="w-full aspect-square object-cover rounded-full"
              />
            </div>
            <div>
              <p>
                <span className="bg-gradient">{review.author}</span>
              </p>
              <p className="text-foreground">{review.position}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <section
      id="reviews"
      className="theme-dark px-3.75 py-20 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-12.5 items-center bg-[radial-gradient(25%_30%_at_50%_50%,rgba(112,190,250,0.1)_0%,rgb(10,10,10)_100%)]"
    >
      <div className="container mb-12">
        <h1 className="text-center">
          <span className="bg-gradient h-full">{t.reviews.title}</span>
        </h1>
      </div>

      <div className="container h-[360px] w-screen lg:w-auto">
        <Marquee reverse={true} className="pb-8 h-full [--gap:24px] [--duration:140s]" pauseOnHover={true}>
          {reviewCards}
        </Marquee>
      </div>
    </section>
  );
}
