import axios from 'axios';
import getApiKeysForUser from './account/getApiKeysForUser';
import { ApiKey } from '@/app/hooks/useAccountStore';

interface IParams {
  userId: string;
  token: string;
  apiUrl: string;
  base64String: string;
  maskPii?: boolean;
  fileType?: string;
}

export const runSyncExtract = async ({ userId, token, apiUrl, base64String, maskPii }: IParams): Promise<string> => {
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
  const extractAPI = `${apiUrl}/extract`;
  const params = {
    file_content: base64String,
    file_type: 'pdf',
    mask_pii: maskPii || false,
  };

  const config = {
    headers: {
      'x-api-key': apiKey[0].key || '-',
    },
  };

  const extractStatusResponse = await axios.post(extractAPI, params, config);

  if (extractStatusResponse.status !== 200) {
    throw new Error('Failed to extract data');
  }
  const markdown = extractStatusResponse.data.markdown[0];

  return markdown;
};
