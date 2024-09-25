import axios from 'axios';
import toast from 'react-hot-toast';
import { PresignedResponse, UploadParams } from './apiInterface';
import { AddFileParams } from '@/app/hooks/usePlaygroundStore';

interface IParams {
  api_url: string;
  file: File | undefined;
  token: string;
  clientId: string;
  addFilesFormData: (data: PresignedResponse) => void;
  addFiles: ({ files, fileId, jobId, userId }: AddFileParams) => void;
}

interface Config {
  params: UploadParams;
  headers?: { authorizationToken: string; apiKey: string };
}

export const uploadFile = async ({ api_url, file, token, clientId, addFiles, addFilesFormData }: IParams) => {
  if (!file) {
    toast.error('No file selected');
    return;
  }
  const file_name = file.name;
  const getConfig: Config = {
    params: {
      token: token,
      clientId: clientId,
      fileName: file_name,
    },
    headers: { authorizationToken: token, apiKey: '-' },
  };

  return await axios
    .get<PresignedResponse>(api_url + '/upload', getConfig)
    .then((response) => {
      const data = response.data as PresignedResponse;
      const postData = new FormData();
      Object.entries(data.presignedUrl.fields).forEach(([key, value]) => {
        postData.append(key, value);
      });
      postData.append('file', file);
      return axios
        .post(data.presignedUrl.url, postData)
        .then((response) => {
          if (response.status !== 204) {
            throw new Error(`Error uploading file: ${file.name}. Please try again.`);
          }
          addFilesFormData(data);
          addFiles({ files: file, fileId: data.fileId, jobId: data.jobId, userId: data.userId });
          return response;
        })
        .catch((error) => {
          toast.error(`Error uploading file: ${file.name}. Please try again.`);
          return error;
        });
    })
    .catch((error) => {
      toast.error(`PREPROD: ${file.name}. Please try again.`);
      return error;
    });
};
