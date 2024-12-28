export interface UploadParams {
  token: string;
  clientId: string;
  fileName: string;
}

export interface PresignedResponse {
  presignedUrl: {
    fields: Record<string, string>;
    url: string;
  };
  s3_bucket: string;
  s3_prefix: string;
  fileId: string;
  jobId: string;
  userId: string;
}

export interface QueryParams {
  userId: string;
  fileId: string;
  queryType: string;
  jobId: string;
}

export type QueryResult = string[];

export interface RequestParams {
  token: string;
  clientId: string;
  files: { sourceType: string; fileId?: string; url?: string }[];
  jobType: string;
  jobParams?: JobParams;
  customSchema?: string[];
}

export interface JobParams {
  targetPageNumbers?: number[];
  maskPiiFlag?: boolean;
  lambdaProcessorArgs?: {
    informationExtractionInstruction: string;
    refineFlag: boolean;
  };
  vqaProcessorArgs?: {
    vqaFiguresFlag?: boolean;
    vqaChartsFlag?: boolean;
    vqaTablesFlag?: boolean;
    vqaFootnotesFlag?: boolean;
    vqaHeadersFlag?: boolean;
    vqaFootersFlag?: boolean;
    vqaPageNumsFlag?: boolean;
    vqaTableOnlyFlag?: boolean;
    vqaChartOnlyFlag?: boolean;
    vqaExtractInstruction?: Record<string, string>;
  };
  schemaInfo?: {
    dbSchema?: string[];
    tableSchema?: string[];
  };
}

export type QAResult = Array<
  Array<{
    output: Array<{
      error: string;
      response: Array<{
        context: string;
        question: string;
        answer: string;
      }>;
    }>;
  }>
>;
