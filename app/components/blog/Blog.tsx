'use client';
import { CaretLeft } from '@phosphor-icons/react';
import PageHero from '../hero/PageHero';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BlogLink from './BlogLink';

interface Author {
  name: string;
  companyName: string;
  companyUrl: string;
}

interface BlogProps {
  title: string;
  publishedOn: string;
  children: React.ReactNode;
  authors: Author[];
}

const Blog = ({ title, publishedOn, children, authors }: BlogProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center ">
      <PageHero title={title} short />
      <div className="px-10 pb-10 w-full max-w-4xl min-h-[1000px]">
        <div className="w-full py-2 flex gap-2 items-center justify-between">
          <div className="text-md italic">{publishedOn}</div>
          <div
            className=" flex gap-2 p-2 items-center justify-center cursor-pointer hover:font-semibold rounded-xl hover:bg-neutral-100"
            onClick={() => router.push('/blog')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CaretLeft size={16} weight={isHovered ? 'bold' : 'regular'} /> Back to Blogs
          </div>
        </div>
        <div className="text-lg italic flex pb-8">
          Authors:&nbsp;
          {authors.map((author, i) => (
            <div key={author.name}>
              {i > 0 && '; '}
              {author.name} @ <BlogLink text={author.companyName} url={author.companyUrl} />
            </div>
          ))}
        </div>
        {children}
        <hr className="my-6" />
      </div>
    </div>
  );
};

export default Blog;
