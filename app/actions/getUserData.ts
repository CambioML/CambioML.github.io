import axios from 'axios';
import createUser from './createUser';

interface IParams {
  userId: string;
  api_url: string;
}

export const getUserData = async ({ userId, api_url }: IParams) => {
  const params = {
    userId,
  };

  try {
    const response = await axios.get(`${api_url}/get-user-data`, { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log('User not found, creating new user');
      return createUser({ userId, apiURL: api_url });
    } else {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
};
