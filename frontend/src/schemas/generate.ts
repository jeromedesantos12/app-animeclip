import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const GenerateImageSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length >= 1, {
      message: "Harap unggah sebuah gambar.",
    })
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `Ukuran file maksimal adalah 5MB.`,
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung.",
    }),
});

export type GenerateImageFormValues = z.infer<typeof GenerateImageSchema>;
