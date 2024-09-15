import axios from 'axios';

interface IParams {
  userId: string;
  api_url: string;
}

export const getUserData = async ({ userId, api_url }: IParams) => {
  const params = {
    userId,
  };

  return axios
    .get(`${api_url}/get-user-data`, { params })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
};
