import Blog from '@/app/components/blog/Blog';
import BlogImage from '@/app/components/blog/BlogImage';
import BlogLink from '@/app/components/blog/BlogLink';
import BlogList from '@/app/components/blog/BlogListItem';
import BlogParagraph from '@/app/components/blog/BlogParagraph';
import BlogSectionTitle from '@/app/components/blog/BlogSectionTitle';

const KDDPage = () => {
  return (
    <Blog
      title="KDD 2024: Talk with Amazon"
      authors={[{ name: 'Jojo', companyName: 'CambioML', companyUrl: 'https://www.cambioml.com' }]}
      publishedOn="August 29, 2024"
    >
      <BlogImage
        src="kdd-2024-cover.jpeg"
        alt="KDD 2024 Conference"
        subtitle="Rachel Hu presenting at the KDD 2024 conference"
      />
      <BlogParagraph>
        At the KDD 2024 conference, <BlogLink text="Rachel Hu" url="https://www.linkedin.com/in/rachelsonghu/" />,
        Co-founder and CEO of CambioML, presented a comprehensive tutorial on optimizing Large Language Models (LLMs)
        for domain-specific applications, alongside co-presenters
        <BlogLink text="José Cassio dos Santos Junior" url="https://www.linkedin.com/in/jcassiojr/" /> (Amazon),
        <BlogLink text="Richard Song" url="https://www.linkedin.com/in/renchu-richard-song-a4099247/" /> (Epsilla), and{' '}
        <BlogLink text="Yunfei Bai" url="https://www.linkedin.com/in/yunfei-felix-bai-909b861/" /> (Amazon). The session
        provided in-depth insights into two critical techniques: Retrieval Augmented Generation (RAG) and LLM
        Fine-Tuning. These methods are essential for improving the performance of LLMs in specialized fields, allowing
        developers to create more effective and accurate models tailored to specific tasks.
      </BlogParagraph>

      <BlogSectionTitle title="Understanding RAG: Expanding LLM Capabilities" />
      <BlogParagraph>
        Retrieval Augmented Generation (RAG) is a powerful approach that extends the capabilities of LLMs by integrating
        external knowledge bases. This technique enables LLMs to generate responses based on specific domain knowledge
        without requiring extensive retraining. RAG is particularly beneficial for organizations that need to leverage
        internal knowledge bases or other specialized resources, providing a way to enhance LLM performance in a
        cost-effective and time-efficient manner.
      </BlogParagraph>

      <BlogSectionTitle title="Fine-Tuning: Tailoring Models for Precision" />
      <BlogParagraph>
        LLM Fine-Tuning involves adjusting the model&apos;s weights using domain-specific data, allowing the model to
        systematically learn new, comprehensive knowledge that wasn&apos;t included during the pre-training phase. This
        approach is essential for tasks requiring a high degree of accuracy and is particularly effective in domains
        where general-purpose models fall short. Fine-Tuning can transform an LLM into a highly specialized tool,
        capable of performing complex, domain-specific tasks with precision.
      </BlogParagraph>

      <BlogImage src="kdd-2024-rachel.jpeg" alt="Rachel Hu presenting at KDD" />

      <BlogSectionTitle title="Combining RAG and Fine-Tuning for Optimal Results" />
      <BlogParagraph>
        The tutorial explored how combining RAG and Fine-Tuning can create a robust architecture for LLM applications.
        By integrating these two approaches, developers can build models that not only access the most relevant external
        information but also learn from domain-specific data. This hybrid approach allows for the creation of models
        that are both versatile and highly accurate, capable of handling a wide range of domain-specific tasks, from
        text generation to complex question-answering scenarios.
      </BlogParagraph>

      <BlogSectionTitle title="Hands-On Labs: Practical Applications of RAG and Fine-Tuning" />
      <BlogParagraph>
        A significant part of Rachel&apos;s tutorial was dedicated to hands-on labs, where participants explored
        advanced techniques to optimize RAG and Fine-Tuned LLM architectures. The labs covered a variety of topics,
        including:
      </BlogParagraph>
      <BlogList
        items={[
          {
            label: 'Advanced RAG Techniques',
            content:
              'Multi-phase optimization strategies were demonstrated to enhance the accuracy and relevance of RAG outputs. This included pre-retrieval, retrieval, and post-retrieval optimization, as well as the innovative use of knowledge graphs and multi-document analysis for more nuanced reasoning.',
          },
          {
            label: 'Fine-Tuning LLMs',
            content:
              'Participants engaged in fine-tuning a small LLM using domain-specific datasets. The lab highlighted the continuous fine-tuning process, integrating both human and AI feedback to achieve superior performance in specialized tasks.',
          },
          {
            label: 'Benchmarking and Evaluation',
            content:
              'The final lab focused on comparing the performance of RAG, Fine-Tuning, and their combined approach across various tasks. This included a detailed ROI analysis to help developers choose the most cost-effective and efficient method for their specific needs.',
          },
        ]}
      />
      <BlogImage src="kdd-2024-labs.jpg" alt="KDD 2024 Labs" />
      <BlogSectionTitle title="Best Practices for Domain-Specific LLM Development" />
      <BlogParagraph>
        The tutorial concluded with a set of best practices for implementing RAG and Fine-Tuning in real-world
        applications. Emphasizing the importance of understanding the trade-offs between RAG&apos;s flexibility and
        Fine-Tuning&apos;s precision, participants were encouraged to engage in continuous experimentation and
        benchmarking. This approach ensures that performance and cost-effectiveness criteria are met, allowing
        developers to optimize their LLM architecture for domain-specific tasks effectively.
      </BlogParagraph>
      <BlogParagraph>
        For a more detailed overview of the tutorial&apos;s content and hands-on labs, please refer to&nbsp;
        <BlogLink url="https://dl.acm.org/doi/pdf/10.1145/3637528.3671445" text="this paper" /> and
        <BlogLink
          url="https://docs.google.com/presentation/d/18PJctnI-KbABE1El_AifjN_7eoHatuaoN8-2q57xpSw/edit#slide=id.g2f5cc21ff85_5_1096"
          text="this presentation"
        />
        .
      </BlogParagraph>
    </Blog>
  );
};

export default KDDPage;
