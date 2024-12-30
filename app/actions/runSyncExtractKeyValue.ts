import axios from 'axios';

interface IParams {
  token: string;
  apiUrl: string;
  base64String: string;
  extractInstruction: Record<string, string>;
  fileType?: string;
}

export const runSyncExtractKeyValue = async ({
  token,
  apiUrl,
  base64String,
  extractInstruction,
}: IParams): Promise<string> => {
  const extractAPI = `${apiUrl}/extract_key_value`;
  const params = {
    file_content: base64String,
    file_type: 'pdf',
    extract_args: {
      extract_instruction: extractInstruction,
    },
  };

  const config = {
    headers: {
      'x-api-key': '-',
      Authorization: token,
    },
  };

  const extractKeyValueResponse = await axios.post(extractAPI, params, config);

  if (extractKeyValueResponse.status !== 200) {
    throw new Error('Failed to extract key value pairs');
  }

  const json = extractKeyValueResponse.data.json[0];
  return json;
};
