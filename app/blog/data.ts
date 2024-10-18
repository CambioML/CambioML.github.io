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
    title: 'Structured vs Unstructured Data: Examples and Best Practices',
    subtitle: '',
    description:
      "Structured data is highly organized and formatted, making it easily searchable and accessible for analysis using traditional tools and machine learning algorithms. Its predefined structure allows for efficient automation in data management tasks like search, create, delete, or edit operations. In contrast, unstructured data lacks a predefined format, making it harder to search, organize, and analyze. Analyzing unstructured data requires specialized tools and advanced techniques, often necessitating the expertise of data scientists, which can limit its accessibility within organizations.",
    url: '/blog/structured-vs-unstructured-data',
    image: '/images/solutions/examples-of-structured-and-unstructured-data.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-18'),
  },
  {
    title: 'Invoice Scanning Software: Digitize Your Billing Workflow with AnyParser',
    subtitle: '',
    description:
      "Are you tired of manually processing stacks of paper invoices? It's time to revolutionize your billing workflow with invoice scanning software. AnyParser offers a cutting-edge solution that transforms your PNG invoice images into editable text and convert bank statement to excel in mere minutes.",
    url: '/blog/invoice-scanning-software',
    image: '/images/solutions/invoice-scanning-software-1.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-11'),
  },
  {
    title: 'Evaluating Your Parsing Solution: A Comparative Look at PDF to Markdown Conversion',
    subtitle: '',
    description:
      'Converting complex PDFs to Markdown can be difficult. LLMs like GPT can manage these tasks but are usually slow and may yield inaccurate results. Traditional OCR tools work well for simpler documents but often fail to preserve the original structure and meaning. This blog will present a comparative analysis of various models using multiple metrics.',
    url: '/blog/measure-document-parsing-accuracy',
    image: '/images/solutions/measure-document-parsing-accuracy-1.png',
    imageContain: false,
    industries: [],
    blog: true,
    date: new Date('2024-10-10'),
  },
  {
    title: 'Convert Image to Excel: Vision Language Models changing image to excel converter',
    subtitle: '',
    description:
      "Enter Vision Language Models (VLMs), a revolutionary approach that combines computer vision and natural language processing. This guide will walk you through the ai image processing of converting images to Excel using AnyParser. You'll discover practical applications, explore the advantages of VLMs over traditional OCR, and gain insights into this transformative technology.",
    url: '/blog/convert-image-to-excel',
    image: '/images/solutions/convert-image-to-excel-2.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-9'),
  },
  {
    title: 'What Does OCR Stand For? Understanding the downside of Optical Character Recognition',
    subtitle: '',
    description:
      "Optical Character Recognition (OCR) is a powerful technology that converts images of text into machine-readable data. While it offers tremendous benefits for digitizing documents and extracting information, it's not without its drawbacks. By gaining a comprehensive understanding of OCR, you'll be equipped to determine if and how to implement this technology in your workflows and projects.",
    url: '/blog/optical-character-recognition',
    image: '/images/solutions/optical-character-recognition-2.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-08'),
  },
  {
    title: 'Convert PDF to Google Sheets: A Step-by-Step Guide to Leveraging Vision Language Models',
    subtitle: '',
    description:
      "In today's data-driven world, whether you're dealing with financial statements, medical records, or logistics documents, you often encounter the need to convert PDF files into editable formats like Google Sheets. This guide will walk you through leveraging AnyParser to seamlessly transform your documents.",
    url: '/blog/convert-pdf-to-google-sheets',
    image: '/images/solutions/convert-pdf-to-google-sheets-2.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-08'),
  },
  {
    title: 'Intelligent Document Processing Solutions: Automating Data Extraction',
    subtitle: '',
    description:
      'This article explores how IDP intelligent document processing is revolutionizing document analysis, empowering you to unlock hidden insights, streamline workflows, and make data-driven decisions with confidence. Discover how this cutting-edge solution can transform your approach to information management and propel your projects to new heights.',
    url: '/blog/intelligent-document-processing',
    image: '/images/solutions/intelligent-document-processing-2.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-07'),
  },
  {
    title: 'What is Parsing and Best Free PDF Parser',
    subtitle: '',
    description:
      "In the realm of data management, parsing involves converting the content—such as <strong>text, images, tables, and metadata</strong>—into a usable format (e.g., plain text, structured data, or images) that can be further processed or analyzed. You'll explore various parsing methods, with a particular focus on PDF parsing and how tools like <strong>AnyParser</strong> stand out from the crowd.",
    url: '/blog/best-pdf-parser',
    image: '/images/solutions/best-pdf-parser-1.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-06'),
  },
  {
    title: 'Data Entry Automation for Logistics: Streamline Operations with auto data entry',
    subtitle: '',
    description:
      "The logistics industry is a cornerstone of the global economy, accounting for approximately <strong>12% of the world's GDP</strong>. This sector, however, has been slow to adopt new technologies, with many companies still relying on manual processes. In this blog, we dive into the power of automation and how it’s reshaping the future of logistics.",
    url: '/blog/data-entry-automation',
    image: '/images/solutions/data-entry-automation-2.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-05'),
  },
  {
    title: 'Data Entry Software: Use Cases and Best Practices',
    subtitle: '',
    description:
      'In the rapidly evolving digital landscape, data entry software has become an indispensable tool for organizations of all sizes. This blog will explore the use cases of data entry software, delve into the best practices for implementation, and discuss how to automate data entry effectively.',
    url: '/blog/data-entry-software',
    image: '/images/solutions/data-entry-software-2.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-04'),
  },
  {
    title: 'Extracting Table from PDF: Unlocking Efficiency with AnyParser',
    subtitle: '',
    description:
      'The digital transformation demands efficient extraction of tables from PDF files and copying them to Excel, but traditional methods struggle with complexity and errors. <strong>AnyParser</strong> solves this by offering fast, accurate table extraction features.',
    url: '/blog/extract-table-from-pdf',
    image: '/images/solutions/convert-word-to-excel-3.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-03'),
  },
  {
    title: 'Convert Word to Excel for FREE: A Comprehensive Guide',
    subtitle: '',
    description:
      "Whether you're managing financial reports, inventory lists, or simple data tables, the ability to switch between Microsoft Word and Excel seamlessly is crucial. Today, we're diving into how you can convert word to excel effortlessly and for free, leveraging both traditional methods and cutting-edge AI technologies.",
    url: '/blog/convert-word-to-excel',
    image: '/images/solutions/convert-word-to-excel-4.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-02'),
  },
  {
    title: 'Can You Convert a PDF to Excel (for free)? Check AnyParser!',
    subtitle: '',
    description:
      'The demand for Image to Excel converters is rising in industries like finance, education, and healthcare due to their ability to streamline data management. These tools, powered by AI, efficiently convert image to Excel formats, enhancing processing speed and reducing errors.',
    url: '/blog/convert-pdf-to-excel',
    image: '/images/solutions/convert-pdf-to-excel-6.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-10-01'),
  },
  {
    title: 'Convert PDF to CSV: An In-Depth Guide to Leveraging Vision Language Models',
    subtitle: '',
    description:
      'This guide will walk you through the process of harnessing VLMs to convert your PDFs into CSV or Excel files using AnyParser, streamlining your workflow and unlocking valuable data insights. With AnyParser, you can easily convert PDF to CSV, PDF to Excel, or even convert Word to CSV with just a few clicks on our Playground.',
    url: '/blog/convert-pdf-to-csv',
    image: '/images/solutions/convert-pdf-to-csv-1.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-09-26'),
  },
  {
    title: "Vision Language Models: Moving Beyond OCR's Limitations",
    subtitle: '',
    description:
      'Vision Language Models (VLMs) are transforming document analysis by addressing the limitations of traditional Optical Character Recognition (OCR). This article examines how VLMs improve upon OCR, enhancing document processing in the digital era.',
    url: '/blog/ocr-vs-vlm',
    image: '/images/solutions/ocr-vs-vlm-1.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-09-25'),
  },
  {
    title: "AnyParser: The Resume Parser Behind Jobright.ai's High-Growth Product",
    subtitle: '',
    description:
      'Struggling to find the perfect candidates through piles of resumes? In this post, we’ll reveal how <strong>JobRight.ai</strong> turned the tables with <strong>AnyParser</strong>, the ultimate resume parser that effortlessly extracts and processes candidate information. Discover how this game-changing tool transformed <strong>JobRight.ai</strong> into the top AI job marketplace, creating career matches faster and more accurately than ever before.',
    url: '/blog/jobright-resumes',
    image: '/images/solutions/jobright-resumes.png',
    imageContain: true,
    industries: [],
    blog: true,
    date: new Date('2024-09-19'),
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
