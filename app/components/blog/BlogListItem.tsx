import React from 'react';
import BlogImage from './BlogImage';
import BlogLink from './BlogLink';

type ListItem = {
  label?: string;
  content: string;
  image?: string;
};

interface BlogListProps {
  items: ListItem[];
  ordered?: boolean;
}

const makeUrlClickable = (text: string) => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  return text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return <BlogLink key={index} text={part} url={part} />;
    }
    if (part !== 'https' && part !== 'http') return part;
  });
};

const BlogList = ({ items, ordered }: BlogListProps) => {
  return (
    <>
      {ordered ? (
        <ol className="list-decimal list-inside mb-6 text-lg">
          {items.map((item, index) => (
            <li key={index}>
              {item.label && (
                <>
                  <strong>{item.label}:</strong>&nbsp;
                </>
              )}
              {makeUrlClickable(item.content)}
              {item.image && (
                <div className="ml-4">
                  <BlogImage src={item.image} alt={item.label || item.content} />
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc list-inside mb-6 text-lg">
          {items.map((item, index) => (
            <li key={index}>
              {item.label && (
                <>
                  <strong>{item.label}:</strong>&nbsp;
                </>
              )}
              {makeUrlClickable(item.content)}
              {item.image && (
                <div className="ml-4">
                  <BlogImage src={item.image} alt={item.label || item.content} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default BlogList;
