"use client";

import toast from "react-hot-toast";
import { AnimeCard } from "@/components/anime-card";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { extractAxiosError } from "@/lib/axios";
import { createPost } from "@/queries/post";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GenerateImageSchema,
  GenerateImageFormValues,
} from "@/schemas/generate";
import { type ChangeEvent, type ReactNode, useState } from "react";
import ImageInput from "@/components/image-input";
import { Navbar } from "@/components/navbar";
import { Protected } from "@/middleware/protected";
import { RotateCcw } from "lucide-react";
import { Aside } from "@/components/aside";
import { Dashboard } from "@/components/dashboard";

interface AnimeType {
  image_url: string;
  title: string;
  episode_no?: number;
  episode_title?: string;
  clip_time?: string;
  summary?: string;
}

export default function GeneratePage() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL as string;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [anime, setAnime] = useState<AnimeType | null>(null);
  const [hide, setHide] = useState(true);
  const form = useForm<GenerateImageFormValues>({
    resolver: zodResolver(GenerateImageSchema),
    defaultValues: {
      image: undefined,
    },
  });
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(data: GenerateImageFormValues) {
    const formData = new FormData();
    formData.append("image_url", data.image[0]);
    try {
      const createdPost = await createPost(formData);
      setAnime(createdPost);
      toast.success("Gambar berhasil diunggah dan diproses!");
    } catch (err) {
      toast.error(extractAxiosError(err));
    } finally {
      setImagePreview(null);
      setHide((hide) => !hide);
      reset();
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <Protected>
      <Navbar />
      <div className="flex">
        <Aside />
        <Dashboard>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            {hide ? (
              <Card
                title="Cari Anime"
                description="Cari anime berdasarkan clip"
                className="bg-background/50 backdrop-blur-lg border-border/50 shadow-xl max-w-lg w-full"
              >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 w-full"
                >
                  <ImageInput
                    imagePreview={imagePreview}
                    handleFileChange={handleFileChange}
                    {...register("image")}
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.image.message as ReactNode}
                    </p>
                  )}
                  <Button
                    type="submit"
                    variant="secondary"
                    loading={isSubmitting}
                  >
                    Upload dan Generate
                  </Button>
                </form>
              </Card>
            ) : (
              <div className="flex flex-col md:flex-row justify-center gap-10">
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Refresh"
                    onClick={() => setHide((hide) => !hide)}
                    className="group absolute top-5 right-5 inline-flex items-center justify-center rounded-full p-2 bg-background/80 text-white shadow-xl backdrop-blur ring-2 ring-primary/40 hover:bg-primary hover:ring-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 transition-all duration-300 z-20"
                  >
                    <RotateCcw className="h-5 w-5 motion-safe:transition-transform duration-300 ease-out group-hover:-rotate-90 group-active:scale-95" />
                  </button>
                  <AnimeCard
                    className="bg-background/50 backdrop-blur-lg border-border/50 shadow-xl max-w-lg w-full"
                    title={anime?.title || ""}
                    image_url={`${baseURL}/uploads/post/image/${
                      anime?.image_url ?? ""
                    }`}
                    episode_no={anime?.episode_no || 0}
                    episode_title={anime?.episode_title || ""}
                    clip_time={anime?.clip_time || ""}
                    summary={anime?.summary || ""}
                  />
                </div>
              </div>
            )}
          </div>
        </Dashboard>
      </div>
    </Protected>
  );
}
