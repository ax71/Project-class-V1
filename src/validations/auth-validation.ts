import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // username: z.string().min(1, "Username is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  confirmpassword: z.string().min(1, "Confirm Password is required"),
});

export type RegisterForm = z.infer<typeof registerSchema>;
