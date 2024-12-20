import axios from 'axios';
import getApiKeysForUser from './account/getApiKeysForUser';
import { ApiKey } from '../hooks/useAccountStore';

interface IParams {
  userId: string;
  token: string;
  apiUrl: string;
  base64String: string;
  extractInstruction?: Record<string, string>;
  fileType?: string;
}

export const runSyncTableExtract = async ({
  userId,
  token,
  apiUrl,
  base64String,
  extractInstruction,
}: IParams): Promise<string> => {
  // Mocking the response for testing
  return JSON.stringify({
    personal_info: {
      name: 'Mark Henry Nimo',
      email: 'marknimo@gmail.com',
      address: '3803 Marquette Place 4H, San Diego, CA',
      phone: '(310) 621-8089',
    },
    account_info: {
      account_number: '1234567890',
      account_type: 'Checking',
      balance: '$10,000.00',
    },
  });
  const extractAPI = `${apiUrl}/extract_key_value`;
  const params = {
    file_content: base64String,
    file_type: 'pdf',
    extract_instruction: extractInstruction || {},
  };

  const config = {
    headers: {
      'x-api-key': '-',
      Authorization: token,
    },
  };

  const keyValueExtractResponse = await axios.post(extractAPI, params, config);

  if (keyValueExtractResponse.status !== 200) {
    throw new Error('Failed to extract key value pairs');
  }

  const json = keyValueExtractResponse.data.json[0];
  return json;
};
