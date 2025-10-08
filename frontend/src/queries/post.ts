import { baseAPI } from "@/lib/axios";

export async function getPostById(id: string) {
  const response = await baseAPI.get(`/post/${id}`);
  return response.data.data;
}

export async function createPost(input: FormData) {
  const response = await baseAPI.post("/post", input, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}
