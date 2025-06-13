interface BlogParagraphProps {
  children: React.ReactNode;
  bold?: boolean;
}

const BlogParagraph = ({ children, bold = false }: BlogParagraphProps) => {
  // Responsive:
  // - Text size increases on larger screens (sm:text-xl)
  // - Margin bottom adjusts for better spacing on different devices
  return <p className={`text-lg sm:text-xl mb-4 sm:mb-6 ${bold ? 'font-semibold' : ''}`}>{children}</p>;
};

export default BlogParagraph;
