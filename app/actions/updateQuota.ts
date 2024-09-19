import axios, { AxiosError } from 'axios';

interface IParams {
  api_url: string;
  userId: string;
  token: string;
  setTotalQuota: (remaining: number) => void;
  setRemainingQuota: (total: number) => void;
  handleError: (error: AxiosError) => void;
}

const updateQuota = async ({ api_url, token, userId, setRemainingQuota, setTotalQuota, handleError }: IParams) => {
  const jobStatusAPI: string = api_url + '/query';
  const postParams = {
    userId,
    queryType: 'user_quota',
    jobId: 'jobId',
  };

  axios.get(jobStatusAPI, {
    headers: {
      'Content-Type': 'application/json',
      authorizationToken: token,
      'x-api-key': '3MKzgWSv8C5jqe3vT2z5B2H2g4RU1Oth8e63KYIi',
    },
  }).then((response) => {
    if (response.status === 200) {
      console.log(response.data);
      setRemainingQuota(response.data.pageRemaining);
      setTotalQuota(response.data.pageLimit);
    } else {
      throw new AxiosError('Failed to get quota');
    }
  }).catch((e: AxiosError) => {
    handleError(e);
    return;
  });
};

export default updateQuota;
