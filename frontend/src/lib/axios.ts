import axios from "axios";

const originURL = process.env.NEXT_PUBLIC_ORIGIN_URL as string;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL as string;

export const originAPI = axios.create({
  baseURL: originURL,
  withCredentials: true,
});

export const baseAPI = axios.create({
  baseURL,
  withCredentials: true,
});

export function extractAxiosError(err: unknown): string | null {
  return axios.isAxiosError(err) && err.response
    ? err.response.data.message
    : "Unexpected error";
}
