import { z } from "zod";

export const registerSchema = z
  .object({
    fullname: z.string().min(3, "Full name must be at least 3 characters."),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username must be 20 characters or less.")
      .regex(
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores."
      ),
    email: z.string().email("Invalid email format."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(1, "Confirming the password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
