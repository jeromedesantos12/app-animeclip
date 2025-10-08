import { z } from "zod";

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or Username is required."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
