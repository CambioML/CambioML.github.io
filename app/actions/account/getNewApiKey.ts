import { ApiKey } from '@/app/hooks/useAccountStore';
import axios from 'axios';
import toast from 'react-hot-toast';

interface IParams {
  token: string;
  apiURL: string;
  email?: string; // Optional email payload
}

export default async function getApiKey({ token, apiURL, email }: IParams): Promise<ApiKey> {
  const payload = email ? { email } : {};

  try {
    const response = await axios.post(`${apiURL}/anyparser/create_api_key`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = response.data;
      return {
        api_key: data.api_key,
        email: data.email,
        quota: data.quota,
        plan: data.plan,
        status: data.status,
        created_at: data.created_at,
        user_id: data.user_id,
      };
    } else {
      throw new Error('Failed to create API key');
    }
  } catch (error) {
    let errorMessage = '';
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 429) {
        errorMessage = 'Maximum number of API keys reached.';
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid request. Please check your authentication.';
      } else {
        errorMessage = error.response.data?.detail || error.message;
      }
    } else {
      errorMessage = error instanceof Error ? error.message : String(error);
    }
    toast.error(errorMessage);
    throw error;
  }
}
