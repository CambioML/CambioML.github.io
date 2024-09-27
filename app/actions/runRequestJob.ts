import axios, { AxiosError, AxiosResponse } from 'axios';
import { ExtractState, TransformState } from '@/app/types/PlaygroundTypes';
import pollJobStatus from './pollJobStatus';
import toast from 'react-hot-toast';
import { JobParams, QueryParams, RequestParams } from './apiInterface';

interface IParams {
  apiURL: string;
  jobType: string;
  clientId: string;
  fileId: string;
  token: string;
  sourceType: string;
  selectedFileIndex: number;
  url?: string;
  jobParams?: JobParams;
  filename: string;
  customSchema?: string[];
  handleSuccess: (response: AxiosResponse) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  updateFileAtIndex: (
    index: number | null,
    property: string,
    value: string | ExtractState | TransformState | File
  ) => void;
}

const JOB_STATE: { [key: string]: string } = {
  file_extraction: 'extractState',
  info_extraction: 'keyValueState',
  instruction_extraction: 'instructionExtractionState',
  qa_generation: 'qaState',
};

const SUCCESS_STATE: { [key: string]: ExtractState | TransformState } = {
  file_extraction: ExtractState.EXTRACTING,
  instruction_extraction: ExtractState.EXTRACTING,
  info_extraction: TransformState.TRANSFORMING,
  qa_generation: TransformState.TRANSFORMING,
};

const FAIL_STATE: { [key: string]: ExtractState | TransformState } = {
  file_extraction: ExtractState.READY,
  instruction_extraction: ExtractState.READY,
  info_extraction: TransformState.READY,
  qa_generation: TransformState.READY,
};

const SLEEP_DURATION: { [key: string]: number } = {
  file_extraction: 5000,
  info_extraction: 5000,
  instruction_extraction: 5000,
  qa_generation: 5000,
  schema_extraction: 5000,
  schema_extraction_frontend: 5000,
};

export const runRequestJob = async ({
  apiURL,
  clientId,
  fileId,
  jobParams,
  jobType,
  selectedFileIndex,
  sourceType,
  filename,
  token,
  url,
  customSchema,
  handleError,
  handleSuccess,
  handleTimeout,
  updateFileAtIndex,
}: IParams) => {
  const params: RequestParams = {
    token,
    clientId,
    files: [{ sourceType, ...(fileId && { fileId }), ...(url && { url }) }],
    jobType,
    ...(jobParams && { jobParams }),
    customSchema,
  };
  console.log('params', params);
  axios
    .post(`${apiURL}/request`, params, {
      headers: {
        'Content-Type': 'application/json',
        authorizationToken: token,
        apiKey: '-',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        toast.success(`${filename} submitted!`);
        updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], SUCCESS_STATE[jobType]);
        const postParams: QueryParams = {
          userId: response.data.userId,
          fileId,
          jobId: response.data.jobId,
          queryType: 'job_result',
        };
        setTimeout(() => {
          pollJobStatus({
            apiKey: '-',
            api_url: apiURL,
            postParams,
            token,
            handleSuccess,
            handleError,
            handleTimeout,
            targetPages: jobParams?.targetPageNumbers,
          });
        }, SLEEP_DURATION[jobType]); // Need to delay the polling to give the server time to process the file
      } else {
        updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], FAIL_STATE[jobType]);
      }
    })
    .catch((error) => {
      console.error('error', error);
      toast.error(`Error uploading ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], FAIL_STATE[jobType]);
    });
};
