'use client';
import { Icon, LockKey, Speedometer, Target } from '@phosphor-icons/react';
import Container from '../Container';
import Heading from '../Heading';

type Card = {
  title: string;
  image?: string;
  icon?: Icon;
};

type Differentiator = {
  title: string;
  description: string;
  cards: Card[];
};

const differentiators: Differentiator[] = [
  {
    title: 'Accuracy',
    description:
      'Our model is trained on a large dataset of documents to provide the most accurate results. No hallucination. 90% less error rate than traditional OCR based model.',
    cards: [
      {
        title: '',
        image: '',
        icon: Target,
      },
    ],
  },
  {
    title: 'Privacy',
    description: 'Fully privacy preserved. Redact confidential information during the retrieval as needed.',
    cards: [
      {
        title: '',
        icon: LockKey,
      },
    ],
  },
  {
    title: 'Speed',
    description: 'Our model is optimized for speed, providing results in seconds for most documents.',
    cards: [
      {
        title: '',
        icon: Speedometer,
      },
    ],
  },
];

interface DifferentiatorProps {
  title: string;
  description: string;
  cards: Card[];
}

const Differentiator = ({ title, description, cards }: DifferentiatorProps) => {
  return (
    <div className="w-full h-[300px] grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="w-full h-full flex flex-col items-start justify-start gap-4">
        <div className="text-2xl font-semibold text-neutral-800">{title}</div>
        <div className="text-lg font-light text-neutral-500">{description}</div>
      </div>
      <div className="lg:col-span-2 flex justify-end">
        {cards.map((card, i) => (
          <div
            key={card.title + i}
            className="w-[300px] h-[300px] bg-cambio-primary rounded-xl hover:shadow-lg transition duration-300 ease-in-out"
          >
            {card.image && <img src={card.image} alt={card.title} className="w-full h-full object-cover rounded-md" />}
            {card.icon && <card.icon className="w-full h-full object-cover p-20 text-neutral-800" />}
          </div>
        ))}
      </div>
    </div>
  );
};

const Differentiators = () => {
  return (
    <div className="h-full w-full py-20">
      <Container styles="h-fit">
        <div className="w-full h-fit flex flex-col items-center justify-start px-10">
          <Heading title="Why is AnyParser so Good" center customClass="text-5xl lg:text-6xl" />
          <div className="py-5 flex flex-col gap-20 max-w-screen-xl align-items justify-items h-fit w-full lg:w-max overflow-auto">
            {differentiators.map((differentiator, i) => (
              <Differentiator
                key={differentiator.title + i}
                title={differentiator.title}
                description={differentiator.description}
                cards={differentiator.cards}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Differentiators;
