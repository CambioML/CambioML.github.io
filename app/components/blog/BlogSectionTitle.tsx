interface BlogSectionTitleProps {
  title: string;
  secondary?: boolean;
}

const BlogSectionTitle = ({ title, secondary }: BlogSectionTitleProps) => {
  return <h2 className={`${secondary ? 'text-xl' : 'text-2xl'} font-semibold mb-4`}>{title}</h2>;
};

export default BlogSectionTitle;
