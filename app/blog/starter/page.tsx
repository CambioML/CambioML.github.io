import Blog from '@/app/components/blog/Blog';
import BlogImage from '@/app/components/blog/BlogImage';
import BlogLaTeX from '@/app/components/blog/BlogLaTeX';
import BlogLink from '@/app/components/blog/BlogLink';
import BlogList from '@/app/components/blog/BlogListItem';
import BlogParagraph from '@/app/components/blog/BlogParagraph';
import BlogSectionTitle from '@/app/components/blog/BlogSectionTitle';
import BlogVideo from '@/app/components/blog/BlogVideo';

const Page = () => {
  return (
    <Blog
      title="Example Blog"
      authors={[{ name: 'Jojo', companyName: 'CambioML', companyUrl: 'https://www.cambioml.com' }]}
      publishedOn="August 29, 2024"
    >
      <BlogSectionTitle title="BlogSectionTitle" />
      <BlogParagraph>You can add section titles to your blog post using the BlogSectionTitle component.</BlogParagraph>
      <BlogSectionTitle title="Secondary Title" secondary />
      <BlogSectionTitle title="Tertiary Title" tertiary />
      <BlogSectionTitle title="BlogParagraph" />
      <BlogParagraph>
        This is a blog paragraph. Create a new one every time you want to add a new paragraph to your blog post.
      </BlogParagraph>
      <BlogSectionTitle title="BlogLink" />
      <BlogParagraph>
        You can add <BlogLink url="https://cambioml.com" text="links" /> to your blog post using a BlogLink component.
      </BlogParagraph>
      <BlogSectionTitle title="BlogImage" />
      <BlogImage
        src="kdd-2024-rachel.jpeg"
        alt="Rachel Hu presenting at KDD"
        subtitle="Rachel Hu presents at KDD 2024"
      />
      <BlogParagraph>
        You can add images to your blog post using the BlogImage component. Make sure to include the image in the &nbsp;
        <code>public/images/solutions</code>&nbsp;directory and reference it using the <code>src</code> prop. You also
        need to include an &nbsp;<code>alt</code>&nbsp;prop for accessibility. Optionally, you can add a &nbsp;
        <code>subtitle</code>
      </BlogParagraph>
      <BlogSectionTitle title="BlogVideo" />
      <BlogVideo src="https://www.youtube.com/embed/ny_YwgYzc7Q?si=m1bmULzwlP5g0kIo" />
      <BlogParagraph>
        You can add videos to your blog post using the BlogVideo component. Just include the video URL in the &nbsp;
        <code>src</code>&nbsp;prop.
      </BlogParagraph>
      <BlogSectionTitle title="BlogList" />
      <BlogParagraph>
        You can add lists to your blog post using the BlogList component. You can make them ordered or unordered. You
        can also add an optional label to each list item.
      </BlogParagraph>
      <BlogParagraph>Here&apos;s an unordered list:</BlogParagraph>
      <BlogList
        items={[
          {
            label: 'Label 1',
            content: 'check out this content.',
          },
          {
            label: 'label 2',
            content: 'more content here.',
          },
        ]}
      />
      <BlogParagraph>And here&apos;s an ordered list:</BlogParagraph>
      <BlogList
        items={[
          {
            content: 'check out this conent.',
          },
          {
            content: 'more content here.',
          },
        ]}
        ordered
      />
      <BlogSectionTitle title="BlogLaTeX" />
      <BlogParagraph>
        We also have a <code>BlogLaTeX</code> component
      </BlogParagraph>
      <BlogLaTeX
        latex={`\\text{Recall} = \\frac{\\text{True Positives (TP)}}{\\text{True Positives (TP) + False Negatives (FN)}}`}
      />
      <BlogSectionTitle title="Conclusion" />
      <BlogParagraph>And that&apos;s it! Happy blogging 😊</BlogParagraph>
    </Blog>
  );
};

export default Page;
