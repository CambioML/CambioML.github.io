import { ApiKey } from '@/app/hooks/useAccountStore';
import axios from 'axios';

interface IParams {
  userId: string;
  token: string;
  apiURL: string;
}

export default async function getApiKeysForUser({ userId, token, apiURL }: IParams): Promise<ApiKey[]> {
  const params = {
    userId,
  };

  try {
    const response = await axios.get(`${apiURL}/get-user-data`, {
      headers: {
        'Content-Type': 'application/json',
        authorizationToken: token,
        apiKey: '-',
      },
      params,
    });

    if (response.status === 200 && response.data.user_data.apiKey) {
      // const apiKeys = response.data.user_data.apiKeys.map((thisKey: string) => ({
      //   key: thisKey,
      // }));
      return [{ key: response.data.user_data.apiKey }];
    } else {
      // const errorMessage = 'Failed to get API key';
      // toast.error(errorMessage);
      return [];
      // throw new Error(errorMessage);
    }
  } catch (error) {
    // toast.error('Failed to get API key');
    // throw new Error('Failed to get API key');
    return [];
  }
}
