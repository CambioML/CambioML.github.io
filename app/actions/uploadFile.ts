import axios from 'axios';
import toast from 'react-hot-toast';
import { PresignedResponse } from './apiInterface';
import getApiKeysForUser from './account/getApiKeysForUser';
interface IParams {
  api_url: string;
  file: File | undefined;
  userId: string;
  token: string;
  // clientId: string;
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
  };
  addFilesFormData: (data: PresignedResponse) => void;
}

interface Config {
  headers: {
    'x-api-key': string;
  };
}

export const uploadFile = async ({ api_url, userId, token, file, extractArgs, addFilesFormData }: IParams) => {
  if (!file) {
    toast.error('No file selected');
    return;
  }

  let apiKey;
  try {
    apiKey = await getApiKeysForUser({ userId, token, apiURL: api_url });
    if (apiKey.length === 0) {
      throw new Error('API key not found');
    }
  } catch (e) {
    return e;
  }

  const getConfig: Config = {
    headers: {
      'x-api-key': apiKey[0].key || '-',
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
  };

  const requestBody = {
    file_name: file.name,
    extract_args: snakeCaseExtractArgs || {},
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
