"use client";

import { Aside } from "@/components/aside";
import { Dashboard } from "@/components/dashboard";
import { Navbar } from "@/components/navbar";
import { extractAxiosError } from "@/lib/axios";
import { Protected } from "@/middleware/protected";
import { deletePost, getPosts } from "@/queries/post";
import { PostType } from "@/types/post";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function HistoryPage() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL as string;
  const [posts, setPost] = useState<PostType[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchPosts() {
    try {
      setIsLoading(true);
      const allPosts = await getPosts();
      setPost(allPosts);
    } catch (err) {
      toast.error(extractAxiosError(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      setIsLoading(true);
      await deletePost(id);
      toast.success("Post deleted successfully!");
      fetchPosts();
    } catch (err) {
      toast.error(extractAxiosError(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Protected>
      <Navbar />
      <div className="flex">
        <Aside />
        <Dashboard>
          <div className="flex flex-col md:flex-row justify-center mt-15 gap-10">
            <div className="w-full max-w-6xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-white mb-8 text-center md:text-left">
                Riwayat Pencarian
              </h1>
              {isLoading ? (
                <p className="text-center text-gray-300">Memuat riwayat...</p>
              ) : posts && posts.length > 0 ? (
                <div className="overflow-x-auto bg-background/50 backdrop-blur-lg rounded-lg border border-border/50 shadow-xl">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-foreground/10">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-background">
                          Gambar
                        </th>
                        <th scope="col" className="px-6 py-3 text-background">
                          Judul Anime
                        </th>
                        <th scope="col" className="px-6 py-3 text-background">
                          Episode
                        </th>
                        <th scope="col" className="px-6 py-3 text-background">
                          Waktu Klip
                        </th>
                        <th scope="col" className="px-6 py-3 text-background">
                          Tanggal
                        </th>
                        <th scope="col" className="px-6 py-3 text-background">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr
                          key={post.id}
                          className="border-b border-border/50 hover:bg-foreground/10"
                        >
                          <td className="p-4">
                            <Image
                              src={`${baseURL}/uploads/post/image/${post.image_url}`}
                              alt={post.title}
                              width={128}
                              height={72}
                              className="object-cover rounded-md w-32 h-auto"
                            />
                          </td>
                          <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                            {post.title}
                          </td>
                          <td className="px-6 py-4">{post.episode_no}</td>
                          <td className="px-6 py-4">{post.clip_time}</td>
                          <td className="px-6 py-4">
                            {new Date(post.created_at).toLocaleDateString(
                              "id-ID"
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Trash2
                              onClick={() => handleRemove(post.id)}
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-400 mt-10">
                  Anda belum memiliki riwayat pencarian.
                </p>
              )}
            </div>
          </div>
        </Dashboard>
      </div>
    </Protected>
  );
}
