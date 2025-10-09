import { baseAPI, outAPI } from "@/lib/axios";

export async function getPosts() {
  const response = await baseAPI.get("/post");
  return response.data.data;
}

export async function getPostById(id: string) {
  const response = await baseAPI.get(`/post/${id}`);
  return response.data.data;
}

export async function deletePost(id: string) {
  const response = await baseAPI.delete(`/post/${id}`);
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

export async function getAnime(q: string) {
  const response = await outAPI.get("/anime", {
    params: { q },
  });

  return response.data.data;
}
