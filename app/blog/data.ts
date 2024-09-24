export interface SolutionType {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  image: string;
  industries: string[];
  blog: boolean;
  date: Date;
  imageContain?: boolean;
}

export const solutions: SolutionType[] = [
  {
    title: "AnyParser: The Secret Weapon Behind JobRight.ai's Resume Extraction",
    subtitle: '',
    description:
      'Struggling to find the perfect candidates through piles of resumes? In this post, we’ll reveal how <strong>JobRight.ai</strong> turned the tables with <strong>AnyParser</strong>, the ultimate resume parser that effortlessly extracts and processes candidate information. Discover how this game-changing tool transformed <strong>JobRight.ai</strong> into the top AI job marketplace, creating career matches faster and more accurately than ever before.',
    url: '/blog/jobright-resumes',
    image: '/images/solutions/jobright-resumes.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-08-30'),
  },
  {
    title: 'KDD 2024: Talk with Amazon',
    subtitle: '',
    description:
      'Want to optimize Large Language Models (LLMs) for specific tasks? At KDD 2024, Rachel Hu, CEO of CambioML, and experts from Amazon and Epsilla revealed how <strong>Retrieval Augmented Generation (RAG)</strong> and <strong>LLM Fine-Tuning</strong> can enhance LLM performance for specialized applications. Explore advanced techniques and practical labs that demonstrate how to build accurate, domain-specific models. Learn best practices for making your LLMs more versatile and precise. ',
    url: '/blog/kdd-workshop-2024',
    image: '/images/solutions/kdd-2024-cover.jpeg',
    industries: [],
    blog: true,
    date: new Date('2024-08-29'),
  },
  {
    title: 'Doubling Accuracy in Knowledge Retrieval from Charts and Tables',
    subtitle: '',
    description:
      'In precision-critical industries like finance, traditional OCR models fall short. Enter <strong>AnyParser</strong> and <strong>Epsilla</strong>, a cutting-edge system by CambioML and Epsilla. By integrating advanced vision language models with Retrieval-Augmented Generation (RAG) techniques, this solution offers superior accuracy and recall, revolutionizing data extraction from complex documents. Discover how <strong>AnyParser</strong> and <strong>Epsilla</strong> are redefining knowledge retrieval for businesses.',
    url: '/blog/epsilla-whitepaper',
    image: '/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png',
    industries: [],
    blog: true,
    date: new Date('2024-08-28'),
  },
  {
    title: 'From Documents to Database',
    subtitle: 'Key-Value Data Retrieval from Real Estate Documents',
    description:
      'Having trouble with extracting information from real estate documents? In this post, we’ll show you how to use <strong>Uniflow</strong> to extract key-value data from real estate documents. This way, you can turn real estate documents directly into databases without tedious manual effort.',
    url: 'https://medium.com/@CambioML/from-documents-to-database-key-value-data-retrieval-from-real-estate-documents-380dd3ef38df',
    image: '/images/solutions/real-estate.png',
    industries: [],
    blog: true,
    date: new Date('2024-03-15'),
  },
  {
    title: 'Maximizing Long-Text Potential',
    subtitle: 'Strategies for Open-Source LLMs Beyond Token Limits',
    description:
      'Struggling with processing long texts using open-source LLMs? Discover <strong>Uniflow</strong>, a tool that simplifies handling texts beyond token limits. Learn how to effortlessly manage large documents like "War and Peace" and maximize your LLM\'s potential with <strong>Uniflow</strong>.',
    url: 'https://medium.com/@CambioML/maximizing-long-text-potential-strategies-for-open-source-llms-beyond-token-limits-5489242593da',
    image: '/images/solutions/auto-splitter.png',
    industries: [],
    blog: true,
    date: new Date('2024-03-14'),
  },
  {
    title: 'Build Your Own Gmail Spam Filter with LLMs',
    subtitle: 'Any LLM and Privacy Preserved',
    description:
      'Are you annoyed with constantly receiving spam or sales emails? You’re not alone. In this post, we’ll show you how to select an LLM model and create your own Gmail spam filter using <strong>Uniflow</strong>.',
    url: 'https://medium.com/@CambioML/build-your-own-gmail-spam-filter-any-llm-you-choose-and-privacy-preserved-597648aff5fd',
    image: '/images/solutions/gmail-spam-filter.png',
    industries: [],
    blog: true,
    date: new Date('2024-03-11'),
  },
  {
    title: 'Research Paper Evaluator',
    subtitle: 'Build Your Own Research Agent from Research Papers with Uniflow',
    description:
      'Do you want to build an agent so that you can ask it anything about a research paper? In this example, we will show you how use <strong>Uniflow</strong> to extract knowledge from <i>An Observational Study of the Effect of Nike Vaporfly Shoes on Marathon Performance</i>.',
    url: 'https://medium.com/@CambioML/build-your-own-research-agent-from-research-papers-010e88e876f0',
    image: '/images/solutions/nike-research.png',
    industries: ['research-&-development'],
    blog: true,
    date: new Date('2024-03-04'),
  },
  {
    title: '10K Summarizer',
    subtitle: 'Summarize 10K reports with uniflow',
    description:
      'Are you looking to transform dense annual reports (10K) into concise, informative summaries? This guide introduces the use of <strong>Uniflow</strong> to both extract and summarize key information from unstructured annual reports, enabling efficient knowledge discovery and summarization with a Large Language Model (LLM).',
    url: 'https://github.com/CambioML/cambio-cookbook/blob/main/examples/10K_Evaluator/10K_PDF_Summary.ipynb',
    image: '/images/solutions/amazon-10k.png',
    industries: ['finance'],
    blog: false,
    date: new Date('2024-02-28'),
  },
  {
    title: '10K Evaluator',
    subtitle: 'Evaluate 10K reports with uniflow',
    description:
      'Do you want to build an agent so that you can ask it anything about the annual report (10K)? In this example, we will show you how use <strong>Uniflow</strong> and <strong>Pykoi</strong> to extract knowledge from a unstructured annual report (10K) and then finetune an LLM on this knowledge.',
    url: 'https://github.com/CambioML/cambio-cookbook/blob/main/examples/10K_Evaluator/10K_PDF_Evaluator.ipynb',
    image: '/images/solutions/nike-10k.png',
    industries: ['finance'],
    blog: false,
    date: new Date('2024-02-21'),
  },
];
