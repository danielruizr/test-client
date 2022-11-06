import axios from 'axios';
import { getAccessToken } from 'services/auth';
import { UploadFileResponse } from './interfaces/upload-file-response';

const uploadClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_UPLOAD_SERVICE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
uploadClient.interceptors.request.use(async (config) => {
  const idToken = await getAccessToken();
  config.headers!['Authorization'] = `Bearer ${idToken}`;
  return config;
});

export const uploadGameImage = async(file: File, gameId: string) => upload(`/games/${gameId}/images`, file)
export const uploadGameVideo = async(file: File, gameId: string) => upload(`/games/${gameId}/videos`, file)

const upload = async (endpoint: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const {
    data: { path },
  } = await uploadClient.post<UploadFileResponse>(endpoint, formData);
  return path;
}

export async function uploadUserProfilePicture(userId: string, file: Blob) {
  const formData = new FormData();
  formData.append('file', file);
  const {
    data: { path },
  } = await uploadClient.post<UploadFileResponse>(
    `/users/${userId}/profile-pic`,
    formData
  );
  return path;
}
