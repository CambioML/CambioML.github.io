import axios, { AxiosError, AxiosResponse } from 'axios';
import { QueryParams } from './apiInterface';
import getApiKeysForUser from '../account/getApiKeysForUser';

interface IParams {
  api_url: string;
  postParams: QueryParams;
  token: string;
  handleSuccess: (response: AxiosResponse, pages?: number[]) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  targetPages?: number[];
}

const pollJobStatus = async ({
  api_url,
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
  const pollInterval = 200; // 200 milliseconds
  const startTime = Date.now();
  const poll = async () => {
    if (Date.now() - startTime > timeoutDuration) {
      handleTimeout();
      return;
    }

    let apiKey;
    try {
      apiKey = await getApiKeysForUser({ userId: postParams.userId, token, apiURL: api_url });
      if (apiKey.length === 0) {
        throw new Error('API key not found');
      }
    } catch (e) {
      handleError(e as AxiosError);
      return;
    }

    axios
      .post(jobStatusAPI, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          authorizationToken: token,
          'x-api-key': apiKey[0].key || '-',
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
