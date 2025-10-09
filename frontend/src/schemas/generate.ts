import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
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
      message: "Please upload an image.",
    })
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `The maximum file size is 5MB.`,
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "Only .jpg, .jpeg, .png, and .webp formats are supported.",
    }),
});

export type GenerateImageFormValues = z.infer<typeof GenerateImageSchema>;
