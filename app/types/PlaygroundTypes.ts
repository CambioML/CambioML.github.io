import { QAResult, QueryResult } from '../actions/apiInterface';

export enum ExtractState {
  NO_DATA,
  READY,
  UPLOADING,
  EXTRACTING,
  DONE_EXTRACTING,
  LIMIT_REACHED,
}

export enum TransformState {
  READY,
  TRANSFORMING,
  DONE_TRANSFORMING,
}

export enum CompareState {
  READY,
  COMPARING,
  DONE_COMPARING,
}

export enum ExtractTab {
  FILE_EXTRACT,
  TABLE_EXTRACT,
  INITIAL_STATE,
}

export enum TableTab {
  TABLE_EXTRACT,
  TABLE_SELECT,
  MAP_SCHEMA,
}

export enum ModelType {
  BASE,
  PRO,
  ULTRA,
}

export interface MapSchemaResult {
  keyMap: { [key: string]: string };
  extractedKeys: { [key: string]: string };
}

export interface ExtractedMDTable {
  title: string;
  table: string;
  tableData: { [key: string]: string[] };
}

export interface ExtractSettings {
  removePII: boolean;
  includePageNumbers: boolean;
  includeFootnotes: boolean;
  includeHeadersFooters: boolean;
  includeTables: boolean;
  includeChartsFigures: boolean;
}

export interface PlaygroundFile {
  file: File | string;
  extractResult: QueryResult;
  qaResult: QAResult | null;
  tableExtractResult: string[];
  tableMdExtractResult: ExtractedMDTable[];
  tableMappedDataRows: string[][];
  tableMergedData: { [key: string]: string[] };
  keyMap: { [key: string]: string };
  tableMapIndices: Set<number>;
  jobId: string;
  userId: string;
  fileId: string;
  s3_file_source: {
    s3_bucket: string;
    source_type: string;
    s3_prefix: string;
  };
  activeTab: string;
  extractState: ExtractState;
  instructionExtractState: ExtractState;
  tableMdExtractState: ExtractState;
  extractTab: ExtractTab;
  tableTab: TableTab;
  qaState: TransformState;
  summarizeState: TransformState;
  compareState: CompareState;
  compareFile: File | null;
  compareResult: string;
}

export interface TransformResult {
  file_source: S3FileSource;
  file_metadata: { original_file_name: string };
  results: {
    output: OutputItem[];
  }[][];
  status: string;
}

export interface OutputItem {
  error: string;
  response: {
    context: string;
    question: string;
    answer: string;
  }[];
}

interface S3FileSource {
  s3_bucket: string;
  source_type: string;
  s3_prefix: string;
}

export const PlaygroundTabs = {
  PLAIN_TEXT: 'Full Content',
  TABLE: 'Table Only',
};

export enum JobType {
  FILE_EXTRACTION = 'file_extraction',
  QA_GENERATION = 'qa_generation',
  INFO_EXTRACTION = 'info_extraction',
  INSTRUCTION_EXTRACTION = 'instruction_extraction',
  FILE_COMPARISON = 'file_comparison',
  SCHEMA_EXTRACTION = 'schema_extraction',
  SCHEMA_EXTRACTION_FRONTEND = 'schema_extraction_frontend',
}

export enum ProcessType {
  FILE_EXTRACTION = 'file',
  TABLE_EXTRACTION = 'table',
  JSON_EXTRACTION = 'json',
  // FILE_EXTRACTION_PRO = 'file_refined_quick',
  FILE_EXTRACTION_PRO = 'parse_with_layout', // TODO: verify it's okay to replay the endpoint
  FILE_EXTRACTION_ULTRA = 'file_refined',
}
