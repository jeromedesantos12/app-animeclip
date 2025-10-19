import { baseAPI, outAPI } from "@/lib/axios";

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
