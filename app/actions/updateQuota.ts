import axios, { AxiosError } from 'axios';
import getNewApiKey from '@/app/actions/account/getNewApiKey';
interface IParams {
  api_url: string;
  userId: string;
  token: string;
  setTotalQuota: (remaining: number) => void;
  setRemainingQuota: (total: number) => void;
  handleError: (error: AxiosError) => void;
}

const updateQuota = async ({ api_url, token, userId, setRemainingQuota, setTotalQuota }: IParams) => {
  // Helper function to fetch user data
  const fetchUserData = async () => {
    const params = { userId };
    // Make API call to get user data
    const response = await axios.get(`${api_url}/get-user-data`, { params });
    const { pageRemaining, pageLimit } = response.data.user_data;
    // Update quota states
    setRemainingQuota(pageRemaining);
    setTotalQuota(pageLimit);
    return response.data;
  };

  try {
    // Attempt to fetch user data
    return await fetchUserData();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Create new user when not found
      const newApiKeyResult = await getNewApiKey({ userId, token, apiURL: api_url });
      if (newApiKeyResult) {
        // Retry fetching
        return await fetchUserData();
      } else {
        throw new Error('Failed to create new API key');
      }
    } else {
      // Log and rethrow any other errors
      throw error;
    }
  }
};

export default updateQuota;
