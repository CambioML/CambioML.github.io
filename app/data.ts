export interface SolutionType {
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  image?: string;
  imageContain?: boolean;
  date: Date;
  industries: string[];
  blog?: boolean;
}

export const solutions: SolutionType[] = [
  {
    title: 'AI in Banking Data Processing',
    subtitle: 'Streamline financial document workflows',
    description: 'Automate KYC, loan processing, and fraud detection with intelligent document parsing',
    url: '/blog/ai-in-banking-data-processing',
    image: '/images/solutions/intelligent-document-processing-banking-1.png',
    date: new Date('2024-10-25'),
    industries: ['finance', 'banking'],
    blog: true,
  },
  {
    title: 'Document Parsing for Investment',
    subtitle: 'Accelerate investment analysis',
    description: 'Extract insights from financial statements, research reports, and investment documents',
    url: '/blog/document-parsing-investment',
    image: '/images/solutions/document-parsing-investment-1.png',
    date: new Date('2024-11-15'),
    industries: ['finance', 'investment'],
    blog: true,
  },
  {
    title: 'AI in Oil and Gas',
    subtitle: 'Optimize field operations with AI',
    description: 'Enhance drilling efficiency, equipment monitoring, and safety protocols with AI-powered solutions',
    url: '/blog/ai-in-oil-and-gas',
    image: '/images/solutions/ai-in-oil-and-gas.png',
    date: new Date('2024-10-16'),
    industries: ['energy', 'oil-gas'],
    blog: true,
  },
  {
    title: 'Drill AI: Smart Drilling Solutions',
    subtitle: 'Real-time drill bit optimization',
    description:
      'Revolutionize oil drilling with real-time data analysis, predictive insights, and voice AI assistance',
    url: '/blog/drill-ai',
    image: '/images/solutions/drill-ai-3.png',
    date: new Date('2025-02-12'),
    industries: ['energy', 'oil-gas'],
    blog: true,
  },
  {
    title: 'Data Entry Automation',
    subtitle: 'Streamline logistics operations',
    description: 'Automate data entry processes in logistics to reduce errors and improve efficiency',
    url: '/blog/data-entry-automation',
    image: '/images/solutions/data-entry-automation-1.png',
    date: new Date('2024-10-05'),
    industries: ['logistics', 'automation'],
    blog: true,
  },
  {
    title: 'Intelligent Document Processing',
    subtitle: 'Enterprise document automation',
    description: 'Transform unstructured documents into actionable data with AI-powered processing',
    url: '/blog/intelligent-document-processing',
    image: '/images/solutions/intelligent-document-processing.png',
    date: new Date('2024-11-20'),
    industries: ['enterprise', 'automation'],
    blog: true,
  },
  {
    title: 'AI Table Extraction',
    subtitle: 'Extract tables from any document',
    description: 'Convert PDF tables and image tables into structured data with advanced AI recognition',
    url: '/blog/ai-table-extraction',
    image: '/images/solutions/ai-table-extraction.png',
    date: new Date('2024-11-22'),
    industries: ['data-processing', 'automation'],
    blog: true,
  },
  {
    title: 'AI Image Extraction',
    subtitle: 'Process images and visual data',
    description: 'Extract text, tables, and insights from images using Vision Language Models',
    url: '/blog/ai-image-extraction',
    image: '/images/solutions/ai-image-extraction.png',
    date: new Date('2024-11-25'),
    industries: ['data-processing', 'computer-vision'],
    blog: true,
  },
  {
    title: 'Document Parsing Software',
    subtitle: 'Enterprise integration solutions',
    description: 'Seamlessly integrate document parsing with existing enterprise systems and workflows',
    url: '/blog/document-parsing-software',
    image: '/images/solutions/document-parsing-software.png',
    date: new Date('2024-11-30'),
    industries: ['enterprise', 'integration'],
    blog: true,
  },
  {
    title: 'Medical Records Data Extraction',
    subtitle: 'Healthcare document processing',
    description: 'Extract and structure data from medical records, prescriptions, and healthcare documents',
    url: '/blog/data-extraction-medical-records',
    image: '/images/solutions/medical-records.png',
    date: new Date('2024-10-30'),
    industries: ['healthcare', 'medical'],
    blog: true,
  },
];
