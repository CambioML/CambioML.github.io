interface BlogLinkProps {
  text: string;
  url: string;
}

const BlogLink = ({ text, url }: BlogLinkProps) => {
  return (
    <>
      &nbsp;
      {/* Dark theme compatible link colors */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-400 underline transition-colors"
      >
        {text}
      </a>
    </>
  );
};

export default BlogLink;
