import axios from 'axios';
import getApiKey from './account/ApiKey';
import { ApiKey } from '@/app/hooks/useAccountStore';

interface IParams {
  userId: string;
  token: string;
  apiUrl: string;
  base64String: string;
  maskPii?: boolean;
  fileType?: string;
}

export const runSyncTableExtract = async ({
  token,
  apiUrl,
  base64String,
  maskPii,
}: Omit<IParams, 'userId'>): Promise<string> => {
  let apiKey: ApiKey;
  try {
    apiKey = await getApiKey({
      token,
      apiURL: apiUrl,
      email: undefined,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return e.message;
    } else {
      return 'Error in getting API key';
    }
  }
  const extractAPI = `${apiUrl}/table/extract`;
  const params = {
    file_content: base64String,
    file_type: 'pdf',
    table_args: {
      mask_pii_flag: maskPii || false,
    },
  };

  const config = {
    headers: {
      'x-api-key': apiKey.api_key || '-',
    },
  };

  const tableExtractResponse = await axios.post(extractAPI, params, config);

  if (tableExtractResponse.status !== 200) {
    throw new Error('Failed to extract data');
  }
  const table = tableExtractResponse.data.markdown[0];

  return table;
};
