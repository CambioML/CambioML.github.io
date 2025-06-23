import { ApiKey } from '@/app/hooks/useAccountStore';
import axios from 'axios';
import toast from 'react-hot-toast';

interface getApiKeyParams {
  token: string;
  apiURL: string;
  email?: string;
}

interface CheckQuotaRequest {
  remaining_quota: number;
  total_used: number;
}

interface CheckQuotaParams {
  apiKey?: string;
  apiURL: string;
}

export async function checkQuota({ apiKey, apiURL }: CheckQuotaParams): Promise<CheckQuotaRequest> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['x-api-key'] = apiKey;
    } else {
      throw new Error('A valid API key is required to check quota');
    }

    const response = await axios.get(`${apiURL}/anyparser/check_quota`, {
      headers,
    });

    if (response.status === 200) {
      const data = response.data;
      return {
        remaining_quota: data.remaining_quota,
        total_used: data.total_used,
      };
    } else {
      throw new Error('Failed to check quota');
    }
  } catch (error) {
    let errorMessage = '';
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Missing or invalid API key.';
      } else if (error.response.status === 404) {
        errorMessage = 'No API key found for this user.';
      } else if (error.response.status === 500) {
        errorMessage = 'Failed to check quota.';
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

export default async function getApiKey({ token, apiURL, email }: getApiKeyParams): Promise<ApiKey> {
  const payload = email ? { email } : {};

  try {
    const response = await axios.post(`${apiURL}/anyparser/get_api_key`, payload, {
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
      throw new Error('Failed to get API key');
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

export async function checkApiKey({ token, apiURL }: { token: string; apiURL: string }): Promise<boolean> {
  try {
    const response = await axios.get(`${apiURL}/anyparser/check_api_key`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return Boolean(response.data);
    } else {
      return false;
    }
  } catch (error) {
    console.log('checkApiKey error:', error);
    return false;
  }
}
