import PageHero from '@/app/components/hero/PageHero';
import SolutionsList from '@/app/components/solutions/SolutionsList';
import { solutions } from './data';

const BlogPage = () => {
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center ">
      <PageHero title={`📝 Blog`} short />
      <div className="p-10 max-w-[1000px] min-h-[1000px]">
        <SolutionsList solutions={solutions.filter((solution) => solution.blog)} sortNewest />
      </div>
    </div>
  );
};

export default BlogPage;
