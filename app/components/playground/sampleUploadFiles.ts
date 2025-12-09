export type PlaygroundSampleUploadFile = {
  fileName: string;
  fileLabel: string;
  previewImage: string;
};

export const playgroundSampleUploadFiles: PlaygroundSampleUploadFile[] = [
  {
    fileName: 'SamplePortfolioStatement.pdf',
    fileLabel: 'Portfolio Statement',
    previewImage: 'SamplePortfolioStatement.png',
  },
  {
    fileName: 'BoeingSustainabilityReport.pdf',
    fileLabel: 'Sustainability Report',
    previewImage: 'BoeingSustainabilityReport.png',
  },
  {
    fileName: 'TableOfContents.pdf',
    fileLabel: 'Table of Contents',
    previewImage: 'TableOfContents.png',
  },
];
