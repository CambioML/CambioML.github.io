'use client';

import Image from 'next/image';
import { Marquee } from '../dark/magicui/marquee';
import { useTranslation } from '@/lib/use-translation';

import { cn } from '@/lib/cn';

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
        className={cn(
          'rounded-lg transition-all duration-300',
          'border border-border/50 bg-white dark:bg-card hover:shadow-lg dark:hover:shadow-[0px_0px_2px_0.5px_rgba(112,190,250,0.75)]'
        )}
      >
        <div className="p-10 flex flex-col gap-3.75 h-[320px]">
          <div className={cn('max-w-80 rounded-lg mb-auto')}>
            <p className={cn('p-2.5 text-gray-800 dark:text-gray-200')}>{review.text}</p>
          </div>
          <div className={cn('py flex items-center gap-2.5 rounded-lg')}>
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
                <span className={cn('text-gray-900 dark:bg-gradient font-semibold')}>{review.author}</span>
              </p>
              <p className={cn('text-gray-600 dark:text-gray-300')}>{review.position}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <section
      id="reviews"
      className={cn(
        'px-3.75 py-20 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-12.5 items-center',
        'px-3.75 py-20 lg:pt-25 lg:pb-12.5 lg:px-40 flex flex-col gap-12.5 items-center'
      )}
    >
      <div className="container mb-12">
        <h1 className={cn('text-center font-semibold text-4xl lg:text-5xl text-gray-900 dark:text-inherit')}>
          <span className={cn('h-full text-gray-900 dark:bg-gradient')}>{t.reviews.title}</span>
        </h1>
      </div>

      <div
        className="container h-[360px] w-screen lg:w-auto"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <Marquee reverse={true} className="pb-8 h-full [--gap:24px] [--duration:60s]" pauseOnHover={true}>
          {reviewCards}
        </Marquee>
      </div>
    </section>
  );
}
