import axios from 'axios';
import toast from 'react-hot-toast';
import { PresignedResponse } from './apiInterface';

// New interfaces for the async_parse endpoint
interface AsyncParseParams {
  api_url: string;
  file: File;
  apiKey: string;
}

interface AsyncParseResponse {
  job_id: string;
  status: string;
  message: string;
}

interface JobStatusResponse {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  result_url?: string;
  error_message?: string;
}

// New interfaces for the async_extract_key_value endpoint
interface ExtractKeyValueParams {
  api_url: string;
  file: File;
  apiKey: string;
  extractInputKeyDescriptionPairs: KeyDescriptionPair[];
}

interface KeyDescriptionPair {
  key: string;
  description: string;
}

interface ExtractKeyValueInputPayload {
  file_content: string;
  file_type: string;
  extract_input_key_description_pairs: KeyDescriptionPair[];
}

interface JobSubmissionResponse {
  job_id: string;
  status: string;
  message: string;
}

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:mime/type;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Get file type from File object
const getFileType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension || '';
};

// New async parse function
export const asyncAnyparser = async ({ api_url, file, apiKey }: AsyncParseParams): Promise<AsyncParseResponse> => {
  try {
    // Convert file to base64
    const fileContent = await fileToBase64(file);
    const fileType = getFileType(file);

    const requestBody = {
      file_content: fileContent,
      file_type: fileType,
    };

    const response = await axios.post<AsyncParseResponse>(`${api_url}/anyparser/async_parse`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in asyncParseFile:', error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response.data?.detail || `Error parsing file: ${file.name}`;
      toast.error(message);
    } else {
      toast.error(`Error parsing file: ${file.name}.`);
    }
    throw error;
  }
};

// New async parse function
export const asyncAnyparserPro = async ({ api_url, file, apiKey }: AsyncParseParams): Promise<AsyncParseResponse> => {
  try {
    // Convert file to base64
    const fileContent = await fileToBase64(file);
    const fileType = getFileType(file);

    const requestBody = {
      file_content: fileContent,
      file_type: fileType,
    };

    const response = await axios.post<AsyncParseResponse>(`${api_url}/anyparser/async_parse_pro`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in asyncParseFile:', error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response.data?.detail || `Error parsing file: ${file.name}`;
      toast.error(message);
    } else {
      toast.error(`Error parsing file: ${file.name}.`);
    }
    throw error;
  }
};

// Poll job status
export const pollJobStatus = async (
  api_url: string,
  jobId: string,
  apiKey: string,
  maxAttempts: number = 30,
  pollInterval: number = 1000
): Promise<JobStatusResponse> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios.get<JobStatusResponse>(`${api_url}/anyparser/job_status/${jobId}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      const status = response.data;

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error(`Error polling job status (attempt ${attempt + 1}):`, error);
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  }

  throw new Error('Job polling timed out');
};

interface UploadFileIParams {
  api_url: string;
  file: File | undefined;
  userId: string;
  token: string;
  process_type: string;
  maskPiiFlag?: boolean;
  extractArgs: {
    vqaFiguresFlag?: boolean;
    vqaChartsFlag?: boolean;
    vqaTablesFlag?: boolean;
    vqaFootnotesFlag?: boolean;
    vqaHeadersFlag?: boolean;
    vqaFootersFlag?: boolean;
    vqaPageNumsFlag?: boolean;
    vqaTableOnlyFlag?: boolean;
    vqaChartOnlyFlag?: boolean;
    extractInstruction?: Record<string, string>;
  };
  addFilesFormData: (data: PresignedResponse) => void;
}

interface Config {
  headers: {
    'x-api-key': string;
    Authorization: string;
  };
}

export const uploadFile = async ({
  api_url,
  token,
  file,
  extractArgs,
  process_type,
  maskPiiFlag,
  addFilesFormData,
}: UploadFileIParams) => {
  if (!file) {
    toast.error('No file selected');
    return;
  }

  const getConfig: Config = {
    headers: {
      'x-api-key': '-',
      Authorization: token,
    },
  };

  const snakeCaseExtractArgs = {
    vqa_figures_flag: extractArgs.vqaFiguresFlag,
    vqa_charts_flag: extractArgs.vqaChartsFlag,
    vqa_tables_flag: extractArgs.vqaTablesFlag,
    vqa_footnotes_flag: extractArgs.vqaFootnotesFlag,
    vqa_headers_flag: extractArgs.vqaHeadersFlag,
    vqa_footers_flag: extractArgs.vqaFootersFlag,
    vqa_page_nums_flag: extractArgs.vqaPageNumsFlag,
    vqa_table_only_flag: extractArgs.vqaTableOnlyFlag,
    vqa_table_only_caption_flag: extractArgs.vqaChartOnlyFlag,
    extract_instruction: extractArgs.extractInstruction,
  };

  const requestBody = {
    file_name: file.name,
    extract_args: snakeCaseExtractArgs || {},
    process_type: process_type,
    mask_pii: maskPiiFlag,
  };

  return await axios
    .post<PresignedResponse>(api_url + '/async/upload', requestBody, getConfig)
    .then((response) => {
      const data = response.data as PresignedResponse;
      addFilesFormData(data);
      return response;
    })
    .catch((error) => {
      toast.error(`Error uploading file: ${file.name}. Please try again.`);
      return error;
    });
};

// New async extract key value function
export const asyncExtractKeyValue = async ({
  api_url,
  file,
  apiKey,
  extractInputKeyDescriptionPairs,
}: ExtractKeyValueParams): Promise<JobSubmissionResponse> => {
  try {
    // Convert file to base64
    const fileContent = await fileToBase64(file);
    const fileType = getFileType(file);

    const requestBody: ExtractKeyValueInputPayload = {
      file_content: fileContent,
      file_type: fileType,
      extract_input_key_description_pairs: extractInputKeyDescriptionPairs,
    };

    const response = await axios.post<JobSubmissionResponse>(
      `${api_url}/anyparser/async_extract_key_value`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in asyncExtractKeyValue:', error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response.data?.detail || `Error extracting key values from file: ${file.name}`;
      toast.error(message);
    } else {
      toast.error(`Error extracting key values from file: ${file.name}. Please try again.`);
    }
    throw error;
  }
};

// New async extract tables function
export const asyncExtractTables = async ({
  api_url,
  file,
  apiKey,
}: {
  api_url: string;
  file: File;
  apiKey: string;
}): Promise<JobSubmissionResponse> => {
  try {
    // Convert file to base64
    const fileContent = await fileToBase64(file);
    const fileType = getFileType(file);

    const requestBody = {
      file_content: fileContent,
      file_type: fileType,
    };

    const response = await axios.post<JobSubmissionResponse>(`${api_url}/anyparser/async_extract_tables`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in asyncExtractTables:', error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response.data?.detail || `Error extracting tables from file: ${file.name}`;
      toast.error(message);
    } else {
      toast.error(`Error extracting tables from file: ${file.name}. Please try again.`);
    }
    throw error;
  }
};
