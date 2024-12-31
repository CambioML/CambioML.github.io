import axios from 'axios';
import toast from 'react-hot-toast';
import { PresignedResponse } from './apiInterface';
interface IParams {
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
}: IParams) => {
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
