import { baseAPI } from "@/lib/axios";

export async function getUserById(id: string) {
  const response = await baseAPI.get(`/user/${id}`);
  return response.data.data;
}
