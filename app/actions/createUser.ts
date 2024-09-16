import axios from 'axios';

interface IParams {
  userId: string;
  apiURL: string;
}

export default async function createUser({ userId, apiURL }: IParams) {
  try {
    const response = await axios.post(`${apiURL}/create-billing-record`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}
