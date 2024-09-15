import { ApiKey } from '@/app/hooks/useAccountStore';
import axios from 'axios';
import toast from 'react-hot-toast';

interface IParams {
  userId: string;
  token: string;
  apiURL: string;
}

export default async function getApiKey({ userId, token, apiURL }: IParams): Promise<ApiKey> {
  const params = {
    userId,
  };

  try {
    const response = await axios.post(`${apiURL}/makekey`, params, {
      headers: {
        'Content-Type': 'application/json',
        authorizationToken: token,
        apiKey: '-',
      },
    });
  
    if (response.status === 200) {
      return { key: response.data.apiKey };
    } else {
      // Fallback error handling if not caught by Axios error
      throw new Error('Failed to get API key');
    }
  
  } catch (error) {
    let errorMessage = '';
  
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 429) {
        errorMessage = 'Maximum number of API keys reached.';
      } else {
        // default error message for other status codes
        errorMessage = error.message;
      }
    } else {
      // Handle any other errors
      errorMessage = error instanceof Error ? error.message : String(error);
    }
  
    console.error(errorMessage);
    toast.error(errorMessage);
  
    // Re-throw the original error to keep the stack trace
    throw error;
  }
  
  
}
