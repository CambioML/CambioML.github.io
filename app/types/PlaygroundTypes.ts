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
  extractKeyValueResult: string;
  tableExtractResult: string[];
  tableMdExtractResult: ExtractedMDTable[];
  tableMappedDataRows: string[][];
  tableMergedData: { [key: string]: string[] };
  keyMap: { [key: string]: string };
  keyValueInputs: { key: string; description: string }[];
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
  extractKeyValueState: ExtractState;
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
  PLAIN_TEXT: 'plainText',
  TABLE: 'table',
  KEY_VALUE_PAIR: 'keyValuePair',
};

// Helper function to get translated tab labels
export const getPlaygroundTabLabel = (tabKey: string, t: any) => {
  switch (tabKey) {
    case PlaygroundTabs.PLAIN_TEXT:
      return t.playground.tabs.plainText;
    case PlaygroundTabs.TABLE:
      return t.playground.tabs.table;
    case PlaygroundTabs.KEY_VALUE_PAIR:
      return t.playground.tabs.keyValuePair;
    default:
      return tabKey;
  }
};

export enum JobType {
  FILE_EXTRACTION = 'file_extraction',
  QA_GENERATION = 'qa_generation',
  INFO_EXTRACTION = 'info_extraction',
  INSTRUCTION_EXTRACTION = 'instruction_extraction',
  KEY_VALUE_EXTRACTION = 'key_value_extraction',
  FILE_COMPARISON = 'file_comparison',
  SCHEMA_EXTRACTION = 'schema_extraction',
  SCHEMA_EXTRACTION_FRONTEND = 'schema_extraction_frontend',
}

export enum ProcessType {
  FILE_EXTRACTION = 'file',
  TABLE_EXTRACTION = 'extract_tables',
  JSON_EXTRACTION = 'json',
  // FILE_EXTRACTION_PRO = 'file_refined_quick',
  FILE_EXTRACTION_PRO = 'parse_with_layout_ocr',
  EXTRACT_KEY_VALUE = 'extract_key_value',
  FILE_EXTRACTION_ULTRA = 'file_refined',
}
