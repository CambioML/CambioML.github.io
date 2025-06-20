// import axios, { AxiosError } from 'axios';
// import toast from 'react-hot-toast';
// import createUser from './createUser';
// interface IParams {
//   api_url: string;
//   userId: string;
//   token: string;
//   setTotalQuota: (remaining: number) => void;
//   setRemainingQuota: (total: number) => void;
//   handleError: (error: AxiosError) => void;
// }

// const updateQuota = async ({ api_url, userId, setRemainingQuota, setTotalQuota }: IParams) => {
//   // Helper function to fetch user data
//   const fetchUserData = async () => {
//     const params = { userId };
//     // Make API call to get user data
//     const response = await axios.get(`${api_url}/get-user-data`, { params });
//     const { pageRemaining, pageLimit } = response.data.user_data;
//     // Update quota states
//     setRemainingQuota(pageRemaining);
//     setTotalQuota(pageLimit);
//     return response.data;
//   };

//   try {
//     // Attempt to fetch user data
//     return await fetchUserData();
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response?.status === 404) {
//       const createUserResult = await createUser({ userId, apiURL: api_url });
//       console.log('createUserResult', createUserResult);
//       if (createUserResult) {
//         return await fetchUserData();
//       } else {
//         throw new Error('Failed to create new API key');
//       }
//     } else {
//       // Log and rethrow any other errors
//       throw error;
//     }
//   }
// };

// export default updateQuota;
