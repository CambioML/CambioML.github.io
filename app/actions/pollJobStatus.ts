import axios, { AxiosError, AxiosResponse } from 'axios';
import { QueryParams } from './apiInterface';

interface IParams {
  api_url: string;
  apiKey: string;
  postParams: QueryParams;
  token: string;
  handleSuccess: (response: AxiosResponse, pages?: number[]) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  targetPages?: number[];
}

const pollJobStatus = async ({
  api_url,
  apiKey,
  token,
  postParams,
  handleSuccess,
  handleError,
  handleTimeout,
  targetPages,
}: IParams) => {
  const jobStatusAPI: string = api_url + '/async/fetch';
  const requestBody = {
    file_id: postParams.fileId,
  };
  const timeoutDuration = 600000; // 10 minutes
  const pollInterval = 1000; // 200 milliseconds
  const startTime = Date.now();
  const poll = async () => {
    if (Date.now() - startTime > timeoutDuration) {
      handleTimeout();
      return;
    }

    axios
      .post(jobStatusAPI, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          authorizationToken: token,
          'x-api-key': apiKey || '-',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          handleSuccess(response, targetPages);
          return;
        } else if (response.status === 202 || response.status === 403) {
          setTimeout(poll, pollInterval);
        } else {
          return;
        }
      })
      .catch((e: AxiosError) => {
        handleError(e);
        return;
      });
  };

  poll();
};

export default pollJobStatus;
