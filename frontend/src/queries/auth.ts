import { originAPI, baseAPI } from "@/lib/axios";

export async function getToken() {
  const response = await originAPI.get("/token");
  return response.data.data;
}

export async function loginAuth(input: {
  emailOrUsername: string;
  password: string;
}) {
  const response = await baseAPI.post("/auth/login", input);
  return response.data.data;
}

export async function registerAuth(input: {
  fullname: string;
  username: string;
  email: string;
  password: string;
}) {
  const response = await baseAPI.post("/auth/register", input);
  return response.data.data;
}
