import axios from 'axios';
import getApiKeysForUser from './account/getApiKeysForUser';
import { ApiKey } from '../hooks/useAccountStore';

interface IParams {
  userId: string;
  token: string;
  apiUrl: string;
  base64String: string;
  maskPii?: boolean;
  fileType?: string;
}

export const runSyncTableExtract = async ({
  userId,
  token,
  apiUrl,
  base64String,
  maskPii,
}: IParams): Promise<string> => {
  let apiKey: ApiKey[];
  try {
    apiKey = await getApiKeysForUser({ userId, token, apiURL: apiUrl });
    if (apiKey.length === 0) {
      throw new Error('API key not found');
    }
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
      'x-api-key': apiKey[0].key || '-',
    },
  };

  const tableExtractResponse = await axios.post(extractAPI, params, config);

  if (tableExtractResponse.status !== 200) {
    throw new Error('Failed to extract data');
  }
  const table = tableExtractResponse.data.markdown[0];

  return table;
};
