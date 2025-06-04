'use client';

import { useEffect, useState } from 'react';
import SolutionsCard from './SolutionsCard';
import { SolutionType } from '@/app/data';

interface SolutionsListProps {
  solutions: SolutionType[];
  sortNewest?: boolean;
}

const SolutionsList = ({ solutions, sortNewest }: SolutionsListProps) => {
  // State to hold sorted solutions
  const [sortedSolutions, setSortedSolutions] = useState<SolutionType[]>([]);

  useEffect(() => {
    // Sort solutions by date of most recent
    const sorted = [...solutions].sort((a, b) => {
      if (sortNewest) {
        return b.date.getTime() - a.date.getTime();
      }
      return a.date.getTime() - b.date.getTime();
    });
    setSortedSolutions(sorted);
  }, [solutions]);
  return (
    <div className="grid grid-cols-1 w-full h-fit gap-10 pb-20">
      {sortedSolutions.map((solution, index) => (
        <SolutionsCard key={index} {...solution} />
      ))}
    </div>
  );
};

export default SolutionsList;
