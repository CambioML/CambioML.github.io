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
  jobParams?: { [key: string]: string | boolean };
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
